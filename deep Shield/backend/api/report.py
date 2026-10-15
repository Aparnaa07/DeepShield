
from fastapi import APIRouter, HTTPException, Query
from database import analysis_collection, jobs_collection
from typing import Optional

router = APIRouter()


@router.get("/list")
async def list_reports(
    limit: int = Query(default=10, le=50),                    
    skip: int = Query(default=0),                             
    risk_category: Optional[str] = None                                           
):
    query = {}
    if risk_category:
        query["risk_category"] = risk_category.upper()

    cursor = analysis_collection.find(query, {"_id": 0})
    cursor = cursor.sort("timestamp", -1).skip(skip).limit(limit)                
    reports = await cursor.to_list(length=limit)
    total = await analysis_collection.count_documents(query)

    return {
        "reports": reports,
        "total": total,
        "page": skip // limit + 1,
    }


@router.get("/{job_id}")
async def get_report(job_id: str):
    result = await analysis_collection.find_one({"job_id": job_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Report not found")
    return result


@router.delete("/{job_id}")
async def delete_report(job_id: str):
    await analysis_collection.delete_one({"job_id": job_id})
    await jobs_collection.delete_one({"job_id": job_id})
    return {"message": "Report deleted"}


@router.get("/stats/summary")
async def get_stats():
    total = await analysis_collection.count_documents({})
    critical = await analysis_collection.count_documents({"risk_category": "CRITICAL"})
    high = await analysis_collection.count_documents({"risk_category": "HIGH"})
    medium = await analysis_collection.count_documents({"risk_category": "MEDIUM"})
    low = await analysis_collection.count_documents({"risk_category": "LOW"})

    return {
        "total_analyses": total,
        "by_risk": {
            "CRITICAL": critical,
            "HIGH": high,
            "MEDIUM": medium,
            "LOW": low
        },
        "threat_rate": round((critical + high) / total * 100, 1) if total > 0 else 0
    }
