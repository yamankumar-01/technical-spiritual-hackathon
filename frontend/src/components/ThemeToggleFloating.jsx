import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggleFloating = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-sky-500/50 hover:shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-slate-800 dark:text-slate-100"
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-200">
          {isDark ? (
            <Sun className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <Moon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </div>
        <span className="text-xs font-semibold tracking-wide font-display select-none">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggleFloating;
