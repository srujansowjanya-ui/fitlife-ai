import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Home workouts, Gym workouts, Yoga, Cardio, HIIT, Strength training
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: { type: Number, required: true }, // in minutes
  caloriesBurned: { type: Number, required: true },
  targetMuscles: [{ type: String }],
  exercises: [{ type: String }], // Array of Exercise IDs
  image: { type: String, default: '' },
  description: { type: String },
  createdBy: { type: String, default: 'admin' }
}, { timestamps: true });

const Workout = mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);
export default Workout;
