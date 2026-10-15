from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv()
                                                    
celery_app = Celery(
    "deepshield",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    include=[
        "workers.image_worker",                                      
        "workers.audio_worker",                                   
        "workers.document_worker",                                     
        "workers.scoring_worker",                                         
    ]
)

               
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,                                                              
    task_acks_late=True,                                                                
    worker_prefetch_multiplier=1,                                                    
)
