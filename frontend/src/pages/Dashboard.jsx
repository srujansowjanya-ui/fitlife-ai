import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Droplet, 
  Moon, 
  Plus, 
  CalendarRange, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  Compass, 
  Volume2, 
  Trophy 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FitnessContext } from '../context/FitnessContext';
import BMICalculator from '../components/BMICalculator';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { 
    dailyProgress, 
    aiRecommendations, 
    logProgress, 
    challenges,
    joinChallenge 
  } = useContext(FitnessContext);

  const [waterVolume, setWaterVolume] = useState('');
  const [sleepHours, setSleepHours] = useState('');

  // Fallback metrics if progress not logged yet
  const todayProgress = dailyProgress || {
    waterIntake: 0,
    sleepDuration: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    workoutsCompleted: []
  };

  const targets = aiRecommendations?.dailyTargets || {
    water: 2500,
    sleep: 8,
    caloriesToBurn: 300,
    caloriesToConsume: 2000
  };

  const handleWaterAdd = (amount) => {
    const nextWater = (todayProgress.waterIntake || 0) + amount;
    logProgress({ waterIntake: nextWater });
  };

  const handleWaterSubmit = (e) => {
    e.preventDefault();
    if (!waterVolume) return;
    handleWaterAdd(parseInt(waterVolume));
    setWaterVolume('');
  };

  const handleSleepSubmit = (e) => {
    e.preventDefault();
    if (!sleepHours) return;
    logProgress({ sleepDuration: parseFloat(sleepHours) });
    setSleepHours('');
  };

  // Math for Calorie progress ring
  const burnPercent = Math.min(100, Math.round((todayProgress.caloriesBurned / targets.caloriesToBurn) * 100)) || 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (burnPercent / 100) * circumference;

  // Daily quote
  const quote = "Your body can stand almost anything. It's your mind that you have to convince.";

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      {/* Welcome Block */}
      <div className="glass-card p-6 border border-white/[0.04] bg-gradient-to-r from-slate-900 via-darkCard to-[#0c1322] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brandGreen/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Welcome back, <span className="text-brandGreen">{user?.name}</span>!
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-semibold italic">"{quote}"</p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px]">
              <span className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 font-bold text-gray-300">
                Goal: <span className="text-brandGreen-light">{user?.fitnessGoal || 'General fitness'}</span>
              </span>
              <span className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 font-bold text-gray-300">
                Activity Level: <span className="text-brandGreen-light">{user?.activityLevel || 'Active'}</span>
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/workouts" className="btn-primary py-2 px-4 text-xs font-bold">
              Start Workout <Plus size={14} />
            </Link>
            <Link to="/nutrition" className="btn-secondary py-2 px-4 text-xs font-bold">
              Log Meal
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Calories Burned Ring Widget */}
        <div className="glass-card p-6 border border-white/[0.04] flex items-center justify-between gap-4">
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Calories Burned</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white">{todayProgress.caloriesBurned}</span>
                <span className="text-xs text-gray-500 font-semibold">/ {targets.caloriesToBurn} kcal</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-bold mt-4 flex items-center gap-1">
              <Flame size={12} className="text-brandCoral animate-pulse" />
              Active metabolic energy
            </div>
          </div>

          {/* SVG Circular Progress */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-24 h-24">
              <circle 
                cx="48" cy="48" r={radius} 
                className="stroke-slate-800 fill-transparent" 
                strokeWidth="8"
              />
              <circle 
                cx="48" cy="48" r={radius} 
                className="stroke-brandGreen fill-transparent progress-ring-circle" 
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-sm font-extrabold text-white">{burnPercent}%</span>
              <span className="text-[8px] text-gray-500 font-bold uppercase">Burned</span>
            </div>
          </div>
        </div>

        {/* Water Hydration logger */}
        <div className="glass-card p-6 border border-white/[0.04]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Water Intake</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white">{todayProgress.waterIntake}</span>
                <span className="text-xs text-gray-500 font-semibold">/ {targets.water} ml</span>
              </div>
            </div>
            <Droplet className="text-blue-400 animate-bounce" size={20} />
          </div>

          {/* Hydration progress slider bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.round((todayProgress.waterIntake / targets.water) * 100))}%` }}
            />
          </div>

          {/* Increment shortcuts */}
          <div className="flex gap-2">
            <button 
              onClick={() => handleWaterAdd(250)}
              className="flex-1 py-1.5 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-[10px] font-bold rounded-lg text-blue-300"
            >
              +250ml
            </button>
            <button 
              onClick={() => handleWaterAdd(500)}
              className="flex-1 py-1.5 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-[10px] font-bold rounded-lg text-blue-300"
            >
              +500ml
            </button>
            <form onSubmit={handleWaterSubmit} className="flex-1 flex gap-1">
              <input 
                type="number"
                value={waterVolume}
                onChange={(e) => setWaterVolume(e.target.value)}
                placeholder="Custom"
                className="w-full text-[10px] text-center bg-slate-900/40 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400 px-1 py-1 text-white"
              />
            </form>
          </div>
        </div>

        {/* Sleep Tracker logger */}
        <div className="glass-card p-6 border border-white/[0.04]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs text-gray-400 font-bold block mb-1">Sleep Tracker</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-white">{todayProgress.sleepDuration}</span>
                <span className="text-xs text-gray-500 font-semibold">/ {targets.sleep} hrs</span>
              </div>
            </div>
            <Moon className="text-brandIndigo-light" size={20} />
          </div>

          {/* Sleep progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-brandIndigo h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.round((todayProgress.sleepDuration / targets.sleep) * 100))}%` }}
            />
          </div>

          <form onSubmit={handleSleepSubmit} className="flex gap-2">
            <input 
              type="number"
              step="0.1"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="Log sleep hours (e.g. 7.5)"
              className="flex-grow text-[10px] bg-slate-900/40 border border-white/10 rounded-lg focus:outline-none focus:border-brandIndigo px-2 py-1.5 text-white"
            />
            <button 
              type="submit"
              className="p-1.5 bg-brandIndigo hover:bg-brandIndigo-dark transition-colors text-white rounded-lg"
            >
              <Plus size={14} />
            </button>
          </form>
        </div>

      </div>

      {/* DASHBOARD MIDDLE SECTION - Recommendations & BMI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* AI Recommendations Tasklist */}
        <div className="glass-card p-6 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-200 flex items-center gap-1.5">
              <Sparkles size={18} className="text-brandGreen animate-pulse" />
              AI Recommendations (XP Tasks)
            </h3>
            <span className="text-[10px] text-brandGreen font-bold bg-brandGreen/10 px-2 py-1 rounded-lg">
              Goal Tasks
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Workout recommendations */}
            {aiRecommendations?.workoutPlan.slice(0, 2).map((rec, i) => (
              <div 
                key={`work_rec_${i}`}
                className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-brandGreen/25 transition-colors group cursor-pointer"
                onClick={() => {
                  logProgress({ workoutTitle: rec.substring(0, 20), caloriesBurned: 120 });
                  alert(`Task completed! Logged workout: ${rec.substring(0, 20)} and earned 80 XP!`);
                }}
              >
                <CheckCircle size={16} className="text-gray-500 shrink-0 mt-0.5 group-hover:text-brandGreen transition-colors" />
                <div>
                  <span className="text-xs font-semibold text-gray-200 block">Complete Workout:</span>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{rec}</p>
                  <span className="text-[9px] font-bold text-brandGreen mt-1 block">+80 XP Reward</span>
                </div>
              </div>
            ))}

            {/* Diet recommendation task */}
            {aiRecommendations?.dietSuggestions.slice(0, 1).map((rec, i) => (
              <div 
                key={`diet_rec_${i}`}
                className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-blue-400/25 transition-colors group cursor-pointer"
                onClick={() => {
                  logProgress({ waterIntake: 2000 });
                  alert('Task completed! Drank 2L of water and earned 30 XP!');
                }}
              >
                <CheckCircle size={16} className="text-gray-500 shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                <div>
                  <span className="text-xs font-semibold text-gray-200 block">Nutrition Target:</span>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{rec}</p>
                  <span className="text-[9px] font-bold text-blue-400 mt-1 block">+30 XP Reward</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] mt-4 pt-4 flex justify-between items-center text-xs text-gray-500">
            <span>AI suggestions optimize automatically</span>
            <Link to="/progress" className="text-brandGreen hover:underline font-bold flex items-center gap-0.5">
              View History <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Embedded BMI Calculator */}
        <BMICalculator />

      </div>

      {/* BOTTOM SECTION: Community Challenges */}
      <div className="glass-card p-6 border border-white/[0.04]">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-amber-400" size={20} />
          <h3 className="text-lg font-bold text-gray-200">Active Challenges</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.slice(0, 3).map((chal) => {
            const hasJoined = user?.joinedChallenges?.includes(chal._id);
            return (
              <div 
                key={chal._id}
                className={`p-4 rounded-2xl border transition-all ${
                  hasJoined 
                    ? 'bg-brandIndigo/5 border-brandIndigo/25' 
                    : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08]'
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                  {chal.category}
                </span>
                <h4 className="font-bold text-xs text-gray-200 mt-2.5">{chal.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">{chal.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-brandGreen font-bold">+{chal.xpReward} XP Reward</span>
                  <button
                    onClick={() => {
                      joinChallenge(chal._id);
                    }}
                    disabled={hasJoined}
                    className={`text-[9px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                      hasJoined 
                        ? 'bg-brandIndigo/10 text-brandIndigo-light border border-brandIndigo/20 cursor-default'
                        : 'bg-brandGreen hover:bg-brandGreen-dark text-white shadow-sm hover:shadow-glowGreen'
                    }`}
                  >
                    {hasJoined ? 'Active Challenge' : 'Join Challenge'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
