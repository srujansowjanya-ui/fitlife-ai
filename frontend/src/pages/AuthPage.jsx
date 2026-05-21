import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
  const { login, signup, googleLogin, error } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const isSignupParam = searchParams.get('signup') === 'true';
  
  const [isSignup, setIsSignup] = useState(isSignupParam);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsSignup(isSignupParam);
  }, [isSignupParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    let success = false;
    if (isSignup) {
      success = await signup(name, email, password);
    } else {
      success = await login(email, password);
    }

    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  // Mock Google sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const googlePayload = {
      name: 'Google User',
      email: 'googleuser@fitlife.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      googleId: 'google_oauth_123456789'
    };
    const success = await googleLogin(googlePayload);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 relative">
      {/* Background radial spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brandIndigo/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Glass Container */}
      <div className="w-full max-w-md glass-card p-8 border border-white/[0.04]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brandGreen to-brandIndigo flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-glowGreen mb-4">
            FL
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-400 mt-1.5 font-medium">
            {isSignup 
              ? 'Join FitLife AI to start tracking your health goals.' 
              : 'Sign in to access your workout metrics and logs.'
            }
          </p>
        </div>

        {/* Error notification banner */}
        {(error || localError) && (
          <div className="mb-6 p-3 bg-brandCoral/10 border border-brandCoral/20 text-brandCoral text-xs font-semibold rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <p>{localError || error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="form-input text-xs pl-10 focus:border-brandGreen"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                required
                className="form-input text-xs pl-10 focus:border-brandGreen"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
              {!isSignup && (
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered email! (Mocked)'); }}
                  className="text-[10px] text-brandGreen hover:underline font-bold"
                >
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input text-xs pl-10 focus:border-brandGreen"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs font-bold mt-2"
          >
            {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
            {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/[0.06]"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/[0.06]"></div>
        </div>

        {/* Google Authentication Trigger */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full btn-secondary py-3 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10"
        >
          {/* Custom SVG Google Icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.478 0-6.3-2.822-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.506 0 2.882.533 3.967 1.417l3.056-3.056C19.062 2.302 15.894 1.1 12.24 1.1c-6.13 0-11.1 4.97-11.1 11.1s4.97 11.1 11.1 11.1c5.807 0 10.985-4.148 10.985-11.1 0-.663-.06-1.3-.178-1.915H12.24Z" />
          </svg>
          Continue with Google
        </button>

        {/* Form Toggle Link */}
        <div className="text-center mt-6">
          <span className="text-xs text-gray-500 font-semibold">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button 
            onClick={() => {
              setIsSignup(!isSignup);
              setLocalError(null);
            }}
            className="text-xs text-brandGreen hover:underline font-bold ml-1"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Quick Credentials Helper (for developer reviews!) */}
        <div className="mt-8 p-3 rounded-xl border border-white/[0.04] bg-white/[0.01]">
          <span className="text-[9px] font-bold text-brandGreen uppercase block tracking-wider mb-1.5 flex items-center gap-1">
            <ShieldCheck size={11} /> Demo Quick Sign-in (Auto-Mocked)
          </span>
          <div className="text-[10px] text-gray-500 leading-normal font-medium">
            Submit any email/password to log in immediately. To inspect admin features, use <code className="text-brandIndigo-light bg-white/5 px-1 py-0.5 rounded">admin@fitlife.com</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
