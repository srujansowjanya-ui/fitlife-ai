import React, { useContext, useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  Scale, 
  Flame, 
  Droplet, 
  Moon, 
  Activity, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FitnessContext } from '../context/FitnessContext';

export default function ProgressAnalytics() {
  const { user } = useContext(AuthContext);
  const { 
    dailyProgress, 
    progressHistory, 
    logProgress, 
    aiRecommendations 
  } = useContext(FitnessContext);

  const [weight, setWeight] = useState('');
  const [sleep, setSleep] = useState('');
  const [water, setWater] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [caloriesConsumed, setCaloriesConsumed] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const targets = aiRecommendations?.dailyTargets || {
    water: 2500,
    sleep: 8,
    caloriesToBurn: 300,
    caloriesToConsume: 2000
  };

  // Safe fallback if history is empty
  const historyData = progressHistory && progressHistory.length > 0 
    ? progressHistory 
    : [
        { dayName: 'Mon', weight: 72.4, waterIntake: 1800, sleepDuration: 6.8, caloriesBurned: 150, caloriesConsumed: 1800 },
        { dayName: 'Tue', weight: 72.2, waterIntake: 2200, sleepDuration: 7.2, caloriesBurned: 280, caloriesConsumed: 1950 },
        { dayName: 'Wed', weight: 72.3, waterIntake: 2500, sleepDuration: 8.0, caloriesBurned: 350, caloriesConsumed: 1700 },
        { dayName: 'Thu', weight: 72.1, waterIntake: 2100, sleepDuration: 7.5, caloriesBurned: 200, caloriesConsumed: 2100 },
        { dayName: 'Fri', weight: 71.9, waterIntake: 2600, sleepDuration: 6.5, caloriesBurned: 400, caloriesConsumed: 1650 },
        { dayName: 'Sat', weight: 71.8, waterIntake: 2000, sleepDuration: 7.0, caloriesBurned: 180, caloriesConsumed: 2200 },
        { dayName: 'Sun', weight: 71.6, waterIntake: 2800, sleepDuration: 8.2, caloriesBurned: 450, caloriesConsumed: 1850 }
      ];

  const handleLogProgress = async (e) => {
    e.preventDefault();
    const updates = {};
    if (weight) updates.weight = parseFloat(weight);
    if (sleep) updates.sleepDuration = parseFloat(sleep);
    if (water) updates.waterIntake = parseInt(water);
    if (caloriesBurned) updates.caloriesBurned = parseInt(caloriesBurned);
    if (caloriesConsumed) updates.caloriesConsumed = parseInt(caloriesConsumed);

    if (Object.keys(updates).length === 0) return;

    const success = await logProgress(updates);
    if (success) {
      setSuccessMsg('Telemetry logged successfully!');
      setWeight('');
      setSleep('');
      setWater('');
      setCaloriesBurned('');
      setCaloriesConsumed('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Compute stats metrics
  const avgSleep = historyData.length > 0
    ? (historyData.reduce((acc, curr) => acc + (curr.sleepDuration || 0), 0) / historyData.length).toFixed(1)
    : 0;

  const totalBurned = historyData.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  const avgWater = historyData.length > 0
    ? Math.round(historyData.reduce((acc, curr) => acc + (curr.waterIntake || 0), 0) / historyData.length)
    : 0;

  const latestWeight = dailyProgress?.weight || (historyData[historyData.length - 1]?.weight) || user?.weight || 70;
  const initialWeight = user?.weight || 70;
  const weightDiff = (latestWeight - initialWeight).toFixed(1);

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Progress & Analytics</h2>
          <p className="text-xs text-gray-400 mt-1">Visualize your consistency, weight telemetry, and wellness stats over time.</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-300 font-semibold">
          <Calendar size={14} className="text-brandGreen" />
          <span>Last 7 entries</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-4">
          <div className="p-3 bg-brandGreen/10 rounded-xl">
            <Scale size={20} className="text-brandGreen" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Current Weight</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-white">{latestWeight} kg</span>
              <span className={`text-[10px] font-bold ${parseFloat(weightDiff) <= 0 ? 'text-brandGreen' : 'text-brandCoral'}`}>
                {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Droplet size={20} className="text-blue-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Avg Hydration</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-white">{avgWater} ml</span>
              <span className="text-[10px] text-gray-500 font-semibold">/ day</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-4">
          <div className="p-3 bg-brandIndigo/10 rounded-xl">
            <Moon size={20} className="text-brandIndigo-light" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Avg Sleep</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-white">{avgSleep} hrs</span>
              <span className="text-[10px] text-gray-500 font-semibold">/ target {targets.sleep}h</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 border border-white/[0.04] flex items-center gap-4">
          <div className="p-3 bg-brandCoral/10 rounded-xl">
            <Flame size={20} className="text-brandCoral" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Energy Expelled</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-white">{totalBurned} kcal</span>
              <span className="text-[10px] text-gray-500 font-semibold">this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts Dashboard */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Weight telemetry trend */}
          <div className="glass-card p-5 border border-white/[0.04] glow-indigo-hover">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-brandIndigo" />
              Weight Log Trend (kg)
            </h3>
            <div className="h-[220px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="dayName" stroke="#94a3b860" tickLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b860" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    labelClassName="font-bold text-gray-300"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="url(#weightGradient)" 
                    strokeWidth={3} 
                    dot={{ fill: '#818cf8', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Calorie Intake vs Expelled */}
          <div className="glass-card p-5 border border-white/[0.04] glow-green-hover">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Activity size={16} className="text-brandGreen" />
              Energy Distribution: Consumed vs Burned (kcal)
            </h3>
            <div className="h-[220px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="dayName" stroke="#94a3b860" tickLine={false} />
                  <YAxis stroke="#94a3b860" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="caloriesConsumed" name="Consumed" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="caloriesBurned" name="Burned" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Intake vs Target */}
          <div className="glass-card p-5 border border-white/[0.04] hover:border-blue-500/20 transition-all">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Droplet size={16} className="text-blue-400" />
              Water Hydration Consistency (ml)
            </h3>
            <div className="h-[220px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="dayName" stroke="#94a3b860" tickLine={false} />
                  <YAxis stroke="#94a3b860" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="waterIntake" 
                    name="Intake"
                    stroke="#60a5fa" 
                    fillOpacity={1} 
                    fill="url(#waterFill)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Logger form & Goal tracking */}
        <div className="flex flex-col gap-6">
          {/* Daily Tracker Form */}
          <div className="glass-card p-6 border border-white/[0.04] bg-gradient-to-b from-[#151c2c] to-[#0c1322]">
            <h3 className="text-base font-extrabold text-white mb-2 flex items-center gap-2">
              <Plus size={18} className="text-brandGreen" />
              Log Daily Metrics
            </h3>
            <p className="text-[11px] text-gray-400 mb-4 leading-normal">
              Keep your health logs updated. Data automatically syncs with AI recommendations.
            </p>

            {successMsg && (
              <div className="bg-brandGreen/10 border border-brandGreen/20 text-brandGreen text-xs p-3 rounded-xl mb-4 font-bold">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleLogProgress} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 71.5"
                  className="form-input text-xs" 
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Sleep Duration (hours)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                  placeholder="e.g. 7.5"
                  className="form-input text-xs" 
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Water Hydration (ml)</label>
                <input 
                  type="number" 
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  placeholder="e.g. 500"
                  className="form-input text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Calories Burned (kcal)</label>
                  <input 
                    type="number" 
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                    placeholder="e.g. 200"
                    className="form-input text-xs px-2" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1.5">Calories Eaten (kcal)</label>
                  <input 
                    type="number" 
                    value={caloriesConsumed}
                    onChange={(e) => setCaloriesConsumed(e.target.value)}
                    placeholder="e.g. 1850"
                    className="form-input text-xs px-2" 
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full text-xs font-bold py-3 mt-2">
                Submit Telemetry Logs
              </button>
            </form>
          </div>

          {/* Goal Checklist Widget */}
          <div className="glass-card p-6 border border-white/[0.04]">
            <h4 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-400" />
              Target Achievements
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <div className="mt-0.5 rounded-full bg-blue-500/10 p-1">
                  <Droplet size={14} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Hydration Target</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Drink {targets.water}ml daily. Consistency builds metabolism health.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <div className="mt-0.5 rounded-full bg-indigo-500/10 p-1">
                  <Moon size={14} className="text-brandIndigo-light" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Sleep Recovery</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Sleep {targets.sleep} hrs to aid muscle tissue repair and cognitive health.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                <div className="mt-0.5 rounded-full bg-brandCoral/10 p-1">
                  <Flame size={14} className="text-brandCoral" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Caloric Deficit/Surplus</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Burn {targets.caloriesToBurn} kcal vs consuming {targets.caloriesToConsume} kcal based on BMI parameters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
