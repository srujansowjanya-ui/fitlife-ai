import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists on boot
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.warn('Backend server unreachable, looking for mock session...', err);
        // Fallback: check local storage for user profile
        const localUser = localStorage.getItem('user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      console.warn('Backend offline, running mock login...');
      // MOCK LOGIN FALLBACK
      if (email && password) {
        const mockUser = {
          id: 'mock_usr_1',
          name: email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
          role: email === 'admin@fitlife.com' ? 'admin' : 'user',
          level: 1,
          xp: 80,
          badges: ['First Step'],
          age: 28,
          height: 175,
          weight: 72,
          gender: 'male',
          fitnessGoal: 'General fitness',
          activityLevel: 'Moderately active',
          bmi: 23.5
        };
        const mockToken = 'mock_jwt_token_12345';
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }
      setError('Connection refused');
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        setError(data.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      console.warn('Backend offline, running mock signup...');
      const mockUser = {
        id: 'mock_usr_1',
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        role: 'user',
        level: 1,
        xp: 0,
        badges: ['First Step'],
        age: 25,
        height: 170,
        weight: 65,
        gender: 'female',
        fitnessGoal: 'General fitness',
        activityLevel: 'Lightly active',
        bmi: 22.5
      };
      const mockToken = 'mock_jwt_token_12345';
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
  };

  const googleLogin = async (googleData) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData)
      });
      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Backend offline, running mock Google Login...');
      const mockUser = {
        id: 'mock_usr_g',
        name: googleData.name,
        email: googleData.email,
        avatar: googleData.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${googleData.name}`,
        role: 'user',
        level: 1,
        xp: 0,
        badges: ['Google Connect'],
        age: 26,
        height: 172,
        weight: 68,
        gender: 'other',
        fitnessGoal: 'Home workouts',
        activityLevel: 'Moderately active',
        bmi: 23.0
      };
      const mockToken = 'mock_jwt_token_google';
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Backend offline, updating local profile mock...');
      // Mock profile update
      const heightMeters = (profileData.height || user.height) / 100;
      const calcBmi = (profileData.weight || user.weight) / (heightMeters * heightMeters);
      const roundedBmi = Math.round(calcBmi * 10) / 10;

      const updated = {
        ...user,
        ...profileData,
        bmi: roundedBmi
      };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return true;
    }
  };

  const addXp = async (amount, reason) => {
    try {
      const response = await fetch('/api/user/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, reason })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data; // Return levelUp info
      }
      return null;
    } catch (err) {
      console.warn('Backend offline, running local XP update...');
      const nextXp = (user.xp || 0) + amount;
      const nextLvl = Math.floor(nextXp / 500) + 1;
      const leveledUp = nextLvl > (user.level || 1);
      
      const updated = {
        ...user,
        xp: nextXp,
        level: nextLvl
      };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return { success: true, leveledUp, user: updated };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, googleLogin, logout, updateProfile, addXp }}>
      {children}
    </AuthContext.Provider>
  );
};
