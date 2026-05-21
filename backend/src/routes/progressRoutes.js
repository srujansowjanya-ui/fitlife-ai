import express from 'express';
import { getDailyProgress, logProgress, getProgressHistory } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDailyProgress);
router.post('/', protect, logProgress);
router.get('/history', protect, getProgressHistory);

export default router;
