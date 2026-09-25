import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Compass, Shield, Users, ArrowRight, BookOpen, MapPin, Building2, ExternalLink } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full bg-white dark:bg-[#071510] border-2 border-[#2EB88A]/40 p-2.5 sm:p-3.5 shadow-xl flex items-center justify-center overflow-hidden">
          <img src="/tsh-logo.png" alt="TSH Logo" className="w-full h-full object-contain rounded-full" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDF5EB] dark:bg-[#2EB88A]/15 border border-[#2EB88A]/30 text-[#1E9470] dark:text-[#2EB88A] text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(46,184,138,0.15)]">
          <span>The Story of TSH</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
          Awakening Consciousness in the Age of Silicon
        </h1>
        <p className="text-base text-[#536159] dark:text-slate-300 leading-relaxed">
          The Techno Spiritual Hackathon (TSH) was conceived from an urgent modern paradox: as our
          computational powers reach astronomical heights, human tranquility, genuine connection, and
          ethical clarity face unprecedented attrition.
        </p>
      </div>

      {/* Mission & Vision Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 space-y-4 shadow-[0_12px_36px_rgba(18,20,26,0.06)]">
          <div className="w-14 h-14 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] flex items-center justify-center text-3xl">
            🌱
          </div>
          <h2 className="text-2xl font-bold text-[#12141A] dark:text-white font-['Outfit']">Our Sacred Vision</h2>
          <p className="text-sm text-[#536159] dark:text-slate-300 leading-relaxed">
            We envision a technological landscape where engineers build not just for user capture or
            shareholder extraction, but for inner peace, collective upliftment, and sustainable harmony.
            Technology is an amplifier of human intent; when intent is grounded in conscious mindfulness
            and selfless service (Seva), tech becomes an instrument of universal healing.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 space-y-4 shadow-[0_12px_36px_rgba(18,20,26,0.06)]">
          <div className="w-14 h-14 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] flex items-center justify-center text-3xl">
            ⚡
          </div>
          <h2 className="text-2xl font-bold text-[#12141A] dark:text-white font-['Outfit']">Our Rigorous Mission</h2>
          <p className="text-sm text-[#536159] dark:text-slate-300 leading-relaxed">
            TSH provides a competitive yet deeply collaborative crucible. Over 24 unbroken hours, teams of 4
            design production-grade prototypes addressing attention ethics, sacred agritech, acoustic
            neurology, and ancient wisdom preservation. Here, clean code and profound purpose are one.
          </p>
        </div>
      </div>

      {/* Four Guiding Mantras */}
      <div className="space-y-8 pt-6 border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E9470] dark:text-[#2EB88A] font-mono">
            Core Tenets
          </span>
          <h2 className="text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
            The Four Pillars of TSH
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#071510]/90 backdrop-blur-md border border-white/80 dark:border-white/10 space-y-3 shadow-[0_8px_24px_rgba(18,20,26,0.05)] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 flex items-center justify-center text-2xl">
              🧘
            </div>
            <h3 className="text-base font-bold text-[#12141A] dark:text-slate-100 font-['Outfit']">Conscious Attention</h3>
            <p className="text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
              Designing software that protects mental bandwidth rather than inducing addictive dopamine
              feedback loops.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#071510]/90 backdrop-blur-md border border-white/80 dark:border-white/10 space-y-3 shadow-[0_8px_24px_rgba(18,20,26,0.05)] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <h3 className="text-base font-bold text-[#12141A] dark:text-slate-100 font-['Outfit']">Ethical Autonomy</h3>
            <p className="text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
              Decentralized protocols and transparent AI architectures that safeguard individual sovereignty
              and dignity.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#071510]/90 backdrop-blur-md border border-white/80 dark:border-white/10 space-y-3 shadow-[0_8px_24px_rgba(18,20,26,0.05)] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 flex items-center justify-center text-2xl">
              🌿
            </div>
            <h3 className="text-base font-bold text-[#12141A] dark:text-slate-100 font-['Outfit']">Sacred Ecology</h3>
            <p className="text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
              Computing models and physical-digital systems engineered with reverence for the Earth and
              organic cultivators.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#071510]/90 backdrop-blur-md border border-white/80 dark:border-white/10 space-y-3 shadow-[0_8px_24px_rgba(18,20,26,0.05)] hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 flex items-center justify-center text-2xl">
              🕊️
            </div>
            <h3 className="text-base font-bold text-[#12141A] dark:text-slate-100 font-['Outfit']">Selfless Impact (Seva)</h3>
            <p className="text-xs text-[#536159] dark:text-slate-400 leading-relaxed">
              Direct micro-relief and community tools that measure success by human smiles and alleviated
              suffering.
            </p>
          </div>
        </div>
      </div>

      {/* Host Institution: JECRC Foundation Block */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#071510]/95 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(18,20,26,0.06)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#DDF5EB] dark:bg-[#2EB88A]/20 text-[#2EB88A] flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E9470] dark:text-[#2EB88A] font-mono">
                Host Academic Institution
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
                JECRC Foundation, Jaipur
              </h2>
              <p className="text-xs sm:text-sm text-[#536159] dark:text-slate-400 mt-0.5">
                Jaipur Engineering College and Research Centre • Premier Technical & Innovation Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://jecrcfoundation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-[#DDF5EB] hover:bg-[#cbf1e1] text-[#1E9470] dark:bg-[#2EB88A]/20 dark:hover:bg-[#2EB88A]/30 dark:text-[#2EB88A] transition-all shadow-2xs cursor-pointer"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-[#536159] dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-[#EBF8F2]/40 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-[#1E9470] dark:text-[#2EB88A] font-bold">
              <MapPin className="w-4 h-4" />
              <span>Campus Location</span>
            </div>
            <p className="leading-relaxed">
              Shri Ram ki Nangal, via Sitapura RIICO, Opposite EPIP Gate, Tonk Road, Jaipur – 302022, Rajasthan, India
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EBF8F2]/40 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-[#1E9470] dark:text-[#2EB88A] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Innovation Ecosystem</span>
            </div>
            <p className="leading-relaxed">
              Equipped with JECRC Incubation Centre, advanced computing facilities, AI/Robotics labs, and a 25+ year pedigree of hosting national-level hackathons.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EBF8F2]/40 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-[#1E9470] dark:text-[#2EB88A] font-bold">
              <Users className="w-4 h-4" />
              <span>Welcoming India's Builders</span>
            </div>
            <p className="leading-relaxed">
              Welcoming 200+ selected developers, designers, and thinkers to an inspiring 24-hour physical hackathon experience in the Pink City.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#DDF5EB]/70 via-white/80 to-[#EBF8F2]/70 dark:from-[#071510]/90 dark:via-[#0b2119]/90 dark:to-[#071510]/90 border border-[#2EB88A]/20 p-8 sm:p-12 text-center space-y-6 shadow-[0_15px_40px_rgba(46,184,138,0.1)]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12141A] dark:text-white font-['Outfit']">
          Ready to Build Something Meaningful?
        </h2>
        <p className="text-sm text-[#536159] dark:text-slate-300 max-w-xl mx-auto">
          Seats are capped at 5 teams per Problem Statement to ensure direct mentorship, profound depth,
          and genuine impact.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/ps"
            className="px-8 py-3.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#2EB88A] to-[#1E9470] text-white hover:brightness-105 transition-all flex items-center gap-2 shadow-[0_8px_20px_rgba(46,184,138,0.25)] cursor-pointer"
          >
            <span>Explore Problem Statements</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3.5 rounded-full text-xs font-semibold bg-white/90 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-[#12141A] dark:text-slate-200 border border-slate-200/80 dark:border-white/10 transition-all shadow-[0_4px_16px_rgba(18,20,26,0.04)] cursor-pointer"
          >
            Contact Secretariat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
