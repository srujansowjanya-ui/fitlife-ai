import express from 'express';
import { getDietPlans, calculateMacros, createDietPlan } from '../controllers/dietController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDietPlans);
router.post('/calculate', calculateMacros);
router.post('/', protect, adminOnly, createDietPlan);

export default router;
