import express from 'express';
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authenticateToken, createCourse);
router.get('/', authenticateToken, getCourses);
router.get('/:id', authenticateToken, getCourseById);

export default router;
