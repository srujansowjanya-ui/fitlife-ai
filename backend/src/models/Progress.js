import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  weight: { type: Number }, // in kg
  waterIntake: { type: Number, default: 0 }, // in ml
  sleepDuration: { type: Number, default: 0 }, // in hours
  caloriesBurned: { type: Number, default: 0 },
  caloriesConsumed: { type: Number, default: 0 },
  workoutsCompleted: [{ type: String }] // Array of Workout IDs or Custom titles completed
}, { timestamps: true });

// Ensure unique entry per user per day
ProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

const Progress = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
export default Progress;
