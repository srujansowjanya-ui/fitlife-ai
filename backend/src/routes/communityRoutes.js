import express from 'express';
import { 
  getFeed, 
  createPost, 
  likePost, 
  commentPost, 
  getChallenges, 
  joinChallenge, 
  getNotifications, 
  markNotificationsRead 
} from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/feed', getFeed);
router.post('/post', protect, createPost);
router.post('/like/:id', protect, likePost);
router.post('/comment/:id', protect, commentPost);

router.get('/challenges', getChallenges);
router.post('/challenges/join/:id', protect, joinChallenge);

router.get('/notifications', protect, getNotifications);
router.post('/notifications/read', protect, markNotificationsRead);

export default router;
