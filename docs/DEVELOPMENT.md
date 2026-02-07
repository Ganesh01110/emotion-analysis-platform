# Emotion Analysis Web App - Development Documentation

## Project Overview

This is a full-stack emotion analysis platform that uses AI/ML to analyze user thoughts and media content, providing insights through interactive visualizations.

## Architecture

### Backend (FastAPI + Python)
- **AI Engine**: Hugging Face DistilBERT for emotion classification
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Security**: AES-256 encryption for sensitive data
- **Caching**: Redis for async task processing

### Frontend (Next.js + React)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom color palette
- **Visualizations**: D3.js for interactive charts
- **PWA**: Service Workers for offline functionality

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python -m models.connection  # Initialize database
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

### Docker Development
```bash
# Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Features Implemented

### Phase 1: AI Engine ✅
- FastAPI backend with Hugging Face integration
- 8-emotion Plutchik model mapping
- Media content scraping
- Agent modes (Counselor, Analytical, Brutally Honest)

### Phase 2: Database & Security ✅
- PostgreSQL schema with Users and Analyses tables
- AES-256 encryption for user thoughts
- SQLAlchemy ORM with relationships

### Phase 3: Frontend Foundation ✅
- Next.js 15 with TypeScript
- Sage Green/Yellow color palette
- Dark mode support
- PWA manifest

### Phase 4: Visualizations ✅
- D3.js emotion wheel (donut chart)
- Spider/radar chart for single entry
- Interactive hover effects

### Phase 5: PWA Features ✅
- Service Worker for offline caching
- IndexedDB for offline storage
- Background sync hook

### Phase 6: DevOps ✅
- Docker Compose configuration
- GitHub Actions CI/CD
- Automated testing pipeline

## API Endpoints

### POST /api/analyze
Analyze text and return emotion scores.

**Request:**
```json
{
  "text": "Your thought paragraph here",
  "agent_mode": "analytical"
}
```

**Response:**
```json
{
  "emotion_scores": {
    "joy": 0.1,
    "sadness": 0.05,
    "anger": 0.8,
    "fear": 0.2,
    "trust": 0.1,
    "disgust": 0.15,
    "surprise": 0.05,
    "anticipation": 0.1
  },
  "dominant_emotion": "anger",
  "intensity": 0.8,
  "agent_response": "Response based on mode",
  "trigger_words": ["word1", "word2"]
}
```

### POST /api/scrape
Analyze media content from URL (one-time, no storage).

**Request:**
```json
{
  "url": "https://example.com/article"
}
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run lint
npm run build
```

## Deployment

### Vercel (Frontend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Hugging Face Spaces (Backend)
1. Create new Space
2. Upload Dockerfile
3. Set secrets in Space settings
4. Connect external database (Aiven/PlanetScale)

## Contributing

1. Create feature branch from `master`
2. Make changes with descriptive commits
3. Test locally
4. Submit pull request

## License

MIT License - See LICENSE file for details
