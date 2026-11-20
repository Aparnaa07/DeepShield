import asyncio
import random
from datetime import datetime, timedelta
import sys
import os

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from dotenv import load_dotenv
load_dotenv(os.path.join(BACKEND_DIR, ".env"))

try:
    # pyrefly: ignore[missing-import]
    from database import analysis_collection, jobs_collection
except ImportError:
    from backend.database import analysis_collection, jobs_collection  # type: ignore

IMAGE_NAMES = [
    "executive_portrait.jpg", "ceo_profile.png", "passport_photo.jpg", 
    "kyc_id_scan.png", "driver_headshot.webp", "security_badge.jpg"
]
AUDIO_NAMES = [
    "urgent_wire_transfer.mp3", "earnings_call_sample.wav", "ceo_voice_memo.m4a", 
    "customer_service_call.wav", "voicemail_verification.mp3"
]
DOCUMENT_NAMES = [
    "passport_scan.pdf", "aadhaar_card_v2.pdf", "drivers_license_front.pdf", 
    "bank_statement_jan.pdf", "tax_return_doc.pdf"
]

RECOMMENDATIONS = {
    "LOW":      "Content appears authentic. No significant AI manipulation detected.",
    "MEDIUM":   "Some suspicious indicators detected. Manual review recommended.",
    "HIGH":     "Strong indicators of AI manipulation. Escalate to senior analyst.",
    "CRITICAL": "HIGH CONFIDENCE AI GENERATION DETECTED. Do not use as authentic media.",
}


def random_score_for_category(category: str) -> int:
    ranges = {"LOW": (6, 28), "MEDIUM": (34, 58), "HIGH": (64, 84), "CRITICAL": (88, 98)}
    lo, hi = ranges[category]
    return random.randint(lo, hi)


def make_image_report(job_id: str, score: int, category: str, ts: str, filename: str) -> dict:
    fake_prob = score / 100
    has_faces = random.random() > 0.25
    return {
        "job_id": job_id,
        "filename": filename,
        "file_url": f"/uploads/{job_id}/{filename}",
        "timestamp": ts,
        "file_type": "image",
        "fraud_risk_score": score,
        "risk_category": category,
        "recommendation": RECOMMENDATIONS[category],
        "processing_time_ms": random.randint(850, 2400),
        "modules": {
            "image_deepfake": {
                "score": round(fake_prob * 100 + random.uniform(-4, 4), 1),
                "faces_detected": 1 if has_faces else 0,
                "model": "EfficientNet-B4 Ensemble",
                "face_results": [{
                    "bounding_box": {"x": 120, "y": 80, "w": 160, "h": 180},
                    "deepfake_probability": round(fake_prob, 2),
                    "real_probability": round(1 - fake_prob, 2),
                }] if has_faces else [],
            },
            "ela_analysis": {
                "score": round(fake_prob * 100 + random.uniform(-6, 6), 1),
                "ela_image": None,
                "mean_diff": round(random.uniform(2, 34), 2),
                "interpretation": "High tampering detected" if score > 60 else "Low tampering",
            },
            "metadata_forensics": {
                "score": round(fake_prob * 100 + random.uniform(-8, 8), 1),
                "flags": (
                    ["No EXIF metadata found", "AI software signature: Midjourney v6"]
                    if score > 60 else ["Standard EXIF camera metadata present"]
                ),
                "metadata_fields_count": 0 if score > 60 else random.randint(15, 38),
            },
        },
        "all_flags": (
            ["GAN boundary artifacts detected", "No camera EXIF metadata"] if score > 60 else []
        ),
    }


def make_audio_report(job_id: str, score: int, category: str, ts: str, filename: str) -> dict:
    fake_prob = score / 100
    return {
        "job_id": job_id,
        "filename": filename,
        "file_url": f"/uploads/{job_id}/{filename}",
        "timestamp": ts,
        "file_type": "audio",
        "fraud_risk_score": score,
        "risk_category": category,
        "recommendation": RECOMMENDATIONS[category],
        "processing_time_ms": random.randint(620, 2100),
        "modules": {
            "voice_clone_detection": {
                "score": round(fake_prob * 100 + random.uniform(-4, 4), 1),
                "model": "ResNet-18 Spectrogram CNN",
                "sample_rate": 16000,
                "duration_seconds": round(random.uniform(2.5, 9.0), 1),
                "spectrogram_image": None,
                "real_probability": round((1 - fake_prob) * 100, 1),
                "fake_probability": round(fake_prob * 100, 1),
            },
        },
        "all_flags": (
            ["Vocoder harmonics detected in high-frequency band", "Unnatural robotic pitch stability"]
            if score > 60 else []
        ),
    }


def make_document_report(job_id: str, score: int, category: str, ts: str, filename: str) -> dict:
    fake_prob = score / 100
    return {
        "job_id": job_id,
        "filename": filename,
        "file_url": f"/uploads/{job_id}/{filename}",
        "timestamp": ts,
        "file_type": "document",
        "fraud_risk_score": score,
        "risk_category": category,
        "recommendation": RECOMMENDATIONS[category],
        "processing_time_ms": random.randint(1100, 3100),
        "modules": {
            "ela_analysis": {
                "score": round(fake_prob * 100 + random.uniform(-5, 5), 1),
                "ela_image": None,
                "interpretation": "High tampering detected" if score > 60 else "Consistent compression",
            },
            "noise_pattern_analysis": {
                "score": round(fake_prob * 100 + random.uniform(-7, 7), 1),
                "flags": ["Inconsistent background noise patterns across document regions"] if score > 60 else [],
            },
            "ocr_analysis": {
                "score": round(fake_prob * 60 + random.uniform(-5, 5), 1),
                "extracted_text_preview": "OFFICIAL IDENTITY DOCUMENT - Republic of India...",
                "avg_confidence": round(random.uniform(45, 96), 1),
                "flags": ["Low OCR font alignment confidence"] if score > 60 else [],
            },
            "metadata_forensics": {
                "score": round(fake_prob * 75 + random.uniform(-5, 5), 1),
                "flags": ["PDF Producer: Ghostscript / Adobe Photoshop modification"] if score > 50 else [],
            },
        },
        "all_flags": (
            ["Inconsistent background noise patterns", "Font splicing indicator"] if score > 60 else []
        ),
    }


async def main():
    print("=" * 60)
    print("  DeepShield — Demo Data Generator")
    print("=" * 60)

    # Clear previous demo items
    await analysis_collection.delete_many({})
    await jobs_collection.delete_many({})
    print("Cleared existing analysis data...")

    categories = ["LOW", "LOW", "LOW", "MEDIUM", "MEDIUM", "HIGH", "CRITICAL"]
    file_types = ["image", "image", "audio", "document"]

    for i in range(30):
        category = random.choice(categories)
        file_type = random.choice(file_types)
        score = random_score_for_category(category)
        job_id = f"ds_demo_{i+1:03d}"

        # Generate realistic timestamps spread over the last 7 days
        ts_dt = datetime.utcnow() - timedelta(
            days=random.randint(0, 6),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        ts = ts_dt.isoformat()

        if file_type == "image":
            fname = random.choice(IMAGE_NAMES)
            report = make_image_report(job_id, score, category, ts, fname)
        elif file_type == "audio":
            fname = random.choice(AUDIO_NAMES)
            report = make_audio_report(job_id, score, category, ts, fname)
        else:
            fname = random.choice(DOCUMENT_NAMES)
            report = make_document_report(job_id, score, category, ts, fname)

        await analysis_collection.insert_one(report)

        await jobs_collection.insert_one({
            "job_id": job_id,
            "filename": report["filename"],
            "file_type": file_type,
            "status": "completed",
            "progress": 100,
            "fraud_risk_score": score,
            "risk_category": category,
            "created_at": ts,
            "steps": {
                "upload": "completed",
                "preprocessing": "completed",
                "ai_analysis": "completed",
                "scoring": "completed",
                "report": "completed",
            }
        })

    total = await analysis_collection.count_documents({})
    print(f"✅ Successfully generated {total} forensic analyses across Image, Audio, and Document types!")
    print("   Data is now available for the Dashboard, Reports, and Live Feed.")


if __name__ == "__main__":
    asyncio.run(main())
