import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Building2,
  ExternalLink,
  Clock,
  Layers,
  Users,
  Compass,
  Heart,
  Shield,
  Leaf,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage = () => {
  const pillars = [
    {
      num: '01',
      title: 'Conscious Attention',
      icon: '🧘',
      desc: 'Engineering digital interfaces that nurture presence, mental clarity, and focus over dopamine-driven addiction.',
    },
    {
      num: '02',
      title: 'Ethical Autonomy',
      icon: '⚖️',
      desc: 'Advancing decentralized models, privacy-by-design, and transparent AI systems that honor human agency.',
    },
    {
      num: '03',
      title: 'Sacred Ecology',
      icon: '🌿',
      desc: 'Synthesizing precision IoT, green cloud computing, and regenerative agritech with respect for nature.',
    },
    {
      num: '04',
      title: 'Selfless Impact (Seva)',
      icon: '🕊️',
      desc: 'Grounding high-tech solutions in compassion to uplift communities and solve real grassroot challenges.',
    },
  ];

  const highlights = [
    { label: 'Format', value: '24-Hour Offline Hackathon' },
    { label: 'Venue', value: 'JECRC Foundation, Jaipur' },
    { label: 'Team Size', value: 'Strictly 4 Members' },
    { label: 'Exclusivity', value: 'Max 5 Teams / Theme' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16 sm:space-y-20">
      
      {/* 1. Hero Section - Simple, Clean & Editorial */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs font-semibold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2EB88A]" />
          <span>The Philosophy Behind TSH 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#12141A] dark:text-white font-['Outfit'] tracking-tight leading-[1.15]">
          Awakening Consciousness <br className="hidden sm:inline" />
          <span className="text-[#1E9470] dark:text-[#2EB88A]">In the Age of Silicon</span>
        </h1>

        <p className="text-sm sm:text-base text-[#536159] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          The Techno Spiritual Hackathon brings together India’s most thoughtful developers, designers,
          and thinkers to prove that technological velocity and spiritual depth can flourish together.
        </p>

        {/* Quick Highlights Strip */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#071510]/80 border border-slate-200/80 dark:border-white/10 shadow-xs text-center backdrop-blur-sm"
            >
              <span className="block text-[11px] font-medium text-[#536159] dark:text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <span className="block text-xs sm:text-sm font-bold text-[#12141A] dark:text-slate-100 font-['Outfit'] mt-0.5">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Core Story & Dual Synthesis Section (Side-by-Side) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] font-mono">
              Why TSH Exists
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
              Beyond Fast Code: Purpose-Driven Engineering
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#536159] dark:text-slate-300 leading-relaxed">
            <p>
              In our hyper-connected world, algorithms optimize for constant screen retention and anxiety.
              TSH questions this trajectory. We believe technology is an amplifier of human intent; when intent
              is grounded in mindful calm, service (<em>Seva</em>), and ethical clarity, code transforms into an
              instrument of societal healing.
            </p>
            <p>
              Over 24 unbroken hours, 50 hand-selected teams engineer working prototypes across 10 vital
              problem areas—from digital detox and acoustic neuroscience to sustainable community supply
              chains and ancient knowledge preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2EB88A] shrink-0 mt-0.5" />
              <span className="text-xs text-[#12141A] dark:text-slate-200 font-medium">
                Focus on real human wellbeing over vanity metrics
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2EB88A] shrink-0 mt-0.5" />
              <span className="text-xs text-[#12141A] dark:text-slate-200 font-medium">
                Direct mentorship from technical and domain mentors
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2EB88A] shrink-0 mt-0.5" />
              <span className="text-xs text-[#12141A] dark:text-slate-200 font-medium">
                Fair, transparent evaluation on innovation & ethics
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2EB88A] shrink-0 mt-0.5" />
              <span className="text-xs text-[#12141A] dark:text-slate-200 font-medium">
                Post-hackathon incubation & patent support at JECRC
              </span>
            </div>
          </div>
        </div>

        {/* Right: Modern Emblem Badge Card */}
        <div className="lg:col-span-5">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-white/95 to-[#DDF5EB]/50 dark:from-[#071510] dark:via-[#091a14] dark:to-[#071510] border border-slate-200/80 dark:border-white/10 shadow-[0_15px_40px_rgba(46,184,138,0.12)] text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2EB88A]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-white border border-[#2EB88A]/30 p-2 shadow-md flex items-center justify-center overflow-hidden">
              <img src="/tsh-logo.png" alt="TSH Official Emblem" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#12141A] dark:text-white font-['Outfit']">
                Techno-Spiritual Hackathon
              </h3>
              <p className="text-xs text-[#1E9470] dark:text-[#2EB88A] font-semibold">
                Ideas for a Brighter Tomorrow
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EBF8F2]/60 dark:bg-white/5 border border-[#2EB88A]/20 text-[11px] text-[#536159] dark:text-slate-300 leading-relaxed text-left">
              "We must elevate technological mastery through moral responsibility, creating tools that honor both the intellect and the human spirit."
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Four Pillars - Clean, Numbered Editorial Cards */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E9470] dark:text-[#2EB88A] font-mono">
            Guiding Tenets
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            The Four Pillars of TSH
          </h2>
          <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400">
            Every problem statement and evaluation metric at TSH stems from these 4 core commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="p-6 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 space-y-4 shadow-xs hover:shadow-md hover:border-[#2EB88A]/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{pillar.icon}</span>
                <span className="text-xs font-bold font-mono text-[#1E9470] dark:text-[#2EB88A] bg-[#DDF5EB] dark:bg-[#2EB88A]/15 px-2.5 py-1 rounded-full">
                  {pillar.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#12141A] dark:text-slate-100 font-['Outfit'] group-hover:text-[#2EB88A] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Host Academic Partner - Clean JECRC Card */}
      <section className="p-7 sm:p-9 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] font-mono">
                Host Academic Institution
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
            <span>Visit Campus Portal</span>
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>Incubation & Facilities</span>
            </div>
            <p className="leading-relaxed">
              High-speed gigabit Wi-Fi, 24/7 maker spaces, maker lab access, and physical incubation support.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EBF8F2]/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#1E9470] dark:text-[#2EB88A] font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Participant Support</span>
            </div>
            <p className="leading-relaxed">
              Full meal arrangements, mindfulness rejuvenation zones, resting facilities, and security.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Clean, Minimalist CTA Strip */}
      <section className="rounded-3xl bg-gradient-to-r from-[#DDF5EB]/80 via-white/95 to-[#EBF8F2]/80 dark:from-[#071510] dark:via-[#091a14] dark:to-[#071510] border border-[#2EB88A]/30 p-8 sm:p-10 text-center space-y-5 shadow-xs">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
          Ready to Build with Purpose?
        </h2>
        <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Slots are limited to strictly 5 teams per Problem Statement to ensure high-touch mentorship and meaningful competition.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Link
            to="/ps"
            className="px-6 py-3 rounded-full text-xs font-bold bg-[#2EB88A] hover:bg-[#1E9470] text-white transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Explore Problem Statements</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 text-[#12141A] dark:text-white border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
          >
            Contact Secretariat
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

