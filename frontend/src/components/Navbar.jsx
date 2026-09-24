import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  Users,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Sun,
  Moon,
  LayoutDashboard,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export const Navbar = () => {
  const { user, myTeam, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About / TSH', path: '/about' },
    { name: 'Problem Statements', path: '/ps' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-300">
      <nav
        className={`rounded-full px-3.5 sm:px-5 py-2 border flex items-center justify-between transition-all duration-300 min-h-[58px] sm:min-h-[62px] ${
          scrolled
            ? 'bg-white/30 dark:bg-[#071510]/40 backdrop-blur-xl shadow-lg border-white/40 dark:border-white/10'
            : 'bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(18,20,26,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-white/85 dark:border-white/10'
        }`}
      >
        {/* Brand Logo with Official TSH Emblem - Balanced and Centered */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 mr-2 lg:mr-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-center p-1 sm:p-1.5 shadow-sm group-hover:border-[#2EB88A]/60 group-hover:shadow-md group-hover:scale-105 transition-all overflow-hidden shrink-0">
            <img src="/tsh-logo.png" alt="TSH Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#12141A] dark:text-white font-['Outfit'] group-hover:text-[#2EB88A] transition-colors leading-none">
              TSH <span className="text-[#2EB88A]">2026</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#536159] dark:text-slate-400 font-medium tracking-wide hidden sm:block leading-none mt-1">
              Techno Spiritual Hackathon
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Subtle, Balanced Spacing & Single Line Aligned */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`h-9 px-3 lg:px-3.5 rounded-full text-xs lg:text-[13px] xl:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0 ${
                isActive(link.path)
                  ? 'text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 font-semibold shadow-xs'
                  : 'text-[#536159] hover:text-[#12141A] hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              to="/dashboard"
              className={`h-9 px-3 lg:px-3.5 rounded-full text-xs lg:text-[13px] xl:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap leading-none shrink-0 ${
                isActive('/dashboard')
                  ? 'text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 font-semibold shadow-xs'
                  : 'text-[#536159] hover:text-[#12141A] hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
            >
              My Dashboard
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`h-9 px-3 lg:px-3.5 rounded-full text-xs lg:text-[13px] xl:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-all whitespace-nowrap leading-none shrink-0 ${
                isActive('/admin')
                  ? 'text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 font-bold shadow-xs ring-1 ring-[#2EB88A]/30'
                  : 'text-[#536159] dark:text-slate-300 hover:text-[#12141A] dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#1E9470] dark:text-[#2EB88A] shrink-0" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Right Action / Theme Toggle / Auth Buttons */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Bright / Dark Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#DDF5EB]/80 hover:bg-[#DDF5EB] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1E9470] dark:text-[#2EB88A] transition-all shadow-xs group cursor-pointer shrink-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#1E9470] transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>

          {user ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="h-9 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 hover:border-[#2EB88A]/50 text-slate-800 dark:text-slate-200 transition-all shadow-xs cursor-pointer"
              >
                <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-r from-[#2EB88A] to-[#1E9470] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left justify-center">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 max-w-[110px] truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[9px] text-[#2EB88A] font-medium leading-none">
                    {user.role === 'admin' ? 'Administrator' : myTeam ? `Team ${myTeam.teamCode}` : 'Participant'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{user.email}</p>
                    {myTeam && (
                      <div className="mt-2">
                        <StatusBadge status={myTeam.status} />
                      </div>
                    )}
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#1E9470] dark:text-[#2EB88A] hover:bg-[#DDF5EB]/50 dark:hover:bg-[#2EB88A]/10 font-semibold transition-colors"
                  >
                    <Users className="w-4 h-4 text-[#2EB88A]" />
                    My Registrations & Slots
                  </Link>

                  {!myTeam && (
                    <Link
                      to="/register-team"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#1E9470] hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-[#2EB88A]" />
                      Register Team (Leader + 3)
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#1E9470] dark:text-[#2EB88A] hover:bg-[#DDF5EB]/50 dark:hover:bg-[#2EB88A]/10 font-semibold transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#1E9470] dark:text-[#2EB88A]" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/login"
                className={`h-9 px-3.5 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap leading-none ${
                  isActive('/login')
                    ? 'text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 font-semibold shadow-xs'
                    : 'text-[#536159] hover:text-[#12141A] hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="h-9 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_4px_14px_rgba(46,184,138,0.35)] hover:shadow-[0_6px_20px_rgba(46,184,138,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center whitespace-nowrap leading-none"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-1.5">
          {user && (
            <Link
              to="/dashboard"
              title="My Dashboard"
              aria-label="My Dashboard"
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                isActive('/dashboard')
                  ? 'bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white shadow-xs'
                  : 'bg-[#DDF5EB] dark:bg-slate-800 text-[#1E9470] dark:text-[#2EB88A]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full bg-[#DDF5EB] dark:bg-slate-800 text-[#1E9470] dark:text-[#2EB88A]"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xl space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A] font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                isActive('/dashboard')
                  ? 'bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#1E9470] dark:text-[#2EB88A]" />
              <span>My Dashboard</span>
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                isActive('/admin')
                  ? 'bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A]'
                  : 'text-[#536159] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-[#1E9470] dark:text-[#2EB88A]" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 px-2 py-0.5 rounded-full">
                      {user.role === 'admin' ? 'Admin' : myTeam ? `Team ${myTeam.teamCode || ''}` : 'Participant'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  {myTeam && (
                    <div className="pt-1">
                      <StatusBadge status={myTeam.status} />
                    </div>
                  )}
                </div>

                {/* Direct Dashboard Link Button */}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A] border border-[#2EB88A]/40 font-bold text-sm hover:bg-[#DDF5EB]/80 transition-all shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#1E9470] dark:text-[#2EB88A]" />
                  <span>My Dashboard</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#1E9470] dark:text-[#2EB88A]" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {!myTeam && (
                  <Link
                    to="/register-team"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2.5 px-4 rounded-full bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white font-semibold text-sm shadow-md"
                  >
                    Register Team Now
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-center py-2.5 px-4 rounded-full font-medium text-sm transition-all ${
                    isActive('/login')
                      ? 'bg-[#DDF5EB] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:text-[#2EB88A] font-semibold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#12141A] dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 rounded-full bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white font-semibold text-sm shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
