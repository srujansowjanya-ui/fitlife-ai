import React, { useContext, useState } from 'react';
import { Utensils, Flame, Droplet, Calculator, Sparkles, Scale, CheckCircle2 } from 'lucide-react';
import { FitnessContext } from '../context/FitnessContext';
import { AuthContext } from '../context/AuthContext';

export default function DietNutrition() {
  const { user } = useContext(AuthContext);
  const { diets, dailyProgress, logProgress } = useContext(FitnessContext);

  // Form States for Calorie Calculator
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [activity, setActivity] = useState(user?.activityLevel || 'Moderately active');
  
  const [calcResults, setCalcResults] = useState(null);
  const [activePlanCategory, setActivePlanCategory] = useState('High-protein');

  // Daily log states
  const [loggedCalories, setLoggedCalories] = useState('');

  const todayProgress = dailyProgress || {
    waterIntake: 0,
    caloriesConsumed: 0,
    caloriesBurned: 0
  };

  // Run Miffln-St Jeor Formula
  const handleCalculateMacros = (e) => {
    e.preventDefault();
    if (!age || !height || !weight) return;

    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    let factor = 1.2;
    switch (activity) {
      case 'Sedentary': factor = 1.2; break;
      case 'Lightly active': factor = 1.375; break;
      case 'Moderately active': factor = 1.55; break;
      case 'Very active': factor = 1.725; break;
      case 'Extra active': factor = 1.9; break;
    }

    const maintenance = Math.round(bmr * factor);
    const weightLoss = maintenance - 500;
    const weightGain = maintenance + 500;

    setCalcResults({
      bmr: Math.round(bmr),
      maintenance,
      weightLoss,
      weightGain
    });
  };

  const handleLogCalories = (e) => {
    e.preventDefault();
    if (!loggedCalories) return;

    const currentConsumed = todayProgress.caloriesConsumed || 0;
    logProgress({ caloriesConsumed: currentConsumed + Number(loggedCalories) });
    setLoggedCalories('');
    alert(`Logged ${loggedCalories} kcal successfully to daily total!`);
  };

  const filteredDiets = diets.filter(d => d.category.toLowerCase() === activePlanCategory.toLowerCase());

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Diet & Nutrition Module</h2>
        <p className="text-xs text-gray-400 mt-1">
          Calculate your maintenance calories, examine macro splits, and choose preloaded healthy diet templates.
        </p>
      </div>

      {/* Grid: Logging Panel & Calorie Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LOG TELEMETRY CALORIES CARD */}
        <div className="glass-card p-6 border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="text-brandGreen" size={20} />
            <h3 className="text-lg font-bold text-gray-200">Daily Caloric Logs</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center mb-6">
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Calories Consumed</span>
              <span className="text-2xl font-extrabold text-white">
                {todayProgress.caloriesConsumed || 0}
              </span>
              <span className="text-[9px] text-gray-500 block mt-1">kcal logged today</span>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Calories Burned</span>
              <span className="text-2xl font-extrabold text-brandCoral">
                {todayProgress.caloriesBurned || 0}
              </span>
              <span className="text-[9px] text-gray-500 block mt-1">kcal active metabolic</span>
            </div>
          </div>

          {/* Form to log food */}
          <form onSubmit={handleLogCalories} className="flex gap-2">
            <div className="relative flex-grow">
              <Flame className="absolute left-3 top-3 text-gray-500" size={16} />
              <input
                type="number"
                value={loggedCalories}
                onChange={(e) => setLoggedCalories(e.target.value)}
                placeholder="Log calories eaten (e.g. 450)"
                required
                className="form-input text-xs pl-9 py-2 px-3 focus:border-brandGreen"
              />
            </div>
            <button
              type="submit"
              className="btn-primary py-2 px-4 text-xs font-bold shrink-0 shadow-sm"
            >
              Log Food
            </button>
          </form>
        </div>

        {/* CALORIE CALCULATOR CARD */}
        <div className="glass-card p-6 border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-brandGreen" size={20} />
            <h3 className="text-lg font-bold text-gray-200">Daily Calorie Target Calculator</h3>
          </div>

          <form onSubmit={handleCalculateMacros} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Years"
                required
                className="form-input text-xs py-1.5 px-3 bg-slate-900/40"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="form-input text-xs py-1.5 px-3 bg-slate-900/40"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                required
                className="form-input text-xs py-1.5 px-3 bg-slate-900/40"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
                required
                className="form-input text-xs py-1.5 px-3 bg-slate-900/40"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Activity Level</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="form-input text-xs py-1.5 px-3 bg-slate-900/40"
              >
                <option value="Sedentary">Sedentary (desk job, no exercise)</option>
                <option value="Lightly active">Lightly active (light exercise 1-3 days/wk)</option>
                <option value="Moderately active">Moderately active (moderate exercise 3-5 days/wk)</option>
                <option value="Very active">Very active (hard exercise 6-7 days/wk)</option>
                <option value="Extra active">Extra active (very hard exercise, physical job)</option>
              </select>
            </div>
            <button
              type="submit"
              className="sm:col-span-2 btn-secondary py-2 text-xs font-bold"
            >
              Run Macro Calculation
            </button>
          </form>

          {/* Calculator Results Display */}
          {calcResults && (
            <div className="mt-6 border-t border-white/[0.08] pt-4 flex flex-col gap-3">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>BMR (Basal Metabolic Rate):</span>
                <span>{calcResults.bmr} kcal/day</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2.5 mt-2">
                <div className="p-2 border border-white/[0.04] bg-white/[0.01] rounded-xl text-center">
                  <span className="text-[9px] text-gray-500 font-bold block uppercase">Weight Loss</span>
                  <span className="text-sm font-extrabold text-white">{calcResults.weightLoss}</span>
                  <span className="text-[8px] text-gray-500 block font-semibold mt-0.5">kcal/day</span>
                </div>
                <div className="p-2 border border-brandGreen/20 bg-brandGreen/5 rounded-xl text-center">
                  <span className="text-[9px] text-brandGreen font-bold block uppercase">Maintenance</span>
                  <span className="text-sm font-extrabold text-white">{calcResults.maintenance}</span>
                  <span className="text-[8px] text-gray-500 block font-semibold mt-0.5">kcal/day</span>
                </div>
                <div className="p-2 border border-white/[0.04] bg-white/[0.01] rounded-xl text-center">
                  <span className="text-[9px] text-gray-500 font-bold block uppercase">Gain / Bulk</span>
                  <span className="text-sm font-extrabold text-white">{calcResults.weightGain}</span>
                  <span className="text-[8px] text-gray-500 block font-semibold mt-0.5">kcal/day</span>
                </div>
              </div>
              
              {/* Macro ratios recommendations */}
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-start gap-2.5 mt-2 text-[10px] leading-relaxed text-gray-300">
                <Sparkles className="text-brandGreen shrink-0 mt-0.5 animate-pulse" size={14} />
                <p>
                  To support **Maintenance**, aim for: **Protein: 150g**, **Carbs: 220g**, **Fats: 65g** based on a standard clean 30% Protein, 45% Carbs, 25% Fat caloric ratio.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MEAL PLANS & RECIPES MODULE */}
      <div className="glass-card p-6 border border-white/[0.04] mt-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Utensils className="text-brandGreen" size={20} />
            <h3 className="text-lg font-bold text-gray-200">Curated Diet & Meal Plans</h3>
          </div>

          {/* Diet categories selectors */}
          <div className="flex flex-wrap gap-2">
            {['High-protein', 'Weight-loss', 'Vegan'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActivePlanCategory(cat)}
                className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all ${
                  activePlanCategory === cat 
                    ? 'border-brandGreen text-brandGreen bg-brandGreen/5'
                    : 'border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Meal cards list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDiets.map((diet) => (
            <div 
              key={diet._id}
              className="p-5 border border-white/[0.04] bg-white/[0.01] rounded-2xl hover:border-white/[0.08] transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="font-extrabold text-sm text-gray-200 mb-1">{diet.name}</h4>
                <p className="text-[10px] text-gray-500 leading-snug mb-4 font-semibold">{diet.description}</p>
                
                {/* Macro splits details */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] border-b border-white/[0.06] pb-3 mb-4 font-bold">
                  <div className="bg-slate-900/50 p-1.5 rounded">
                    <span className="text-[8px] text-gray-500 block">CALORIES</span>
                    <span className="text-white">{diet.calories}</span>
                  </div>
                  <div className="bg-slate-900/50 p-1.5 rounded">
                    <span className="text-[8px] text-gray-500 block">PROTEIN</span>
                    <span className="text-brandGreen">{diet.protein}g</span>
                  </div>
                  <div className="bg-slate-900/50 p-1.5 rounded">
                    <span className="text-[8px] text-gray-500 block">CARBS</span>
                    <span className="text-brandIndigo-light">{diet.carbs}g</span>
                  </div>
                  <div className="bg-slate-900/50 p-1.5 rounded">
                    <span className="text-[8px] text-gray-500 block">FATS</span>
                    <span className="text-brandCoral-light">{diet.fat}g</span>
                  </div>
                </div>

                {/* Meals descriptions list */}
                <div className="flex flex-col gap-2.5 text-xs text-gray-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-brandGreen shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-200">Breakfast: </strong> {diet.meals.breakfast}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-brandGreen shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-200">Lunch: </strong> {diet.meals.lunch}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-brandGreen shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-200">Dinner: </strong> {diet.meals.dinner}
                    </div>
                  </div>
                  {diet.meals.snacks && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-brandGreen shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-200">Snacks: </strong> {diet.meals.snacks}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  logProgress({ caloriesConsumed: diet.calories });
                  alert(`Set target consumption: Added ${diet.calories} kcal from ${diet.name}!`);
                }}
                className="w-full btn-secondary py-2 text-xs font-bold mt-6 hover:bg-brandGreen hover:text-white"
              >
                Log Meal Plan Daily Target
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
