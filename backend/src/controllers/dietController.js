import DietPlan from '../models/DietPlan.js';
import { dbService } from '../services/dbService.js';

export const getDietPlans = async (req, res) => {
  const { category } = req.query;

  try {
    const query = {};
    if (category) query.category = category;

    const diets = await dbService.find(DietPlan, query);
    res.status(200).json({ success: true, diets });
  } catch (error) {
    console.error('Get diets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createDietPlan = async (req, res) => {
  const { name, category, calories, protein, carbs, fat, description, meals } = req.body;

  if (!name || !category || !calories || !protein || !carbs || !fat || !meals) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const diet = await dbService.create(DietPlan, {
      name,
      category,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      description,
      meals
    });

    res.status(201).json({ success: true, diet });
  } catch (error) {
    console.error('Create diet plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const calculateMacros = async (req, res) => {
  const { age, gender, height, weight, activityLevel } = req.body;

  if (!age || !gender || !height || !weight || !activityLevel) {
    return res.status(400).json({ success: false, message: 'Please provide age, gender, height, weight, activityLevel' });
  }

  try {
    // BMR Calculation via Mifflin-St Jeor
    let bmr = 0;
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);

    if (gender.toLowerCase() === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Activity Multiplier
    let multiplier = 1.2; // Sedentary
    switch (activityLevel) {
      case 'Lightly active':
        multiplier = 1.375;
        break;
      case 'Moderately active':
        multiplier = 1.55;
        break;
      case 'Very active':
        multiplier = 1.725;
        break;
      case 'Extra active':
        multiplier = 1.9;
        break;
    }

    const maintenance = Math.round(bmr * multiplier);
    const weightLoss = maintenance - 500;
    const weightGain = maintenance + 500;

    // Macro distributions for maintenance (protein 30%, carbs 45%, fat 25%)
    // 1g protein = 4 kcal, 1g carb = 4 kcal, 1g fat = 9 kcal
    const macros = {
      maintenance: {
        calories: maintenance,
        protein: Math.round((maintenance * 0.30) / 4),
        carbs: Math.round((maintenance * 0.45) / 4),
        fat: Math.round((maintenance * 0.25) / 9)
      },
      weightLoss: {
        calories: weightLoss,
        protein: Math.round((weightLoss * 0.35) / 4), // Higher protein during deficit
        carbs: Math.round((weightLoss * 0.40) / 4),
        fat: Math.round((weightLoss * 0.25) / 9)
      },
      weightGain: {
        calories: weightGain,
        protein: Math.round((weightGain * 0.25) / 4),
        carbs: Math.round((weightGain * 0.50) / 4),
        fat: Math.round((weightGain * 0.25) / 9)
      }
    };

    res.status(200).json({
      success: true,
      bmr: Math.round(bmr),
      macros
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
