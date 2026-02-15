# 🚀 AI Learning Hub

> Adaptive Gamified Learning Operating System

An AI-powered personalized learning platform that transforms any learning goal into a structured, gamified experience with curated content.

---

## 🎯 Vision

Build a learning OS that:
- Asks structured onboarding questions
- Generates fully customized learning courses
- Fetches and embeds free learning content (YouTube)
- Turns courses into gamified experiences
- Tracks progress and adapts dynamically

---

## 🏗️ Architecture

```
Frontend (React + TailwindCSS)
    ↕
Backend (Node.js + Express + Prisma)
    ↕
Database (PostgreSQL)
    ↕
External APIs (OpenAI + YouTube Data API)
```

**Full technical plan:** [docs/TECHNICAL_PLAN.md](docs/TECHNICAL_PLAN.md)

---

## ✨ Features

### MVP (v1.0)
- ✅ Smart 7-step onboarding wizard
- ✅ AI-generated personalized course structure
- ✅ YouTube content integration (legal embeds)
- ✅ Gamified progress tracking (XP, levels, streaks)
- ✅ Module completion tracking
- ✅ Dark, minimal, aesthetic UI

### Post-MVP (Roadmap)
- Adaptive replanning based on progress
- AI-generated quizzes with validation
- Social features (leaderboards, study groups)
- Certificate generation
- Mobile app (React Native)
- Spaced repetition system
- AI tutor chatbot per module

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jsonwebtoken + bcrypt) |
| AI | OpenAI API (GPT-4) |
| Video | YouTube Data API v3 |
| Deployment | Docker-ready |

---

## 📦 Project Structure

```
ai-learning-hub/
├── frontend/          # React app
├── backend/           # Express API
├── database/          # Prisma schema + migrations
├── docs/              # Documentation
├── .gitignore
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- YouTube Data API key
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd ai-learning-hub
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys and database URL
npx prisma migrate dev
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

4. **Access the app**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 🗄️ Database Schema

See [docs/TECHNICAL_PLAN.md](docs/TECHNICAL_PLAN.md#database-schema) for full schema.

**Core tables:**
- `users` - User accounts
- `user_profiles` - Onboarding data
- `courses` - Generated learning paths
- `modules` - Course modules
- `resources` - YouTube videos, quizzes
- `progress` - Completion tracking
- `user_stats` - XP, levels, streaks

---

## 🔌 API Endpoints

See [docs/TECHNICAL_PLAN.md](docs/TECHNICAL_PLAN.md#api-endpoints) for full API reference.

**Key endpoints:**
- `POST /api/auth/register` - Create account
- `POST /api/onboarding/submit` - Submit onboarding
- `POST /api/courses/generate` - Generate AI course
- `GET /api/courses/:id/modules` - Get course modules
- `POST /api/modules/:id/complete` - Mark complete

---

## 🎨 Design System

**Color Palette:**
- Background: `#0a0a0a` (matte black)
- Cards: `#1a1a1a`
- Accent: `#6366f1` (indigo)
- Text: `#f5f5f5` / `#a3a3a3`

**Principles:**
- Dark, minimal, aesthetic
- Card-based layouts
- Smooth transitions (200-300ms)
- No clutter

---

## 🧪 Development

```bash
# Run backend
cd backend && npm run dev

# Run frontend
cd frontend && npm run dev

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

---

## 📝 Git Workflow

- `main` - Production-ready code
- `develop` - Active development
- Feature branches: `feat/feature-name`
- Bug fixes: `fix/bug-name`

**Commit convention:**
```
feat: add onboarding wizard
fix: resolve YouTube embed issue
docs: update README
refactor: reorganize API routes
```

---

## 🚢 Deployment

*Coming soon - Docker setup*

---

## 📄 License

MIT

---

## 👤 Author

**KAN** - Creator

---

**Status:** 🏗️ In Active Development

Last updated: 2026-02-15
