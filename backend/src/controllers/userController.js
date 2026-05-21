import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { dbService } from '../services/dbService.js';

export const updateProfile = async (req, res) => {
  const { age, height, weight, gender, fitnessGoal, activityLevel } = req.body;
  const userId = req.user._id || req.user.id;

  try {
    const updateData = {};
    if (age) updateData.age = Number(age);
    if (height) updateData.height = Number(height);
    if (weight) updateData.weight = Number(weight);
    if (gender) updateData.gender = gender;
    if (fitnessGoal) updateData.fitnessGoal = fitnessGoal;
    if (activityLevel) updateData.activityLevel = activityLevel;

    // Calculate BMI
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiVal = weight / (heightInMeters * heightInMeters);
      updateData.bmi = Math.round(bmiVal * 10) / 10; // Round to 1 decimal place
    }

    const updatedUser = await dbService.findByIdAndUpdate(User, userId, { $set: updateData });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        level: updatedUser.level,
        xp: updatedUser.xp,
        badges: updatedUser.badges,
        age: updatedUser.age,
        height: updatedUser.height,
        weight: updatedUser.weight,
        gender: updatedUser.gender,
        fitnessGoal: updatedUser.fitnessGoal,
        activityLevel: updatedUser.activityLevel,
        bmi: updatedUser.bmi
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addXp = async (req, res) => {
  const { amount, reason } = req.body;
  const userId = req.user._id || req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid XP amount' });
  }

  try {
    const user = await dbService.findById(User, userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;

    const newXp = currentXp + Number(amount);
    
    // Level formula: level threshold = level * 300 XP
    // e.g. Lvl 1->2 needs 300 XP. Lvl 2->3 needs 600 XP (900 total), etc.
    // Let's make it simpler: every 500 XP is a level.
    const newLevel = Math.floor(newXp / 500) + 1;
    const leveledUp = newLevel > currentLevel;

    const updateFields = { xp: newXp, level: newLevel };
    
    // Auto badges check
    const badges = [...(user.badges || [])];
    if (newXp >= 1000 && !badges.includes('Fitness Enthusiast')) {
      badges.push('Fitness Enthusiast');
      updateFields.badges = badges;
    }
    if (newLevel >= 5 && !badges.includes('Elite Warrior')) {
      badges.push('Elite Warrior');
      updateFields.badges = badges;
    }

    const updatedUser = await dbService.findByIdAndUpdate(User, userId, { $set: updateFields });

    if (leveledUp) {
      await dbService.create(Notification, {
        userId,
        title: '🎉 Level Up!',
        message: `Congratulations! You reached Level ${newLevel}! Keep going to unlock new rewards.`,
        type: 'success'
      });
    }

    res.status(200).json({
      success: true,
      leveledUp,
      reason,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        level: updatedUser.level,
        xp: updatedUser.xp,
        badges: updatedUser.badges
      }
    });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const uploadAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id || req.user.id;

  if (!avatar) {
    return res.status(400).json({ success: false, message: 'Avatar link required' });
  }

  try {
    const updatedUser = await dbService.findByIdAndUpdate(User, userId, { $set: { avatar } });
    res.status(200).json({ success: true, avatar: updatedUser.avatar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await dbService.getRawList(User);
    // Remove passwords before returning
    const safeUsers = users.map(user => {
      const u = { ...user };
      delete u.password;
      return u;
    });
    res.status(200).json({ success: true, users: safeUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
