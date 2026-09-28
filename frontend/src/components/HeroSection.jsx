import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  CheckCircle2,
  Quote,
} from 'lucide-react';

const QUOTES = [
  {
    text: 'Technology without consciousness is power without purpose. Innovate with soul.',
    author: 'TSH Charter of Values',
  },
  {
    text: 'When ancient mindfulness guides futuristic silicon, technology becomes a force of healing.',
    author: 'Vedic Cybernetics Forum',
  },
  {
    text: 'The greatest algorithm ever written is human empathy encoded into collective action.',
    author: 'Conscious Tech Manifesto',
  },
];

export const HeroSection = () => {
  const { user, myTeam } = useAuth();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Rotating quote interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Determine if team has completed registration & payment submission
  const isRegisteredAndPaid =
    myTeam &&
    ['confirmed', 'payment_pending', 'ps_not_declared', 'finalized'].includes(myTeam.status);

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-8 pb-10 sm:pb-14 transition-all">
      {/* Cyber-Zen Glass Hero Container */}
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(14,165,233,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/80 dark:border-slate-800/80 px-6 py-10 sm:px-10 sm:py-14 lg:py-16 lg:px-14 overflow-hidden">
        {/* Soft cyan & indigo ambient cyber glow */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-sky-500/10 dark:bg-sky-400/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[250px] bg-indigo-500/10 dark:bg-indigo-400/10 blur-[100px] pointer-events-none rounded-full" />

        {/* TSH Emblem Watermark in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <img
            src="/tsh-emblem.png"
            alt="TSH Watermark"
            className="w-[340px] sm:w-[500px] lg:w-[620px] max-w-full aspect-square object-contain opacity-[0.07] sm:opacity-[0.08] dark:opacity-[0.06] transition-opacity"
          />
        </div>

        {/* Hero Content - Centered with Generous Breathing Room */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Centered Official TSH Emblem Medallion */}
          <div className="relative mb-5 sm:mb-6 group">
            {/* Ambient Cyan/Sky Glow Behind Emblem */}
            <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-sky-400/50 via-cyan-400/40 to-indigo-500/50 blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse pointer-events-none" />
            
            {/* Medallion Disc */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full p-2 sm:p-2.5 bg-white shadow-[0_12px_40px_rgba(14,165,233,0.35)] border-2 border-sky-400/70 hover:border-cyan-300 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <img
                src="/tsh-emblem.png"
                alt="Techno Spiritual Hackathon Official Emblem"
                className="w-full h-full object-contain filter drop-shadow-xs select-none"
              />
            </div>
          </div>

          {/* Tag / Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 text-xs font-semibold shadow-xs border border-sky-200/70 dark:border-sky-800/50 mb-4 sm:mb-5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="tracking-wide font-display">National Techno Spiritual Conclave • JECRC Foundation, Jaipur</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-[1.14] mb-4 sm:mb-5">
            Techno Spiritual <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 dark:from-sky-400 dark:via-cyan-300 dark:to-amber-400 bg-clip-text text-transparent">Hackathon 2026</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-7 font-sans">
            Synthesizing ancient mindfulness and futuristic technology. 24 hours of conscious engineering,
            ethical AI, and transformative social impact hosted at JECRC Foundation, Jaipur.
          </p>

          {/* Rotating Guiding Philosophy Quote */}
          <div className="max-w-2xl mx-auto text-center space-y-2 py-2 mb-7 sm:mb-8">
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-2xs">
                <Quote className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs sm:text-[13px] uppercase font-extrabold tracking-wider text-sky-600 dark:text-sky-400 font-mono">
                {QUOTES[currentQuoteIndex].author}
              </span>
            </div>
            <p className="text-base sm:text-lg lg:text-[19px] font-semibold text-slate-800 dark:text-slate-100 leading-relaxed font-display italic px-2">
              "{QUOTES[currentQuoteIndex].text}"
            </p>
          </div>

          {/* Dynamic Hero State: Confirmed Team vs Primary CTAs */}
          {isRegisteredAndPaid ? (
            <div className="rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 p-4 sm:p-5 shadow-xs max-w-xl w-full mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-xs shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                      Team Registered ({myTeam.teamCode})
                    </h4>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-medium font-sans">
                      {myTeam.teamName} • Status: {myTeam.status}
                    </p>
                  </div>
                </div>
                <Link
                  to="/ps"
                  className="w-full sm:w-auto text-center px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-slate-50 shadow-xs transition-all shrink-0"
                >
                  View Problem Statements
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
              <Link
                to={user ? '/register-team' : '/login?redirect=/register-team'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-[0_6px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_8px_25px_rgba(14,165,233,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
              >
                <span>Register Team Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/ps"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 hover:text-sky-600 dark:hover:text-white border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow transition-all text-center font-display"
              >
                Explore Problem Statements
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
