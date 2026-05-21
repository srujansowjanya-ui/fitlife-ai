import User from '../models/User.js';
import { dbService } from '../services/dbService.js';

export const getAIRecommendations = async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    const user = await dbService.findById(User, userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { bmi = 22, fitnessGoal = 'General fitness', age = 25, weight = 70, activityLevel = 'Moderately active' } = user;

    // Define AI generation templates based on Goals
    let workoutPlan = [];
    let dietSuggestions = [];
    let healthSuggestions = [];
    let dailyTargets = { water: 2500, sleep: 8, caloriesToBurn: 300, caloriesToConsume: 2000 };

    // Categorized logic based on Goals
    if (fitnessGoal === 'Weight loss' || fitnessGoal === 'Fat loss') {
      workoutPlan = [
        'Perform 30-40 mins of Cardio/HIIT 4x a week (e.g. HIIT High Intensity Cardio)',
        'Incorporate bodyweight strength circuits (e.g. Pushups, squats, planks) to retain muscle mass',
        'End workouts with 10 mins of core conditioning and stretching'
      ];
      dietSuggestions = [
        'Maintain a moderate caloric deficit (approx. 500 kcal below maintenance)',
        'Focus on high-fiber foods (leafy greens, vegetables) to promote satiety',
        'Consume lean protein (chicken breast, tofu, egg whites, fish) with every meal',
        'Limit refined carbohydrates and sugary beverages'
      ];
      healthSuggestions = [
        'Aim for a consistent daily step count of 10,000 steps',
        'Drink a glass of water 15 minutes before meals to help control portions',
        'Focus on getting high-quality sleep (7-8h) to regulate fat-storage hormones'
      ];
      dailyTargets = {
        water: 3000, // higher to support weight loss
        sleep: 8,
        caloriesToBurn: 450,
        caloriesToConsume: Math.max(1500, Math.round(weight * 22)) // caloric deficit
      };
    } else if (fitnessGoal === 'Muscle gain' || fitnessGoal === 'Strength building') {
      workoutPlan = [
        'Focus on progressive overload: Lift weights 4-5x a week (e.g. Intermediate Strength Session)',
        'Prioritize compound movements: Squats, deadlifts, chest press, and pull-ups',
        'Limit excessive cardio (keep to 1-2 low-impact sessions weekly of 20 mins)'
      ];
      dietSuggestions = [
        'Maintain a clean caloric surplus (approx. 300-500 kcal above maintenance)',
        'Aim for 1.6g to 2.2g of protein per kg of body weight daily',
        'Eat complex carbohydrates (sweet potatoes, oats, brown rice) for sustained lifting energy',
        'Incorporate healthy fats (avocados, nuts, olive oil) for hormone production'
      ];
      healthSuggestions = [
        'Take at least 2 rest days per week to allow muscle fibers to repair and grow',
        'Hydrate during workouts with electrolytes if sweating heavily',
        'Consume a protein-rich meal/shake within 2 hours post-workout'
      ];
      dailyTargets = {
        water: 3500,
        sleep: 8.5, // extra sleep for recovery
        caloriesToBurn: 250,
        caloriesToConsume: Math.round(weight * 38) // caloric surplus
      };
    } else if (fitnessGoal === 'Home workouts') {
      workoutPlan = [
        'Perform Full Body Bodyweight routines 3-4x weekly (e.g. Full Body Home Blast)',
        'Utilize household items (chairs, backpacks) for loaded squats or incline pushups',
        'Incorporate 15-minute yoga flows on active recovery days'
      ];
      dietSuggestions = [
        'Focus on a balanced macro split: 30% Protein, 40% Carbs, 30% Fats',
        'Stay consistent with meal times to avoid snacking due to boredom at home',
        'Cook meals from scratch to fully control oil and sodium levels'
      ];
      healthSuggestions = [
        'Stand up and stretch for 5 minutes for every hour of sitting',
        'Open windows for fresh air ventilation during home workouts',
        'Create a dedicated workout space free from household distractions'
      ];
      dailyTargets = {
        water: 2500,
        sleep: 7.5,
        caloriesToBurn: 300,
        caloriesToConsume: Math.round(weight * 30)
      };
    } else {
      // General fitness / Yoga
      workoutPlan = [
        'Mix 2 cardio sessions, 2 strength sessions, and 1 mobility session weekly',
        'Try new exercises monthly to keep the mind and body stimulated',
        'Start workouts with 5 mins dynamic warm up and end with static stretches'
      ];
      dietSuggestions = [
        'Aim for maintenance calories: focus on nutrient density rather than restriction',
        'Eat a colorful variety of fruits and vegetables daily for micronutrient diversity',
        'Drink adequate water throughout the day to support cognitive and physical performance'
      ];
      healthSuggestions = [
        'Incorporate deep breathing or meditation for 5-10 mins daily to keep stress levels down',
        'Walk outdoors in natural light to optimize circadian rhythms',
        'Listen to your body and scale back intensity if feeling overly fatigued'
      ];
      dailyTargets = {
        water: 2700,
        sleep: 8,
        caloriesToBurn: 350,
        caloriesToConsume: Math.round(weight * 32)
      };
    }

    // Custom BMI specific warning/target adjustment
    let bmiCategory = 'Normal';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      healthSuggestions.unshift('⚠️ Note: Your BMI indicates you are underweight. We recommend prioritizing nutrition, strength training, and consulting a health professional.');
      dailyTargets.caloriesToConsume += 200; // auto-suggest surplus
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight';
      healthSuggestions.unshift('💡 Recommendation: Your BMI is in the overweight range. Focus on sustainable lifestyle adjustments, steady caloric deficit, and cardiovascular health.');
    } else if (bmi >= 30) {
      bmiCategory = 'Obese';
      healthSuggestions.unshift('⚠️ Warning: Your BMI indicates obesity. Focus on low-impact activities (walking, swimming, light bodyweight squats) to protect your joints, and emphasize diet.');
      dailyTargets.caloriesToBurn = Math.max(dailyTargets.caloriesToBurn, 400);
    }

    res.status(200).json({
      success: true,
      bmiCategory,
      recommendations: {
        workoutPlan,
        dietSuggestions,
        healthSuggestions,
        dailyTargets
      }
    });
  } catch (error) {
    console.error('Get AI recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const handleAIChat = async (req, res) => {
  const { message } = req.body;
  const user = req.user;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Please provide a message' });
  }

  const q = message.toLowerCase();
  let reply = '';

  try {
    // Local NLP keyword-matching fitness brain
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      reply = `Hello ${user.name}! I am your FitLife AI assistant. How can I help you optimize your fitness, diet, or mental wellness today?`;
    } else if (q.includes('belly') || q.includes('fat') || q.includes('lose') || q.includes('weight')) {
      reply = `To lose weight or body fat, you must create a **caloric deficit** (consuming fewer calories than your body burns). 
Here are my recommendations:
1. Combine resistance training (to preserve muscle) with HIIT/Cardio (to boost caloric burn).
2. Prioritize high protein (increases satiety and preserves lean tissue) and high fiber (keeps you full).
3. Log your food in the **Diet tracker** and aim for 500 calories below your maintenance.
4. Avoid drinking your calories (soda, juices, alcohol).`;
    } else if (q.includes('muscle') || q.includes('bulk') || q.includes('gain') || q.includes('strength')) {
      reply = `Building muscle and strength requires **progressive overload** and a **caloric surplus** (eating more calories than you burn).
Here is the blueprint:
1. Lift weights 3-5 times per week focusing on major compound exercises (Squats, Bench Press, Rows, Overhead Press).
2. Eat in a 300-500 kcal surplus and consume 1.6-2.2g of protein per kg of body weight. Try our *High-Protein Muscle Builder* meal plan!
3. Prioritize 8+ hours of sleep, as muscles repair and grow while you rest.
4. Limit high-intensity cardio which can deplete the energy needed for muscle synthesis.`;
    } else if (q.includes('water') || q.includes('hydrate') || q.includes('drink')) {
      reply = `Proper hydration is critical for performance, digestion, and metabolism!
- I recommend aiming for **2.5 to 3.5 liters** of water daily depending on your workout intensity.
- Try keeping a water bottle nearby and log your progress in the **Water Tracker** on your dashboard.
- Fun fact: Drinking cold water can slightly boost your metabolism as your body expends energy to warm it up!`;
    } else if (q.includes('sore') || q.includes('hurt') || q.includes('pain') || q.includes('injury')) {
      reply = `If you are experiencing severe pain, please consult a physician. For general muscle soreness (DOMS):
1. Focus on active recovery: light walking, gentle yoga, and mobility exercises.
2. Ensure you are consuming enough water and protein to aid recovery.
3. Try foam rolling, warm baths, and get 8+ hours of sleep.
4. Do not train the exact same muscle group if it is still highly tender. Let it rest!`;
    } else if (q.includes('meditat') || q.includes('stress') || q.includes('anxiety') || q.includes('sleep') || q.includes('mind')) {
      reply = `Mental health is just as important as physical health! To handle stress and improve sleep:
1. Visit our **Mental Wellness** tab and try the **Box Breathing** exercise (4s inhale, 4s hold, 4s exhale, 4s hold).
2. Avoid looking at screens/phones for at least 45 minutes before bedtime to support melatonin release.
3. Try a 5-minute mindfulness breathing meditation in the morning to calm your nervous system.
4. Keep caffeine consumption to the morning hours only.`;
    } else if (q.includes('diet') || q.includes('eat') || q.includes('meal') || q.includes('recipe') || q.includes('food')) {
      reply = `Nutrition represents 70-80% of your body transformation!
- For weight loss, focus on high volume, low calorie foods like green vegetables, berries, egg whites, and grilled chicken.
- For muscle gain, focus on calorie-dense healthy foods like eggs, oats, peanut butter, avocados, salmon, and brown rice.
- You can calculate your target macros using our **Calorie Calculator** inside the Diet page, which provides exact protein/carb/fat splits!`;
    } else {
      reply = `That is a great question! Based on your active goal of **${user.fitnessGoal || 'General fitness'}** and current level (${user.level}), my advice is to keep consistency above all. Focus on logging your daily exercises in the **Workout Tracker**, tracking your hydration, and sleeping well. 

Is there a specific detail about workouts, nutrition, or wellness you would like me to elaborate on?`;
    }

    res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
