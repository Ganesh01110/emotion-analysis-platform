# Emotion Analysis Project - Walkthrough

## Project Overview

This is a full-stack emotion analysis web application that uses AI/ML to analyze user thoughts and media content, visualizing emotional patterns through interactive charts and providing adaptive mental health support features.

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with React
- **Styling**: Tailwind CSS with custom Sage Green/Yellow theme
- **Visualizations**: D3.js for emotion wheel, Recharts for spider/radar charts
- **PWA**: Service Workers + IndexedDB for offline-first functionality
- **Auth**: Firebase Authentication

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML**: Hugging Face Transformers (DistilBERT emotion classifier)
- **Database**: PostgreSQL/MariaDB with SQLAlchemy ORM
- **Security**: AES-256 encryption for sensitive mental health data
- **Scraping**: BeautifulSoup4 for media content extraction

### DevOps
- **Containerization**: Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend) + Hugging Face Spaces (Backend)

## Key Features Implemented

### 1. Emotion Analysis Engine
- **8-Emotion Model**: Based on Plutchik's wheel (Joy, Sadness, Anger, Fear, Trust, Disgust, Surprise, Anticipation)
- **Text Analysis**: Analyze user thoughts with real-time emotion scoring
- **Media Analysis**: Scrape and analyze emotional tone of articles/URLs
- **Encryption**: All user thoughts encrypted with AES-256 before storage

### 2. Interactive Visualizations
- **Emotion Wheel**: Layered donut chart showing primary emotions and intensity levels
- **Spider Chart**: 8-axis radar visualization for single entry analysis
- **Activity Heatmap**: GitHub-style contribution map based on emotional output
- **Temporal Drift**: 7-day trend analysis with line charts

### 3. Adaptive Care System
- **Agent Modes**: 
  - Counselor (validating, CBT-based)
  - Analytical (raw data focus)
  - Brutally Honest (pattern recognition)
- **Triggered Interventions**:
  - Anger > 0.7 → Breathing exercises (4-7-8 technique)
  - Sadness > 0.7 → Mood lifter suggestions
  - Fear > 0.8 → Grounding techniques
  - Crisis detection → Emergency resources

### 4. PWA Capabilities
- **Offline Mode**: Write thoughts without internet connection
- **Background Sync**: Automatic sync when connection restored
- **IndexedDB Storage**: Local data persistence
- **Service Worker**: Cache static assets and handle offline requests

## Project Structure

```
EmotionanalysisProject/
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── routes/
│   │   └── analyze.py          # Emotion analysis endpoints
│   ├── utils/
│   │   ├── encryption.py       # AES-256 encryption utilities
│   │   └── scraper.py          # Web scraping for media analysis
│   ├── models/
│   │   └── database.py         # SQLAlchemy models
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── components/         # React components
│   │   └── hooks/              # Custom React hooks
│   ├── public/
│   │   └── sw.js               # Service Worker
│   └── package.json
├── docs/                        # Documentation
├── docker-compose.yml          # Multi-container setup
└── README.md                   # Project overview
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (optional)
- PostgreSQL/MariaDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EmotionanalysisProject
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**
   - Copy `.env.example` files in both backend and frontend
   - Add Firebase credentials
   - Set database URLs
   - Configure encryption keys

### Running the Application

**Option 1: Docker Compose (Recommended)**
```bash
docker-compose up
```

**Option 2: Manual**
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development Workflow

### Testing
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
npm run test:e2e
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend (Docker)
docker build -t emotion-analysis-backend .
```

## Database Schema

### Users Table
- `id`: Primary key
- `firebase_uid`: Unique Firebase user ID
- `email`: User email
- `created_at`: Registration timestamp
- `profile_data`: JSONB for flexible profile storage

### Analyses Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `encrypted_text`: AES-256 encrypted user thought
- `emotion_scores`: JSONB with 8 emotion values
- `source_type`: 'text' or 'url'
- `source_url`: URL if media analysis
- `timestamp`: Analysis timestamp
- `agent_mode`: Active agent mode during analysis

## Design System

### Color Palette

**Light Mode:**
- Background: `#FDFCF0` (Cream)
- Primary: `#86A789` (Sage Green)
- Secondary: `#F4E869` (Mellow Yellow)
- Text: `#2D3436`

**Dark Mode:**
- Background: `#121812` (Deep Charcoal-Green)
- Primary: `#4F6F52` (Dark Sage)
- Secondary: `#B8A12C` (Dark Yellow)
- Text: `#E0E0E0`

**Emotion Colors (Plutchik Standard):**
- Joy: `#FFD700` (Yellow)
- Sadness: `#4A90E2` (Blue)
- Anger: `#E74C3C` (Red)
- Fear: `#9B59B6` (Purple)
- Trust: `#86E3CE` (Light Green)
- Disgust: `#8E44AD` (Dark Purple)
- Surprise: `#F39C12` (Orange)
- Anticipation: `#E67E22` (Dark Orange)

## API Endpoints

### POST /analyze
Analyze text and return emotion scores
```json
{
  "text": "User thought or paragraph",
  "agent_mode": "counselor"
}
```

### POST /scrape
Analyze URL content (one-time, no storage)
```json
{
  "url": "https://example.com/article"
}
```

### GET /history
Retrieve user's analysis history with filters

## Security Considerations

- All user thoughts encrypted with AES-256 before database storage
- Firebase JWT token verification on all protected endpoints
- HTTPS enforcement in production
- CORS configured for specific origins only
- Environment variables for sensitive credentials

## Deployment

### Frontend (Vercel)
- Automatic deployment on push to main branch
- Environment variables configured in Vercel dashboard
- Static export for optimal performance

### Backend (Hugging Face Spaces)
- Dockerfile configured for port 7860
- Hugging Face model auto-downloaded on first run
- Environment secrets configured in Space settings

## Git Commit History

Project initialized with commits starting from **February 4th, 2026**:
- Feb 4: Project setup and backend foundation
- Feb 5: Database models and Docker configuration
- Feb 6: Frontend initialization with visualizations
- Feb 7: PWA features and offline sync
- Feb 8: CI/CD pipeline and deployment configuration

## Future Enhancements

- [ ] Voice input for thought journaling
- [ ] Multi-language support
- [ ] Advanced pattern recognition with ML
- [ ] Social features (anonymous support groups)
- [ ] Integration with wearables for physiological data
- [ ] Export data as PDF reports

## Contributing

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for development guidelines and setup instructions.

## License

See [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for mental health awareness**
