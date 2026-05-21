import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // user, admin
  age: { type: Number },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  gender: { type: String, enum: ['male', 'female', 'other'] },
  fitnessGoal: { type: String, enum: ['Weight loss', 'Muscle gain', 'Fat loss', 'General fitness', 'Strength building', 'Home workouts'] },
  activityLevel: { type: String, enum: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Extra active'] },
  bmi: { type: Number },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: String }], // Array of badges (e.g. 'Hydration Hero', 'First Workout')
  avatar: { type: String, default: '' },
  joinedChallenges: [{ type: String }], // Array of Challenge IDs
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
