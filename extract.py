import pdfplumber
import pandas as pd
import re

# Correct regular expression (no double escaping)
pattern = re.compile(r"([A-Z]{2}\d+(?:[A-Z]?\d+)*)\(([^)]+)\)\s*-\s*([^-\/]+)\/(.+)")

day_names = ["MON", "TUES", "WED", "THUR", "FRI", "SAT"]
time_cols = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

slots, previous_day = [], None

with pdfplumber.open("BTECH_II_4Sem_J128.pdf") as pdf:
    for page in pdf.pages:
        table = page.extract_table()
        if not table:
            continue
        for i, row in enumerate(table):
            if i < 2:  # skip title + time header rows
                continue

            day_cell = (row[0] or "").strip().upper()
            if day_cell in day_names:
                day = day_cell
                previous_day = day
            else:
                day = previous_day  # assume continuation of same day

            for col_idx, cell in enumerate(row[1:], 1):
                if not cell:
                    continue
                for entry in cell.splitlines():
                    entry = entry.strip()
                    m = pattern.match(entry)
                    if m:
                        slot_code, subj_code, room, faculty = m.groups()
                        slots.append({
                            "day": day,
                            "start": time_cols[col_idx - 1],
                            "slot_code": slot_code,
                            "subject_code": subj_code,
                            "room": room.strip(),
                            "faculty": faculty.strip(),
                            "batches":re.findall(r"[FE]\d+", slot_code)

                        })

# Save to file
df = pd.DataFrame(slots)
df.to_pickle("timetable.pkl")
print(f"Extracted {len(df)} timetable items → timetable.pkl")
