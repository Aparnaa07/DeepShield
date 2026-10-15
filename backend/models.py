
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text
from sqlalchemy.sql import func
from database import Base
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)                                 
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, unique=True, nullable=False, index=True)
    user_id = Column(String, nullable=True)                                 
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)                                      
    file_size_bytes = Column(Integer, nullable=False)
    status = Column(String, default="queued")                                                   
    fraud_risk_score = Column(Float, nullable=True)                                      
    risk_category = Column(String, nullable=True)                                    
    processing_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)                              
