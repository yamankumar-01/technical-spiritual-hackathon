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
      {/* Card-Style Hero Container */}
      <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-[#DDF5EB]/60 dark:from-[#081611]/95 dark:via-[#06120e]/90 dark:to-[#040c09]/80 backdrop-blur-md rounded-[32px] sm:rounded-[40px] shadow-[0_15px_40px_rgba(18,30,24,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-white/85 dark:border-white/10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16 lg:px-14 overflow-hidden">
        {/* Soft mint/emerald ambient light */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-[#2EB88A]/15 dark:bg-[#2EB88A]/10 blur-[100px] pointer-events-none rounded-full" />

        {/* TSH Emblem Watermark in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <img
            src="/tsh-logo.png"
            alt="TSH Watermark"
            className="w-[340px] sm:w-[500px] lg:w-[620px] max-w-full aspect-square object-contain opacity-[0.10] sm:opacity-[0.11] dark:opacity-[0.08] transition-opacity"
          />
        </div>

        {/* Hero Content - Centered with Generous Breathing Room */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Tag / Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 text-[#1E9470] dark:text-[#2EB88A] text-xs font-semibold shadow-sm border border-[#2EB88A]/25 mb-4 sm:mb-5">
            <span className="w-2 h-2 rounded-full bg-[#2EB88A] animate-pulse" />
            <span className="tracking-wide">National Techno Spiritual Conclave • JECRC Foundation, Jaipur</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-extrabold text-[#12141A] dark:text-white font-['Outfit'] tracking-tight leading-[1.14] mb-4 sm:mb-5">
            Techno Spiritual <span className="text-[#1E9470] dark:text-[#2EB88A]">Hackathon 2026</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#536159] dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-7">
            Synthesizing ancient mindfulness and futuristic technology. 24 hours of conscious engineering,
            ethical AI, and transformative social impact hosted at JECRC Foundation, Jaipur.
          </p>

          {/* Rotating Guiding Philosophy Quote - Clean Text Only with Airy Spacing */}
          <div className="max-w-2xl mx-auto text-center space-y-2 py-2 mb-7 sm:mb-8">
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#1E9470] dark:text-[#2EB88A] flex items-center justify-center shadow-2xs">
                <Quote className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs sm:text-[13px] uppercase font-extrabold tracking-wider text-[#1E9470] dark:text-[#2EB88A]">
                {QUOTES[currentQuoteIndex].author}
              </span>
            </div>
            <p className="text-base sm:text-lg lg:text-[19px] font-semibold text-[#12141A] dark:text-slate-100 leading-relaxed font-['Outfit'] italic px-2">
              "{QUOTES[currentQuoteIndex].text}"
            </p>
          </div>

          {/* Dynamic Hero State: Confirmed Team vs Primary CTAs */}
          {isRegisteredAndPaid ? (
            <div className="rounded-2xl bg-[#DDF5EB]/80 dark:bg-emerald-950/30 border border-[#2EB88A]/30 dark:border-emerald-500/40 p-4 sm:p-5 shadow-sm max-w-xl w-full mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#2EB88A] flex items-center justify-center text-white shadow-sm shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#12141A] dark:text-white">
                      Team Registered ({myTeam.teamCode})
                    </h4>
                    <p className="text-xs text-[#1E9470] dark:text-emerald-300 font-medium">
                      {myTeam.teamName} • Status: {myTeam.status}
                    </p>
                  </div>
                </div>
                <Link
                  to="/ps"
                  className="w-full sm:w-auto text-center px-4 py-2 rounded-full text-xs font-semibold bg-white text-[#1E9470] hover:bg-slate-50 shadow-sm transition-all shrink-0"
                >
                  View Problem Statements
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
              <Link
                to={user ? '/register-team' : '/login?redirect=/register-team'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_18px_rgba(46,184,138,0.35)] hover:shadow-[0_8px_24px_rgba(46,184,138,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register Team Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/ps"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-[#536159] dark:text-slate-300 bg-white dark:bg-slate-800 hover:text-[#12141A] dark:hover:text-white border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow transition-all text-center"
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
