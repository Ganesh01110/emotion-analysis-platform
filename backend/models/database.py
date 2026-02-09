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
    
    # Source information
    source_type = Column(Enum(SourceType), nullable=False)
    source_url = Column(String(512), nullable=True)
    
    # Agent mode used
    agent_mode = Column(String(20), nullable=True)
    
    # Timestamp
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship to user
    user = relationship("User", back_populates="analyses")
    
    def __repr__(self):
        return f"<Analysis(id={self.id}, user_id={self.user_id}, timestamp={self.timestamp})>"
    
    @property
    def dominant_emotion(self) -> str:
        """Get the dominant emotion from scores"""
        if not self.emotion_scores:
            return "unknown"
        return max(self.emotion_scores.items(), key=lambda x: x[1])[0]
