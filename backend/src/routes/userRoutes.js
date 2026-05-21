import express from 'express';
import { updateProfile, addXp, uploadAvatar, getAllUsers } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/xp', protect, addXp);
router.put('/avatar', protect, uploadAvatar);
router.get('/all', protect, adminOnly, getAllUsers);

export default router;
