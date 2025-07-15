# 📅 Timetable Retriever

A modern web app to **extract and display college timetables** from PDF files with a clean, responsive UI. Built with **React + Vite** (frontend) and **FastAPI** (backend) for real-time, batch-based timetable retrieval.

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue.svg" />
  <img src="https://img.shields.io/badge/Vite-7-purple.svg" />
  <img src="https://img.shields.io/badge/FastAPI-Latest-green.svg" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-cyan.svg" />
  <img src="https://img.shields.io/badge/Status-Production_Ready-success.svg" />
</div>

---

## ✨ Features

- ✅ **Smart PDF Extraction** – Parses timetable PDFs using regex & Camelot/pdfplumber  
- ✅ **Batch-based Search** – Quickly view timetables for any batch (e.g., `F7`, `E16`)  
- ✅ **Day-wise Grouping** – Organized schedule with color-coded days  
- ✅ **Beautiful UI** – Gradient themes, glassmorphism, and Lucide icons  
- ✅ **Responsive Design** – Mobile-friendly with smooth animations  
- ✅ **Fast Performance** – Vite-powered React frontend & optimized FastAPI backend  

---

## 🏗️ Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS, Lucide Icons  |
| **Backend**  | FastAPI, Python 3.8+, Pandas, pdfplumber, Camelot |
| **Storage**  | Pickle-based timetable data (`timetable.pkl`) |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/timetable-retriever.git
cd timetable-retriever
