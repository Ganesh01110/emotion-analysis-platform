"""
Mood Check-in Routes
Handles quick mood logging and self-care activity history
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import logging
from sqlalchemy.orm import Session
from models.connection import get_db
from models.database import MoodLog, User
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

class MoodCheckInRequest(BaseModel):
    mood_rating: Optional[int] = None
    trigger_tag: Optional[str] = None
    nuance_tag: Optional[str] = None
    activity_type: Optional[str] = None
    duration: Optional[int] = None

@router.post("/mood/check-in")
async def mood_check_in(
    request: MoodCheckInRequest,
    db: Session = Depends(get_db)
):
    """
    Log a quick mood check-in or self-care activity
    """
    try:
        # Get or create default user for now
        user = db.query(User).first()
        if not user:
            user = User(
                firebase_uid="default_test_user",
                email="test@example.com",
                profile_data={"name": "Test User"}
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        new_mood_log = MoodLog(
            user_id=user.id,
            mood_rating=request.mood_rating,
            trigger_tag=request.trigger_tag,
            nuance_tag=request.nuance_tag,
            activity_type=request.activity_type,
            duration=request.duration
        )
        
        db.add(new_mood_log)
        db.commit()
        db.refresh(new_mood_log)
        
        return {
            "status": "success",
            "message": "Mood check-in saved",
            "id": new_mood_log.id
        }
    except Exception as e:
        logger.error(f"Mood check-in error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save mood check-in")

@router.get("/mood/history")
async def get_mood_history(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Fetch recent mood check-ins
    """
    try:
        logs = db.query(MoodLog).order_by(MoodLog.created_at.desc()).limit(limit).all()
        
        return [
            {
                "id": log.id,
                "mood_rating": log.mood_rating,
                "trigger_tag": log.trigger_tag,
                "nuance_tag": log.nuance_tag,
                "activity_type": log.activity_type,
                "duration": log.duration,
                "created_at": log.created_at
            } for log in logs
        ]
    except Exception as e:
        logger.error(f"Mood history error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch mood history")
