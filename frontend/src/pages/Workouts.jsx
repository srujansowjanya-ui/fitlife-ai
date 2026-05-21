import React, { useContext, useState } from 'react';
import { Dumbbell, Search, Filter, Play, CheckCircle, Clock, Flame, ChevronRight, Plus, Eye, X } from 'lucide-react';
import { FitnessContext } from '../context/FitnessContext';
import { AuthContext } from '../context/AuthContext';

export default function Workouts() {
  const { user } = useContext(AuthContext);
  const { 
    workouts, 
    exercises, 
    createCustomWorkout, 
    logProgress 
  } = useContext(FitnessContext);

  // Search & Filter States
  const [workoutTab, setWorkoutTab] = useState('prebuilt'); // prebuilt, exercises, custom
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Custom Workout Form States
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Home workouts');
  const [customDifficulty, setCustomDifficulty] = useState('Beginner');
  const [customDuration, setCustomDuration] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customSelectedEx, setCustomSelectedEx] = useState([]);
  const [customDesc, setCustomDesc] = useState('');

  // Selected Workout Details Modal
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Mark prebuilt workout complete
  const handleMarkComplete = (workout) => {
    logProgress({
      workoutTitle: workout.title,
      caloriesBurned: workout.caloriesBurned
    });
    alert(`🎉 Workout Completed! Logged "${workout.title}" and earned 80 XP!`);
    setSelectedWorkout(null);
  };

  // Create custom workout
  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customTitle || !customDuration || !customCalories) return;

    createCustomWorkout({
      title: customTitle,
      category: customCategory,
      difficulty: customDifficulty,
      duration: Number(customDuration),
      caloriesBurned: Number(customCalories),
      exercises: customSelectedEx,
      description: customDesc
    });

    // Reset states
    setCustomTitle('');
    setCustomDuration('');
    setCustomCalories('');
    setCustomSelectedEx([]);
    setCustomDesc('');
    setShowCustomModal(false);
    alert('Custom workout template successfully saved to library!');
  };

  const handleExToggle = (exId) => {
    if (customSelectedEx.includes(exId)) {
      setCustomSelectedEx(prev => prev.filter(id => id !== exId));
    } else {
      setCustomSelectedEx(prev => [...prev, exId]);
    }
  };

  // Filters logic for prebuilt workouts
  const filteredWorkouts = workouts.filter(w => {
    const titleMatch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = w.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    const matchesDifficulty = !difficultyFilter || w.difficulty === difficultyFilter;
    const matchesCategory = !categoryFilter || w.category === categoryFilter;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Filters logic for exercises
  const filteredExercises = exercises.filter(ex => {
    const nameMatch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const instrMatch = ex.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || instrMatch;
    const matchesDifficulty = !difficultyFilter || ex.difficulty === difficultyFilter;
    const matchesCategory = !categoryFilter || ex.category.includes(categoryFilter) || ex.targetMuscles.some(m => m.includes(categoryFilter));
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Workout Ecosystem</h2>
          <p className="text-xs text-gray-400 mt-1">
            Browse our workout collections or create your own custom physical training routine templates.
          </p>
        </div>
        <button
          onClick={() => setShowCustomModal(true)}
          className="btn-primary py-2.5 px-5 text-xs font-bold shrink-0 self-start"
        >
          Create Custom Workout <Plus size={15} />
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-white/[0.06] gap-6 text-sm font-semibold">
        <button
          onClick={() => { setWorkoutTab('prebuilt'); setSearchQuery(''); }}
          className={`pb-3 transition-colors relative ${
            workoutTab === 'prebuilt' ? 'text-brandGreen' : 'text-gray-400 hover:text-white'
          }`}
        >
          Workout Routines
          {workoutTab === 'prebuilt' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brandGreen rounded-full" />}
        </button>
        <button
          onClick={() => { setWorkoutTab('exercises'); setSearchQuery(''); }}
          className={`pb-3 transition-colors relative ${
            workoutTab === 'exercises' ? 'text-brandGreen' : 'text-gray-400 hover:text-white'
          }`}
        >
          Exercise Library
          {workoutTab === 'exercises' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brandGreen rounded-full" />}
        </button>
      </div>

      {/* FILTER OPTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={workoutTab === 'prebuilt' ? "Search workout routines..." : "Search exercises..."}
            className="form-input text-xs pl-10 py-2.5"
          />
        </div>

        <div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="form-input text-xs py-2.5"
          >
            <option value="">All Difficulty Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input text-xs py-2.5"
          >
            <option value="">All Categories</option>
            <option value="Home workouts">Home workouts</option>
            <option value="Strength training">Strength training</option>
            <option value="Cardio">Cardio</option>
            <option value="HIIT">HIIT</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>
      </div>

      {/* ROUTINES LIST TAB */}
      {workoutTab === 'prebuilt' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkouts.map((w) => (
            <div 
              key={w._id}
              className="glass-card overflow-hidden border border-white/[0.04] flex flex-col sm:flex-row"
            >
              <img 
                src={w.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80'} 
                alt={w.title}
                className="w-full sm:w-44 h-44 object-cover"
              />
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brandGreen-light bg-brandGreen/10 border border-brandGreen/20 px-2 py-0.5 rounded">
                      {w.category}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brandIndigo-light bg-brandIndigo/10 border border-brandIndigo/20 px-2 py-0.5 rounded">
                      {w.difficulty}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-200 mt-1">{w.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-snug truncate-3-lines">{w.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5 mt-4">
                  <div className="flex gap-4 text-[10px] text-gray-500 font-bold">
                    <span className="flex items-center gap-1"><Clock size={12} /> {w.duration}m</span>
                    <span className="flex items-center gap-1 text-brandCoral-light"><Flame size={12} /> {w.caloriesBurned} kcal</span>
                  </div>
                  
                  <button
                    onClick={() => setSelectedWorkout(w)}
                    className="text-[10px] font-bold text-brandGreen flex items-center gap-0.5 hover:underline"
                  >
                    View details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredWorkouts.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 py-12">No routines match your active filter settings.</div>
          )}
        </div>
      )}

      {/* EXERCISES TAB */}
      {workoutTab === 'exercises' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredExercises.map((ex) => (
            <div 
              key={ex._id}
              className="glass-card overflow-hidden border border-white/[0.04] flex flex-col"
            >
              <img 
                src={ex.image || 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=300&q=80'} 
                alt={ex.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {ex.category}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brandGreen bg-brandGreen/5 border border-brandGreen/10 px-2 py-0.5 rounded">
                      {ex.difficulty}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-gray-200 mt-2">{ex.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-snug line-clamp-2">{ex.instructions}</p>
                </div>

                <div className="border-t border-white/[0.06] pt-3 mt-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ex.targetMuscles.map((m) => (
                      <span key={m} className="text-[8px] font-bold bg-white/5 px-2 py-0.5 rounded text-gray-400">
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                    <span>Target: {ex.sets} Sets × {ex.reps} Reps</span>
                    <span className="text-brandCoral-light">{ex.caloriesBurned} kcal</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-12">No exercises found.</div>
          )}
        </div>
      )}

      {/* SELECTED ROUTINE DETAIL MODAL */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-card p-6 border border-white/[0.08] relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedWorkout(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <img 
              src={selectedWorkout.image} 
              alt={selectedWorkout.title} 
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-extrabold text-brandGreen bg-brandGreen/10 px-2 py-0.5 rounded uppercase tracking-wider">
                {selectedWorkout.category}
              </span>
              <span className="text-[9px] font-extrabold text-brandIndigo-light bg-brandIndigo/10 px-2 py-0.5 rounded uppercase tracking-wider">
                {selectedWorkout.difficulty}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">{selectedWorkout.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">{selectedWorkout.description}</p>

            <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/[0.04] p-3.5 rounded-xl mb-6 text-center text-xs">
              <div>
                <span className="text-gray-500 font-bold block">Duration</span>
                <span className="text-base font-extrabold text-white">{selectedWorkout.duration} mins</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold block">Est. Calorie Burn</span>
                <span className="text-base font-extrabold text-brandCoral">{selectedWorkout.caloriesBurned} kcal</span>
              </div>
            </div>

            <h4 className="text-xs font-extrabold text-gray-200 uppercase tracking-wider mb-2.5">Routine Exercises</h4>
            <div className="flex flex-col gap-2.5 mb-6">
              {(selectedWorkout.exercises || []).map((exId, idx) => {
                const matchedEx = exercises.find(ex => ex._id === exId);
                return (
                  <div key={exId} className="flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-brandGreen/10 text-brandGreen flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      <span className="text-xs font-bold text-gray-200 block">{matchedEx?.name || 'Workout Exercise'}</span>
                      <span className="text-[10px] text-gray-500">
                        {matchedEx?.sets || 3} sets × {matchedEx?.reps || 10} reps ({matchedEx?.duration || '30s'})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleMarkComplete(selectedWorkout)}
              className="w-full btn-primary py-3 text-xs font-bold"
            >
              Mark Routine Completed <CheckCircle size={16} />
            </button>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM ROUTINE MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-card p-6 border border-white/[0.08] relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-extrabold text-white mb-4">Create Custom Workout</h3>

            <form onSubmit={handleCreateCustom} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Workout Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. My HIIT Destroyer"
                  required
                  className="form-input text-xs py-2 px-3 bg-slate-900/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="form-input text-xs py-2 px-3 bg-slate-900/40"
                  >
                    <option value="Home workouts">Home workouts</option>
                    <option value="Strength training">Strength training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Yoga">Yoga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Difficulty</label>
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value)}
                    className="form-input text-xs py-2 px-3 bg-slate-900/40"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Duration (mins)</label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="e.g. 20"
                    required
                    className="form-input text-xs py-2 px-3 bg-slate-900/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Est. Calories Burned</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    placeholder="e.g. 180"
                    required
                    className="form-input text-xs py-2 px-3 bg-slate-900/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Description (optional)</label>
                <textarea
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Notes about targets, gear, or recovery..."
                  rows={2}
                  className="form-input text-xs py-2 px-3 bg-slate-900/40 focus:border-brandGreen"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Select Exercises (min 1)</label>
                <div className="flex flex-col gap-2.5 max-h-36 overflow-y-auto border border-white/10 rounded-xl p-2.5 bg-slate-900/40">
                  {exercises.map((ex) => {
                    const isSelected = customSelectedEx.includes(ex._id);
                    return (
                      <div 
                        key={ex._id}
                        onClick={() => handleExToggle(ex._id)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                          isSelected 
                            ? 'bg-brandGreen/10 border-brandGreen/40 text-brandGreen-light'
                            : 'bg-transparent border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          readOnly
                          className="mr-1 accent-brandGreen cursor-pointer"
                        />
                        <span>{ex.name} ({ex.category})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={customSelectedEx.length === 0}
                className="w-full btn-primary py-3 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Save Workout Template
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
