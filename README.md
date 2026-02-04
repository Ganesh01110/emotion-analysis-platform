# Emotion Analysis Web App

A full-stack emotion analysis platform using AI/ML to analyze thoughts and media content, visualizing emotional patterns through interactive charts.

## Features

- 🧠 **AI-Powered Emotion Analysis** - 8-emotion classification using Hugging Face Transformers
- 📊 **Interactive Visualizations** - Emotion wheel, spider charts, temporal drift analysis
- 📱 **PWA Support** - Offline-first with background sync
- 🔒 **Secure** - AES-256 encryption for sensitive mental health data
- 🎨 **Beautiful UI** - Bento grid layout with dark/light modes
- 🤖 **Adaptive Agent Modes** - Counselor, Analytical, and Brutally Honest modes

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, D3.js
- **Backend**: FastAPI (Python)
- **AI/ML**: Hugging Face Transformers (DistilBERT)
- **Database**: PostgreSQL/MariaDB
- **Cache**: Redis
- **Auth**: Firebase Authentication
- **DevOps**: Docker, GitHub Actions

## Getting Started

See `implementation_plan.md` for detailed setup instructions.

## Project Structure

```
EmotionanalysisProject/
├── frontend/          # Next.js application
├── backend/           # FastAPI server
├── plans/             # Project planning documents
├── assets/            # UI reference images
└── docs/              # Additional documentation
```

## Development

```bash
# Install dependencies
npm install  # Frontend
pip install -r requirements.txt  # Backend

# Run development servers
npm run dev  # Frontend (port 3000)
uvicorn main:app --reload  # Backend (port 8000)
```

## License

MIT
