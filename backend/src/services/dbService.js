import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Exercise from '../models/Exercise.js';
import DietPlan from '../models/DietPlan.js';
import Progress from '../models/Progress.js';
import CommunityPost from '../models/CommunityPost.js';
import Challenge from '../models/Challenge.js';
import Notification from '../models/Notification.js';
import { mockDb } from '../config/mockDb.js';

// Map models to their collection names in mockDb
const modelMap = new Map([
  [User, 'users'],
  [Workout, 'workouts'],
  [Exercise, 'exercises'],
  [DietPlan, 'diets'],
  [Progress, 'progress'],
  [CommunityPost, 'posts'],
  [Challenge, 'challenges'],
  [Notification, 'notifications']
]);

const getCollectionName = (model) => {
  return modelMap.get(model) || '';
};

export const dbService = {
  find: async (model, query = {}) => {
    if (global.isMockDatabase) {
      return mockDb.find(getCollectionName(model), query);
    }
    return model.find(query).exec();
  },

  findOne: async (model, query = {}) => {
    if (global.isMockDatabase) {
      return mockDb.findOne(getCollectionName(model), query);
    }
    return model.findOne(query).exec();
  },

  findById: async (model, id) => {
    if (global.isMockDatabase) {
      return mockDb.findById(getCollectionName(model), id);
    }
    return model.findById(id).exec();
  },

  create: async (model, doc) => {
    if (global.isMockDatabase) {
      return mockDb.create(getCollectionName(model), doc);
    }
    const newDoc = new model(doc);
    return newDoc.save();
  },

  findByIdAndUpdate: async (model, id, update) => {
    if (global.isMockDatabase) {
      return mockDb.findByIdAndUpdate(getCollectionName(model), id, update);
    }
    // Mongoose standard options: { new: true } to return the modified document
    return model.findByIdAndUpdate(id, update, { new: true }).exec();
  },

  deleteOne: async (model, id) => {
    if (global.isMockDatabase) {
      return mockDb.deleteOne(getCollectionName(model), id);
    }
    const res = await model.deleteOne({ _id: id }).exec();
    return res.deletedCount > 0;
  },

  // Custom function to get raw data for sorting / pagination / limits
  getRawList: async (model) => {
    if (global.isMockDatabase) {
      return mockDb.getCollection(getCollectionName(model));
    }
    return model.find({}).exec();
  }
};
