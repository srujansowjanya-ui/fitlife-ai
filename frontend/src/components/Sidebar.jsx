import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  HeartHandshake, 
  Users, 
  User, 
  Settings, 
  ShieldAlert 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Nutrition', path: '/nutrition', icon: Utensils },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Wellness', path: '/wellness', icon: HeartHandshake },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  if (!user) return null;

  return (
    <>
      {/* DESKTOP SIDEBAR - Docked Left */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0d1322] border-r border-white/[0.04] py-6 px-4 shrink-0 min-h-[calc(100vh-73px)]">
        <div className="flex flex-col gap-2 flex-grow">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-brandGreen text-white shadow-glowGreen'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Admin link if user is admin */}
          {user.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 mt-6 border border-red-500/20 ${
                  isActive
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'text-red-400 hover:text-red-300 hover:bg-red-500/5'
                }`
              }
            >
              <ShieldAlert size={18} />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </div>

        {/* User stats widget at bottom of sidebar */}
        <div className="mt-auto glass-card p-4 border border-white/[0.04] bg-slate-900/30">
          <div className="flex items-center gap-2">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
              alt="avatar" 
              className="w-10 h-10 rounded-xl"
            />
            <div className="overflow-hidden">
              <div className="font-bold text-xs truncate text-gray-200">{user.name}</div>
              <div className="text-[10px] text-brandIndigo-light font-semibold">Level {user.level || 1} Rookie</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-brandIndigo h-1.5 rounded-full" 
              style={{ width: `${(user.xp % 500) / 5}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-semibold">
            <span>{user.xp % 500} / 500 XP</span>
            <span>Lvl {user.level || 1}</span>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-lg border-t border-white/[0.06] flex items-center justify-around py-3 px-2 shadow-2xl">
        {menuItems.slice(0, 6).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[9px] font-bold transition-colors ${
                isActive ? 'text-brandGreen' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}
        {/* Mobile Profile Link */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[9px] font-bold transition-colors ${
              isActive ? 'text-brandGreen' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
}
