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

print("--- ANALYSES ---")
analyses_count = db.query(Analysis).count()
print(f"Total Count: {analyses_count}")

first_anal = db.query(Analysis).first()
if first_anal:
    print(f"Example Analysis ID: {first_anal.id}")
    print(f"Example Timestamp: {first_anal.timestamp} (Type: {type(first_anal.timestamp)})")

print("\n--- MOOD LOGS ---")
mood_count = db.query(MoodLog).count()
print(f"Total Count: {mood_count}")

first_mood = db.query(MoodLog).first()
if first_mood:
    print(f"Example Mood ID: {first_mood.id}")
    print(f"Example Created At: {first_mood.created_at} (Type: {type(first_mood.created_at)})")

db.close()
