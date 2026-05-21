import React, { useContext, useState } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  Award, 
  Activity, 
  Heart, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Scale 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitnessGoal || 'General fitness');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'Active');

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const badgesList = [
    { name: 'First Step', desc: 'Signed up and logged your first telemetry metric.', icon: '👣', color: 'border-brandGreen bg-brandGreen/5 text-brandGreen' },
    { name: 'Google Connect', desc: 'Synced profile via Google Single Sign-on integration.', icon: '🌐', color: 'border-blue-400 bg-blue-400/5 text-blue-400' },
    { name: 'Water Hero', desc: 'Logged 2,000ml+ water intake today.', icon: '💧', color: 'border-blue-500 bg-blue-500/5 text-blue-500' },
    { name: 'Iron Shredder', desc: 'Completed 3 high-intensity strength workouts.', icon: '🏋️‍♂️', color: 'border-brandCoral bg-brandCoral/5 text-brandCoral' },
    { name: 'Zen Master', desc: 'Completed box breathing stress trainer loop.', icon: '🧘‍♂️', color: 'border-brandIndigo bg-brandIndigo/5 text-brandIndigo' },
    { name: 'Milestone 5', desc: 'Reached Level 5 in user profile ranking.', icon: '🏆', color: 'border-amber-400 bg-amber-400/5 text-amber-400' }
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = {
        name,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        gender,
        fitnessGoal,
        activityLevel
      };
      
      const success = await updateProfile(data);
      if (success) {
        setSuccessMsg('Profile updated successfully! BMI re-calculated.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Failed to update profile info.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to API.');
    } finally {
      setIsUpdating(false);
    }
  };

  // XP calculations: 500 XP per level
  const currentXp = user?.xp || 0;
  const currentLvl = user?.level || 1;
  const xpInCurrentLvl = currentXp % 500;
  const xpPercent = Math.min(100, Math.round((xpInCurrentLvl / 500) * 100)) || 0;

  // BMI Category Helper
  const getBmiCategory = (bmi) => {
    if (!bmi) return { label: 'Unknown', color: 'text-gray-400' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal weight', color: 'text-brandGreen' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400' };
    return { label: 'Obese', color: 'text-brandCoral' };
  };

  const bmiCat = getBmiCategory(user?.bmi);

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Profile & Settings</h2>
        <p className="text-xs text-gray-400 mt-1">Configure your personal physical metrics, customize goals, and view unlocked achievements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: User Card & Progression */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 border border-white/[0.04] text-center relative overflow-hidden bg-gradient-to-b from-[#151c2c] to-[#0c1322]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brandGreen/5 blur-[50px] rounded-full pointer-events-none" />
            
            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full border border-white/10 bg-slate-800" 
              />
              <span className="absolute bottom-0 right-0 bg-brandGreen text-white text-[10px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center border border-darkBg">
                {currentLvl}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white">{user?.name}</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">{user?.email}</span>
            
            <div className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 inline-block mt-3 text-[10px] font-bold text-gray-300">
              Role: <span className="text-brandGreen uppercase">{user?.role || 'user'}</span>
            </div>

            {/* Level slider */}
            <div className="mt-6 border-t border-white/[0.06] pt-5 text-left">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-gray-400 font-bold">Level {currentLvl} Progression</span>
                <span className="text-brandGreen font-bold">{xpInCurrentLvl} / 500 XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                <div 
                  className="bg-brandGreen h-2 rounded-full transition-all duration-500 shadow-glowGreen" 
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-500 font-semibold block text-right">
                {500 - xpInCurrentLvl} XP until Level {currentLvl + 1}
              </span>
            </div>
          </div>

          {/* BMI Info Panel */}
          <div className="glass-card p-6 border border-white/[0.04]">
            <h4 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5">
              <Scale size={16} className="text-blue-400" />
              BMI Telemetry Analysis
            </h4>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Your BMI Gauge</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{user?.bmi || 'N/A'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Category</span>
                <span className={`text-xs font-bold ${bmiCat.color} mt-1 block`}>{bmiCat.label}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] leading-relaxed text-gray-400">
              <span className="font-bold text-white block mb-1">BMI Reference Index:</span>
              <div className="flex justify-between mt-1 text-[9px] border-b border-white/5 pb-1">
                <span>Underweight:</span> <span className="text-blue-400">&lt; 18.5</span>
              </div>
              <div className="flex justify-between mt-1 text-[9px] border-b border-white/5 pb-1">
                <span>Normal:</span> <span className="text-brandGreen">18.5 - 24.9</span>
              </div>
              <div className="flex justify-between mt-1 text-[9px] border-b border-white/5 pb-1">
                <span>Overweight:</span> <span className="text-amber-400">25.0 - 29.9</span>
              </div>
              <div className="flex justify-between mt-1 text-[9px]">
                <span>Obese:</span> <span className="text-brandCoral">&ge; 30.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Form and Badges */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Settings Form */}
          <div className="glass-card p-6 border border-white/[0.04]">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-1.5">
              <Settings size={18} className="text-brandGreen" />
              Configure Health Metrics
            </h3>

            {successMsg && (
              <div className="bg-brandGreen/10 border border-brandGreen/20 text-brandGreen text-xs p-3 rounded-xl mb-4 font-bold">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-brandCoral/10 border border-brandCoral/20 text-brandCoral text-xs p-3 rounded-xl mb-4 font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Display Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. John Doe"
                    className="form-input text-xs" 
                    required 
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Age (Years)</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    placeholder="e.g. 28"
                    className="form-input text-xs" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Height (cm)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)} 
                    placeholder="e.g. 175"
                    className="form-input text-xs" 
                    required 
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    placeholder="e.g. 72"
                    className="form-input text-xs" 
                    required 
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Biological Gender</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="form-input text-xs cursor-pointer"
                  >
                    <option value="male" className="bg-darkCard">Male</option>
                    <option value="female" className="bg-darkCard">Female</option>
                    <option value="other" className="bg-darkCard">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Fitness Goal</label>
                  <select 
                    value={fitnessGoal} 
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="form-input text-xs cursor-pointer"
                  >
                    <option value="General fitness" className="bg-darkCard">General Fitness</option>
                    <option value="Weight loss" className="bg-darkCard">Weight Loss</option>
                    <option value="High-protein muscle building" className="bg-darkCard">Muscle Gain</option>
                    <option value="Home workouts" className="bg-darkCard">Home Conditioning</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Physical Activity Level</label>
                  <select 
                    value={activityLevel} 
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="form-input text-xs cursor-pointer"
                  >
                    <option value="Sedentary" className="bg-darkCard">Sedentary (desk job)</option>
                    <option value="Lightly active" className="bg-darkCard">Lightly active (1-2 days/wk)</option>
                    <option value="Moderately active" className="bg-darkCard">Moderately active (3-4 days/wk)</option>
                    <option value="Very active" className="bg-darkCard">Very active (5-6 days/wk)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUpdating}
                className="btn-primary w-full text-xs font-bold py-3 mt-2"
              >
                {isUpdating ? 'Re-calculating metrics...' : 'Save Health Configuration'}
              </button>
            </form>
          </div>

          {/* Badges and milestones showcase */}
          <div className="glass-card p-6 border border-white/[0.04]">
            <h3 className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-1.5">
              <Award size={18} className="text-amber-400" />
              Achievements & Badges
            </h3>
            <p className="text-[11px] text-gray-400 mb-4 leading-normal">
              Earn XP by completing daily fitness tasks, logging diets, and accepting active challenges.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badgesList.map((badge, idx) => {
                const hasUnlocked = user?.badges?.includes(badge.name) || (badge.name === 'First Step');
                return (
                  <div 
                    key={`badge_${idx}`}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                      hasUnlocked 
                        ? `${badge.color} border-opacity-30` 
                        : 'bg-white/[0.01] border-white/[0.04] opacity-40'
                    }`}
                  >
                    <span className="text-2xl mt-0.5 select-none">{badge.icon}</span>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-gray-200">{badge.name}</h4>
                        {hasUnlocked && <CheckCircle2 size={12} className="text-brandGreen shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{badge.desc}</p>
                      <span className="text-[8px] font-bold block mt-1.5 text-gray-500 uppercase tracking-wider">
                        {hasUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
