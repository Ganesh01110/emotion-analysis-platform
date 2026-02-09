import sys
import os

# Add project root directory to path (parent of scripts folder)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(project_root)

from backend.models.connection import SessionLocal
from backend.models.database import MoodLog

def verify_pagination():
    db = SessionLocal()
    try:
        page = 2
        limit = 5
        offset = (page - 1) * limit
        
        print(f"Testing Pagination: Page {page}, Limit {limit}")
        
        # Total count
        total = db.query(MoodLog).count()
        print(f"Total Logs: {total}")
        
        # Paginated Query
        logs = db.query(MoodLog).order_by(MoodLog.created_at.desc()).offset(offset).limit(limit).all()
        
        print(f"Logs returned: {len(logs)}")
        for log in logs:
            print(f"- [ID: {log.id}] {log.mood_rating}/5 {log.trigger_tag}")
            
        if len(logs) == limit and total >= limit:
            print("✅ Pagination logic appears correct (returned correct limit)")
        elif total < limit:
             print("⚠️ Not enough data to fully test limit, but query ran.")
        else:
            print("❌ Pagination logic issue: length mismatch")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_pagination()
