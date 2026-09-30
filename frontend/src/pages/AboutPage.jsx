import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  Info,
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
  Lightbulb,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const AboutPage = () => {
  const themes = [
    {
      id: '01',
      title: 'AR & AI Solutions',
      icon: Bot,
      accent: 'from-sky-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-800/80',
      badge: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    },
    {
      id: '02',
      title: 'IoT & Smart Hardware',
      icon: Cpu,
      accent: 'from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80',
      badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    {
      id: '03',
      title: 'Mindfulness & Mental Health',
      icon: HeartHandshake,
      accent: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80',
      badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
    {
      id: '04',
      title: 'Campus & Academics',
      icon: GraduationCap,
      accent: 'from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80',
      badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    {
      id: '05',
      title: 'Habits, Games & Ethics',
      icon: Gamepad2,
      accent: 'from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/80',
      badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    {
      id: '06',
      title: 'Environment & Sustainability',
      icon: Leaf,
      accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80',
      badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white py-8 sm:py-12 font-sans relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        
        {/* Hero Header */}
        <header className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-sky-700 bg-sky-50 border border-sky-200/80 shadow-2xs font-display">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>National Innovation Initiative • TSH 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
            Techno Spiritual Hackathon{' '}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
              (TSH)
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Where modern engineering, artificial intelligence, and digital innovation unite with human values, mental wellness, and spiritual wellbeing.
          </p>
        </header>

        {/* SECTION 1: ABOUT TSH (Complete Full Width - Not in a card) */}
        <section className="w-full space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
              01 // OVERVIEW
            </span>
            <span className="text-xs font-semibold text-slate-400">About The Hackathon</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
              About TSH
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal max-w-4xl">
              The Techno Spiritual Hackathon (TSH) is an event where students use modern technology (like apps, AI, and websites) to solve real-world problems related to mental wellness, human values, and spiritual wellbeing.
            </p>
          </div>

          {/* Value Badges taking full width */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Real-World Impact
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Mindful Engineering
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-slate-700 border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Human Values First
            </span>
          </div>
        </section>

        {/* Clean subtle divider */}
        <div className="w-full border-t border-slate-200/70" />

        {/* SECTION 2: VISION OF TSH (Complete Full Width - Not in a card) */}
        <section className="w-full space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              02 // FUTURE VISION
            </span>
            <span className="text-xs font-semibold text-slate-400">Our Guiding North Star</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
              Vision of TSH
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-normal max-w-4xl">
              To harmoniously blend inner human wisdom with cutting-edge engineering—inspiring student developers to build purposeful, ethical, and consciousness-driven technology that uplifts society and fosters universal wellbeing.
            </p>
          </div>

          {/* Guiding Quote */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-indigo-50/60 border-l-3 border-indigo-500 border border-indigo-100/80 max-w-3xl">
            <p className="text-xs sm:text-sm italic text-indigo-950 font-medium">
              "Blending inner consciousness with digital intelligence for a better tomorrow."
            </p>
          </div>
        </section>

        {/* Clean subtle divider */}
        <div className="w-full border-t border-slate-200/70" />

        {/* SECTION 3: THEME OF TSH (Interactive Bento Grid without explanation) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 px-0.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  03 // CATEGORIES
                </span>
                <span className="text-xs font-semibold text-slate-400">Core Hackathon Tracks</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
                Theme of TSH
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              6 Diverse Domains • Zero Boundaries
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {themes.map((theme) => {
              const IconComp = theme.icon;
              return (
                <div
                  key={theme.id}
                  className="group p-3.5 sm:p-4 rounded-xl bg-white/85 backdrop-blur-xs border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-gradient-to-br ${theme.accent} group-hover:scale-105 transition-transform duration-200 shadow-2xs`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        Track {theme.id}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-display truncate">
                        {theme.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg text-slate-300 group-hover:text-slate-800 group-hover:bg-slate-100 transition-colors shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: CONNECTED TIMELINE (Day 1 & Day 2) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 px-0.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  04 // TIMELINE
                </span>
                <span className="text-xs font-semibold text-slate-400">Step-by-Step Schedule</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">
                Hackathon Timeline & Rounds
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Two Milestone Stages
            </span>
          </div>

          {/* Connected Timeline Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* DAY 1 CARD */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-xs border border-sky-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Stage Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-sky-50 text-sky-700 border border-sky-300">
                      <Presentation className="w-3 h-3" />
                      <span>DAY 01</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                      Day 1 — PPT Round
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      <span>Approx. 8:00 AM – 8:00 PM</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 shrink-0">
                    Presentation
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70">
                    <div className="w-5.5 h-5.5 rounded-lg bg-sky-500 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      1
                    </div>
                    <p className="leading-relaxed">
                      Students present their ideas through PPT slides to assigned judges in their allocated rooms.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70">
                    <div className="w-5.5 h-5.5 rounded-lg bg-sky-500 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      2
                    </div>
                    <p className="leading-relaxed">
                      Judges score the presentations.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-sky-50/80 border border-sky-200/80">
                    <div className="w-5.5 h-5.5 rounded-lg bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      3
                    </div>
                    <p className="leading-relaxed font-semibold text-sky-950">
                      By the end of the day (around 8:00 PM), announce which teams qualify for the final round.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 1 Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>Stage 1 Evaluation</span>
                <span className="flex items-center gap-1">
                  Qualifiers advance to Day 2 <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* DAY 2 CARD */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-xs border border-emerald-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Stage Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-50 text-emerald-700 border border-emerald-300">
                      <Award className="w-3 h-3" />
                      <span>DAY 02</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                      Day 2 — Prototype Round & Winners
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Approx. 8:00 AM – 8:00 PM</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                    Demo & Prizes
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70">
                    <div className="w-5.5 h-5.5 rounded-lg bg-emerald-500 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      1
                    </div>
                    <p className="leading-relaxed">
                      Shortlisted teams build and show their working prototypes (working apps/models) to the judges.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70">
                    <div className="w-5.5 h-5.5 rounded-lg bg-emerald-500 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      2
                    </div>
                    <p className="leading-relaxed">
                      Judges test the working models.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                    <div className="w-5.5 h-5.5 rounded-lg bg-emerald-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      3
                    </div>
                    <p className="leading-relaxed font-semibold text-emerald-950">
                      Declare the final results (around 5:00 PM) and give out prizes, trophies, and certificates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 2 Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Grand Finale</span>
                <span className="flex items-center gap-1">
                  Prizes & Certificates <Award className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: CALL TO ACTION BANNER */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left relative overflow-hidden">
          <div className="space-y-1 relative z-10 max-w-xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
              Limited Seats Available
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold font-display">
              Ready to Build Conscious Technology?
            </h3>
            <p className="text-xs text-slate-300">
              Browse available Problem Statements across the 6 tracks and reserve your team's slot before capacity fills up.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <Link
              to="/ps"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Explore Problem Statements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
