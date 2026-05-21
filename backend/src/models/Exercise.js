import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  targetMuscles: [{ type: String }],
  duration: { type: String, default: '30s' },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 10 },
  caloriesBurned: { type: Number, default: 15 },
  instructions: { type: String, required: true },
  image: { type: String, default: '' } // Link to visual GIF or image
}, { timestamps: true });

const Exercise = mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
export default Exercise;
