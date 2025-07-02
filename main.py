from pathlib import Path
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

DATA_FILE = Path(__file__).with_name("timetable.pkl")

# ---------------------------------------------------------------------
# Load data once at startup
# ---------------------------------------------------------------------
if not DATA_FILE.exists():
    raise RuntimeError(
        f"{DATA_FILE} not found. Run extract_from_pdf.py first to "
        "create it from the merged timetable PDF."
    )

_df = pd.read_pickle(DATA_FILE)

# Normalise batch tokens to lowercase for case‑insensitive matching
_df["batches_norm"] = _df["batches"].apply(lambda lst: [b.lower() for b in lst])

# ---------------------------------------------------------------------
# FastAPI app definition
# ---------------------------------------------------------------------
app = FastAPI(title="College Timetable API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # CRA/Next.js default
        "*",                      # ↩️  loosen in dev; tighten in prod
    ],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    """Health‑check route."""
    return {"status": "ok"}


@app.get("/timetable/{batch_code}")
async def get_timetable(batch_code: str):
    """Return full weekly timetable for the given **batch_code** (e.g. F7, E16)."""
    batch_code = batch_code.lower()

    subset = _df[_df["batches_norm"].apply(lambda lst: batch_code in lst)]
    if subset.empty:
        raise HTTPException(status_code=404, detail="Batch not found")

    subset = subset.sort_values(["day", "start"], kind="stable")

    # Convert DataFrame rows to plain dicts for JSON response
    records: List[dict] = subset[
        ["day", "start", "subject_code", "room", "faculty"]
    ].to_dict(orient="records")

    return records