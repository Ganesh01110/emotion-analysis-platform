import os
from dotenv import load_dotenv
load_dotenv('backend/.env')
import sys
# Add project root directory to path (parent of scripts folder)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(project_root)

from backend.models.database import Analysis, MoodLog
from backend.models.connection import SessionLocal
from datetime import datetime, timedelta

db = SessionLocal()
six_months_ago = datetime.now() - timedelta(days=180)
print(f"Threshold (six_months_ago): {six_months_ago}")

analyses = db.query(Analysis).all()
print(f"Total analyses in DB: {len(analyses)}")

analyses_filtered = db.query(Analysis).filter(Analysis.timestamp >= six_months_ago).all()
print(f"Analyses in 6mo: {len(analyses_filtered)}")

mood_logs = db.query(MoodLog).all()
print(f"Total mood logs in DB: {len(mood_logs)}")

mood_logs_filtered = db.query(MoodLog).filter(MoodLog.created_at >= six_months_ago).all()
print(f"Mood logs in 6mo: {len(mood_logs_filtered)}")

oldest_analysis = db.query(Analysis).order_by(Analysis.timestamp).first()
if oldest_analysis:
    print(f"Oldest analysis: {oldest_analysis.timestamp}, type: {type(oldest_analysis.timestamp)}")

newest_analysis = db.query(Analysis).order_by(Analysis.timestamp.desc()).first()
if newest_analysis:
    print(f"Newest analysis: {newest_analysis.timestamp}")

# Check first few records to see if they are within the threshold
if analyses:
    for a in analyses[:3]:
        print(f"Analysis {a.id}: {a.timestamp} >= {six_months_ago} ? {a.timestamp >= six_months_ago}")
