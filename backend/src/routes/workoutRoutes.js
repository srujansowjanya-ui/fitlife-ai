import express from 'express';
import { getAllWorkouts, getWorkoutById, createCustomWorkout, getExercises, addExercise } from '../controllers/workoutController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllWorkouts);
router.get('/exercises', getExercises);
router.get('/:id', getWorkoutById);
router.post('/custom', protect, createCustomWorkout);
router.post('/exercise', protect, adminOnly, addExercise);

export default router;
