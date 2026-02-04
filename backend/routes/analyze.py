"""
Emotion Analysis Routes
Handles text and media analysis endpoints
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, List
import logging

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
        
        return AnalysisResponse(
            emotion_scores=emotion_scores,
            dominant_emotion=dominant_emotion,
            intensity=intensity,
            agent_response=agent_response,
            trigger_words=trigger_words
        )
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/scrape", response_model=AnalysisResponse)
async def analyze_media(
    request: MediaAnalysisRequest,
    classifier = Depends(get_emotion_classifier)
):
    """
    Scrape URL and analyze content (one-time, no storage)
    """
    try:
        from utils.scraper import scrape_article
        
        # Scrape article text
        article_text = scrape_article(str(request.url))
        
        if not article_text:
            raise HTTPException(status_code=400, detail="Could not extract text from URL")
        
        # Analyze the scraped text
        raw_results = classifier(article_text[:512])[0]  # Limit to 512 chars for speed
        
        emotion_scores = normalize_emotion_scores(raw_results)
        dominant_emotion, intensity = get_dominant_emotion(emotion_scores)
        
        return AnalysisResponse(
            emotion_scores=emotion_scores,
            dominant_emotion=dominant_emotion,
            intensity=intensity,
            agent_response=f"Media analysis complete. Dominant tone: {dominant_emotion}",
            trigger_words=None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Media analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Media analysis failed: {str(e)}")
