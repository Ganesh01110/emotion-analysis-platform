"""
Backend Tests
Unit tests for emotion analysis and utilities
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from utils.encryption import EncryptionManager
import os

client = TestClient(app)


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_loaded" in data


def test_analyze_text():
    """Test text analysis endpoint"""
    response = client.post(
        "/api/analyze",
        json={
            "text": "I am feeling very happy and excited about the future!",
            "agent_mode": "analytical"
        }
    )
    assert response.status_code == 200
    data = response.json()
    
    # Check response structure
    assert "emotion_scores" in data
    assert "dominant_emotion" in data
    assert "intensity" in data
    assert "agent_response" in data
    
    # Check emotion scores
    scores = data["emotion_scores"]
    assert all(key in scores for key in ["joy", "sadness", "anger", "fear", "trust", "disgust", "surprise", "anticipation"])
    assert all(0 <= score <= 1 for score in scores.values())
    
    # Joy should be dominant for this text
    assert data["dominant_emotion"] in ["joy", "anticipation"]


def test_analyze_text_invalid():
    """Test analysis with invalid input"""
    response = client.post(
        "/api/analyze",
        json={"text": ""}
    )
    assert response.status_code == 422  # Validation error


def test_agent_modes():
    """Test different agent modes"""
    text = "I am feeling anxious about work"
    
    for mode in ["counselor", "analytical", "brutally_honest"]:
        response = client.post(
            "/api/analyze",
            json={"text": text, "agent_mode": mode}
        )
        assert response.status_code == 200
        data = response.json()
        assert "agent_response" in data
        assert len(data["agent_response"]) > 0


def test_encryption():
    """Test encryption and decryption"""
    os.environ["ENCRYPTION_KEY"] = "test-key-for-testing-purposes-only"
    manager = EncryptionManager()
    
    original_text = "This is a sensitive thought"
    encrypted = manager.encrypt_text(original_text)
    decrypted = manager.decrypt_text(encrypted)
    
    assert encrypted != original_text
    assert decrypted == original_text


def test_encryption_empty():
    """Test encryption with empty string"""
    os.environ["ENCRYPTION_KEY"] = "test-key-for-testing-purposes-only"
    manager = EncryptionManager()
    
    assert manager.encrypt_text("") == ""
    assert manager.decrypt_text("") == ""


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
