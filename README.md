# 🛡️ DeepShield — AI Deepfake & Identity Fraud Detection

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<br/>

### Multi-Modal AI Forensics for Images, Audio Clones, and Forged Identity Documents

*Delivering an ensemble-calibrated Fraud Risk Score (0 to 100%) with Error Level Analysis (ELA) heatmaps, acoustic vocoder harmonic scans, and container metadata audits.*

</div>

---

## 📌 Overview

**DeepShield** is an enterprise-grade cybersecurity and synthetic media detection platform engineered to detect generative AI manipulations across three major fraud vectors:

1. **AI Image Deepfakes & GAN Synthesis** — Face morphing, diffusion boundary artifacts, eye reflection anomalies, and compression gradients.
2. **Synthetic Voice Cloning** — Vocoder phase anomalies, unnatural pitch contours, and spectral discontinuities.
3. **Identity Document Forgery** — High-resolution PDF rasterization, background noise variance, and font splicing detection for passports, IDs, and financial statements.

---

## 🔍 Multi-Modal Forensic Pipeline

```
                     Incoming Media (Image, Audio, PDF)
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
[ Visual Forensics ]       [ Audio Spectral Scan ]      [ Document Forensics ]
• Error Level Analysis      • 16kHz Resampling          • PyMuPDF 300DPI Raster
• Pixel Diff Heatmap (Q90)  • Mel Spectrogram CNN       • 4x4 Grid Noise Matrix
• EXIF Container Audit      • Vocoder Phase Check       • Font Splicing Anomaly
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     ▼
                   [ Ensemble Platt Scaling Sigmoid ]
                                     ▼
               Calibrated Fraud Risk Score (0 - 100%)
                       + Full Evidence Dossier
```

### Risk Calibration Gates:
- **LOW RISK (0% – 30%)**: Clean compression curves, authentic EXIF camera signatures.
- **MEDIUM RISK (31% – 60%)**: Subtle anomalies flagged for manual human audit.
- **HIGH RISK (61% – 85%)**: Strong generative AI markers or noise pattern mismatches.
- **CRITICAL THREAT (86% – 100%)**: Confirmed synthetic creation or tampered credentials.

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, Uvicorn, SQLAlchemy, Pydantic v2, Motor / SQLite Local Document Store
- **Computer Vision & Forensics**: OpenCV, Pillow (PIL), PyMuPDF (Fitz), ExifRead
- **Audio & ML**: NumPy, SciPy, Scikit-learn (Platt Scaling Sigmoid)
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, Recharts, Lucide Icons, React Dropzone
- **Containerization**: Docker, Docker Compose

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python 3.11 or 3.12**
- **Node.js 18+ & npm**

### 1. Clone & Set Up Backend
```bash
git clone https://github.com/Aparnaa07/DeepShield.git
cd DeepShield

# Create and activate virtual environment
python -m venv backend/venv
# Windows:
.\backend\venv\Scripts\activate
# Linux/macOS:
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Initialize database & seed default admin
python scripts/init_db.py

# Optional: Seed 30 demo forensic records
python scripts/generate_demo_data.py
```

### 2. Set Up Frontend
```bash
cd frontend
npm install
```

### 3. Start Both Services
You can run the all-in-one launcher:
```bash
python scripts/start_deepshield.py
```

Or start them in separate terminals:
- **Terminal 1 (Backend)**: `cd backend && uvicorn main:app --reload --port 8000`
- **Terminal 2 (Frontend)**: `cd frontend && npm run dev`

Visit:
- **Web Dashboard**: `http://localhost:3000`
- **API Swagger Docs**: `http://localhost:8000/docs`

**Default Admin Credentials**:
- **Email**: `admin@deepshield.io`
- **Username**: `admin`
- **Password**: `admin123`

---

## 🐳 Docker Deployment

To launch the full stack with isolated containers:

```bash
docker compose up --build -d
```

Services exposed:
- `http://localhost:3000` — Next.js Web Interface
- `http://localhost:8000` — FastAPI Backend API
- `http://localhost:5432` — PostgreSQL Database
- `http://localhost:27017` — MongoDB Document Store
- `http://localhost:6379` — Redis Queue
- `http://localhost:9000` — MinIO Object Storage (Console: `9001`)

---

## ☁️ Cloud Deployment

### 1. Deploying Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set environment variable: `ALLOWED_ORIGINS=https://your-frontend.vercel.app`.

### 2. Deploying Frontend on Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com`
4. Deploy!

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health status check |
| `POST` | `/api/upload/` | Ingest media file (`image`, `audio`, `pdf`), returns `job_id` |
| `GET` | `/api/analyze/status/{job_id}` | Poll real-time progress (0–100%) and pipeline stages |
| `GET` | `/api/analyze/result/{job_id}` | Retrieve comprehensive forensic dossier upon completion |
| `GET` | `/api/report/list` | Filterable list of forensic cases with pagination |
| `GET` | `/api/report/stats/summary` | Dashboard statistics, risk breakdown, and threat rates |
| `GET` | `/api/report/{job_id}` | Fetch individual forensic dossier |
| `DELETE` | `/api/report/{job_id}` | Delete forensic dossier from evidence vault |
| `POST` | `/api/auth/register` | Register new investigator account |
| `POST` | `/api/auth/login` | Authenticate investigator and issue JWT bearer token |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
