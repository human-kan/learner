import express from 'express';
import { register, login, googleLogin, handleCallback, getMe } from '../controllers/supabaseAuthController.js';
import { authenticateSupabase } from '../middleware/supabaseAuth.js';

const router = express.Router();

// Email/password auth
router.post('/register', register);
router.post('/login', login);

// Google OAuth
router.get('/google', googleLogin);
router.post('/callback', handleCallback);

// Get current user
router.get('/me', authenticateSupabase, getMe);

export default router;
