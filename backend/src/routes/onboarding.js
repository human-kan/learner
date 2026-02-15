import express from 'express';
import { submitOnboarding, getProfile } from '../controllers/onboardingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', authenticateToken, submitOnboarding);
router.get('/profile', authenticateToken, getProfile);

export default router;
