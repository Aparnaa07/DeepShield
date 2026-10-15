from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
                                         
load_dotenv()
                                      
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
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class CORSFixMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.add_middleware(CORSFixMiddleware)
                                                                       
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
) 
                                                
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
async def health_check():
    return {"status": "healthy"}
