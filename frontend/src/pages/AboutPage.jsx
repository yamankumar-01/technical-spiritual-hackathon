import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Building2,
  ExternalLink,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  Compass,
  Zap,
  Target,
  Clock,
  Users,
} from 'lucide-react';

export const AboutPage = () => {
  const steps = [
    {
      time: 'Hours 00 – 04',
      title: 'Mindful Alignment & Architecture',
      desc: 'Teams analyze their declared Problem Statement alongside industry mentors, setting architectural foundations that prioritize ethical considerations, data privacy, and end-user peace of mind.',
    },
    {
      time: 'Hours 04 – 18',
      title: 'Deep Engineering Crucible',
      desc: 'Unbroken build sprint. Teams implement full-stack code, AI pipelines, or hardware prototypes with midnight mindfulness checkpoints to keep developers energized and clear-headed.',
    },
    {
      time: 'Hours 18 – 24',
      title: 'Live Pitching & Incubation Evaluation',
      desc: 'Live functional demonstrations evaluated by industry veterans and academics. Winning solutions unlock direct pre-incubation mentorship and grant pathways at JECRC Foundation.',
    },
  ];

  const guarantees = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#2EB88A]" />,
      title: '100% Team IP Ownership',
      desc: 'You and your team retain full, unencumbered rights to the source code, designs, and intellectual property engineered during TSH.',
    },
    {
      icon: <Target className="w-5 h-5 text-[#2EB88A]" />,
      title: 'Capped & Focused Tracks',
      desc: 'With strictly 5 teams per Problem Statement, there is zero chaotic noise. Every participant receives genuine attention from technical juries.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#2EB88A]" />,
      title: 'Post-Hackathon Incubation',
      desc: 'Top projects receive direct support through the JECRC Incubation Centre (JIC) for pilot testing, prototyping grants, and startup incorporation.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-20">
      
      {/* 1. Header Manifesto */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#2EB88A]" />
          <span>National Techno-Spiritual Conclave 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#12141A] dark:text-white font-['Outfit'] tracking-tight leading-[1.12]">
          Where Ancient Wisdom <br className="hidden sm:inline" />
          <span className="text-[#1E9470] dark:text-[#2EB88A]">Meets Modern Silicon</span>
        </h1>

        <p className="text-base sm:text-lg text-[#536159] dark:text-slate-300 leading-relaxed font-normal">
          The Techno Spiritual Hackathon (TSH) redefines the standard hackathon format. Rather than building for engagement loops or vanity metrics, we challenge India's brightest student engineers to build technology with conscience.
        </p>

        {/* Stats Row */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#071510]/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <span className="text-2xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">24</span>
            <span className="block text-xs text-[#536159] dark:text-slate-400 font-medium mt-0.5">Continuous Hours</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#071510]/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <span className="text-2xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">10</span>
            <span className="block text-xs text-[#536159] dark:text-slate-400 font-medium mt-0.5">Problem Themes</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#071510]/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <span className="text-2xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">50</span>
            <span className="block text-xs text-[#536159] dark:text-slate-400 font-medium mt-0.5">Selected Teams</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#071510]/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <span className="text-2xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">4</span>
            <span className="block text-xs text-[#536159] dark:text-slate-400 font-medium mt-0.5">Coders Per Team</span>
          </div>
        </div>
      </section>

      {/* 2. The Contrast: The Paradigm Shift */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] font-mono">
            The Paradigm Shift
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            Re-engineering the Purpose of Software
          </h2>
          <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-300 leading-relaxed">
            Technology is the most potent amplifier of human intent ever devised. But when disconnected from human values, it risks creating more fragmentation than connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Conventional View */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <span>Conventional Hackathon Track</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Optimizing algorithms purely for user screen time and constant ad impressions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Building superficial prototypes aimed merely at winning cash and discarding the codebase.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Burnout sprints that celebrate sleeplessness over clear, sustainable problem solving.</span>
              </li>
            </ul>
          </div>

          {/* Right Column: TSH View */}
          <div className="p-6 rounded-2xl bg-[#EBF8F2]/60 dark:bg-[#2EB88A]/10 border border-[#2EB88A]/30 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#DDF5EB] dark:bg-[#2EB88A]/25 text-[#1E9470] dark:text-[#2EB88A] text-xs font-bold">
              <Sparkles className="w-3 h-3" />
              <span>The TSH Approach</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#12141A] dark:text-slate-200 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#2EB88A] font-bold">✓</span>
                <span>Prioritizing attention preservation, calm UX, and software that respects human mental bandwidth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2EB88A] font-bold">✓</span>
                <span>Real-world solutions in mental health, organic cultivation, acoustic therapy, and wisdom archiving.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2EB88A] font-bold">✓</span>
                <span>Mindful work rhythm with active industry mentor feedback and post-event incubation pathways.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. The 24-Hour Journey Flow */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E9470] dark:text-[#2EB88A] font-mono">
            Event Structure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            How The 24 Hours Unfold
          </h2>
          <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400">
            A structured, high-energy offline conclave designed for depth and genuine production output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 space-y-3.5 shadow-xs relative"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 text-[#1E9470] dark:text-[#2EB88A] text-[11px] font-bold font-mono">
                <Clock className="w-3 h-3" />
                <span>{step.time}</span>
              </div>
              <h3 className="text-base font-bold text-[#12141A] dark:text-white font-['Outfit']">
                {step.title}
              </h3>
              <p className="text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Three Core Guarantees for Participants */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guarantees.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 space-y-3 shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#DDF5EB] dark:bg-[#2EB88A]/15 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-base font-bold text-[#12141A] dark:text-white font-['Outfit']">
              {item.title}
            </h3>
            <p className="text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* 5. Host Institution: JECRC Foundation */}
      <section className="p-7 sm:p-9 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] font-mono">
                Host Academic Partner
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#12141A] dark:text-white font-['Outfit']">
                JECRC Foundation, Jaipur
              </h3>
            </div>
          </div>

          <a
            href="https://jecrcfoundation.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#DDF5EB] hover:bg-[#cbf1e1] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:hover:bg-[#2EB88A]/30 dark:text-[#2EB88A] transition-all shrink-0 w-fit"
          >
            <span>Visit Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#536159] dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#1E9470] dark:text-[#2EB88A] font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Campus Address</span>
            </div>
            <p className="leading-relaxed">
              Sitapura Industrial Area, Opposite EPIP Gate, Tonk Road, Jaipur – 302022, Rajasthan, India
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#1E9470] dark:text-[#2EB88A] font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Infrastructure</span>
            </div>
            <p className="leading-relaxed">
              Gigabit networking, dedicated server access, hardware labs, and 24/7 technical logistics support.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#1E9470] dark:text-[#2EB88A] font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Hospitality & Care</span>
            </div>
            <p className="leading-relaxed">
              All meals, refreshments, resting areas, security, and quiet contemplation zones provided on campus.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Clean Minimalist Action Card */}
      <section className="rounded-3xl bg-gradient-to-r from-[#DDF5EB]/80 via-white/95 to-[#EBF8F2]/80 dark:from-[#071510] dark:via-[#091a14] dark:to-[#071510] border border-[#2EB88A]/30 p-8 sm:p-12 text-center space-y-5 shadow-xs">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
          Ready to Code for Real Impact?
        </h2>
        <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Select your problem statement early. Registrations operate on real-time slot availability capped at 5 teams per track.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/ps"
            className="px-6 py-3 rounded-full text-xs font-bold bg-[#2EB88A] hover:bg-[#1E9470] text-white transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Explore Problem Statements</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 text-[#12141A] dark:text-white border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
          >
            Register Your Team
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
