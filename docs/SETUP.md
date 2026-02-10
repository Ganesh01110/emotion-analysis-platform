# 🔧 Setup Guide - Environment Configuration

## Firebase Setup (Required for Authentication)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `emotion-analysis` (or your choice)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Enable sign-in methods:
   - **Email/Password**: Click, toggle "Enable", Save
   - **Google**: Click, toggle "Enable", add support email, Save

### Step 3: Register Web App

1. In Project Overview, click the **Web icon** (`</>`)
2. Register app:
   - App nickname: `emotion-analysis-web`
   - **Don't** check "Firebase Hosting" (we'll use Vercel)
   - Click "Register app"

### Step 4: Get Your Firebase Config

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "emotion-analysis-xxxxx.firebaseapp.com",
  projectId: "emotion-analysis-xxxxx",
  storageBucket: "emotion-analysis-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 5: Configure Frontend Environment

1. Copy `frontend/.env.example` to `frontend/.env.local`:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Edit `frontend/.env.local` with your Firebase values:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=emotion-analysis-xxxxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=emotion-analysis-xxxxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=emotion-analysis-xxxxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

---

## Backend Environment Setup

### Step 1: Configure Backend Environment

1. Copy `backend/.env.example` to `backend/.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env`:
   ```env
   # Database (for local development, use SQLite or local PostgreSQL)
   DATABASE_URL=postgresql://user:password@localhost:5432/emotion_analysis
   # Or for SQLite: DATABASE_URL=sqlite:///./emotion_analysis.db
   
   # Redis (optional for local dev)
   REDIS_URL=redis://localhost:6379
   
   # Encryption (IMPORTANT: Generate a secure key!)
   ENCRYPTION_KEY=your-super-secret-encryption-key-min-32-chars
   
   # Hugging Face Model
   HF_MODEL_NAME=bhadresh-savani/distilbert-base-uncased-emotion
   
   # API Configuration
   FRONTEND_URL=http://localhost:3000
   ```

### Step 2: Generate Encryption Key

**Option 1: Python**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Option 2: OpenSSL**
```bash
openssl rand -base64 32
```

**Option 3: PowerShell (Windows)**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and use it as your `ENCRYPTION_KEY`.

---

## Database Setup

### Option 1: SQLite (Easiest for Local Development)

Already configured! Just use:
```env
DATABASE_URL=sqlite:///./emotion_analysis.db
```

### Option 2: PostgreSQL (Recommended for Production)

**Local PostgreSQL:**
```bash
# Install PostgreSQL, then:
createdb emotion_analysis
```

**Docker PostgreSQL:**
```bash
docker run -d \
  --name emotion-postgres \
  -e POSTGRES_USER=emotion_user \
  -e POSTGRES_PASSWORD=emotion_pass \
  -e POSTGRES_DB=emotion_analysis \
  -p 5432:5432 \
  postgres:15-alpine
```

**Cloud PostgreSQL (Production):**
- [Aiven](https://aiven.io/) - Free tier available
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Supabase](https://supabase.com/) - Free tier with auth

Get connection string and update `DATABASE_URL`.

---

## Docker Setup (Optional)

### Using Docker Compose

1. **Update environment in docker-compose.yml**:
   - Set `ENCRYPTION_KEY` in backend service
   - Optionally customize database credentials

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Check logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**:
   ```bash
   docker-compose down
   ```

---

## Verification Checklist

### Backend
- [ ] `.env` file created with all variables
- [ ] `ENCRYPTION_KEY` is at least 32 characters
- [ ] Database is accessible (test connection)
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] Server starts: `uvicorn main:app --reload`
- [ ] Visit http://localhost:8000/docs (API documentation)

### Frontend
- [ ] `.env.local` file created with Firebase config
- [ ] All Firebase values are correct (no "your-api-key" placeholders)
- [ ] Dependencies installed: `npm install`
- [ ] Development server starts: `npm run dev`
- [ ] Visit http://localhost:3000

### Firebase
- [ ] Project created
- [ ] Email/Password auth enabled
- [ ] Google auth enabled (optional)
- [ ] Web app registered
- [ ] Config copied to `.env.local`

---

## Troubleshooting

### "Firebase not initialized"
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Verify no typos in `.env.local`
- Restart dev server after changing env vars

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Check database is running (PostgreSQL/Redis)
- For SQLite, ensure write permissions in directory

### "Encryption error"
- Ensure `ENCRYPTION_KEY` is set
- Key must be at least 32 characters
- No special characters that need escaping

### "CORS errors"
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend is running on correct port
- Check CORS settings in `backend/main.py`

---

## Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Backend (Hugging Face Spaces / Railway)
1. Set environment variables in platform
2. Use external PostgreSQL (Aiven/Neon)
3. Update `FRONTEND_URL` to production domain
4. Deploy!

---

## Security Notes

⚠️ **NEVER commit `.env` or `.env.local` files to Git!**

✅ **Always use**:
- Strong encryption keys (32+ characters)
- Environment variables for secrets
- HTTPS in production
- Secure database passwords

---

**Need help?** Check `docs/DEVELOPMENT.md` for detailed setup instructions.
