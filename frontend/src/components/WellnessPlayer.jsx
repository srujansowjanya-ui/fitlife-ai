import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind, Sparkles, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WellnessPlayer() {
  const [activeTab, setActiveTab] = useState('breathing'); // breathing, meditation
  
  // Box Breathing States
  const [breathPhase, setBreathPhase] = useState('Idle'); // Inhale, Hold In, Exhale, Hold Out
  const [breathCounter, setBreathCounter] = useState(4);
  const [breathingActive, setBreathingActive] = useState(false);

  // Meditation States
  const [medTimeLeft, setMedTimeLeft] = useState(300); // 5 mins in seconds
  const [medActive, setMedActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState('Zen Bell');

  // Box Breathing Loop
  useEffect(() => {
    let interval = null;
    if (breathingActive) {
      if (breathPhase === 'Idle') {
        setBreathPhase('Inhale');
        setBreathCounter(4);
      }
      
      interval = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            // Transition phase
            setBreathPhase((currPhase) => {
              switch (currPhase) {
                case 'Inhale': return 'Hold In';
                case 'Hold In': return 'Exhale';
                case 'Exhale': return 'Hold Out';
                case 'Hold Out': return 'Inhale';
                default: return 'Inhale';
              }
            });
            return 4; // Reset to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setBreathPhase('Idle');
      setBreathCounter(4);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  // Guided Meditation Timer
  useEffect(() => {
    let timer = null;
    if (medActive && medTimeLeft > 0) {
      timer = setInterval(() => {
        setMedTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (medTimeLeft === 0) {
      setMedActive(false);
      alert('🧘‍♂️ Meditation session complete. Namaste.');
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [medActive, medTimeLeft]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Determine breathing circle scale based on phase
  const getCircleScale = () => {
    switch (breathPhase) {
      case 'Inhale': return 1.5;
      case 'Hold In': return 1.5;
      case 'Exhale': return 1.0;
      case 'Hold Out': return 1.0;
      default: return 1.0;
    }
  };

  const getBreathColor = () => {
    switch (breathPhase) {
      case 'Inhale': return 'bg-brandGreen border-brandGreen shadow-glowGreen';
      case 'Hold In': return 'bg-brandIndigo border-brandIndigo shadow-glowIndigo';
      case 'Exhale': return 'bg-brandCoral border-brandCoral';
      case 'Hold Out': return 'bg-slate-700 border-slate-600';
      default: return 'bg-brandGreen/20 border-brandGreen/40';
    }
  };

  return (
    <div className="glass-card p-6 border border-white/[0.04]">
      {/* Tab select */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
        <button
          onClick={() => {
            setActiveTab('breathing');
            setMedActive(false);
          }}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'breathing' ? 'bg-brandGreen text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Box Breathing
        </button>
        <button
          onClick={() => {
            setActiveTab('meditation');
            setBreathingActive(false);
          }}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'meditation' ? 'bg-brandGreen text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Guided Meditation
        </button>
      </div>

      {/* BOX BREATHING TAB */}
      {activeTab === 'breathing' && (
        <div className="flex flex-col items-center py-4">
          <div className="text-center mb-6">
            <h4 className="font-bold text-gray-200 text-sm flex items-center gap-1.5 justify-center">
              <Wind size={16} className="text-brandGreen animate-pulse" />
              Box Breathing Trainer
            </h4>
            <p className="text-[11px] text-gray-400 max-w-xs mt-1 leading-relaxed">
              Standard 4-4-4-4 rhythm helps balance the nervous system, reduce cortisol, and relieve immediate stress.
            </p>
          </div>

          {/* Animating Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center my-6">
            <div className="absolute inset-0 rounded-full border border-white/[0.05]" />
            <div className="absolute w-36 h-36 rounded-full border border-white/[0.03]" />
            
            {/* Pulsing visual bubble */}
            <div 
              className={`w-28 h-28 rounded-full border transition-all duration-[4000ms] ease-in-out flex flex-col items-center justify-center ${getBreathColor()}`}
              style={{ transform: `scale(${getCircleScale()})` }}
            >
              {breathingActive ? (
                <>
                  <span className="text-white font-extrabold text-sm select-none uppercase tracking-widest">{breathPhase}</span>
                  <span className="text-white/80 font-bold text-xs select-none mt-0.5">{breathCounter}s</span>
                </>
              ) : (
                <Wind className="text-brandGreen-light animate-bounce" size={24} />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full mt-4">
            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
                breathingActive ? 'bg-brandCoral text-white' : 'bg-brandGreen text-white hover:bg-brandGreen-dark shadow-glowGreen'
              }`}
            >
              {breathingActive ? 'Pause breathing guide' : 'Start breathing guide'}
            </button>

            {/* Instruction Banner */}
            <div className="text-center h-8">
              <AnimatePresence mode="wait">
                {breathingActive && (
                  <motion.div
                    key={breathPhase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-brandGreen-light font-semibold"
                  >
                    {breathPhase === 'Inhale' && 'Slowly fill your lungs with air...'}
                    {breathPhase === 'Hold In' && 'Hold the breath in your chest...'}
                    {breathPhase === 'Exhale' && 'Slowly release all the air out...'}
                    {breathPhase === 'Hold Out' && 'Hold your lungs completely empty...'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* MEDITATION TAB */}
      {activeTab === 'meditation' && (
        <div className="flex flex-col items-center py-4">
          <div className="text-center mb-6">
            <h4 className="font-bold text-gray-200 text-sm flex items-center gap-1.5 justify-center">
              <Sparkles size={16} className="text-brandGreen animate-pulse" />
              Mindfulness Meditation Timer
            </h4>
            <p className="text-[11px] text-gray-400 max-w-xs mt-1 leading-relaxed">
              Quiet your mind, reduce cognitive fatigue, and enhance workout consistency through mental recovery.
            </p>
          </div>

          {/* Ambient selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/[0.06] rounded-xl px-3 py-1.5 mb-6 text-xs text-gray-300 w-full justify-between">
            <span className="flex items-center gap-1.5 text-gray-400 font-semibold">
              <Volume2 size={14} /> Soundscape
            </span>
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none text-xs cursor-pointer"
            >
              <option value="Zen Bell" className="bg-darkCard">Zen Bell</option>
              <option value="Rainforest" className="bg-darkCard">Rainforest</option>
              <option value="Ocean Waves" className="bg-darkCard">Ocean Waves</option>
              <option value="White Noise" className="bg-darkCard">White Noise</option>
            </select>
          </div>

          {/* Time Display */}
          <div className="text-center my-4">
            <div className="text-5xl font-extrabold text-white tracking-widest font-mono">
              {formatTime(medTimeLeft)}
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase mt-2 block tracking-wider">
              {medActive ? 'Resting in mindfulness' : 'Ready to begin'}
            </span>
          </div>

          {/* Speed settings dial */}
          <div className="flex gap-2.5 my-4">
            {[300, 600, 900].map((time) => (
              <button
                key={time}
                onClick={() => {
                  setMedTimeLeft(time);
                  setMedActive(false);
                }}
                disabled={medActive}
                className={`px-3 py-1 border rounded-lg text-xs font-semibold ${
                  medTimeLeft === time 
                    ? 'border-brandGreen text-brandGreen bg-brandGreen/5'
                    : 'border-white/10 text-gray-400 hover:text-white'
                } disabled:opacity-50`}
              >
                {time / 60}m
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={() => setMedActive(!medActive)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-white ${
                medActive ? 'bg-brandCoral hover:bg-brandCoral-dark' : 'bg-brandGreen hover:bg-brandGreen-dark shadow-glowGreen'
              }`}
            >
              {medActive ? (
                <>
                  <Pause size={14} /> Pause Session
                </>
              ) : (
                <>
                  <Play size={14} /> Start Session
                </>
              )}
            </button>
            <button
              onClick={() => {
                setMedActive(false);
                setMedTimeLeft(300);
              }}
              className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors text-gray-300 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
