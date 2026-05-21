import React, { useState, useContext } from 'react';
import { Calculator, ArrowRight, HeartPulse } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function BMICalculator() {
  const { user, updateProfile } = useContext(AuthContext);
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [bmi, setBmi] = useState(user?.bmi || null);
  const [category, setCategory] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const calculateBmi = (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const heightInMeters = Number(height) / 100;
    const computedBmi = Number(weight) / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(computedBmi * 10) / 10;
    setBmi(roundedBmi);

    let cat = '';
    let advice = '';

    if (roundedBmi < 18.5) {
      cat = 'Underweight';
      advice = 'Focus on high-quality nutrition and progressive resistance training. Consider a slight calorie surplus.';
    } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
      cat = 'Healthy weight';
      advice = 'Fantastic! You are in the optimal health zone. Keep up your balanced diet and workout consistency.';
    } else if (roundedBmi >= 25 && roundedBmi < 30) {
      cat = 'Overweight';
      advice = 'Prioritize cardio conditioning and clean eating. A minor deficit will help you reach the healthy zone.';
    } else {
      cat = 'Obese';
      advice = 'Focus on low-impact exercise (walking, swimming) to protect joints, and consult a nutritionist to plan a safe caloric deficit.';
    }

    setCategory(cat);
    setMsg(advice);
  };

  const handleSaveToProfile = async () => {
    if (!bmi) return;
    setSaving(true);
    const success = await updateProfile({
      height: Number(height),
      weight: Number(weight)
    });
    setSaving(false);
    if (success) {
      alert('Metrics successfully saved to your profile!');
    }
  };

  // Determine indicator position on gauge
  // Underweight: <18.5 (mapped 0% to 25%)
  // Normal: 18.5 - 24.9 (mapped 25% to 50%)
  // Overweight: 25.0 - 29.9 (mapped 50% to 75%)
  // Obese: >=30 (mapped 75% to 100%)
  const getGaugePercentage = () => {
    if (!bmi) return 0;
    if (bmi < 15) return 5;
    if (bmi > 40) return 95;
    
    if (bmi < 18.5) {
      // Scale 15-18.5 between 5% and 25%
      return 5 + ((bmi - 15) / 3.5) * 20;
    } else if (bmi < 25) {
      // Scale 18.5-25 between 25% and 50%
      return 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
      // Scale 25-30 between 50% and 75%
      return 50 + ((bmi - 25) / 5) * 25;
    } else {
      // Scale 30-40 between 75% and 95%
      return 75 + ((bmi - 30) / 10) * 20;
    }
  };

  const gaugePercent = getGaugePercentage();

  return (
    <div className="glass-card p-6 border border-white/[0.04]">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="text-brandGreen" size={20} />
        <h3 className="text-lg font-bold text-gray-200">BMI Calculator</h3>
      </div>

      <form onSubmit={calculateBmi} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Height (cm)</label>
          <input 
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 175"
            required
            className="form-input text-sm py-2 px-3 bg-slate-900/40"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Weight (kg)</label>
          <input 
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 70"
            required
            className="form-input text-sm py-2 px-3 bg-slate-900/40"
          />
        </div>
        <div className="sm:col-span-2">
          <button 
            type="submit"
            className="btn-primary w-full py-2.5 text-sm"
          >
            Calculate BMI <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {bmi && (
        <div className="border-t border-white/[0.08] pt-6 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-gray-400 font-semibold block">Computed BMI</span>
              <span className="text-3xl font-extrabold text-white">{bmi}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-semibold block">Category</span>
              <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                category === 'Healthy weight' ? 'bg-brandGreen/10 text-brandGreen' : 
                category === 'Overweight' ? 'bg-amber-500/10 text-amber-400' :
                category === 'Obese' ? 'bg-brandCoral/10 text-brandCoral' : 'bg-brandIndigo/10 text-brandIndigo-light'
              }`}>
                {category}
              </span>
            </div>
          </div>

          {/* GAUGE GRAPH */}
          <div className="w-full relative mt-3">
            <div className="h-2.5 w-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full" />
            <div 
              className="absolute -top-1.5 w-4.5 h-4.5 bg-white border-2 border-darkCard rounded-full shadow-md transition-all duration-500"
              style={{ left: `calc(${gaugePercent}% - 9px)` }}
            />
            <div className="flex justify-between text-[9px] text-gray-500 mt-1.5 font-bold">
              <span>Underweight</span>
              <span>Healthy</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.04] p-3.5 rounded-xl flex items-start gap-2.5 mt-2">
            <HeartPulse className="text-brandGreen shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-gray-300 leading-relaxed font-medium">{msg}</p>
          </div>

          {user && (
            <button 
              onClick={handleSaveToProfile}
              disabled={saving}
              className="w-full btn-secondary py-2 text-xs"
            >
              {saving ? 'Saving...' : 'Sync metrics to profile'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
