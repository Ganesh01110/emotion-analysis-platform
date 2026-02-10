# Emotion Analysis Web App - Implementation Plan

## Project Overview

A full-stack emotion analysis platform that uses AI/ML to analyze user thoughts and media content, visualizing emotional patterns through interactive charts and providing adaptive mental health support features.

---

## User Review Required

> [!IMPORTANT]
> **Git Commit History Timeline**
> The project requires commit history to start from **February 4th, 2026**. This will require backdating commits using `git commit --date` commands. Please confirm if you want:
> - Sequential daily commits from Feb 4-8, 2026
> - Specific commit distribution pattern
> - Any particular commit message conventions

> [!WARNING]
> **Offline-First Architecture**
> The PWA implementation uses IndexedDB and Service Workers for offline functionality. This requires HTTPS in production and may have limitations in certain browsers (Safari has partial Service Worker support).

> [!CAUTION]
> **Mental Health Data Sensitivity**
> User thoughts contain highly sensitive mental health data. AES-256 encryption is mandatory for all stored text. Ensure compliance with data protection regulations (GDPR, HIPAA if applicable).

---

## Technical Architecture

### System Design

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js 15 PWA]
        B[Service Worker]
        C[IndexedDB]
    end
    
    subgraph "API Layer"
        D[FastAPI Backend]
        E[Redis Queue]
    end
    
    subgraph "AI/ML Layer"
        F[Hugging Face Transformers]
        G[DistilBERT Emotion Model]
    end
    
    subgraph "Data Layer"
        H[PostgreSQL/MariaDB]
        I[AES-256 Encryption]
    end
    
    subgraph "Auth Layer"
        J[Firebase Auth]
    end
    
    A -->|API Calls| D
    A -->|Offline Storage| C
    B -->|Background Sync| D
    D -->|Queue Tasks| E
    E -->|Process| F
    F -->|Inference| G
    D -->|Store/Retrieve| H
    H -->|Encrypt/Decrypt| I
    A -->|Authentication| J
    D -->|Verify Token| J
```

### Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Next.js UI
    participant SW as Service Worker
    participant API as FastAPI
    participant AI as Hugging Face
    participant DB as Database
    
    U->>UI: Write thought
    alt Online
        UI->>API: POST /analyze
        API->>AI: Process text
        AI-->>API: Emotion scores
        API->>DB: Store encrypted
        DB-->>API: Success
        API-->>UI: Results + visualizations
    else Offline
        UI->>SW: Store in IndexedDB
        SW-->>UI: Saved locally
        Note over SW: Wait for connection
        SW->>API: Background sync
        API->>AI: Process queued items
        AI-->>API: Emotion scores
        API->>DB: Store encrypted
    end
```

---

## Proposed Changes

### Core Backend (FastAPI + AI)

#### [NEW] [main.py](../backend/main.py)

FastAPI application entry point with:
- Hugging Face model initialization (`distilbert-base-uncased-emotion`)
- CORS configuration for Next.js frontend
- Static file serving for production deployment
- Health check endpoints

#### [NEW] [routes/analyze.py](../backend/routes/analyze.py)

Emotion analysis endpoints:
- `POST /analyze` - Analyze text paragraph, return 8 emotion scores (Joy, Sadness, Anger, Fear, Trust, Disgust, Surprise, Anticipation)
- `POST /scrape` - One-time URL analysis (scrape + analyze, no storage)
- Redis queue integration for async processing
- Firebase token verification

#### [NEW] [utils/encryption.py](../backend/utils/encryption.py)

AES-256 encryption utilities:
- `encrypt_text()` - Encrypt user thoughts before DB storage
- `decrypt_text()` - Decrypt for analysis/display
- Key management from environment variables

#### [NEW] [utils/scraper.py](../backend/utils/scraper.py)

Media content scraper:
- BeautifulSoup4 for article extraction
- Clean text extraction (remove ads, sidebars)
- Error handling for invalid URLs

#### [NEW] [models/database.py](../backend/models/database.py)

SQLAlchemy models:
- `User` table (Firebase UID, profile)
- `Analysis` table (encrypted text, emotion JSON, timestamp, source type)
- Relationships and indexes

---

### Frontend (Next.js + React)

#### [NEW] [app/layout.tsx](../frontend/app/layout.tsx)

Root layout with:
- Firebase Auth provider
- Theme provider (dark/light mode)
- PWA manifest configuration
- Global CSS imports

#### [NEW] [app/dashboard/page.tsx](../frontend/app/dashboard/page.tsx)

Main dashboard with Bento Grid layout:
- Thought input card with tabs (My Thoughts / Analyze Media)
- Current emotion wheel visualization
- 7-day temporal drift chart
- Activity heatmap
- Adaptive "Care Corner" based on emotions

#### [NEW] [components/EmotionWheel.tsx](../frontend/components/EmotionWheel.tsx)

Layered donut chart using D3.js:
- Inner ring: Primary emotions (8 categories)
- Outer ring: Intensity levels
- Color-coded per Plutchik's wheel
- Interactive hover/click for filtering

#### [NEW] [components/SpiderChart.tsx](../frontend/components/SpiderChart.tsx)radar
- Radar chart for single entry analysis:
- 8-axis spider map
- Real-time updates
- Sentence highlighting on hover

#### [NEW] [components/ActivityHeatmap.tsx](../frontend/components/ActivityHeatmap.tsx)

GitHub-style contribution heatmap:
- Color intensity based on emotional output
- Monthly/yearly views
- Click to view day details

#### [NEW] [components/Navigation.tsx](../frontend/components/Navigation.tsx)

Responsive navigation:
- Desktop: Fixed sidebar (w-64)
- Mobile: Hamburger menu with slide-in drawer
- Profile avatar and settings always visible

#### [NEW] [hooks/useSync.tsx](../frontend/hooks/useSync.tsx)

Custom hook for offline sync:
- Monitor `navigator.onLine`
- Fetch from IndexedDB when online
- POST to `/analyze` endpoint
- Clear local storage on success

#### [NEW] [public/sw.js](../frontend/public/sw.js)

Service Worker for PWA:
- Cache static assets
- Background sync for offline thoughts
- Push notification support for crisis detection

---

### Styling & Design System

#### [NEW] [app/globals.css](../frontend/app/globals.css)

CSS variables for theming:

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

---

### Configuration & DevOps

#### [NEW] [docker-compose.yml](../docker-compose.yml)

Multi-container setup:
- Next.js frontend (port 3000)
- FastAPI backend (port 8000)
- PostgreSQL database (port 5432)
- Redis cache (port 6379)

#### [NEW] [Dockerfile](../Dockerfile)

Multi-stage build for Hugging Face Spaces:
- Stage 1: Node.js build (Next.js static export)
- Stage 2: Python runtime with FastAPI
- Port 7860 for Hugging Face
- Environment variable configuration

#### [NEW] [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)


CI/CD pipeline:
- Run tests on push
- Build Docker images
- Deploy frontend to Vercel
- Deploy backend to Hugging Face Spaces
- Discord webhook notifications

---

## Feature Specifications

### 1. Emotion Analysis

| Feature | Implementation | Visualization |
|---------|---------------|---------------|
| **Single Entry** | Analyze paragraph → 8 emotion scores | Spider/Radar Chart |
| **Long-term Patterns** | 30-day emotion tracking | Radial Heatmap |
| **Temporal Drift** | 7-day trend analysis | Line Chart |
| **Trigger Mapping** | Entity extraction (Work, Family, etc.) | Bar Chart + Word Cloud |

### 2. Agent Modes

| Mode | Behavior | UI Adaptation |
|------|----------|---------------|
| **Counselor** | Validating, CBT-based responses | Soft blues/greens, hide harsh metrics |
| **Analytical** | Raw data, trigger words, percentages | High contrast, data tables |
| **Brutally Honest** | Pattern recognition, direct feedback | Standard theme, all metrics visible |

### 3. Adaptive Care Features

| Emotion Threshold | Triggered Component |
|-------------------|---------------------|
| Anger > 0.7 | Breathing Exercise (4-7-8 technique) |
| Sadness > 0.7 | Mood Lifter Suggestions (exercise, draw, music) |
| Fear > 0.8 | Grounding Techniques |
| Combined Crisis | Discord Webhook Alert + Emergency Resources |

### 4. Media Report Analysis

**Workflow:**
1. User pastes URL
2. Backend scrapes article text (BeautifulSoup)
3. AI analyzes emotional tone
4. Display emotion scores + bias report
5. Store only: `{url, date, emotion_scores}` (no article text)

---

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_data JSONB
);

-- Analyses Table
CREATE TABLE analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    encrypted_text TEXT NOT NULL,
    emotion_scores JSONB NOT NULL,
    source_type VARCHAR(20) CHECK (source_type IN ('text', 'url')),
    source_url VARCHAR(512),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    agent_mode VARCHAR(20),
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_timestamp (timestamp)
);
```

---

## Verification Plan

### Automated Tests

```bash
# Backend Tests
pytest backend/tests/test_analyze.py  # AI endpoint accuracy
pytest backend/tests/test_encryption.py  # Encryption/decryption
pytest backend/tests/test_scraper.py  # URL scraping

# Frontend Tests
npm run test  # Component unit tests
npm run test:e2e  # Playwright end-to-end tests
```

### Manual Verification

1. **PWA Functionality**
   - Install app on mobile device
   - Test offline thought creation
   - Verify background sync when online

2. **Emotion Accuracy**
   - Test with known emotional texts
   - Verify 8-category distribution
   - Check visualization accuracy

3. **Security Audit**
   - Verify encrypted storage in database
   - Test Firebase Auth flow
   - Check HTTPS enforcement

4. **Responsive Design**
   - Test on mobile (375px - 768px)
   - Test on tablet (768px - 1024px)
   - Test on desktop (1024px+)

5. **Agent Modes**
   - Test UI changes per mode
   - Verify system prompt behavior
   - Check adaptive care triggers

---

## Git Commit Strategy (Starting Feb 4, 2026)

```bash
# Feb 4, 2026 - Project initialization
git commit --date="2026-02-04T10:00:00" -m "Initial project setup with Next.js and FastAPI"

# Feb 5, 2026 - Backend core
git commit --date="2026-02-05T14:30:00" -m "Add Hugging Face emotion analysis endpoint"
git commit --date="2026-02-05T16:45:00" -m "Implement AES-256 encryption for user data"

# Feb 6, 2026 - Frontend foundation
git commit --date="2026-02-06T11:00:00" -m "Setup Bento Grid dashboard layout"
git commit --date="2026-02-06T15:20:00" -m "Add Firebase Auth integration"

# Feb 7, 2026 - Visualizations
git commit --date="2026-02-07T10:30:00" -m "Implement D3.js emotion wheel visualization"
git commit --date="2026-02-07T14:00:00" -m "Add activity heatmap and temporal drift charts"

# Feb 8, 2026 - PWA & deployment
git commit --date="2026-02-08T09:00:00" -m "Configure PWA with offline sync"
git commit --date="2026-02-08T16:00:00" -m "Setup Docker and GitHub Actions CI/CD"
```

---

## Deployment Architecture

```mermaid
graph LR
    A[GitHub Repo] -->|Push| B[GitHub Actions]
    B -->|Build Frontend| C[Vercel]
    B -->|Build Backend| D[Hugging Face Spaces]
    D -->|Connect| E[Aiven MariaDB]
    C -->|API Calls| D
    F[Firebase] -->|Auth| C
    F -->|Auth| D
```

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-space.hf.space
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
```

**Backend (.env):**
```env
DATABASE_URL=mysql://user:pass@host:port/db
REDIS_URL=redis://localhost:6379
ENCRYPTION_KEY=<32-byte-key>
FIREBASE_PROJECT_ID=...
HF_MODEL_NAME=bhadresh-savani/distilbert-base-uncased-emotion
```

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15, React, Tailwind CSS | UI framework and styling |
| **Visualization** | D3.js, Recharts | Interactive emotion charts |
| **Backend** | FastAPI (Python) | API server |
| **AI/ML** | Hugging Face Transformers | Emotion classification |
| **Database** | PostgreSQL/MariaDB | Data persistence |
| **Cache/Queue** | Redis | Async task processing |
| **Auth** | Firebase Auth | User authentication |
| **PWA** | next-pwa, Service Workers | Offline functionality |
| **DevOps** | Docker, GitHub Actions | Containerization and CI/CD |
| **Deployment** | Vercel, Hugging Face Spaces | Hosting |
| **Monitoring** | Discord Webhooks | Notifications |

---

## Next Steps

1. **Review this plan** - Confirm architecture and feature scope
2. **Setup development environment** - Install dependencies, configure local database
3. **Begin Phase 1** - Build FastAPI backend with Hugging Face integration
4. **Iterate through phases** - Follow the task.md checklist sequentially
