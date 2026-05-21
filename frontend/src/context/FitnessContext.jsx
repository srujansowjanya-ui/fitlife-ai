import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const FitnessContext = createContext();

export const FitnessProvider = ({ children }) => {
  const { token, user, addXp } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [diets, setDiets] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dailyProgress, setDailyProgress] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper date utility (YYYY-MM-DD)
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Fetch initial collections
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const [workoutsRes, exercisesRes, dietsRes, challengesRes] = await Promise.all([
          fetch('/api/workouts'),
          fetch('/api/workouts/exercises'),
          fetch('/api/diets'),
          fetch('/api/community/challenges')
        ]);

        const wData = await workoutsRes.json();
        const eData = await exercisesRes.json();
        const dData = await dietsRes.json();
        const cData = await challengesRes.json();

        if (wData.success) setWorkouts(wData.workouts);
        if (eData.success) setExercises(eData.exercises);
        if (dData.success) setDiets(dData.diets);
        if (cData.success) setChallenges(cData.challenges);
      } catch (err) {
        console.warn('Backend offline, seeding local mock fitness collections...');
        seedMockCollections();
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Fetch user specific progress & notifications
  useEffect(() => {
    if (!user) {
      setDailyProgress(null);
      setProgressHistory([]);
      setNotifications([]);
      setAiRecommendations(null);
      return;
    }

    const fetchUserSpecificData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [progRes, histRes, notifRes, aiRes] = await Promise.all([
          fetch(`/api/progress?date=${getTodayString()}`, { headers }),
          fetch('/api/progress/history?days=7', { headers }),
          fetch('/api/community/notifications', { headers }),
          fetch('/api/ai/recommendations', { headers })
        ]);

        const pData = await progRes.json();
        const hData = await histRes.json();
        const nData = await notifRes.json();
        const aData = await aiRes.json();

        if (pData.success) setDailyProgress(pData.progress);
        if (hData.success) setProgressHistory(hData.history);
        if (nData.success) setNotifications(nData.notifications);
        if (aData.success) setAiRecommendations(aData.recommendations);
      } catch (err) {
        console.warn('Backend offline, loading user mock tracking logs...');
        loadMockUserTracking();
      }
    };

    fetchUserSpecificData();
  }, [user, token]);

  // Seed mock data for offline support
  const seedMockCollections = () => {
    setWorkouts([
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

    setExercises([
      { _id: 'ex1', name: 'Push-Ups', category: 'Strength training', difficulty: 'Beginner', targetMuscles: ['Chest', 'Triceps'], duration: '30s', sets: 3, reps: 12, caloriesBurned: 15, instructions: 'Lower body until chest nearly touches floor, push up.', image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=300&q=80' },
      { _id: 'ex2', name: 'Bodyweight Squats', category: 'Home workouts', difficulty: 'Beginner', targetMuscles: ['Quads', 'Glutes'], duration: '45s', sets: 3, reps: 15, caloriesBurned: 20, instructions: 'Lower hips back and down. Keep chest up.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=300&q=80' },
      { _id: 'ex3', name: 'Plank Hold', category: 'Core', difficulty: 'Intermediate', targetMuscles: ['Abs', 'Shoulders'], duration: '60s', sets: 3, reps: 1, caloriesBurned: 10, instructions: 'Keep body straight resting on forearms and toes.', image: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&w=300&q=80' },
      { _id: 'ex4', name: 'Jumping Jacks', category: 'Cardio', difficulty: 'Beginner', targetMuscles: ['Full Body'], duration: '45s', sets: 3, reps: 30, caloriesBurned: 25, instructions: 'Jump feet out and raise hands overhead. Repeat.', image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=300&q=80' },
      { _id: 'ex5', name: 'Dumbbell Bicep Curls', category: 'Strength training', difficulty: 'Intermediate', targetMuscles: ['Biceps'], duration: '40s', sets: 4, reps: 12, caloriesBurned: 18, instructions: 'Curl weights up keeping elbows close to chest.', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80' },
      { _id: 'ex6', name: 'Downward-Facing Dog', category: 'Yoga', difficulty: 'Beginner', targetMuscles: ['Shoulders', 'Hamstrings'], duration: '60s', sets: 2, reps: 1, caloriesBurned: 8, instructions: 'Press hips back to form inverted V shape.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80' },
      { _id: 'ex7', name: 'Burpees', category: 'HIIT', difficulty: 'Advanced', targetMuscles: ['Full Body'], duration: '45s', sets: 4, reps: 10, caloriesBurned: 35, instructions: 'Squat, kick back, pushup, jump feet in, jump up.', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80' }
    ]);

    setDiets([
      { _id: 'd1', name: 'High-Protein Muscle Builder', category: 'High-protein', calories: 2200, protein: 160, carbs: 210, fat: 75, description: 'Optimal nutrition for lifting.', meals: { breakfast: 'Egg white omelet & oats.', lunch: 'Grilled chicken & brown rice.', dinner: 'Baked salmon & sweet potato.', snacks: 'Whey protein shake & greek yogurt.' } },
      { _id: 'd2', name: 'Balanced Weight-Loss Plan', category: 'Weight-loss', calories: 1600, protein: 110, carbs: 150, fat: 50, description: 'Deficit plan to shed fat.', meals: { breakfast: 'Oatmeal & blueberries.', lunch: 'Green salad & grilled shrimp.', dinner: 'Stir-fried tofu & quinoa.', snacks: 'Apple & almonds.' } },
      { _id: 'd3', name: 'Plant-Powered Vegan Plan', category: 'Vegan', calories: 1800, protein: 95, carbs: 220, fat: 60, description: 'Fully vegan macro ratios.', meals: { breakfast: 'Tofu scramble & avocado toast.', lunch: 'Lentil soup & pita bread.', dinner: 'Chickpea curry & basmati rice.', snacks: 'Hummus & celery.' } }
    ]);

    setChallenges([
      { _id: 'c1', title: '7-Day Water Hydration Challenge', description: 'Drink 2.5L water daily.', xpReward: 150, durationDays: 7, category: 'Water' },
      { _id: 'c2', title: 'Cardio Crusher Sprint', description: 'Log 3 Cardio workouts.', xpReward: 250, durationDays: 5, category: 'Workout' },
      { _id: 'c3', title: 'Deep Sleep Streak', description: 'Sleep 7+ hours for 5 nights.', xpReward: 200, durationDays: 5, category: 'Sleep' }
    ]);
  };

  const loadMockUserTracking = () => {
    const todayStr = getTodayString();
    setDailyProgress({
      userId: 'mock_usr',
      date: todayStr,
      weight: user?.weight || 70,
      waterIntake: 1200,
      sleepDuration: 7.2,
      caloriesBurned: 180,
      caloriesConsumed: 1450,
      workoutsCompleted: ['Morning Stretch']
    });

    // Make last 7 days history
    const history = [];
    const dateNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      history.push({
        _id: `prog_mock_${i}`,
        date: dStr,
        dayName: dateNames[7 - i - 1] || 'Day',
        weight: user?.weight ? user.weight + (i * 0.1 - 0.3) : 70 + (i * 0.1 - 0.3),
        waterIntake: 1000 + (i * 200) + Math.round(Math.random() * 300),
        sleepDuration: 6.5 + (i * 0.2) + Math.random() * 0.5,
        caloriesBurned: 100 + (i * 50) + Math.round(Math.random() * 100),
        caloriesConsumed: 1600 - (i * 30) + Math.round(Math.random() * 150),
        workoutsCompleted: i % 2 === 0 ? ['Cardio'] : []
      });
    }
    setProgressHistory(history);

    setNotifications([
      { _id: 'n1', title: 'Welcome aboard! 🎉', message: 'Set up your health goals to unlock your fitness recommendations!', type: 'info', read: false },
      { _id: 'n2', title: 'First Badge Earned!', message: 'You unlocked the "First Step" badge. Keep building consistency!', type: 'success', read: false }
    ]);

    // Set AI recommendations
    const userGoal = user?.fitnessGoal || 'General fitness';
    setAiRecommendations({
      workoutPlan: [
        'Mix 2 cardio sessions and 2 strength sessions weekly',
        'Use Full Body Home Blast routines for home sessions',
        'Ensure dynamic warmups of 5-10 minutes'
      ],
      dietSuggestions: [
        'Prioritize complex carbohydrates like oats and brown rice',
        'Target 1.2g to 1.5g protein per kg of bodyweight',
        'Consume plenty of colorful leafy greens'
      ],
      healthSuggestions: [
        'Drink a glass of water first thing in the morning',
        'Establish a consistent sleep schedule to aid muscle recovery',
        'Walk 8,000 steps daily to maintain general cardio health'
      ],
      dailyTargets: {
        water: 2500,
        sleep: 8,
        caloriesToBurn: 300,
        caloriesToConsume: 2000
      }
    });
  };

  // Mutating tracking actions
  const logProgress = async (logData) => {
    const todayStr = getTodayString();
    
    // Optimistic UI update
    const prevProgress = { ...dailyProgress };
    const mergedProgress = {
      ...dailyProgress,
      userId: user?.id || 'mock',
      date: todayStr,
      ...logData
    };

    if (logData.caloriesBurned !== undefined && dailyProgress) {
      mergedProgress.caloriesBurned = (dailyProgress.caloriesBurned || 0) + logData.caloriesBurned;
    }
    if (logData.workoutTitle && dailyProgress) {
      mergedProgress.workoutsCompleted = [...(dailyProgress.workoutsCompleted || []), logData.workoutTitle];
    }
    setDailyProgress(mergedProgress);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: todayStr, ...logData })
      });
      const data = await response.json();
      if (data.success) {
        setDailyProgress(data.progress);
        // Refresh history
        const histRes = await fetch('/api/progress/history?days=7', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const histData = await histRes.json();
        if (histData.success) setProgressHistory(histData.history);

        // If XP was awarded, trigger context updates
        if (data.xpAwarded > 0) {
          addXp(0, 'dummy'); // Refresh Auth user state to reflect new level/XP
        }
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Backend offline, logging progress locally...');
      // offline logic: update state
      if (logData.workoutTitle) {
        addXp(80, `Completed: ${logData.workoutTitle}`);
        // Add to notification
        setNotifications(prev => [
          { _id: Math.random().toString(), title: 'Workout Completed! 💪', message: `Logged "${logData.workoutTitle}" and earned 80 XP!`, type: 'success', read: false },
          ...prev
        ]);
      }
      if (logData.waterIntake >= 2000 && (dailyProgress?.waterIntake || 0) < 2000) {
        addXp(30, 'Hydration target (2L) reached!');
        setNotifications(prev => [
          { _id: Math.random().toString(), title: 'Goal Complete! 💧', message: 'Reached 2,000ml hydration goal and earned 30 XP!', type: 'success', read: false },
          ...prev
        ]);
      }
      
      // Update history in state
      const histIdx = progressHistory.findIndex(h => h.date === todayStr);
      if (histIdx !== -1) {
        const updatedHist = [...progressHistory];
        updatedHist[histIdx] = { ...updatedHist[histIdx], ...logData };
        setProgressHistory(updatedHist);
      }

      return true;
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      const response = await fetch(`/api/community/challenges/join/${challengeId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        addXp(0, 'refresh');
        // Fetch new notifications
        const notifRes = await fetch('/api/community/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const notifData = await notifRes.json();
        if (notifData.success) setNotifications(notifData.notifications);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Backend offline, joining challenge locally...');
      addXp(20, 'Challenge Join');
      setNotifications(prev => [
        { _id: Math.random().toString(), title: 'Challenge Accepted! 🏆', message: 'You have signed up for the challenge. Let\'s conquer it!', type: 'challenge', read: false },
        ...prev
      ]);
      return true;
    }
  };

  const markNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/community/notifications/read', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('Backend offline, notifications read locally.');
    }
  };

  const createCustomWorkout = async (workoutData) => {
    try {
      const response = await fetch('/api/workouts/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      });
      const data = await response.json();
      if (data.success) {
        setWorkouts(prev => [data.workout, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Backend offline, adding custom workout locally...');
      const mockCustom = {
        _id: `w_custom_${Math.random()}`,
        title: workoutData.title,
        category: workoutData.category,
        difficulty: workoutData.difficulty || 'Beginner',
        duration: Number(workoutData.duration),
        caloriesBurned: Number(workoutData.caloriesBurned),
        targetMuscles: workoutData.targetMuscles || ['Full Body'],
        exercises: workoutData.exercises || [],
        description: workoutData.description || 'Custom workout',
        createdBy: user?.id || 'mock'
      };
      setWorkouts(prev => [mockCustom, ...prev]);
      return true;
    }
  };

  return (
    <FitnessContext.Provider value={{
      workouts,
      exercises,
      diets,
      challenges,
      notifications,
      dailyProgress,
      progressHistory,
      aiRecommendations,
      loading,
      logProgress,
      joinChallenge,
      markNotificationsRead,
      createCustomWorkout
    }}>
      {children}
    </FitnessContext.Provider>
  );
};
