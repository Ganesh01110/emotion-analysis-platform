import sys
import os
from sqlalchemy import text

# Add parent directory to path to import models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.connection import SessionLocal

def migrate():
    print("🔄 Starting database migration...")
    db = SessionLocal()
    
    try:
        # 1. Add column if it doesn't exist (SQLite doesn't support IF NOT EXISTS in ALTER TABLE easily, so we catch error)
        try:
            db.execute(text("ALTER TABLE analyses ADD COLUMN dominant_emotion VARCHAR(20)"))
            db.commit()
            print("✅ Added dominant_emotion column.")
        except Exception:
            print("ℹ️ Column dominant_emotion already exists or couldn't be added directly.")
            db.rollback()

        # 2. Update existing records
        from models.database import Analysis
        records = db.query(Analysis).all()
        updated_count = 0
        
        for record in records:
            if record.emotion_scores:
                # Calculate dominant emotion from scores
                dominant = max(record.emotion_scores.items(), key=lambda x: x[1])[0]
                record.dominant_emotion = dominant
                updated_count += 1
        
        db.commit()
        print(f"✅ Successfully updated {updated_count} existing records with dominant emotions!")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
