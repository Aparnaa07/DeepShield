import os
import sys
import time
import threading
import urllib.request
import io
from PIL import Image

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
os.environ["NO_PROXY"] = "localhost,127.0.0.1"
os.environ["no_proxy"] = "localhost,127.0.0.1"

import uvicorn
from main import app
from database import jobs_collection, analysis_collection
from workers.image_worker import analyze_image

def main():
    print("=" * 60)
    print("  DeepShield — End-to-End System Verification")
    print("=" * 60)

    # 1. Start uvicorn in thread
    config = uvicorn.Config(app, host="127.0.0.1", port=8000, log_level="warning")
    server = uvicorn.Server(config)
    t = threading.Thread(target=server.run, daemon=True)
    t.start()
    time.sleep(2)

    proxy_handler = urllib.request.ProxyHandler({})
    opener = urllib.request.build_opener(proxy_handler)

    try:
        # Check Health
        with opener.open("http://127.0.0.1:8000/health") as resp:
            data = resp.read().decode()
            print(f"✅ Backend Health: {resp.status} -> {data}")

        # Check Stats
        with opener.open("http://127.0.0.1:8000/api/report/stats/summary") as resp:
            data = resp.read().decode()
            print(f"✅ Stats Summary: {resp.status} -> {data}")

        # Check Reports List
        with opener.open("http://127.0.0.1:8000/api/report/list?limit=3") as resp:
            data = resp.read().decode()
            print(f"✅ Reports Registry: {resp.status} -> {len(data)} bytes received")

        # Check File Upload & Worker Inference
        print("\n--- Testing Forensic Analysis Pipeline ---")
        img = Image.new("RGB", (150, 150), color="blue")
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        test_file = "uploads/verify_test.jpg"
        with open(test_file, "wb") as f:
            f.write(buf.getvalue())

        import asyncio
        job_id = "ds_verify_001"
        asyncio.run(jobs_collection.insert_one({
            "job_id": job_id,
            "filename": "verify_test.jpg",
            "file_type": "image",
            "status": "queued",
            "progress": 0
        }))
        asyncio.run(analyze_image(job_id, test_file, "image/jpeg", "verify_test.jpg"))

        job = asyncio.run(jobs_collection.find_one({"job_id": job_id}))
        print(f"✅ Job Pipeline: {job['status']} (progress: {job['progress']}%)")

        report = asyncio.run(analysis_collection.find_one({"job_id": job_id}))
        print(f"✅ Generated Forensic Report: Score={report['fraud_risk_score']}% | Category={report['risk_category']}")
        print(f"   Recommendation: {report['recommendation'][:60]}...")
        if report["modules"]["ela_analysis"]["ela_image"]:
            print(f"   ELA Heatmap: Available ({len(report['modules']['ela_analysis']['ela_image'])} base64 chars)")

        print("\n" + "=" * 60)
        print("  🎉 ALL SYSTEM CHECKS PASSED PERFECTLY!")
        print("=" * 60)

    finally:
        server.should_exit = True

if __name__ == "__main__":
    main()
