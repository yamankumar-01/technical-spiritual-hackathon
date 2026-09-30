import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  Info,
  Calendar,
  Clock,
  Award,
  Layers,
  Bot,
  Cpu,
  HeartHandshake,
  GraduationCap,
  Gamepad2,
  Leaf,
  ArrowRight,
  Presentation,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage = () => {
  const themes = [
    { id: 1, title: 'AR & AI Solutions', icon: Bot, color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/60' },
    { id: 2, title: 'IoT & Smart Hardware', icon: Cpu, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60' },
    { id: 3, title: 'Mindfulness & Mental Health', icon: HeartHandshake, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60' },
    { id: 4, title: 'Campus & Academics', icon: GraduationCap, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60' },
    { id: 5, title: 'Habits, Games & Ethics', icon: Gamepad2, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60' },
    { id: 6, title: 'Environment & Sustainability', icon: Leaf, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60' },
  ];

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950 py-10 sm:py-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Main Header */}
        <header className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>About TSH 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            Techno Spiritual Hackathon{' '}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 dark:from-sky-400 dark:via-cyan-300 dark:to-amber-400 bg-clip-text text-transparent">
              (TSH)
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Where modern engineering, AI, and digital innovation unite with human values, mental wellness, and spiritual wellbeing.
          </p>
        </header>

        {/* 1. About TSH & Vision of TSH (Dual Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* About TSH */}
          <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_35px_rgb(0,0,0,0.4)] space-y-4 hover:border-sky-300/80 dark:hover:border-sky-700/80 transition-all group">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-2xs group-hover:scale-105 transition-transform">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block font-mono">
                  Overview
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                  About TSH
                </h2>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              The Techno Spiritual Hackathon (TSH) is an event where students use modern technology (like apps, AI, and websites) to solve real-world problems related to mental wellness, human values, and spiritual wellbeing.
            </p>
          </div>

          {/* Vision of TSH */}
          <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_35px_rgb(0,0,0,0.4)] space-y-4 hover:border-indigo-300/80 dark:hover:border-indigo-700/80 transition-all group">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs group-hover:scale-105 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block font-mono">
                  Future Horizon
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
                  Vision of TSH
                </h2>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              To harmoniously blend inner human wisdom with cutting-edge engineering—inspiring student developers to build purposeful, ethical, and consciousness-driven technology that uplifts society and fosters universal wellbeing.
            </p>
          </div>

        </div>

        {/* 2. Theme of TSH (Cards Without Any Explanation) */}
        <section className="space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 shadow-2xs">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Tracks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Theme of TSH
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {themes.map((theme) => {
              const IconComp = theme.icon;
              return (
                <div
                  key={theme.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${theme.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      Theme 0{theme.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">
                      {theme.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Event Schedule: Day 1 Info & Day 2 Info */}
        <section className="space-y-6 pt-2">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Event Schedule</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit']">
              Hackathon Timeline & Rounds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Day 1 Info */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-sky-500/20 dark:border-sky-500/30 shadow-[0_12px_36px_rgba(14,165,233,0.08)] space-y-5 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                      <Presentation className="w-3.5 h-3.5" /> Day 1
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1">
                      Day 1 — PPT Round
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      <span>Approx. 8:00 AM – 8:00 PM</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 shrink-0">
                    Presentation Round
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>Students present their ideas through PPT slides to assigned judges in their allocated rooms.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>Judges score the presentations.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>By the end of the day (around 8:00 PM), announce which teams qualify for the final round.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                <span>Evaluation Day</span>
                <span>Stage 1 Evaluation</span>
              </div>
            </div>

            {/* Day 2 Info */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/20 dark:border-emerald-500/30 shadow-[0_12px_36px_rgba(16,185,129,0.08)] space-y-5 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <Award className="w-3.5 h-3.5" /> Day 2
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1">
                      Day 2 — Prototype Round & Winners
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Approx. 8:00 AM – 8:00 PM</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 shrink-0">
                    Live Demo & Prizes
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>Shortlisted teams build and show their working prototypes (working apps/models) to the judges.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>Judges test the working models.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>Declare the final results (around 5:00 PM) and give out prizes, trophies, and certificates.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Grand Finale</span>
                <span>Trophies & Felicitation</span>
              </div>
            </div>

          </div>
        </section>

        {/* Quick Call to Action Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
              Ready to Showcase Your Innovation?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Explore available problem statements and reserve your team's slot before capacity fills up.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/ps"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
            >
              <span>Explore PS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
