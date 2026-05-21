import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { dbService } from '../services/dbService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fitlife_secret_key';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  try {
    const userExists = await dbService.findOne(User, { email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await dbService.create(User, {
      name,
      email,
      password: hashedPassword,
      xp: 0,
      level: 1,
      badges: ['First Step'],
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      joinedChallenges: []
    });

    // Create a welcome notification
    await dbService.create(Notification, {
      userId: user._id,
      title: 'Welcome to FitLife AI!',
      message: 'Hi there! We are excited to support you on your wellness journey. Build routines and win badges!',
      type: 'info'
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        level: user.level,
        xp: user.xp,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  try {
    const user = await dbService.findOne(User, { email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        fitnessGoal: user.fitnessGoal,
        activityLevel: user.activityLevel,
        bmi: user.bmi
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const googleAuth = async (req, res) => {
  const { name, email, avatar, googleId } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Invalid Google payload' });
  }

  try {
    let user = await dbService.findOne(User, { email });

    if (!user) {
      // Create user with a dummy hashed password since they use Google auth
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(googleId || Math.random().toString(36), salt);

      user = await dbService.create(User, {
        name,
        email,
        password: hashedPassword,
        avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        xp: 0,
        level: 1,
        badges: ['Google Connect'],
        joinedChallenges: []
      });

      await dbService.create(Notification, {
        userId: user._id,
        title: 'Google Account Connected',
        message: 'Successfully linked your Google profile to FitLife AI.',
        type: 'info'
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        level: user.level,
        xp: user.xp,
        badges: user.badges,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        fitnessGoal: user.fitnessGoal,
        activityLevel: user.activityLevel,
        bmi: user.bmi
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await dbService.findById(User, req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
