from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, Base
import models

# Ensure tables are created
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[DeepShield] Warning: table creation: {e}")

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

from api.upload import router as upload_router
from api.analyze import router as analyze_router
from api.report import router as report_router
from api.auth import router as auth_router

app = FastAPI(
    title="DeepShield API",
    description="AI-Powered Deepfake & Identity Fraud Detection",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Standard Permissive CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded media and reports
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router,     prefix="/api/auth",    tags=["Authentication"])
app.include_router(upload_router,   prefix="/api/upload",  tags=["File Upload"])
app.include_router(analyze_router,  prefix="/api/analyze", tags=["Analysis"])
app.include_router(report_router,   prefix="/api/report",  tags=["Reports"])


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "DeepShield API is running",
        "docs": "/docs"
    }


@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
