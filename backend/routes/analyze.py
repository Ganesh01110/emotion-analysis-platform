"""
Emotion Analysis Routes
Handles text and media analysis endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, List
import logging
from sqlalchemy.orm import Session
from models.connection import get_db
from models.database import Analysis, User, SourceType

logger = logging.getLogger(__name__)

router = APIRouter()


class TextAnalysisRequest(BaseModel):
    """Request model for text analysis"""
    text: str
    agent_mode: Optional[str] = "analytical"  # counselor, analytical, brutally_honest
    

class MediaAnalysisRequest(BaseModel):
    """Request model for media URL analysis"""
    url: HttpUrl
    

class EmotionScores(BaseModel):
    """Emotion scores response model"""
    joy: float
    sadness: float
    anger: float
    fear: float
    trust: float
    disgust: float
    surprise: float
    anticipation: float


class AnalysisResponse(BaseModel):
    """Analysis response model"""
    emotion_scores: EmotionScores
    dominant_emotion: str
    intensity: float
    agent_response: Optional[str] = None
    trigger_words: Optional[List[str]] = None


def get_emotion_classifier():
    """Dependency to get the loaded ML model"""
    from main import ml_models
    
    if "emotion_classifier" not in ml_models:
        raise HTTPException(status_code=503, detail="AI model not loaded")
    
    return ml_models["emotion_classifier"]


def normalize_emotion_scores(raw_results: List[Dict]) -> EmotionScores:
    """
    Convert Hugging Face output to 8-emotion Plutchik model
    Maps the 6-emotion model to 8 emotions with approximations
    """
    # Initialize all emotions to 0
    emotions = {
        "joy": 0.0,
        "sadness": 0.0,
        "anger": 0.0,
        "fear": 0.0,
        "trust": 0.0,
        "disgust": 0.0,
        "surprise": 0.0,
        "anticipation": 0.0
    }
    
    # Map Hugging Face labels to Plutchik emotions
    label_mapping = {
        "joy": "joy",
        "sadness": "sadness",
        "anger": "anger",
        "fear": "fear",
        "love": "trust",  # Love maps to Trust
        "surprise": "surprise"
    }
    
    # Process results
    for result in raw_results:
        label = result["label"].lower()
        score = result["score"]
        
        if label in label_mapping:
            emotion = label_mapping[label]
            emotions[emotion] = score
    
    # Derive missing emotions (approximations)
    # Disgust can be approximated from anger + sadness
    emotions["disgust"] = min((emotions["anger"] + emotions["sadness"]) / 3, 1.0)
    
    # Anticipation can be approximated from joy + surprise
    emotions["anticipation"] = min((emotions["joy"] + emotions["surprise"]) / 3, 1.0)
    
    return EmotionScores(**emotions)


def get_dominant_emotion(scores: EmotionScores) -> tuple[str, float]:
    """Get the dominant emotion and its intensity"""
    emotions_dict = scores.model_dump()
    dominant = max(emotions_dict.items(), key=lambda x: x[1])
    return dominant[0], dominant[1]


def generate_agent_response(scores: EmotionScores, mode: str, dominant: str) -> str:
    """
    Generate contextual response based on agent mode
    """
    responses = {
        "counselor": {
            "anger": "I notice you're experiencing some anger. It's completely valid to feel this way. Would you like to try a brief breathing exercise?",
            "sadness": "It sounds like you're going through a difficult time. Remember, it's okay to feel sad. Your emotions are valid.",
            "fear": "I sense some anxiety in your words. Let's take a moment to ground ourselves. You're safe right now.",
            "joy": "I'm glad to see you're experiencing some positive emotions. That's wonderful!",
        },
        "analytical": {
            "anger": f"Anger detected at {scores.anger:.1%}. Consider identifying specific triggers to address the root cause.",
            "sadness": f"Sadness level: {scores.sadness:.1%}. Pattern analysis suggests reviewing recent life changes.",
            "fear": f"Fear response: {scores.fear:.1%}. Recommend cognitive reframing techniques.",
            "joy": f"Positive affect: {scores.joy:.1%}. Maintain activities that generate this emotional state.",
        },
        "brutally_honest": {
            "anger": "You're angry. That's clear. Now, what are you going to do about it?",
            "sadness": "Feeling down won't solve anything. Time to identify what's actually wrong and take action.",
            "fear": "Fear is just your brain's alarm system. Is the threat real or imagined?",
            "joy": "Good. Keep doing whatever led to this feeling.",
        }
    }
    
    default_response = "Analysis complete. Review your emotion scores for insights."
    return responses.get(mode, {}).get(dominant, default_response)


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(
    request: TextAnalysisRequest,
    db: Session = Depends(get_db),
    classifier = Depends(get_emotion_classifier)
):
    """
    Analyze text and return emotion scores
    """
    try:
        # Run AI inference
        raw_results = classifier(request.text)[0]
        
        # Normalize to 8-emotion model
        emotion_scores = normalize_emotion_scores(raw_results)
        
        # Get dominant emotion
        dominant_emotion, intensity = get_dominant_emotion(emotion_scores)
        
        # Generate agent response
        agent_response = generate_agent_response(
            emotion_scores,
            request.agent_mode,
            dominant_emotion
        )
        
        # Extract trigger words (simplified - can be enhanced with NER)
        trigger_words = [word for word in request.text.split() if len(word) > 5][:5]
        
        response_data = AnalysisResponse(
            emotion_scores=emotion_scores,
            dominant_emotion=dominant_emotion,
            intensity=intensity,
            agent_response=agent_response,
            trigger_words=trigger_words
        )

        # PERSIST TO DATABASE
        try:
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
            
            new_analysis = Analysis(
                user_id=user.id,
                encrypted_text=request.text, # Storing raw for now as per user request
                emotion_scores=emotion_scores.model_dump(),
                source_type=SourceType.TEXT,
                agent_mode=request.agent_mode
            )
            db.add(new_analysis)
            db.commit()
        except Exception as db_error:
            logger.error(f"Database error: {db_error}")

        return response_data
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/scrape", response_model=AnalysisResponse)
async def analyze_media(
    request: MediaAnalysisRequest,
    db: Session = Depends(get_db),
    classifier = Depends(get_emotion_classifier)
):
    """
    Scrape URL and analyze content and store results in DB
    """
    try:
        from utils.scraper import scrape_article
        
        # Scrape article text
        article_text = scrape_article(str(request.url))
        
        if not article_text:
            raise HTTPException(status_code=400, detail="Could not extract text from URL")
        
        # Analyze the scraped text
        # Limit to 512 chars for speed and consistent results
        raw_results = classifier(article_text[:512])[0]
        
        emotion_scores = normalize_emotion_scores(raw_results)
        dominant_emotion, intensity = get_dominant_emotion(emotion_scores)
        
        # Prepare response
        response_data = AnalysisResponse(
            emotion_scores=emotion_scores,
            dominant_emotion=dominant_emotion,
            intensity=intensity,
            agent_response=f"Media analysis complete. Dominant tone: {dominant_emotion}",
            trigger_words=None
        )
        
        # PERSIST TO DATABASE
        try:
            # For now, get or create a default user for testing
            # In a real app, this would come from the authenticated user context
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
            
            # Create analysis record without text content (saves space)
            new_analysis = Analysis(
                user_id=user.id,
                encrypted_text=None,  # Not storing large content as per requirements
                emotion_scores=emotion_scores.model_dump(),
                source_type=SourceType.URL,
                source_url=str(request.url),
                agent_mode="analytical"
            )
            
            db.add(new_analysis)
            db.commit()
            logger.info(f"✅ Saved media analysis for URL: {request.url}")
            
        except Exception as db_error:
            # Log DB error but don't fail the request if analysis succeeded
            logger.error(f"❌ Database focus error: {db_error}")
            # We still return the response_data because the analysis was successful
            
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Media analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Media analysis failed: {str(e)}")


@router.get("/history")
async def get_history(
    page: int = 1,
    limit: int = 10,
    source_type: Optional[str] = None,
    emotion: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Fetch paginated and filtered analysis history"""
    try:
        query = db.query(Analysis)
        
        # Filtering
        if source_type:
            query = query.filter(Analysis.source_type == source_type)
        if emotion and emotion != 'all':
            query = query.filter(Analysis.dominant_emotion == emotion)
        if search:
            search_query = f"%{search}%"
            # Search in text or URL
            query = query.filter(
                (Analysis.encrypted_text.ilike(search_query)) | 
                (Analysis.source_url.ilike(search_query))
            )

        # Count total before limit/offset
        total = query.count()
        pages = (total + limit - 1) // limit
        
        # Paginate
        offset = (page - 1) * limit
        analyses = query.order_by(Analysis.timestamp.desc()).limit(limit).offset(offset).all()
        
        return {
            "items": [
                {
                    "id": a.id,
                    "timestamp": a.timestamp,
                    "emotion_scores": a.emotion_scores,
                    "dominant_emotion": a.dominant_emotion,
                    "source_type": a.source_type,
                    "source_url": a.source_url,
                    "text": a.encrypted_text
                } for a in analyses
            ],
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }
    except Exception as e:
        logger.error(f"History fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")


@router.get("/history/summary")
async def get_history_summary(db: Session = Depends(get_db)):
    """Fetch count and intensity summary per day for heatmap"""
    try:
        from sqlalchemy import func, cast, Float
        
        # Dialect-specific intensity calculation
        dialect = db.bind.dialect.name
        if dialect == 'postgresql':
            intensity_col = cast(Analysis.emotion_scores['joy'].astext, Float)
        else:
            intensity_col = func.json_extract(Analysis.emotion_scores, '$.joy')

        # Group by date
        results = db.query(
            func.date(Analysis.timestamp).label('date'),
            func.count(Analysis.id).label('count'),
            func.avg(intensity_col).label('intensity')
        ).group_by(func.date(Analysis.timestamp)).all()
        
        return [
            {
                "date": str(r.date),
                "count": r.count,
                "intensity": float(r.intensity or 0)
            } for r in results
        ]
    except Exception as e:
        logger.error(f"Summary fetch error: {e}")
        # Fallback: Pull last 1000 records and aggregate in Python if SQL fails
        try:
            from collections import defaultdict
            analyses = db.query(Analysis).order_by(Analysis.timestamp.desc()).limit(1000).all()
            stats = defaultdict(lambda: {"count": 0, "sum": 0})
            for a in analyses:
                d = a.timestamp.date().isoformat()
                stats[d]["count"] += 1
                stats[d]["sum"] += a.emotion_scores.get("joy", 0)
            
            return [
                {
                    "date": d,
                    "count": v["count"],
                    "intensity": v["sum"] / v["count"]
                } for d, v in stats.items()
            ]
        except:
            return []
