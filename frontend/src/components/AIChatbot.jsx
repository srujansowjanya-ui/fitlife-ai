import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, X, Send, Bot, User, Mic, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FitnessContext } from '../context/FitnessContext';

export default function AIChatbot() {
  const { token } = useContext(AuthContext);
  const { logProgress } = useContext(FitnessContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! I am your AI Wellness Coach. Ask me anything about weight loss, bulking, hydration, recovery, or say a voice shortcut like "log 500ml water"!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceHint, setVoiceHint] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    if (!textToSend) setInputText('');

    // Add user message
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: msg }]);
    setIsTyping(true);

    // Trigger local NLP or api chat
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: msg })
      });
      const data = await response.json();
      
      setIsTyping(false);
      if (data.success) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.reply }]);
        
        // INTERCEPT VOICE COMMAND TELEMETRY ACTIONS
        // e.g. "log 500ml water"
        handleVoiceActions(msg);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'Sorry, I encountered an issue. Let me know if I can help with anything else!' }]);
      }
    } catch (err) {
      console.warn('Backend chat offline, generating local simulation reply...');
      // Local simulated response fallback
      setTimeout(() => {
        setIsTyping(false);
        const reply = simulateLocalReply(msg);
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
        handleVoiceActions(msg);
      }, 800);
    }
  };

  const handleVoiceActions = (msg) => {
    const lower = msg.toLowerCase();
    // 1. Water logger: "log 500ml water" or "log water 250ml"
    if (lower.includes('log') && (lower.includes('water') || lower.includes('ml'))) {
      const match = lower.match(/\d+/);
      const amount = match ? parseInt(match[0]) : 250;
      logProgress({ waterIntake: amount });
      
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: 'bot',
        text: `⚡ [System Action] Automatically logged ${amount}ml of water to your daily tracker! 💧`,
        isSystem: true
      }]);
    }
    
    // 2. Workout logger: "log workout strength" or "log cardio" or "complete cardio"
    if ((lower.includes('log') || lower.includes('complete')) && (lower.includes('workout') || lower.includes('cardio') || lower.includes('strength') || lower.includes('yoga'))) {
      let workoutTitle = 'Cardio Workout';
      if (lower.includes('strength')) workoutTitle = 'Strength Training';
      if (lower.includes('yoga')) workoutTitle = 'Yoga Session';
      
      logProgress({ workoutTitle, caloriesBurned: 150 });
      setMessages(prev => [...prev, {
        id: Date.now() + 3,
        sender: 'bot',
        text: `⚡ [System Action] Automatically marked "${workoutTitle}" complete and logged 150 calories burned! 🏋️‍♂️`,
        isSystem: true
      }]);
    }
  };

  const simulateLocalReply = (msg) => {
    const q = msg.toLowerCase();
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return 'Hello! I am your offline FitLife AI coach. How is your workout routine going today?';
    }
    if (q.includes('water') || q.includes('hydrate') || q.includes('drink')) {
      return 'Proper hydration is crucial! Try logging your water intake. A good target is 2.5L to 3L daily to keep your muscle recovery and energy levels high. You can say: "log 500ml water" and I will add it for you!';
    }
    if (q.includes('belly') || q.includes('fat') || q.includes('weight') || q.includes('lose')) {
      return 'To reduce fat, focus on a caloric deficit (consuming less than you burn) and perform a mix of strength training and cardio. Visit the "Nutrition" section to calculate your weight loss calories!';
    }
    if (q.includes('muscle') || q.includes('protein') || q.includes('bulk') || q.includes('gain')) {
      return 'Building muscle requires lifting weights with progressive overload and eating a caloric surplus with 1.6-2.2g of protein per kg of bodyweight. Try our "High-Protein Muscle Builder" meal plan!';
    }
    if (q.includes('stress') || q.includes('sleep') || q.includes('meditat')) {
      return 'Stress and sleep impact muscle recovery. Try the "Box Breathing" guide in the Wellness section, and avoid screens for 45 minutes before sleep to optimize melatonin!';
    }
    return `That's a helpful question! Remember that consistency is key. Keep logging your daily tasks, complete pre-built workouts under "Workouts", and stay hydrated. What specific information about nutrition or exercises can I clarify?`;
  };

  // Simulate Voice Command Activation
  const triggerVoiceSimulation = () => {
    if (voiceListening) return;
    setVoiceListening(true);
    setVoiceHint('Listening...');

    const commands = [
      'log 500ml water',
      'log workout strength',
      'how to build muscle'
    ];
    // Random command selection
    const chosenCmd = commands[Math.floor(Math.random() * commands.length)];

    setTimeout(() => {
      setVoiceHint(`Heard: "${chosenCmd}"`);
      setTimeout(() => {
        setVoiceListening(false);
        handleSend(chosenCmd);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] glass-card flex flex-col mb-4 overflow-hidden animate-float">
          {/* Header */}
          <div className="bg-gradient-to-r from-brandGreen to-brandIndigo p-4 flex items-center justify-between text-white border-b border-white/10 shadow-glowGreen">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-white animate-bounce" />
              <div>
                <span className="font-extrabold text-sm block leading-none">FitLife Coach</span>
                <span className="text-[10px] text-white/70 font-semibold flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active AI
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={triggerVoiceSimulation}
                className={`p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${
                  voiceListening ? 'text-red-400 animate-pulse bg-red-500/20' : 'text-white'
                }`}
                title="Simulate Voice Command"
              >
                <Mic size={15} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-2 max-w-[85%] ${
                  m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                  m.sender === 'user' 
                    ? 'bg-brandIndigo' 
                    : m.isSystem ? 'bg-amber-500' : 'bg-brandGreen'
                }`}>
                  {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed font-medium ${
                  m.sender === 'user' 
                    ? 'bg-brandIndigo/10 text-brandIndigo-light rounded-tr-none border border-brandIndigo/20' 
                    : m.isSystem 
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 self-start max-w-[80%] items-center text-xs text-gray-500">
                <div className="w-7 h-7 rounded-lg bg-brandGreen flex items-center justify-center text-white">
                  <Bot size={14} />
                </div>
                <span className="animate-pulse font-semibold">Coach is thinking...</span>
              </div>
            )}
            
            {voiceListening && (
              <div className="flex gap-2 self-end max-w-[80%] items-center text-xs text-red-400 font-semibold bg-red-500/5 border border-red-500/10 p-2 rounded-xl">
                <Mic size={12} className="animate-bounce" />
                <span>{voiceHint}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick buttons */}
          <div className="px-4 py-2 border-t border-white/[0.04] bg-white/[0.01] flex gap-1.5 overflow-x-auto whitespace-nowrap">
            <button 
              onClick={() => handleSend('How do I build muscle?')}
              className="text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors px-2 py-1 rounded-full text-gray-300"
            >
              💪 Build Muscle
            </button>
            <button 
              onClick={() => handleSend('How do I lose belly fat?')}
              className="text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors px-2 py-1 rounded-full text-gray-300"
            >
              🏃‍♂️ Lose Fat
            </button>
            <button 
              onClick={() => handleSend('What is box breathing?')}
              className="text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors px-2 py-1 rounded-full text-gray-300"
            >
              🧘‍♀️ Reduce Stress
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-white/[0.06] bg-slate-900/60 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question or log data..."
              className="form-input text-xs py-2 px-3 focus:border-brandGreen"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl shadow-glowGreen transition-colors flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-brandGreen to-brandIndigo text-white rounded-full flex items-center justify-center shadow-xl shadow-brandGreen/20 hover:scale-105 active:scale-95 transition-all duration-300 relative border border-white/[0.08]"
      >
        <MessageSquare size={24} />
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-brandCoral rounded-full ring-2 ring-darkBg border border-white animate-ping" />
        )}
      </button>
    </div>
  );
}
