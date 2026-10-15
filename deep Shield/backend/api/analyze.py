
from fastapi import APIRouter, HTTPException
from database import jobs_collection, analysis_collection

router = APIRouter()


@router.get("/status/{job_id}")
async def get_job_status(job_id: str):
    job = await jobs_collection.find_one({"job_id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

    return job


@router.get("/result/{job_id}")
async def get_analysis_result(job_id: str):
                                      
    job = await jobs_collection.find_one({"job_id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")

    if job["status"] != "completed":
        raise HTTPException(
            status_code=202,                                      
            detail=f"Analysis is still {job['status']}. Please wait."
        )

                                        
    result = await analysis_collection.find_one({"job_id": job_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Analysis result not found")

    return result
