import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';
  const stateMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing
  const fillCredentials = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Banner if redirected */}
        {stateMessage && (
          <div className="p-4 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 text-[#2EB88A]" />
            <span>{stateMessage}</span>
          </div>
        )}

        <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_15px_45px_rgba(18,20,26,0.08)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-white border border-slate-200/80 dark:border-white/10 p-2.5 flex items-center justify-center shadow-[0_8px_24px_rgba(46,184,138,0.15)] overflow-hidden">
              <img src="/tsh-logo.png" alt="TSH Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#12141A] dark:text-white font-['Outfit']">
              Welcome Back
            </h1>
            <p className="text-xs text-[#536159] dark:text-slate-400">
              Sign in to your TSH account to register or check your team status.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#12141A] dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#12141A] dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-sm text-[#12141A] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2EB88A] focus:ring-2 focus:ring-[#2EB88A]/20 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full text-xs font-bold bg-gradient-to-r from-[#2EB88A] to-[#1E9470] hover:brightness-105 text-white shadow-[0_8px_20px_rgba(46,184,138,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Login Shortcuts for Easy Testing */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
            <p className="text-[11px] text-center text-[#536159] dark:text-slate-400 uppercase font-semibold tracking-wider">
              Quick Fill Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@tsh.edu', 'Admin@12345')}
                className="py-2 px-3 rounded-full text-[11px] font-semibold bg-[#DDF5EB] hover:bg-[#DDF5EB]/80 dark:bg-[#2EB88A]/15 dark:hover:bg-[#2EB88A]/25 text-[#1E9470] dark:text-[#2EB88A] border border-[#2EB88A]/30 transition-colors text-center cursor-pointer"
              >
                👑 Admin Portal
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('leader@college.edu', 'Password@123')}
                className="py-2 px-3 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#12141A] dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors text-center cursor-pointer"
              >
                👤 Sample Participant
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#536159] dark:text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-[#1E9470] dark:text-[#2EB88A] hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
