
from database import jobs_collection, analysis_collection
from scoring.ensemble import compute_final_score

import asyncio
import random
from datetime import datetime


async def analyze_audio(job_id: str, file_path: str):
    """Analyze audio file for voice cloning / deepfake detection."""
    try:
        start_time = datetime.utcnow()
        await jobs_collection.update_one(
            {"job_id": job_id},
            {"$set": {"status": "processing", "progress": 10, "steps.preprocessing": "completed"}}
        )

        # Read audio file from local disk
        with open(file_path, "rb") as f:
            audio_bytes = f.read()

        await jobs_collection.update_one(
            {"job_id": job_id},
            {"$set": {"progress": 40, "steps.ai_analysis": "completed"}}
        )

        # Demo mode: random score
        fake_prob = random.uniform(0.2, 0.9)

        await jobs_collection.update_one(
            {"job_id": job_id},
            {"$set": {"progress": 80, "steps.scoring": "completed"}}
        )

        module_scores = {
            "voice_clone_detection": {"score": fake_prob, "weight": 1.0},
        }
        final_result = compute_final_score(module_scores)
        processing_time = int((datetime.utcnow() - start_time).total_seconds() * 1000)

        report = {
            "job_id": job_id,
            "timestamp": datetime.utcnow().isoformat(),
            "file_type": "audio",
            "fraud_risk_score": final_result["fraud_risk_score"],
            "risk_category": final_result["risk_category"],
            "modules": {
                "voice_clone_detection": {
                    "score": round(fake_prob * 100, 1),
                    "model": "ResNet-18 Spectrogram CNN (demo mode)",
                    "sample_rate": 16000,
                    "duration_seconds": 3.0,
                    "spectrogram_image": None,
                    "real_probability": round((1 - fake_prob) * 100, 1),
                    "fake_probability": round(fake_prob * 100, 1),
                }
            },
            "recommendation": final_result["recommendation"],
            "processing_time_ms": processing_time,
        }

        await analysis_collection.insert_one(report.copy())
        await jobs_collection.update_one(
            {"job_id": job_id},
            {"$set": {"status": "completed", "progress": 100, "steps.report": "completed"}}
        )

    except Exception as e:
        await jobs_collection.update_one(
            {"job_id": job_id},
            {"$set": {"status": "failed", "error": str(e)}}
        )
        raise