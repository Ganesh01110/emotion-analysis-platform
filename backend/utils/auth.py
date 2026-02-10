"""
Firebase Authentication Utility
Handles token verification and user identification
"""

import os
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Header, HTTPException, Depends, status
from sqlalchemy.orm import Session
from models.connection import get_db
from models.database import User
import logging

logger = logging.getLogger(__name__)

if not firebase_admin._apps:
    try:
        # Check for minimum required env vars for certificate authentication
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        private_key = os.getenv("FIREBASE_PRIVATE_KEY")
        client_email = os.getenv("FIREBASE_CLIENT_EMAIL")

        if project_id and private_key and client_email:
            try:
                firebase_creds = {
                    "type": "service_account",
                    "project_id": project_id,
                    "private_key": private_key.replace("\\n", "\n"),
                    "client_email": client_email,
                    # Optional but good to have
                    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
                }
                cred = credentials.Certificate(firebase_creds)
                firebase_admin.initialize_app(cred)
                logger.info("✅ Firebase Admin initialized with Certificate")
            except Exception as e:
                logger.error(f"❌ Failed to load certificate: {e}")
                # Fallback to default credentials
                firebase_admin.initialize_app()
                logger.info("⚠️ Falling back to Default Firebase Credentials")
        else:
            # Fallback for local development or when using ADC (Application Default Credentials)
            logger.warning("⚠️ Firebase credentials missing. initializing with default settings.")
            firebase_admin.initialize_app()
    except Exception as e:
        logger.error(f"❌ Firebase Admin Initialization Error: {e}")

async def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    FastAPI dependency to verify Firebase token and return the User model
    """
    # Determine if we should allow fallback for local development
    firebase_keys = [os.getenv("FIREBASE_PROJECT_ID"), os.getenv("FIREBASE_PRIVATE_KEY"), os.getenv("FIREBASE_CLIENT_EMAIL")]
    is_placeholder = any("xxxxx" in (k or "") or "MIIEvQTY" in (k or "") for k in firebase_keys)
    allow_fallback = not all(firebase_keys) or is_placeholder

    if not authorization:
        if allow_fallback:
            logger.warning("⚠️ Missing Authorization header. Auth fallback triggered.")
            uid = "default_local_user"
            email = "local@example.com"
            name = "Local Developer"
            picture = ""
            
            # Find or create user in our SQL database
            user = db.query(User).filter(User.firebase_uid == uid).first()
            if not user:
                user = User(
                    firebase_uid=uid,
                    email=email,
                    profile_data={"name": name, "picture": picture}
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            return user

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header"
        )
    
    try:
        # Authorization: Bearer <token>
        try:
            token = authorization.split("Bearer ")[1]
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            email = decoded_token.get('email', 'unknown@example.com')
            name = decoded_token.get('name', '')
            picture = decoded_token.get('picture', '')
        except Exception as token_err:
            if allow_fallback:
                logger.warning(f"⚠️ Auth fallback triggered: {token_err}")
                uid = "default_local_user"
                email = "local@example.com"
                name = "Local Developer"
                picture = ""
            else:
                raise token_err
        
        # Find or create user in our SQL database
        user = db.query(User).filter(User.firebase_uid == uid).first()
        
        if not user:
            user = User(
                firebase_uid=uid,
                email=email,
                profile_data={
                    "name": name,
                    "picture": picture
                }
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        return user
        
    except Exception as e:
        logger.error(f"❌ Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}"
        )
