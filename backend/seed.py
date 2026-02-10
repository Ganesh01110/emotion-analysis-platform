"""
Seed the database with sample mood logs and analyses.
Usage: python seed.py
"""

import os
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.connection import SessionLocal, init_db
from models.database import User, Analysis, MoodLog, SourceType

def seed_data():
    print("🌱 Starting database seeding...")
    
    # Ensure tables exist
    init_db()
    
    db = SessionLocal()
    try:
        # 1. Create a Default Test User if not exists
        test_uid = "default_local_user"
        test_user = db.query(User).filter(User.firebase_uid == test_uid).first()
        
        if not test_user:
            test_user = User(
                firebase_uid=test_uid,
                email="local@example.com",
                profile_data={"name": "Local Developer", "picture": ""}
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✅ Created test user: {test_user.email}")
        else:
            print("ℹ️ Test user already exists.")

        # 2. Seed Mood Logs (last 14 days)
        print("📊 Seeding mood logs...")
        triggers = ["work", "family", "hobbies", "health", "social"]
        nuances = ["productive", "anxious", "grateful", "tired", "inspired", "overwhelmed"]
        
        for i in range(14):
            # 1-2 logs per day
            for _ in range(random.randint(1, 2)):
                log_date = datetime.utcnow() - timedelta(days=i, hours=random.randint(0, 23))
                mood_log = MoodLog(
                    user_id=test_user.id,
                    mood_rating=random.randint(2, 5),
                    trigger_tag=random.choice(triggers),
                    nuance_tag=random.choice(nuances),
                    created_at=log_date
                )
                db.add(mood_log)
        
        # 3. Seed Analyses
        print("🧠 Seeding emotion analyses...")
        emotions = ["joy", "sadness", "anger", "fear", "surprise", "disgust", "trust", "anticipation"]
        thought_samples = [
            "I had a great day today, finished all my tasks and feeling productive.",
            "Feeling a bit overwhelmed with the new project deadlines.",
            "Really enjoyed the weekend trip, was peaceful and refreshing.",
            "Struggling with some technical debt but making progress.",
            "Excited about the upcoming feature launch!"
        ]
        
        for i in range(5):
            scores = {e: random.uniform(0.1, 0.9) for e in emotions}
            dominant = max(scores, key=scores.get)
            
            analysis = Analysis(
                user_id=test_user.id,
                dominant_emotion=dominant,
                emotion_scores=scores,
                source_type=SourceType.TEXT,
                encrypted_text=thought_samples[i % len(thought_samples)],
                agent_mode="thoughtful",
                timestamp=datetime.utcnow() - timedelta(days=i*2)
            )
            db.add(analysis)

        db.commit()
        print("✨ Seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
