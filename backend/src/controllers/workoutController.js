import Workout from '../models/Workout.js';
import Exercise from '../models/Exercise.js';
import { dbService } from '../services/dbService.js';

export const getAllWorkouts = async (req, res) => {
  const { category, difficulty } = req.query;

  try {
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const workouts = await dbService.find(Workout, query);
    res.status(200).json({ success: true, workouts });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWorkoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const workout = await dbService.findById(Workout, id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Populate exercises manually if in mock database
    const exercisesList = [];
    for (let exId of (workout.exercises || [])) {
      const ex = await dbService.findById(Exercise, exId);
      if (ex) exercisesList.push(ex);
    }

    res.status(200).json({
      success: true,
      workout: {
        ...workout,
        exercises: exercisesList
      }
    });
  } catch (error) {
    console.error('Get workout by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCustomWorkout = async (req, res) => {
  const { title, category, difficulty, duration, caloriesBurned, exercises, description } = req.body;
  const userId = req.user._id || req.user.id;

  if (!title || !category || !duration || !caloriesBurned || !exercises) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const newWorkout = await dbService.create(Workout, {
      title,
      category,
      difficulty: difficulty || 'Beginner',
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      exercises, // Array of exercise IDs
      description: description || 'Custom user workout',
      createdBy: userId
    });

    res.status(201).json({ success: true, workout: newWorkout });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getExercises = async (req, res) => {
  const { category, difficulty, search } = req.query;

  try {
    const allExercises = await dbService.getRawList(Exercise);
    let filtered = [...allExercises];

    if (category) {
      filtered = filtered.filter(ex => ex.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (difficulty) {
      filtered = filtered.filter(ex => ex.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(q) || 
        (ex.targetMuscles || []).some(m => m.toLowerCase().includes(q))
      );
    }

    res.status(200).json({ success: true, exercises: filtered });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addExercise = async (req, res) => {
  const { name, category, difficulty, targetMuscles, duration, sets, reps, caloriesBurned, instructions, image } = req.body;

  if (!name || !category || !instructions) {
    return res.status(400).json({ success: false, message: 'Name, category and instructions are required' });
  }

  try {
    const ex = await dbService.create(Exercise, {
      name,
      category,
      difficulty: difficulty || 'Beginner',
      targetMuscles: targetMuscles || [],
      duration: duration || '30s',
      sets: sets ? Number(sets) : 3,
      reps: reps ? Number(reps) : 10,
      caloriesBurned: caloriesBurned ? Number(caloriesBurned) : 15,
      instructions,
      image: image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80'
    });

    res.status(201).json({ success: true, exercise: ex });
  } catch (error) {
    console.error('Add exercise error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
