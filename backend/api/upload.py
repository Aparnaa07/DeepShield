from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid
import os
import asyncio

from database import jobs_collection
from utils.file_validator import validate_file
from workers.image_worker import analyze_image
from workers.audio_worker import analyze_audio
from workers.document_worker import analyze_document

router = APIRouter()

MAX_FILE_SIZE = 50 * 1024 * 1024

ALLOWED_TYPES = {
    "image/jpeg":  "image",
    "image/png":   "image",
    "image/webp":  "image",
    "audio/mpeg":  "audio",
    "audio/wav":   "audio",
    "audio/x-wav": "audio",
    "audio/mp4":   "audio",
    "application/pdf": "document",
}


class UploadResponse(BaseModel):
    job_id: str
    filename: str
    file_type: str
    status: str
    message: str


@router.post("/", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    notes: str = "",
):
    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB")

    detected_mime = validate_file(contents, file.filename)
    if detected_mime not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type. Allowed: JPEG, PNG, WEBP, MP3, WAV, M4A, PDF"
        )

    media_type = ALLOWED_TYPES[detected_mime]
    job_id = f"ds_{str(uuid.uuid4())[:8]}"

    upload_dir = os.path.join("uploads", job_id)
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f_out:
        f_out.write(contents)

    await jobs_collection.insert_one({
        "job_id": job_id,
        "filename": file.filename,
        "file_type": media_type,
        "status": "queued",
        "created_at": datetime.utcnow().isoformat(),
        "progress": 0,
        "steps": {
            "upload": "completed",
            "preprocessing": "pending",
            "ai_analysis": "pending",
            "scoring": "pending",
            "report": "pending"
        }
    })

    if media_type == "image":
        asyncio.create_task(analyze_image(job_id, file_path, detected_mime, filename=file.filename))
    elif media_type == "audio":
        asyncio.create_task(analyze_audio(job_id, file_path, filename=file.filename))
    elif media_type == "document":
        asyncio.create_task(analyze_document(job_id, file_path, filename=file.filename))

    return UploadResponse(
        job_id=job_id,
        filename=file.filename,
        file_type=media_type,
        status="queued",
        message="File uploaded successfully. Analysis starting..."
    )
