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

from utils.auth import get_current_user

@router.post("/mood/check-in")
async def mood_check_in(
    request: MoodCheckInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Log a quick mood check-in or self-care activity for the authenticated user
    """
    try:
        new_mood_log = MoodLog(
            user_id=current_user.id,
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
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch recent mood check-ins for the authenticated user only
    """
    try:
        offset = (page - 1) * limit
        
        # Query logs filtered by current user
        total_logs = db.query(MoodLog).filter(MoodLog.user_id == current_user.id).count()
        
        logs = db.query(MoodLog)\
            .filter(MoodLog.user_id == current_user.id)\
            .order_by(MoodLog.created_at.desc())\
            .offset(offset)\
            .limit(limit)\
            .all()
        
        total_pages = (total_logs + limit - 1) // limit
        
        return {
            "items": [
                {
                    "id": log.id,
                    "mood_rating": log.mood_rating,
                    "trigger_tag": log.trigger_tag,
                    "nuance_tag": log.nuance_tag,
                    "activity_type": log.activity_type,
                    "duration": log.duration,
                    "created_at": log.created_at
                } for log in logs
            ],
            "total": total_logs,
            "page": page,
            "pages": total_pages,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"Mood history error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch mood history")
