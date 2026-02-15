# AI Learning Hub — Technical Plan

## 📋 Product Definition

### Target User Persona
- **Who**: Self-learners, career switchers, students seeking structured yet flexible learning
- **Pain**: Overwhelmed by content, lack of personalization, no accountability
- **Desire**: Adaptive learning path that feels like a game, keeps them motivated

### Core Problem
Traditional learning platforms are:
- One-size-fits-all
- Not adaptive to individual pace
- Lack gamification that truly motivates
- Don't integrate free quality content intelligently

### MVP Scope
**Must Have (v1.0):**
1. Smart onboarding (7-step wizard)
2. AI-generated personalized course structure
3. YouTube content integration (legal, embedded)
4. Gamified progress tracking (XP, levels, streaks)
5. Module completion tracking
6. Dark, minimal, aesthetic UI

**Post-MVP (v1.1+):**
- Adaptive replanning based on progress
- AI-generated quizzes with validation
- Social features (leaderboards, study groups)
- Certificate generation
- Mobile app (React Native)
- Spaced repetition system
- AI tutor chatbot per module

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│              React + TailwindCSS                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Onboard  │  │ Dashboard│  │  Course  │         │
│  │  Wizard  │  │   Home   │  │  Player  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
                       ↕ HTTP/REST
┌─────────────────────────────────────────────────────┐
│                    BACKEND                          │
│              Node.js + Express                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   Auth   │  │ Course   │  │ Progress │         │
│  │  Service │  │ Generator│  │ Tracker  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐                        │
│  │ YouTube  │  │   AI     │                        │
│  │   API    │  │ Service  │                        │
│  └──────────┘  └──────────┘                        │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│                   DATABASE                          │
│                  PostgreSQL                         │
│   users | courses | modules | progress | videos    │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES                     │
│   YouTube Data API  |  AI API (OpenAI/Claude)      │
└─────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### `users`
```sql
id: UUID PRIMARY KEY
email: VARCHAR UNIQUE NOT NULL
password_hash: VARCHAR NOT NULL
name: VARCHAR
created_at: TIMESTAMP
last_login: TIMESTAMP
```

### `user_profiles`
```sql
id: UUID PRIMARY KEY
user_id: UUID REFERENCES users(id)
goal: TEXT
timeframe_weeks: INT
weekly_hours: INT
skill_level: ENUM('beginner', 'intermediate', 'advanced')
learning_style: ENUM('visual', 'text', 'practical', 'mixed')
end_objective: TEXT
prior_knowledge: TEXT
created_at: TIMESTAMP
```

### `courses`
```sql
id: UUID PRIMARY KEY
user_id: UUID REFERENCES users(id)
title: VARCHAR NOT NULL
description: TEXT
total_modules: INT
estimated_weeks: INT
status: ENUM('active', 'completed', 'paused')
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### `modules`
```sql
id: UUID PRIMARY KEY
course_id: UUID REFERENCES courses(id)
order_index: INT NOT NULL
title: VARCHAR NOT NULL
description: TEXT
week_number: INT
estimated_hours: FLOAT
status: ENUM('locked', 'active', 'completed')
xp_reward: INT DEFAULT 100
created_at: TIMESTAMP
```

### `resources`
```sql
id: UUID PRIMARY KEY
module_id: UUID REFERENCES modules(id)
type: ENUM('video', 'article', 'quiz')
title: VARCHAR
youtube_video_id: VARCHAR
duration_seconds: INT
url: TEXT
order_index: INT
created_at: TIMESTAMP
```

### `progress`
```sql
id: UUID PRIMARY KEY
user_id: UUID REFERENCES users(id)
module_id: UUID REFERENCES modules(id)
completed: BOOLEAN DEFAULT FALSE
completed_at: TIMESTAMP
time_spent_minutes: INT DEFAULT 0
xp_earned: INT DEFAULT 0
notes: TEXT
```

### `user_stats`
```sql
id: UUID PRIMARY KEY
user_id: UUID REFERENCES users(id)
total_xp: INT DEFAULT 0
level: INT DEFAULT 1
streak_days: INT DEFAULT 0
last_activity_date: DATE
modules_completed: INT DEFAULT 0
```

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register        - Create account
POST   /api/auth/login           - Login
POST   /api/auth/logout          - Logout
GET    /api/auth/me              - Get current user
```

### Onboarding
```
POST   /api/onboarding/submit    - Submit onboarding form
GET    /api/onboarding/profile   - Get user profile
```

### Courses
```
POST   /api/courses/generate     - Generate course from profile
GET    /api/courses              - Get user's courses
GET    /api/courses/:id          - Get course details
GET    /api/courses/:id/modules  - Get course modules
```

### Modules
```
GET    /api/modules/:id          - Get module details
GET    /api/modules/:id/resources - Get module resources
POST   /api/modules/:id/complete - Mark module complete
```

### Progress
```
GET    /api/progress             - Get user progress summary
POST   /api/progress/update      - Update progress
GET    /api/stats                - Get user stats (XP, level, streak)
```

### YouTube
```
POST   /api/youtube/search       - Search YouTube for learning content
GET    /api/youtube/video/:id    - Get video metadata
```

---

## 🤖 AI Interaction Structure

**Input to AI (Course Generation):**
```json
{
  "goal": "Learn Full Stack Development",
  "timeframe_weeks": 12,
  "weekly_hours": 10,
  "skill_level": "beginner",
  "learning_style": "practical",
  "end_objective": "Build and deploy a full web app",
  "prior_knowledge": "Basic HTML/CSS"
}
```

**Expected AI Output:**
```json
{
  "course_title": "Full Stack Development: Zero to Deployment",
  "description": "...",
  "total_weeks": 12,
  "milestones": [
    {
      "title": "Frontend Fundamentals",
      "weeks": [1, 2, 3],
      "modules": [
        {
          "title": "JavaScript ES6+ Essentials",
          "week": 1,
          "description": "...",
          "estimated_hours": 8,
          "learning_objectives": ["..."],
          "search_query": "JavaScript ES6 tutorial for beginners 2024"
        }
      ]
    }
  ]
}
```

---

## 🎨 UI Design Principles

- **Color Palette:**
  - Background: `#0a0a0a` (matte black)
  - Cards: `#1a1a1a`
  - Accent: `#6366f1` (indigo)
  - Text primary: `#f5f5f5`
  - Text secondary: `#a3a3a3`

- **Typography:**
  - Headings: `font-family: 'Inter', sans-serif`
  - Body: `font-family: 'Inter', sans-serif`
  - Monospace (code): `'Fira Code', monospace`

- **Components:**
  - Smooth transitions (200-300ms)
  - Card-based layouts with subtle borders
  - Minimal shadows
  - Progress bars with gradient fills
  - Micro-interactions on hover/click

---

## 📦 Tech Stack (Finalized)

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS 3
- **Routing**: React Router v6
- **State**: React Context + Hooks (Zustand if needed)
- **HTTP**: Axios
- **Charts**: Recharts (for progress visualization)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Auth**: JWT (jsonwebtoken + bcrypt)
- **Validation**: Zod
- **AI**: OpenAI API (GPT-4 for course generation)
- **YouTube**: YouTube Data API v3

### DevOps
- **Version Control**: Git + GitHub
- **Linting**: ESLint + Prettier
- **Environment**: dotenv
- **Process Manager**: PM2 (production)
- **Deployment**: Docker-ready

---

## 🚀 Development Phases

1. **Phase 1**: Repo setup + architecture docs ✅ (you are here)
2. **Phase 2**: Database schema + Prisma setup
3. **Phase 3**: Backend API skeleton (auth + health check)
4. **Phase 4**: Onboarding wizard (frontend + backend)
5. **Phase 5**: AI course generation engine
6. **Phase 6**: YouTube integration
7. **Phase 7**: Gamified course player
8. **Phase 8**: Progress tracking system
9. **Phase 9**: Polish + testing
10. **Phase 10**: Deployment setup

---

## ✅ MVP Success Criteria

- [ ] User can register and login
- [ ] User completes 7-step onboarding
- [ ] AI generates personalized course (5+ modules)
- [ ] Each module has 1+ YouTube video (legal embed)
- [ ] User can mark modules complete
- [ ] XP, level, and streak are tracked
- [ ] UI is dark, minimal, and responsive
- [ ] All code is in GitHub with proper commits

---

**Architecture approved. Ready to code.**
