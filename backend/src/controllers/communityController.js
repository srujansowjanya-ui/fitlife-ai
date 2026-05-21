import CommunityPost from '../models/CommunityPost.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { dbService } from '../services/dbService.js';

export const getFeed = async (req, res) => {
  try {
    const posts = await dbService.getRawList(CommunityPost);
    // Sort posts by date descending
    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ success: true, posts: sortedPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createPost = async (req, res) => {
  const { content, image } = req.body;
  const user = req.user;

  if (!content) {
    return res.status(400).json({ success: false, message: 'Content is required' });
  }

  try {
    const newPost = await dbService.create(CommunityPost, {
      userId: user._id || user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      image: image || '',
      likes: [],
      comments: []
    });

    // Award minor XP (10 XP) for sharing progress
    const updatedUser = await dbService.findById(User, user._id || user.id);
    const newXp = (updatedUser.xp || 0) + 15;
    await dbService.findByIdAndUpdate(User, user._id || user.id, { $set: { xp: newXp } });

    res.status(201).json({ success: true, post: newPost, xpAwarded: 15 });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id || req.user.id;

  try {
    const post = await dbService.findById(CommunityPost, id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likes = post.likes || [];
    const isLiked = likes.includes(userId);

    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };

    const updatedPost = await dbService.findByIdAndUpdate(CommunityPost, id, update);

    res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!content) {
    return res.status(400).json({ success: false, message: 'Comment content required' });
  }

  try {
    const commentObj = {
      userId: user._id || user.id,
      userName: user.name,
      content,
      createdAt: new Date().toISOString()
    };

    const updatedPost = await dbService.findByIdAndUpdate(CommunityPost, id, {
      $push: { comments: commentObj }
    });

    res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Comment post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Challenges Controllers
export const getChallenges = async (req, res) => {
  try {
    const challenges = await dbService.getRawList(Challenge);
    res.status(200).json({ success: true, challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const joinChallenge = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id || req.user.id;

  try {
    const challenge = await dbService.findById(Challenge, id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const user = await dbService.findById(User, userId);
    const joined = user.joinedChallenges || [];

    if (joined.includes(id)) {
      return res.status(400).json({ success: false, message: 'Already joined this challenge' });
    }

    // Join challenge, reward 20 XP immediately for taking action
    const updatedUser = await dbService.findByIdAndUpdate(User, userId, {
      $push: { joinedChallenges: id },
      $set: { xp: (user.xp || 0) + 20 }
    });

    await dbService.create(Notification, {
      userId,
      title: 'Joined Challenge! 🏆',
      message: `You started "${challenge.title}". Complete goals daily to earn ${challenge.xpReward} XP!`,
      type: 'challenge'
    });

    res.status(200).json({
      success: true,
      message: 'Joined challenge successfully',
      joinedChallenges: updatedUser.joinedChallenges,
      xpAwarded: 20
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Notifications Controllers
export const getNotifications = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    const list = await dbService.getRawList(Notification);
    const userNotifications = list
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, notifications: userNotifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const markNotificationsRead = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    // If mock database, fetch and update all
    if (global.isMockDatabase) {
      const list = await dbService.getRawList(Notification);
      list.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      // Just write to file
      const { mockDb } = await import('../config/mockDb.js');
      // Already mutated in-memory cache, so write out to preserve changes
      // The update helper inside mockDb writes automatically
    } else {
      await Notification.updateMany({ userId }, { $set: { read: true } });
    }

    res.status(200).json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
