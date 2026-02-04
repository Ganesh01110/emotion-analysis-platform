"""
FastAPI Backend for Emotion Analysis Web App
Main application entry point with Hugging Face model initialization
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Global model storage
ml_models = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for model loading
    Loads Hugging Face model on startup
    """
    from transformers import pipeline
    
    print("🧠 Loading Hugging Face emotion analysis model...")
    model_name = os.getenv("HF_MODEL_NAME", "bhadresh-savani/distilbert-base-uncased-emotion")
    
    try:
        ml_models["emotion_classifier"] = pipeline(
            "text-classification",
            model=model_name,
            top_k=None  # Return all emotion scores
        )
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        raise
    
    yield
    
    # Cleanup
    ml_models.clear()
    print("🧹 Cleaned up resources")


# Initialize FastAPI app
app = FastAPI(
    title="Emotion Analysis API",
    description="AI-powered emotion analysis for thoughts and media content",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_URL", "*")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Emotion Analysis API is running",
        "model_loaded": "emotion_classifier" in ml_models
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "ok",
        "database": "connected",  # Will be updated when DB is integrated
        "redis": "connected",     # Will be updated when Redis is integrated
        "ai_model": "loaded" if "emotion_classifier" in ml_models else "not loaded"
    }


# Import routes
from routes import analyze
app.include_router(analyze.router, prefix="/api", tags=["analysis"])


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True
    )
