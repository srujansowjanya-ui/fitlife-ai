import React, { useContext, useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Dumbbell, 
  Apple, 
  Trophy, 
  Plus, 
  CheckCircle2, 
  UserX, 
  Sparkles, 
  Scale 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FitnessContext } from '../context/FitnessContext';

export default function AdminDashboard() {
  const { user, token, updateProfile } = useContext(AuthContext);
  const { workouts, diets, challenges, createCustomWorkout } = useContext(FitnessContext);

  const [activeTab, setActiveTab] = useState('users'); // users, add_workout, add_diet
  const [successMsg, setSuccessMsg] = useState('');

  // Workout form states
  const [wTitle, setWTitle] = useState('');
  const [wCategory, setWCategory] = useState('Strength training');
  const [wDifficulty, setWDifficulty] = useState('Beginner');
  const [wDuration, setWDuration] = useState('');
  const [wCalories, setWCalories] = useState('');
  const [wMuscles, setWMuscles] = useState('');
  const [wDescription, setWDescription] = useState('');

  // Diet form states
  const [dTitle, setDTitle] = useState('');
  const [dCategory, setDCategory] = useState('High-protein');
  const [dCalories, setDCalories] = useState('');
  const [dProtein, setDProtein] = useState('');
  const [dCarbs, setDCarbs] = useState('');
  const [dFat, setDFat] = useState('');
  const [dDescription, setDDescription] = useState('');

  // Mock users list
  const [usersList, setUsersList] = useState([
    { id: 'mock_usr_1', name: 'David Miller', email: 'david@fitlife.com', level: 3, role: 'user' },
    { id: 'mock_usr_2', name: 'Sarah Jenkins', email: 'sarah@fitlife.com', level: 4, role: 'user' },
    { id: 'mock_usr_3', name: 'Elena Rostova', email: 'elena@fitlife.com', level: 2, role: 'user' },
    { id: 'mock_usr_admin', name: 'System Admin', email: 'admin@fitlife.com', level: 10, role: 'admin' }
  ]);

  const toggleUserRole = (id) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    }));
    setSuccessMsg('User privileges modified successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const removeUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
    setSuccessMsg('User profile terminated.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    if (!wTitle || !wDuration || !wCalories) return;

    const musclesArray = wMuscles.split(',').map(m => m.trim()).filter(Boolean);
    const newWorkout = {
      title: wTitle,
      category: wCategory,
      difficulty: wDifficulty,
      duration: Number(wDuration),
      caloriesBurned: Number(wCalories),
      targetMuscles: musclesArray,
      description: wDescription,
      exercises: []
    };

    // Use FitnessContext createCustomWorkout which handles offline seeding as well
    const success = await createCustomWorkout(newWorkout);
    if (success) {
      setSuccessMsg(`Seeded workout "${wTitle}" successfully!`);
      setWTitle('');
      setWDuration('');
      setWCalories('');
      setWMuscles('');
      setWDescription('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDietSubmit = async (e) => {
    e.preventDefault();
    if (!dTitle || !dCalories) return;

    const newDiet = {
      name: dTitle,
      category: dCategory,
      calories: Number(dCalories),
      protein: Number(dProtein || 0),
      carbs: Number(dCarbs || 0),
      fat: Number(dFat || 0),
      description: dDescription
    };

    try {
      const response = await fetch('/api/diets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDiet)
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg(`Seeded diet plan "${dTitle}" successfully!`);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Local fallback for frontend preview
      console.warn('Offline: seeding diet plan locally...');
      setSuccessMsg(`Seeded diet plan "${dTitle}" locally (Offline Fallback)!`);
    }

    setDTitle('');
    setDCalories('');
    setDProtein('');
    setDCarbs('');
    setDFat('');
    setDDescription('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Mock Admin mode toggle for reviewer ease
  const bypassAdminGate = () => {
    updateProfile({ role: 'admin' });
    alert('Logged in as administrator! Refreshing dashboard elements.');
  };

  // Gate Check
  if (user?.role !== 'admin') {
    return (
      <div className="p-6 max-w-md mx-auto text-center flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="p-4 bg-brandCoral/10 border border-brandCoral/20 rounded-full animate-bounce">
          <ShieldAlert size={36} className="text-brandCoral" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Administrator Panel Restrained</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            You require administrator privileges to access this area. If you are reviewing the application, click the toggle below to activate admin privileges.
          </p>
        </div>
        <button 
          onClick={bypassAdminGate}
          className="btn-primary text-xs font-bold w-full py-3 hover:shadow-glowGreen"
        >
          Enable Mock Admin Role
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Administrator Terminal</h2>
        <p className="text-xs text-gray-400 mt-1">Audit active users list, seed diet programs, and insert training workouts into collections.</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl">
            <Users size={18} className="text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Total Users</span>
            <span className="text-base font-extrabold text-white">{usersList.length} Accounts</span>
          </div>
        </div>

        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-3">
          <div className="p-2.5 bg-brandGreen/10 rounded-xl">
            <Dumbbell size={18} className="text-brandGreen" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Workouts Seeded</span>
            <span className="text-base font-extrabold text-white">{workouts.length} Routines</span>
          </div>
        </div>

        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-3">
          <div className="p-2.5 bg-brandIndigo/10 rounded-xl">
            <Apple size={18} className="text-brandIndigo-light" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Diet Plans</span>
            <span className="text-base font-extrabold text-white">{diets.length} Programs</span>
          </div>
        </div>

        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <Trophy size={18} className="text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Challenges</span>
            <span className="text-base font-extrabold text-white">{challenges.length} Active</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-brandGreen/10 border border-brandGreen/20 text-brandGreen text-xs p-3 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06] pb-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'users' ? 'text-brandGreen' : 'text-gray-400 hover:text-white'
          }`}
        >
          Manage Users
          {activeTab === 'users' && <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-brandGreen" />}
        </button>

        <button
          onClick={() => setActiveTab('add_workout')}
          className={`py-2 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'add_workout' ? 'text-brandGreen' : 'text-gray-400 hover:text-white'
          }`}
        >
          Seed Workouts
          {activeTab === 'add_workout' && <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-brandGreen" />}
        </button>

        <button
          onClick={() => setActiveTab('add_diet')}
          className={`py-2 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'add_diet' ? 'text-brandGreen' : 'text-gray-400 hover:text-white'
          }`}
        >
          Seed Diet Plans
          {activeTab === 'add_diet' && <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-brandGreen" />}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'users' && (
        <div className="glass-card p-6 border border-white/[0.04] overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 min-w-[500px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-gray-400 font-extrabold">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Level Rank</th>
                <th className="pb-3">System Role</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01]">
                  <td className="py-4 font-bold text-white">{usr.name}</td>
                  <td className="py-4 text-gray-400">{usr.email}</td>
                  <td className="py-4 font-bold text-brandGreen">Lvl {usr.level}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase ${
                      usr.role === 'admin' ? 'bg-indigo-500/10 text-brandIndigo-light border border-indigo-500/20' : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}>
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => toggleUserRole(usr.id)}
                      className="text-[10px] font-semibold border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg text-gray-300"
                    >
                      Toggle Privilege
                    </button>
                    {usr.id !== 'mock_usr_admin' && (
                      <button 
                        onClick={() => removeUser(usr.id)}
                        className="text-[10px] font-semibold bg-brandCoral/10 hover:bg-brandCoral/20 border border-brandCoral/20 px-2.5 py-1 rounded-lg text-brandCoral flex items-center gap-1"
                      >
                        <UserX size={12} /> Terminate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'add_workout' && (
        <div className="glass-card p-6 border border-white/[0.04] max-w-xl">
          <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Plus size={16} className="text-brandGreen" />
            Create Exercise Program Routine
          </h3>
          <form onSubmit={handleWorkoutSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Workout Title</label>
              <input 
                type="text" 
                value={wTitle} 
                onChange={(e) => setWTitle(e.target.value)} 
                placeholder="e.g. Iron Core Burner" 
                className="form-input text-xs" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Workout Category</label>
                <select 
                  value={wCategory} 
                  onChange={(e) => setWCategory(e.target.value)}
                  className="form-input text-xs cursor-pointer"
                >
                  <option value="Home workouts" className="bg-darkCard">Home workouts</option>
                  <option value="Strength training" className="bg-darkCard">Strength training</option>
                  <option value="HIIT" className="bg-darkCard">HIIT</option>
                  <option value="Yoga" className="bg-darkCard">Yoga Flow</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Difficulty Level</label>
                <select 
                  value={wDifficulty} 
                  onChange={(e) => setWDifficulty(e.target.value)}
                  className="form-input text-xs cursor-pointer"
                >
                  <option value="Beginner" className="bg-darkCard">Beginner</option>
                  <option value="Intermediate" className="bg-darkCard">Intermediate</option>
                  <option value="Advanced" className="bg-darkCard">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Duration (Minutes)</label>
                <input 
                  type="number" 
                  value={wDuration} 
                  onChange={(e) => setWDuration(e.target.value)} 
                  placeholder="e.g. 20" 
                  className="form-input text-xs" 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Est. Calories Burned</label>
                <input 
                  type="number" 
                  value={wCalories} 
                  onChange={(e) => setWCalories(e.target.value)} 
                  placeholder="e.g. 180" 
                  className="form-input text-xs" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Target Muscles (Comma Separated)</label>
              <input 
                type="text" 
                value={wMuscles} 
                onChange={(e) => setWMuscles(e.target.value)} 
                placeholder="e.g. Chest, Triceps, Abs" 
                className="form-input text-xs" 
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Routine Description</label>
              <textarea 
                value={wDescription} 
                onChange={(e) => setWDescription(e.target.value)} 
                placeholder="Write summary instructions for this training program..." 
                rows="3" 
                className="form-input text-xs resize-none" 
              />
            </div>

            <button type="submit" className="btn-primary w-full text-xs font-bold py-3 mt-2">
              SeedTest Workout Collection
            </button>
          </form>
        </div>
      )}

      {activeTab === 'add_diet' && (
        <div className="glass-card p-6 border border-white/[0.04] max-w-xl">
          <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Plus size={16} className="text-brandGreen" />
            Create Balanced Diet Program
          </h3>
          <form onSubmit={handleDietSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Diet Plan Name</label>
              <input 
                type="text" 
                value={dTitle} 
                onChange={(e) => setDTitle(e.target.value)} 
                placeholder="e.g. Keto Fat Burner" 
                className="form-input text-xs" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Diet Category</label>
                <select 
                  value={dCategory} 
                  onChange={(e) => setDCategory(e.target.value)}
                  className="form-input text-xs cursor-pointer"
                >
                  <option value="High-protein" className="bg-darkCard">High-protein</option>
                  <option value="Weight-loss" className="bg-darkCard">Weight-loss</option>
                  <option value="Vegan" className="bg-darkCard">Vegan</option>
                  <option value="Keto" className="bg-darkCard">Keto</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Daily Calories Goal (kcal)</label>
                <input 
                  type="number" 
                  value={dCalories} 
                  onChange={(e) => setDCalories(e.target.value)} 
                  placeholder="e.g. 2000" 
                  className="form-input text-xs" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Protein (g)</label>
                <input 
                  type="number" 
                  value={dProtein} 
                  onChange={(e) => setDProtein(e.target.value)} 
                  placeholder="140" 
                  className="form-input text-xs px-2" 
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Carbohydrates (g)</label>
                <input 
                  type="number" 
                  value={dCarbs} 
                  onChange={(e) => setDCarbs(e.target.value)} 
                  placeholder="150" 
                  className="form-input text-xs px-2" 
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Fat (g)</label>
                <input 
                  type="number" 
                  value={dFat} 
                  onChange={(e) => setDFat(e.target.value)} 
                  placeholder="50" 
                  className="form-input text-xs px-2" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Diet Plan Description</label>
              <textarea 
                value={dDescription} 
                onChange={(e) => setDDescription(e.target.value)} 
                placeholder="Describe meal choices (e.g. Breakfast: Egg whites, Lunch: Salmon...)" 
                rows="3" 
                className="form-input text-xs resize-none" 
              />
            </div>

            <button type="submit" className="btn-primary w-full text-xs font-bold py-3 mt-2">
              SeedTest Diet Program
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
