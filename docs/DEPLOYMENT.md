# 🚀 Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- OpenAI API key
- YouTube Data API key

---

## Local Development

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd ai-learning-hub
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb ai_learning_hub

# Or using psql
psql -U postgres
CREATE DATABASE ai_learning_hub;
```

### 3. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL
# - JWT_SECRET
# - OPENAI_API_KEY
# - YOUTUBE_API_KEY

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start backend
npm run dev
```

Backend will run on `http://localhost:3000`

### 4. Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env

# Edit .env (usually no changes needed for local dev)

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Testing the Full Flow

1. **Register** at `http://localhost:5173/register`
2. **Onboarding**: Fill out 7-step wizard
3. **AI Course Generation**: Wait for AI to generate your course (~10-30 seconds)
4. **Dashboard**: View your course and stats
5. **Course Player**: Click on course → watch video → complete module → earn XP

---

## Production Deployment (Docker)

### Dockerfile (Backend)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npx prisma generate --schema=../database/schema.prisma
EXPOSE 3000
CMD ["npm", "start"]
```

### Dockerfile (Frontend)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ai_learning_hub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/ai_learning_hub
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      YOUTUBE_API_KEY: ${YOUTUBE_API_KEY}
      NODE_ENV: production
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://backend:3000/api
    ports:
      - "80:80"

volumes:
  postgres_data:
```

### Deploy

```bash
docker-compose up -d
```

---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/ai_learning_hub"
JWT_SECRET="your-super-secret-key-min-32-chars"
OPENAI_API_KEY="sk-..."
YOUTUBE_API_KEY="..."
PORT=3000
NODE_ENV=production
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## Database Migrations

```bash
# Create new migration
npm run prisma:migrate

# Reset database (development only)
npx prisma migrate reset --schema=../database/schema.prisma

# View database in Prisma Studio
npx prisma studio --schema=../database/schema.prisma
```

---

## API Keys Setup

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Add to `.env` as `OPENAI_API_KEY`

### YouTube Data API Key
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable "YouTube Data API v3"
4. Create credentials → API key
5. Add to `.env` as `YOUTUBE_API_KEY`

---

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Run `npm run prisma:generate`

### Frontend shows connection error
- Verify backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Check CORS is enabled in backend

### AI course generation fails
- Verify `OPENAI_API_KEY` is valid
- Check API quota/billing
- Check backend logs for detailed error

### YouTube videos not loading
- Verify `YOUTUBE_API_KEY` is valid
- Check API quota (10,000 units/day free)
- Ensure video IDs are valid

---

## Production Checklist

- [ ] Change `JWT_SECRET` to strong random string (min 32 chars)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Enable CORS only for your domain
- [ ] Add helmet.js for security headers
- [ ] Set up CI/CD pipeline
- [ ] Configure environment-specific configs

---

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs
```bash
# Backend
cd backend && npm run dev

# View Prisma queries
# Set log level in prisma.js

# Frontend
cd frontend && npm run dev
```

---

## Scaling

**Backend:**
- Use PM2 for process management
- Load balance with nginx
- Use Redis for session storage
- Implement caching layer

**Database:**
- Add read replicas
- Implement connection pooling
- Use pgBouncer

**Frontend:**
- Use CDN for static assets
- Implement service worker for offline support
- Lazy load routes

---

**Ready to deploy!** 🚀
