import mongoose from 'mongoose';

const DietPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g. Vegetarian, Vegan, High-protein, Weight-loss, Muscle-gain
  calories: { type: Number, required: true },
  protein: { type: Number, required: true }, // grams
  carbs: { type: Number, required: true }, // grams
  fat: { type: Number, required: true }, // grams
  description: { type: String },
  meals: {
    breakfast: { type: String, required: true },
    lunch: { type: String, required: true },
    dinner: { type: String, required: true },
    snacks: { type: String }
  }
}, { timestamps: true });

const DietPlan = mongoose.models.DietPlan || mongoose.model('DietPlan', DietPlanSchema);
export default DietPlan;
