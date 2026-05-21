import express from 'express';
import { getAIRecommendations, handleAIChat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recommendations', protect, getAIRecommendations);
router.post('/chat', protect, handleAIChat);

export default router;
