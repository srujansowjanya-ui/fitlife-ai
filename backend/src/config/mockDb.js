import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache
const collections = {
  users: [],
  workouts: [],
  exercises: [],
  diets: [],
  progress: [],
  posts: [],
  challenges: [],
  notifications: []
};

// Helper to load collections from files or write defaults
const loadCollection = (name, defaults = []) => {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (fs.existsSync(filePath)) {
    try {
      collections[name] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error(`Error reading mock db file for ${name}:`, e);
      collections[name] = defaults;
    }
  } else {
    collections[name] = defaults;
    saveCollection(name);
  }
};

const saveCollection = (name) => {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(collections[name], null, 2), 'utf8');
  } catch (e) {
    console.error(`Error saving mock db file for ${name}:`, e);
  }
};

// Seed initial data
const seedInitialData = () => {
  // Exercises Seed
  loadCollection('exercises', [
    {
      _id: 'ex1',
      name: 'Push-Ups',
      category: 'Strength training',
      difficulty: 'Beginner',
      targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
      duration: '30s',
      sets: 3,
      reps: 12,
      caloriesBurned: 15,
      instructions: 'Start in a plank position. Lower your body until your chest nearly touches the floor. Push yourself back up.',
      image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=300&q=80'
    },
    {
      _id: 'ex2',
      name: 'Bodyweight Squats',
      category: 'Home workouts',
      difficulty: 'Beginner',
      targetMuscles: ['Quads', 'Hamstrings', 'Glutes'],
      duration: '45s',
      sets: 3,
      reps: 15,
      caloriesBurned: 20,
      instructions: 'Stand with feet shoulder-width apart. Lower your hips back and down as if sitting in a chair. Keep chest up and knees behind toes.',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=300&q=80'
    },
    {
      _id: 'ex3',
      name: 'Plank Hold',
      category: 'Core',
      difficulty: 'Intermediate',
      targetMuscles: ['Abs', 'Lower Back', 'Shoulders'],
      duration: '60s',
      sets: 3,
      reps: 1,
      caloriesBurned: 10,
      instructions: 'Keep body in a straight line from head to heels, resting on forearms and toes. Keep core engaged and do not let hips sag.',
      image: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&w=300&q=80'
    },
    {
      _id: 'ex4',
      name: 'Jumping Jacks',
      category: 'Cardio',
      difficulty: 'Beginner',
      targetMuscles: ['Full Body', 'Heart'],
      duration: '45s',
      sets: 3,
      reps: 30,
      caloriesBurned: 25,
      instructions: 'Jump feet out to the sides while raising arms overhead. Jump back to starting position and repeat at a fast pace.',
      image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=300&q=80'
    },
    {
      _id: 'ex5',
      name: 'Dumbbell Bicep Curls',
      category: 'Strength training',
      difficulty: 'Intermediate',
      targetMuscles: ['Biceps', 'Forearms'],
      duration: '40s',
      sets: 4,
      reps: 12,
      caloriesBurned: 18,
      instructions: 'Hold dumbbells at sides with palms facing forward. Keep elbows close to torso and curl weights while contracting biceps.',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80'
    },
    {
      _id: 'ex6',
      name: 'Downward-Facing Dog',
      category: 'Yoga',
      difficulty: 'Beginner',
      targetMuscles: ['Hamstrings', 'Calves', 'Shoulders'],
      duration: '60s',
      sets: 2,
      reps: 1,
      caloriesBurned: 8,
      instructions: 'From hands and knees, lift hips up and back to form an inverted V shape. Press heels toward the mat.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80'
    },
    {
      _id: 'ex7',
      name: 'Burpees',
      category: 'HIIT',
      difficulty: 'Advanced',
      targetMuscles: ['Full Body', 'Cardio'],
      duration: '45s',
      sets: 4,
      reps: 10,
      caloriesBurned: 35,
      instructions: 'Drop into a squat, kick feet back to plank, do a pushup, jump feet forward, and explosively jump straight up.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80'
    }
  ]);

  // Workouts Seed
  loadCollection('workouts', [
    {
      _id: 'w1',
      title: 'Full Body Home Blast',
      category: 'Home workouts',
      difficulty: 'Beginner',
      duration: 15,
      caloriesBurned: 150,
      targetMuscles: ['Full Body', 'Abs', 'Glutes'],
      exercises: ['ex2', 'ex1', 'ex3', 'ex4'],
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      description: 'A quick bodyweight workout designed to burn fat and build strength at home without any equipment.'
    },
    {
      _id: 'w2',
      title: 'Intermediate Strength Session',
      category: 'Strength training',
      difficulty: 'Intermediate',
      duration: 25,
      caloriesBurned: 220,
      targetMuscles: ['Chest', 'Biceps', 'Shoulders'],
      exercises: ['ex1', 'ex5', 'ex3'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      description: 'A classic weight-training session targeting upper body strength, conditioning, and muscle growth.'
    },
    {
      _id: 'w3',
      title: 'HIIT High Intensity Cardio',
      category: 'HIIT',
      difficulty: 'Advanced',
      duration: 20,
      caloriesBurned: 300,
      targetMuscles: ['Heart', 'Full Body'],
      exercises: ['ex4', 'ex7', 'ex2', 'ex7'],
      image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=600&q=80',
      description: 'Tabata-style intervals of burpees, jumping jacks, and squats to maximize calorie burn and metabolic rate.'
    },
    {
      _id: 'w4',
      title: 'Morning Yoga Flow',
      category: 'Yoga',
      difficulty: 'Beginner',
      duration: 15,
      caloriesBurned: 60,
      targetMuscles: ['Hamstrings', 'Back', 'Mind'],
      exercises: ['ex6', 'ex3'],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      description: 'Start your morning with a series of gentle stretching, mindfulness, and breathing exercises.'
    }
  ]);

  // Diets Seed
  loadCollection('diets', [
    {
      _id: 'd1',
      name: 'High-Protein Muscle Builder',
      category: 'High-protein',
      calories: 2200,
      protein: 160,
      carbs: 210,
      fat: 75,
      description: 'Optimal nutritional split for muscle building, muscle recovery, and energy during intense lifting.',
      meals: {
        breakfast: 'Egg white omelet with spinach, turkey breast, and whole wheat toast.',
        lunch: 'Grilled chicken breast with brown rice, broccoli, and light olive oil.',
        dinner: 'Baked salmon fillet with sweet potato mash and roasted asparagus.',
        snacks: 'Whey protein shake, a handful of almonds, and Greek yogurt.'
      }
    },
    {
      _id: 'd2',
      name: 'Balanced Weight-Loss Plan',
      category: 'Weight-loss',
      calories: 1600,
      protein: 110,
      carbs: 150,
      fat: 50,
      description: 'Caloric deficit diet rich in fiber and lean protein to sustain fullness while shedding fat.',
      meals: {
        breakfast: 'Oatmeal cooked with almond milk, topped with chia seeds and blueberries.',
        lunch: 'Mixed green salad with grilled shrimp, avocado, cucumber, and vinaigrette.',
        dinner: 'Stir-fried tofu with green beans, bell peppers, and quinoa.',
        snacks: 'Apple slices with peanut butter, and cucumber sticks.'
      }
    },
    {
      _id: 'd3',
      name: 'Plant-Powered Vegan Plan',
      category: 'Vegan',
      calories: 1800,
      protein: 95,
      carbs: 220,
      fat: 60,
      description: 'Full plant-based nutritional plan prioritizing complex carbs, healthy fats, and vegan protein sources.',
      meals: {
        breakfast: 'Tofu scramble with turmeric, peppers, onions, and avocado toast.',
        lunch: 'Lentil and vegetable soup served with warm whole-grain pita bread.',
        dinner: 'Chickpea curry with coconut milk, spinach, and basmati brown rice.',
        snacks: 'Hummus with carrot sticks, and mixed berry smoothie with hemp protein.'
      }
    }
  ]);

  // Challenges Seed
  loadCollection('challenges', [
    {
      _id: 'c1',
      title: '7-Day Water Hydration Challenge',
      description: 'Drink at least 2.5L of water every day for 7 days to flush out toxins and increase energy.',
      xpReward: 150,
      durationDays: 7,
      category: 'Water'
    },
    {
      _id: 'c2',
      title: 'Cardio Crusher Sprint',
      description: 'Complete 3 Cardio or HIIT workouts in 5 days to jumpstart your metabolic burn.',
      xpReward: 250,
      durationDays: 5,
      category: 'Workout'
    },
    {
      _id: 'c3',
      title: 'Deep Sleep Streak',
      description: 'Log 7+ hours of sleep for 5 consecutive nights to optimize muscle recovery and hormone levels.',
      xpReward: 200,
      durationDays: 5,
      category: 'Sleep'
    }
  ]);

  // Load other empty structures
  loadCollection('users', []);
  loadCollection('progress', []);
  loadCollection('posts', [
    {
      _id: 'p1',
      userId: 'mock_user_1',
      userName: 'Alex Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      content: 'Just smashed my 5k run personal record! Feeling incredible. Consistency is key! 🏃‍♂️💪',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
      likes: ['mock_user_2'],
      comments: [
        {
          _id: 'comment1',
          userId: 'mock_user_2',
          userName: 'Sarah Miller',
          content: 'Amazing job Alex! Keep pushing!',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: 'p2',
      userId: 'mock_user_2',
      userName: 'Sarah Miller',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      content: 'Tried the Morning Yoga Flow today. Perfect way to start a stressful workday. Highly recommend it! 🧘‍♀️✨',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      likes: [],
      comments: [],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
  loadCollection('notifications', []);
};

seedInitialData();

export const mockDb = {
  // Query operations
  find: (collName, query = {}) => {
    let list = collections[collName];
    // Simple query filter
    return list.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },

  findOne: (collName, query = {}) => {
    let list = collections[collName];
    return list.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },

  findById: (collName, id) => {
    return collections[collName].find(item => item._id === id);
  },

  create: (collName, doc) => {
    const newDoc = {
      _id: doc._id || Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      ...doc
    };
    collections[collName].push(newDoc);
    saveCollection(collName);
    return newDoc;
  },

  findByIdAndUpdate: (collName, id, update) => {
    const idx = collections[collName].findIndex(item => item._id === id);
    if (idx !== -1) {
      // Clean up update operator if any (like $push, $pull, $set)
      let current = collections[collName][idx];
      let updated = { ...current };

      if (update.$push) {
        for (let key in update.$push) {
          updated[key] = Array.isArray(updated[key]) ? updated[key] : [];
          updated[key].push(update.$push[key]);
        }
      }
      if (update.$pull) {
        for (let key in update.$pull) {
          if (Array.isArray(updated[key])) {
            updated[key] = updated[key].filter(v => v !== update.$pull[key]);
          }
        }
      }
      // Standard properties override
      const cleanUpdate = { ...update };
      delete cleanUpdate.$push;
      delete cleanUpdate.$pull;
      delete cleanUpdate.$set;
      
      updated = { ...updated, ...cleanUpdate, ...(update.$set || {}) };
      collections[collName][idx] = updated;
      saveCollection(collName);
      return updated;
    }
    return null;
  },

  deleteOne: (collName, id) => {
    const idx = collections[collName].findIndex(item => item._id === id);
    if (idx !== -1) {
      collections[collName].splice(idx, 1);
      saveCollection(collName);
      return true;
    }
    return false;
  },

  getCollection: (collName) => collections[collName]
};
