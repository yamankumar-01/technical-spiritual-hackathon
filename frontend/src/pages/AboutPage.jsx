import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Award,
  Bot,
  Cpu,
  HeartHandshake,
  GraduationCap,
  Gamepad2,
  Leaf,
  ArrowRight,
  Presentation,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

export const AboutPage = () => {
  const themes = [
    {
      id: '01',
      title: 'AR & AI Solutions',
      icon: Bot,
      accent: 'from-sky-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/80',
    },
    {
      id: '02',
      title: 'IoT & Smart Hardware',
      icon: Cpu,
      accent: 'from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80',
    },
    {
      id: '03',
      title: 'Mindfulness & Mental Health',
      icon: HeartHandshake,
      accent: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80',
    },
    {
      id: '04',
      title: 'Campus & Academics',
      icon: GraduationCap,
      accent: 'from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80',
    },
    {
      id: '05',
      title: 'Habits, Games & Ethics',
      icon: Gamepad2,
      accent: 'from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/80',
    },
    {
      id: '06',
      title: 'Environment & Sustainability',
      icon: Leaf,
      accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white dark:bg-transparent py-8 sm:py-12 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        
        {/* Simple & Clean Hero Header */}
        <header className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200/80 dark:border-sky-800/60 font-display">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>National Innovation Initiative • TSH 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
            Techno Spiritual Hackathon{' '}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 dark:from-sky-400 dark:via-cyan-300 dark:to-amber-400 bg-clip-text text-transparent">
              (TSH)
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Where modern engineering, artificial intelligence, and digital innovation unite with human values, mental wellness, and spiritual wellbeing.
          </p>
        </header>

        {/* SECTION 1: ABOUT TSH (Simple, Clean, Full Width) */}
        <section className="w-full space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
            About TSH
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed max-w-4xl">
            The Techno Spiritual Hackathon (TSH) is an event where students use modern technology (like apps, AI, and websites) to solve real-world problems related to mental wellness, human values, and spiritual wellbeing.
          </p>

          {/* Simple Value Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-sm transition-shadow">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Real-World Impact
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-sm transition-shadow">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Mindful Engineering
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-sm transition-shadow">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Human Values First
            </span>
          </div>
        </section>

        {/* Clean divider */}
        <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />

        {/* SECTION 2: VISION OF TSH (Simple, Clean, Full Width) */}
        <section className="w-full space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
            Vision of TSH
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed max-w-4xl">
            To harmoniously blend inner human wisdom with cutting-edge engineering—inspiring student developers to build purposeful, ethical, and consciousness-driven technology that uplifts society and fosters universal wellbeing.
          </p>

          <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-l-indigo-500 border border-indigo-100 dark:border-indigo-900/50 shadow-xs max-w-3xl">
            <p className="text-xs sm:text-sm italic text-indigo-950 dark:text-indigo-200 font-medium">
              "Blending inner consciousness with digital intelligence for a better tomorrow."
            </p>
          </div>
        </section>

        {/* Clean divider */}
        <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />

        {/* SECTION 3: THEME OF TSH (Clean Cards, No Truncation, Synced Header) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
              Theme of TSH
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              6 Core Domains
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {themes.map((theme) => {
              const IconComp = theme.icon;
              return (
                <div
                  key={theme.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-gradient-to-br ${theme.accent} shadow-2xs`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white font-display leading-snug">
                    {theme.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Clean divider */}
        <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />

        {/* SECTION 4: HACKATHON TIMELINE (Day 1 & Day 2) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
              Hackathon Timeline
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Two Milestone Stages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* DAY 1 CARD */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/85 border border-sky-200/90 dark:border-sky-900/60 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200/90 dark:border-sky-800 shadow-xs">
                    <Presentation className="w-3 h-3" />
                    <span>DAY 01</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display pt-1">
                    Day 1 — PPT Round
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Approx. 8:00 AM – 8:00 PM</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200/90 dark:border-sky-800 shadow-xs shrink-0">
                  Presentation
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </span>
                  <p className="leading-relaxed">
                    Students present their ideas through PPT slides to assigned judges in their allocated rooms.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </span>
                  <p className="leading-relaxed">
                    Judges score the presentations.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </span>
                  <p className="leading-relaxed font-semibold text-sky-950 dark:text-sky-200">
                    By the end of the day (around 8:00 PM), announce which teams qualify for the final round.
                  </p>
                </div>
              </div>
            </div>

            {/* DAY 2 CARD */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/85 border border-emerald-200/90 dark:border-emerald-900/60 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800 shadow-xs">
                    <Award className="w-3 h-3" />
                    <span>DAY 02</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display pt-1">
                    Day 2 — Prototype Round & Winners
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Approx. 8:00 AM – 8:00 PM</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800 shadow-xs shrink-0">
                  Demo & Prizes
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </span>
                  <p className="leading-relaxed">
                    Shortlisted teams build and show their working prototypes (working apps/models) to the judges.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </span>
                  <p className="leading-relaxed">
                    Judges test the working models.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </span>
                  <p className="leading-relaxed font-semibold text-emerald-950 dark:text-emerald-200">
                    Declare the final results (around 5:00 PM) and give out prizes, trophies, and certificates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: SIMPLE CALL TO ACTION */}
        <div className="dark-banner p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="space-y-1.5 text-center sm:text-left relative z-10 max-w-xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 block">
              Limited Seats Available
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: '#ffffff' }}>
              Ready to Build Conscious Technology?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              Browse available Problem Statements across the 6 tracks and reserve your team's slot before capacity fills up.
            </p>
          </div>
          <Link
            to="/ps"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer relative z-10"
            style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
          >
            <span style={{ color: '#0f172a' }}>Explore Problem Statements</span>
            <ArrowRight className="w-4 h-4 text-slate-900" style={{ color: '#0f172a', stroke: '#0f172a' }} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
