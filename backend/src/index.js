import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import supabaseAuthRoutes from './routes/supabaseAuth.js';
import onboardingRoutes from './routes/onboarding.js';
import courseRoutes from './routes/courses.js';
import progressRoutes from './routes/progress.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Learning Hub API'
  });
});

// Routes
app.use('/api/auth', authRoutes); // Legacy JWT auth (kept for backward compatibility)
app.use('/api/supabase-auth', supabaseAuthRoutes); // New Supabase auth with Google OAuth
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);

// API info
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Learning Hub API v1.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      onboarding: '/api/onboarding/*',
      courses: '/api/courses/*',
      modules: '/api/modules/*',
      progress: '/api/progress/*',
      youtube: '/api/youtube/*'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Learning Hub API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
