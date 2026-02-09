"""
Database seeding script
Populates the database with sample historical data for testing and demonstration
"""

import sys
import os
from datetime import datetime, timedelta
import random
import json

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.connection import SessionLocal, init_db
from models.database import User, Analysis, SourceType

def seed_database():
    print("🌱 Starting database seeding...")
    db = SessionLocal()
    
    try:
        # 1. Ensure default user exists
        user = db.query(User).filter(User.firebase_uid == "default_test_user").first()
        if not user:
            user = User(
                firebase_uid="default_test_user",
                email="user@example.com",
                profile_data={"name": "Serene User"}
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ Created default user: {user.email}")
        else:
            print(f"ℹ️ User already exists: {user.email}")

        # 2. Generate history for the last 90 days
        now = datetime.utcnow()
        source_types = [SourceType.TEXT, SourceType.URL]
        
        sample_reflections = [
            "I feel so at peace today. The beach was calm and the sun was warm.",
            "Work was incredibly stressful. I felt overwhelmed and frustrated by the lack of communication.",
            "I'm worried about the upcoming presentation, but also excited to share my ideas.",
            "Feeling disappointed after the news today, but trying to stay hopeful.",
            "A beautiful morning meditation really helped clear my mind.",
            "I'm so angry about how I was treated. It's unfair and hurtful.",
            "Watching the sunset made me realize how small my worries are.",
            "I missed my family today. Feeling a bit lonely but grateful for video calls."
        ]
        
        sample_urls = [
            "https://www.nature.com/articles/happiness",
            "https://news.ycombinator.com/item?id=tech-stress",
            "https://www.psychologytoday.com/blog/mindfulness",
            "https://vimeo.com/calm-waves",
            "https://medium.com/topic/mental-health-2024"
        ]

        emotions_base = ["joy", "sadness", "anger", "fear", "trust", "disgust", "surprise", "anticipation"]

        records_to_create = []
        
        # Create ~50-70 random entries over 90 days
        for i in range(120):
            # Random date within last 90 days
            days_ago = random.randint(0, 90)
            hours_ago = random.randint(0, 23)
            timestamp = now - timedelta(days=days_ago, hours=hours_ago)
            
            source = random.choice(source_types)
            
            # Generate random scores that sum reasonably (using simple random)
            scores = {e: random.random() for e in emotions_base}
            # Normalize one dominant emotion
            dominant = random.choice(emotions_base)
            scores[dominant] = random.uniform(0.6, 0.95)
            
            if source == SourceType.TEXT:
                text = random.choice(sample_reflections)
                url = None
            else:
                text = None
                url = random.choice(sample_urls)
            
            analysis = Analysis(
                user_id=user.id,
                encrypted_text=text,
                emotion_scores=scores,
                dominant_emotion=dominant,
                source_type=source,
                source_url=url,
                agent_mode=random.choice(["analytical", "counselor", "brutally_honest"]),
                timestamp=timestamp
            )
            records_to_create.append(analysis)

        db.add_all(records_to_create)
        db.commit()
        print(f"✅ Successfully seeded {len(records_to_create)} analysis records!")

    # 3. Generate Mood Logs (Quick Check-ins)
        print("🌱 Seeding mood logs...")
        from models.database import MoodLog
        mood_logs_to_create = []
        
        triggers = ["work", "family", "health", "sleep", "weather"]
        nuances = ["anxious", "grateful", "tired", "excited", "calm"]
        activities = ["meditation", "breathing", "doodle"]
        
        for i in range(50):
            days_ago = random.randint(0, 60)
            timestamp = now - timedelta(days=days_ago, hours=random.randint(6, 22))
            
            rating = random.randint(1, 5)
            
            log = MoodLog(
                user_id=user.id,
                mood_rating=rating,
                trigger_tag=random.choice(triggers),
                nuance_tag=random.choice(nuances),
                activity_type=random.choice(activities) if random.random() > 0.7 else None,
                duration=random.randint(60, 600) if random.random() > 0.7 else None,
                created_at=timestamp
            )
            mood_logs_to_create.append(log)
            
        db.add_all(mood_logs_to_create)
        db.commit()
        print(f"✅ Successfully seeded {len(mood_logs_to_create)} mood logs!")

    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() # Ensure tables exist
    seed_database()
