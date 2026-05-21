import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FitnessProvider } from './context/FitnessContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AIChatbot from './components/AIChatbot';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import DietNutrition from './pages/DietNutrition';
import ProgressAnalytics from './pages/ProgressAnalytics';
import MentalWellness from './pages/MentalWellness';
import Community from './pages/Community';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brandGreen border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
}

function AppLayout({ children }) {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      {user && <AIChatbot />}
    </div>
  );
}

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><DietNutrition /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressAnalytics /></ProtectedRoute>} />
        <Route path="/wellness" element={<ProtectedRoute><MentalWellness /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <FitnessProvider>
            <AppRoutes />
          </FitnessProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
