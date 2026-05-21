import React, { useState, useContext } from 'react';
import { Sparkles, Heart, Brain, Moon, Smile, Meh, Frown, HelpCircle, CheckCircle } from 'lucide-react';
import WellnessPlayer from '../components/WellnessPlayer';
import { AuthContext } from '../context/AuthContext';

export default function MentalWellness() {
  const { addXp } = useContext(AuthContext);
  const [selectedMood, setSelectedMood] = useState(null);
  const [loggedMood, setLoggedMood] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalLogged, setJournalLogged] = useState(false);

  const moodList = [
    { emoji: '🧘‍♂️', label: 'Zen/Calm', color: 'border-brandGreen bg-brandGreen/5 text-brandGreen' },
    { emoji: '😃', label: 'Energetic', color: 'border-amber-400 bg-amber-400/5 text-amber-400' },
    { emoji: '😐', label: 'Neutral', color: 'border-blue-400 bg-blue-400/5 text-blue-400' },
    { emoji: '😔', label: 'Tired/Low', color: 'border-indigo-400 bg-indigo-400/5 text-indigo-400' },
    { emoji: '😫', label: 'Stressed', color: 'border-brandCoral bg-brandCoral/5 text-brandCoral' }
  ];

  const handleMoodLog = (mood) => {
    setSelectedMood(mood);
    setLoggedMood(true);
    addXp(15, `Logged daily mood: ${mood.label}`);
    setTimeout(() => {
      // notification simulated
    }, 1000);
  };

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    setJournalLogged(true);
    addXp(25, 'Mindfulness journaling completed');
    setJournalText('');
  };

  const tips = [
    { title: 'The 20-20-20 Rule', desc: 'Every 20 minutes spent looking at a screen, look at something 20 feet away for 20 seconds to lower visual strain and stress.', category: 'Focus' },
    { title: 'Sleep Hygiene', desc: 'Avoid bright blue screens 1 hour before bed. Cooler bedroom temperatures (18-20°C) encourage deeper sleep cycles.', category: 'Sleep' },
    { title: 'Vagus Nerve Reset', desc: 'Splash cold water on your face or hum gently. This stimulates the vagus nerve and activates the parasympathetic nervous system.', category: 'Anxiety' }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Mental Wellness & Recovery</h2>
        <p className="text-xs text-gray-400 mt-1">A healthy body requires a peaceful mind. Track your state of mind and practice breathing exercises.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Player and Journaling */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Wellness Player Widget */}
          <WellnessPlayer />

          {/* Daily Mindfulness Journaling */}
          <div className="glass-card p-6 border border-white/[0.04] bg-gradient-to-r from-[#151c2c] to-[#0c1322] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-2">
              <Brain size={16} className="text-brandIndigo-light" />
              Daily Gratitude Journal
            </h3>
            <p className="text-[11px] text-gray-400 mb-4 leading-normal">
              Writing down three things you are grateful for lowers blood pressure, reduces stress, and reinforces positive habit building.
            </p>

            {journalLogged ? (
              <div className="bg-brandGreen/10 border border-brandGreen/20 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle size={20} className="text-brandGreen shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Gratitude Journaled! (+25 XP)</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Your reflection has been logged. Keep up the amazing work!</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleJournalSubmit} className="flex flex-col gap-3">
                <textarea
                  rows="3"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="Write down what you are grateful for today, or anything on your mind..."
                  className="form-input text-xs resize-none"
                />
                <button type="submit" className="btn-primary py-2.5 text-xs font-bold self-end px-6">
                  Save Reflection
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Mood Tracker and Tips */}
        <div className="flex flex-col gap-6">
          
          {/* Mood tracker widget */}
          <div className="glass-card p-6 border border-white/[0.04]">
            <h3 className="text-sm font-bold text-gray-200 mb-1 flex items-center gap-2">
              <Smile size={16} className="text-amber-400" />
              Daily Mood Check-in
            </h3>
            <span className="text-[10px] text-gray-400 font-bold block mb-4 uppercase tracking-wider">Earn +15 XP</span>

            {loggedMood ? (
              <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl text-center">
                <div className="text-4xl mb-2">{selectedMood?.emoji}</div>
                <span className="text-xs font-bold text-white block">Logged: {selectedMood?.label}</span>
                <p className="text-[10px] text-brandGreen font-bold mt-1">+15 XP Logged</p>
                <button 
                  onClick={() => setLoggedMood(false)}
                  className="text-[9px] text-gray-500 hover:text-white mt-4 underline focus:outline-none"
                >
                  Change mood entry
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {moodList.map((mood, idx) => (
                  <button
                    key={`mood_${idx}`}
                    onClick={() => handleMoodLog(mood)}
                    className="w-full flex items-center gap-3 p-3 bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.04] rounded-xl transition-all duration-200 group text-left"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
                    <span className="text-xs font-bold text-gray-300">{mood.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stress management advice card */}
          <div className="glass-card p-6 border border-white/[0.04]">
            <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Heart size={16} className="text-brandCoral" />
              Health Tips of the Day
            </h3>
            <div className="flex flex-col gap-4">
              {tips.map((tip, idx) => (
                <div key={`tip_${idx}`} className="border-b border-white/[0.05] last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold text-white">{tip.title}</h4>
                    <span className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-bold uppercase text-gray-400">
                      {tip.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
