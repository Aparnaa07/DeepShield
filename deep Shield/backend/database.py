
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

                                                                                 
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/astrashield")

                                            
engine = create_engine(DATABASE_URL)

                                                          
                                                              
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

                                                           
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db                                         
    finally:
        db.close()                                      


                                                                                 
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "astrashield")

                                                  
mongo_client = AsyncIOMotorClient(MONGO_URL)
mongo_db = mongo_client[MONGO_DB]

                                         
analysis_collection = mongo_db["analyses"]                                 
jobs_collection = mongo_db["jobs"]                              
