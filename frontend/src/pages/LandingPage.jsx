import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Shield, Sparkles, HeartPulse, Flame, Target, Award, ArrowRight, Star, Users, Brain, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-20 text-center">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brandGreen/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-brandIndigo/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 text-xs text-brandGreen-light font-bold"
          >
            <Sparkles size={14} className="text-brandGreen animate-spin" />
            <span>AI-Powered Wellness Ecosystem</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
          >
            Transform Your Body, <br />
            Guided by <span className="bg-gradient-to-r from-brandGreen via-emerald-400 to-brandIndigo bg-clip-text text-transparent">FitLife AI</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-medium"
          >
            Track your workouts, log nutrition, customize diets, monitor mental health, and unlock real-time recommendations driven by advanced fitness metrics.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
          >
            <Link to="/auth?signup=true" className="btn-primary py-3.5 px-8 text-sm font-bold">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link to="/auth" className="btn-secondary py-3.5 px-8 text-sm font-bold">
              Explore Dashboard
            </Link>
          </motion.div>

          {/* Metrics ticker */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-16 w-full max-w-3xl py-6 border-y border-white/[0.06]"
          >
            <div>
              <span className="text-3xl font-extrabold text-white block">20K+</span>
              <span className="text-xs text-gray-500 font-semibold uppercase mt-1">Active Athletes</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white block">500+</span>
              <span className="text-xs text-gray-500 font-semibold uppercase mt-1">Exercises</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white block">1.2M+</span>
              <span className="text-xs text-gray-500 font-semibold uppercase mt-1">Calories Burned</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white block">98%</span>
              <span className="text-xs text-gray-500 font-semibold uppercase mt-1">Goal Success</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-24 px-6 bg-[#0c1220]/50 border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Full-Stack Ecosystem Features</h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Every tool you need to track biological metrics, establish active consistency, and achieve health milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 border border-white/[0.04] glow-green-hover">
              <div className="w-12 h-12 rounded-xl bg-brandGreen/10 border border-brandGreen/20 flex items-center justify-center text-brandGreen mb-6">
                <Dumbbell size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">Workout Management</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Browse our curated pre-built libraries, filter by difficulty/muscle groups, or design custom templates with target multipliers.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/[0.04] glow-indigo-hover">
              <div className="w-12 h-12 rounded-xl bg-brandIndigo/10 border border-brandIndigo/20 flex items-center justify-center text-brandIndigo mb-6">
                <Brain size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">AI Recommendation Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive dynamically computed workout split suggestions, diet plans, and daily target modifications tailored directly to your BMI and activity levels.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/[0.04] glow-green-hover">
              <div className="w-12 h-12 rounded-xl bg-brandGreen/10 border border-brandGreen/20 flex items-center justify-center text-brandGreen mb-6">
                <Flame size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">Diet & Nutrition Module</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Track water consumption, evaluate meal plans (Vegan, High-Protein), and calculate BMR macro splits using Mifflin-St Jeor formulas.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/[0.04] glow-indigo-hover">
              <div className="w-12 h-12 rounded-xl bg-brandIndigo/10 border border-brandIndigo/20 flex items-center justify-center text-brandIndigo mb-6">
                <HeartPulse size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">Mental Wellness</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Achieve psychological equilibrium using guided meditation audio players and our interactive visual box breathing trainer.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/[0.04] glow-green-hover">
              <div className="w-12 h-12 rounded-xl bg-brandGreen/10 border border-brandGreen/20 flex items-center justify-center text-brandGreen mb-6">
                <Award size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">Gamified Milestones</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Complete daily hydration targets, sleep ranges, and workout completions to earn experience points, rank up levels, and win trophy badges.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/[0.04] glow-indigo-hover">
              <div className="w-12 h-12 rounded-xl bg-brandIndigo/10 border border-brandIndigo/20 flex items-center justify-center text-brandIndigo mb-6">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">Community Challenges</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Engage in shared community boards. Upload progress updates, like and comment on social feeds, and join water/sleep challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Simple, Premium Pricing</h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Start with our free core ecosystem or unlock advanced AI personal coaching features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card p-8 border border-white/[0.04] relative flex flex-col justify-between">
              <div>
                <span className="text-xs text-brandGreen-light font-bold bg-brandGreen/10 px-3 py-1 rounded-full">Core</span>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-gray-500 font-semibold"> / Forever</span>
                </div>
                <h4 className="font-bold text-gray-200 mb-4">Core Ecosystem Access</h4>
                <ul className="flex flex-col gap-3 text-xs text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> Log water, sleep, and workouts daily
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> Prebuilt exercise libraries & categories
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> BMI calculator & history charts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> Standard community challenge board
                  </li>
                </ul>
              </div>
              <Link to="/auth?signup=true" className="w-full btn-secondary text-xs font-bold mt-8">
                Create Free Account
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="glass-card p-8 border-2 border-brandGreen bg-slate-900/50 relative flex flex-col justify-between shadow-glowGreen">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brandGreen text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <span className="text-xs text-brandIndigo-light font-bold bg-brandIndigo/10 px-3 py-1 rounded-full">AI Premium</span>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$9.99</span>
                  <span className="text-xs text-gray-500 font-semibold"> / month</span>
                </div>
                <h4 className="font-bold text-gray-200 mb-4">AI Personal Coach</h4>
                <ul className="flex flex-col gap-3 text-xs text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> **All Core features included**
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> Personalized workout & diet plans generated by AI
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> Interactive floating AI Assistant Chatbot
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> Advanced Recharts analytics (macro tracking breakdowns)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-brandGreen" /> Voice commands simulator activation
                  </li>
                </ul>
              </div>
              <Link to="/auth?signup=true" className="w-full btn-primary text-xs font-bold mt-8">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080b12] border-t border-white/[0.04] py-12 px-6 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brandGreen to-brandIndigo flex items-center justify-center text-white font-extrabold text-sm">
              FL
            </div>
            <span className="font-bold text-gray-300">FitLife AI Inc.</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support Contact</a>
          </div>
          <div>
            © 2026 FitLife AI. Engineered for Peak Performance.
          </div>
        </div>
      </footer>
    </div>
  );
}
