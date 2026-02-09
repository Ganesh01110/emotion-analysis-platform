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

##### To only run Backend server after stopping it

**For PowerShell:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

**For CMD (Command Prompt):**
```cmd
cd backend
venv\Scripts\activate.bat
uvicorn main:app --reload
```


##### Kill Previously Running Backend/Frontend Processes

**For PowerShell:**
```powershell
# Stop all Python (backend) and Node (frontend) processes
Stop-Process -Name "python", "uvicorn", "node" -Force -ErrorAction SilentlyContinue
```

**For CMD (Command Prompt):**
```cmd
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
```


#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```


## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment. The pipeline includes:

1.  **Frontend & Backend Tests**: Runs linting and automated tests.
2.  **Security Scanning**: Uses **Snyk** to check for vulnerabilities.
3.  **Docker Build**: Builds container images for both services.
4.  **Notification**: Sends status updates to a **Discord** channel.

### Required Secrets
To enable the full pipeline, add the following secrets to your GitHub Repository settings:
- `SNYK_TOKEN`: Your Snyk API token.
- `DISCORD_WEBHOOK_URL`: Your Discord Webhook URL for notifications.

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

For detailed information about this project, please refer to the following documentation:

- **[Walkthrough Guide](docs/walkthrough.md)** - Complete project overview, features, and getting started guide
- **[Implementation Plan](docs/implementation_plan.md)** - Technical architecture, proposed changes, and verification plan
- **[Project Status](docs/STATUS.md)** - Current project status, commit history, and next steps
- **[Task Progress](docs/task.md)** - Detailed task checklist and development progress
- **[Development Guide](docs/DEVELOPMENT.md)** - Development setup and guidelines
- **[Setup Instructions](docs/SETUP.md)** - Detailed setup instructions for all components
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deployment instructions for production

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
