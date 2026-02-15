import express from 'express';
import { completeModule, getProgress, getStats } from '../controllers/progressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/module/:id/complete', authenticateToken, completeModule);
router.get('/', authenticateToken, getProgress);
router.get('/stats', authenticateToken, getStats);

export default router;
