import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Moon, Sun, ShieldAlert, Award, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FitnessContext } from '../context/FitnessContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { notifications, markNotificationsRead } = useContext(FitnessContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const handleMarkRead = () => {
    markNotificationsRead();
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0b0f19]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandGreen to-brandIndigo flex items-center justify-center text-white font-bold text-xl shadow-glowGreen group-hover:scale-105 transition-all duration-300">
          FL
        </div>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-brandGreen bg-clip-text text-transparent group-hover:text-brandGreen transition-colors duration-300">
          FitLife <span className="text-brandGreen">AI</span>
        </span>
      </Link>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Switch */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:text-white transition-colors hover:bg-white/10"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <>
            {/* Gamification Badge */}
            <div className="hidden sm:flex items-center gap-1 bg-brandIndigo/10 border border-brandIndigo/30 rounded-xl px-3 py-1.5 text-xs text-brandIndigo-light font-bold">
              <Award size={14} className="text-brandIndigo-light animate-pulse" />
              <span>Level {user.level || 1}</span>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                  if (unreadCount > 0) handleMarkRead();
                }}
                className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-300 hover:text-white transition-colors hover:bg-white/10 relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brandCoral rounded-full ring-2 ring-darkBg animate-ping" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-card p-4 z-50 text-sm max-h-[350px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2 font-semibold">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs text-brandGreen flex items-center gap-1">
                        <Check size={12} /> Marked all read
                      </span>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-gray-500 py-4 text-center">No notifications yet</div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {notifications.map((notif) => (
                        <div 
                          key={notif._id} 
                          className={`p-2.5 rounded-lg border transition-all ${
                            notif.read ? 'bg-white/[0.02] border-transparent' : 'bg-brandGreen/5 border-brandGreen/10'
                          }`}
                        >
                          <div className="font-semibold text-xs flex items-center gap-1 text-gray-200">
                            {notif.type === 'success' && '🎉'}
                            {notif.type === 'challenge' && '🏆'}
                            {notif.title}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 leading-snug">{notif.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 border border-white/10 rounded-xl p-1 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
                  alt="avatar" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="hidden md:inline text-xs font-semibold pr-2 text-gray-300">{user.name}</span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-card p-2 z-50 text-sm">
                  <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                    <div className="font-semibold truncate text-gray-200">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                  <Link 
                    to="/profile" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-gray-300 hover:text-white"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                    >
                      <ShieldAlert size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogoutClick}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-brandCoral/10 text-brandCoral hover:text-brandCoral-light rounded-lg transition-colors mt-1 border-t border-white/[0.08]"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Link 
              to="/auth" 
              className="text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-xl px-4 py-2 text-gray-300 hover:text-white flex items-center"
            >
              Sign In
            </Link>
            <Link 
              to="/auth?signup=true" 
              className="text-xs font-semibold bg-brandGreen hover:bg-brandGreen-dark transition-all rounded-xl px-4 py-2 text-white shadow-md hover:shadow-glowGreen flex items-center"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
