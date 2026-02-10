"""
Database models for Emotion Analysis
SQLAlchemy ORM models for Users and Analyses
"""

from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()


class SourceType(str, enum.Enum):
    """Source type for analysis"""
    TEXT = "text"
    URL = "url"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(128), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    profile_data = Column(JSON, nullable=True)
    
    # Relationship to analyses
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class Analysis(Base):
    """Analysis model for storing emotion analysis results"""
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Encrypted thought text (Optional for URL analyses)
    encrypted_text = Column(Text, nullable=True)
    
    # Emotion scores (8-emotion JSON)
    emotion_scores = Column(JSON, nullable=False)
    
    # Dominant emotion (cached for filtering)
    dominant_emotion = Column(String(20), nullable=False, index=True)
    
    # Source information
    source_type = Column(Enum(SourceType), nullable=False)
    source_url = Column(String(512), nullable=True)
    
    # Agent mode and response insights
    agent_mode = Column(String(20), nullable=True)
    agent_response = Column(Text, nullable=True)
    
    # Timestamp
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship to user
    user = relationship("User", back_populates="analyses")
    
    def __repr__(self):
        return f"<Analysis(id={self.id}, user_id={self.user_id}, timestamp={self.timestamp})>"


class MoodLog(Base):
    """Model for quick mood check-ins and self-care activity logging"""
    __tablename__ = "mood_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # 1-5 rating (1=Very Bad, 5=Very Good)
    mood_rating = Column(Integer, nullable=True)
    
    # Trigger/Reason (e.g., "work", "family", "hobbies")
    trigger_tag = Column(String(50), nullable=True)
    
    # Emotional nuance (e.g., "anxious", "grateful", "overwhelmed")
    nuance_tag = Column(String(50), nullable=True)
    
    # Activity logging (for Self-Care timer)
    activity_type = Column(String(50), nullable=True) # "meditation", "breathing", "doodle"
    duration = Column(Integer, nullable=True) # Duration in seconds
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship to user
    user = relationship("User")
    
    def __repr__(self):
        return f"<MoodLog(id={self.id}, user_id={self.user_id}, mood={self.mood_rating})>"
