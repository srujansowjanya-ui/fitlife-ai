import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { dbService } from '../services/dbService.js';

// Helper to award XP
const awardXpHelper = async (userId, amount, reason) => {
  try {
    const user = await dbService.findById(User, userId);
    if (!user) return null;

    const newXp = (user.xp || 0) + amount;
    const newLevel = Math.floor(newXp / 500) + 1;
    const leveledUp = newLevel > (user.level || 1);

    const updateFields = { xp: newXp, level: newLevel };
    
    // Check for badges
    const badges = [...(user.badges || [])];
    if (amount >= 50 && !badges.includes('Action Taker')) {
      badges.push('Action Taker');
      updateFields.badges = badges;
    }

    await dbService.findByIdAndUpdate(User, userId, { $set: updateFields });

    if (leveledUp) {
      await dbService.create(Notification, {
        userId,
        title: '🎉 Level Up!',
        message: `Awesome! You leveled up to ${newLevel} after completing a goal: "${reason}"`,
        type: 'success'
      });
    }

    return { leveledUp, newLevel, newXp };
  } catch (error) {
    console.error('Error awarding helper XP:', error);
  }
};

export const getDailyProgress = async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD
  const userId = req.user._id || req.user.id;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required' });
  }

  try {
    let progress = await dbService.findOne(Progress, { userId, date });

    if (!progress) {
      // Return a blank template
      progress = {
        userId,
        date,
        weight: req.user.weight || 70,
        waterIntake: 0,
        sleepDuration: 0,
        caloriesBurned: 0,
        caloriesConsumed: 0,
        workoutsCompleted: []
      };
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error('Get daily progress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logProgress = async (req, res) => {
  const { date, weight, waterIntake, sleepDuration, caloriesConsumed, workoutTitle, caloriesBurned } = req.body;
  const userId = req.user._id || req.user.id;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required' });
  }

  try {
    let progress = await dbService.findOne(Progress, { userId, date });
    
    let isNew = false;
    let originalCompletedWorkouts = [];
    let originalWater = 0;
    
    if (!progress) {
      isNew = true;
      progress = {
        userId,
        date,
        weight: weight || req.user.weight || 70,
        waterIntake: 0,
        sleepDuration: 0,
        caloriesBurned: 0,
        caloriesConsumed: 0,
        workoutsCompleted: []
      };
    } else {
      originalCompletedWorkouts = [...(progress.workoutsCompleted || [])];
      originalWater = progress.waterIntake || 0;
    }

    // Set updates
    const updates = {};
    if (weight !== undefined) {
      updates.weight = Number(weight);
      // Also update weight in User profile for calculations
      await dbService.findByIdAndUpdate(User, userId, { $set: { weight: Number(weight) } });
    }
    if (waterIntake !== undefined) updates.waterIntake = Number(waterIntake);
    if (sleepDuration !== undefined) updates.sleepDuration = Number(sleepDuration);
    if (caloriesConsumed !== undefined) updates.caloriesConsumed = Number(caloriesConsumed);
    if (caloriesBurned !== undefined) {
      updates.caloriesBurned = (progress.caloriesBurned || 0) + Number(caloriesBurned);
    }

    // Workouts completed logging
    if (workoutTitle) {
      updates.workoutsCompleted = [...originalCompletedWorkouts, workoutTitle];
    }

    let xpAwarded = 0;
    let xpReason = '';

    // Check gamification milestones
    // 1. Water Goal: Drink >= 2000 ml (2L)
    if (waterIntake >= 2000 && originalWater < 2000) {
      xpAwarded += 30;
      xpReason += 'Hydration milestone (2L reached); ';
      // Add badge if not exists
      const user = await dbService.findById(User, userId);
      if (user && !user.badges.includes('Hydrate Hero')) {
        await dbService.findByIdAndUpdate(User, userId, { $push: { badges: 'Hydrate Hero' } });
      }
    }

    // 2. Workout logged
    if (workoutTitle) {
      xpAwarded += 80; // 80 XP for completing a workout!
      xpReason += `Completed workout: ${workoutTitle}; `;
      
      const user = await dbService.findById(User, userId);
      if (user && !user.badges.includes('Workout Warrior')) {
        await dbService.findByIdAndUpdate(User, userId, { $push: { badges: 'Workout Warrior' } });
      }
    }

    // Write progress updates
    let finalProgress;
    if (isNew) {
      // Create record
      const fullDoc = { ...progress, ...updates };
      finalProgress = await dbService.create(Progress, fullDoc);
    } else {
      // Update record
      finalProgress = await dbService.findByIdAndUpdate(Progress, progress._id, { $set: updates });
    }

    let xpResult = null;
    if (xpAwarded > 0) {
      xpResult = await awardXpHelper(userId, xpAwarded, xpReason);
    }

    res.status(200).json({
      success: true,
      progress: finalProgress,
      xpAwarded,
      xpResult
    });
  } catch (error) {
    console.error('Log progress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProgressHistory = async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { days = 7 } = req.query;

  try {
    const rawList = await dbService.getRawList(Progress);
    
    // Filter by user and sort by date descending, take top 'days'
    let filtered = rawList
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, Number(days))
      .reverse(); // return chronological order

    res.status(200).json({ success: true, history: filtered });
  } catch (error) {
    console.error('Get progress history error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
