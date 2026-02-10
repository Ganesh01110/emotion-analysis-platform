# Emotion Analysis Web App 🧠

A full-stack emotion analysis platform using AI/ML to analyze user thoughts and media content, providing insights through interactive visualizations.

## ✨ Features

- **AI-Powered Analysis**: Hugging Face DistilBERT for 8-emotion classification
- **Interactive Visualizations**: D3.js emotion wheels, spider charts, and activity heatmaps
- **Secure & Private**: AES-256 encryption for mental health data
- **PWA**: Offline-first with Service Workers and IndexedDB
- **Adaptive Care**: Personalized mental health support with breathing exercises
- **Agent Modes**: Counselor, Analytical, and Brutally Honest response styles

## 🛠 Tech Stack

**Backend**: FastAPI, Python 3.10, PostgreSQL, Redis  
**Frontend**: Next.js 15, React 19, Tailwind CSS, D3.js  
**AI/ML**: Hugging Face Transformers (DistilBERT)  
**Auth**: Firebase Authentication  
**DevOps**: Docker, GitHub Actions

## 🚀 Getting Started

### With Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd EmotionanalysisProject

# Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## 📁 Project Structure

```
EmotionanalysisProject/
├── backend/              # FastAPI application
│   ├── main.py          # App entry point
│   ├── routes/          # API endpoints
│   ├── utils/           # Utilities (encryption, scraper)
│   ├── models/          # Database models
│   └── tests/           # Test suite
├── frontend/            # Next.js application
│   ├── app/            # App router pages
│   ├── components/     # React components
│   ├── lib/            # Firebase config
│   └── hooks/          # Custom hooks
├── docs/               # Documentation
├── .github/            # CI/CD workflows
└── docker-compose.yml  # Docker configuration
```

## 📚 Documentation

- **Development Guide**: `docs/DEVELOPMENT.md`
- **Implementation Plan**: `implementation_plan.md`
- **Task Progress**: `task.md`
- **Project Status**: `STATUS.md`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Linting
```bash
cd frontend
npm run lint
npm run build
```

## 🌟 Key Features

### Dashboard
- Bento Grid layout with emotion analysis
- Real-time emotion wheel visualization
- Mindfulness streak tracking
- Sentiment drift charts

### Self-Care
- Guided breathing exercises
- Mood lifters and affirmations
- Crisis resources
- Progress tracking

### History
- Activity heatmap (GitHub-style)
- Search and filter entries
- Emotion timeline
- Pattern analysis

## 📄 License

MIT License - See LICENSE file for details.

## 👤 Author

**Ganesh Sahu**  
Email: ganeshsahu0108@gmail.com

---

Built with ❤️ for mental health awareness

# Quick start with Docker
docker-compose up -d

# Or manually
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
cd frontend && npm install && npm run dev


-----------------

what manual things i have to do here like giving the firebase id , emial etc also here "NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
" where i will get these things and check if the docker file logic in frontend and backend is correct or not and optimised or not ??
