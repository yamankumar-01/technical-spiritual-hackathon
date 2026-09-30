import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return null;

  return (
    <footer className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 mt-20 transition-colors duration-200 font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Column 1: Brand & Philosophy (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center p-1.5 shadow-xs shrink-0 overflow-hidden">
                <img src="/tsh-logo.png" alt="TSH Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display leading-tight">
                  Techno Spiritual Hackathon (TSH)
                </h3>
                <p className="text-xs sm:text-sm text-sky-600 dark:text-sky-400 font-medium mt-0.5 font-display">
                  Hosted at JECRC Foundation, Jaipur • National Conclave
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-0 sm:pr-4 font-sans">
              A 24-hour immersive national innovation conclave challenging visionary student minds
              to engineer empathetic, mindful, and purpose-driven technological solutions for humanity.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200/80 dark:border-sky-800/60 text-xs font-medium text-sky-600 dark:text-sky-400 font-display">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>Theme: Consciousness • Ethics • Decentralization • Healing</span>
            </div>
          </div>

          {/* Column 2: Quick Links (3 Cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-display flex items-center gap-2">
              <span>Explore TSH</span>
              <span className="h-px w-6 bg-sky-500/40"></span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              {[
                { to: '/', label: 'Home Overview' },
                { to: '/about', label: 'About the Movement' },
                { to: '/ps', label: 'Problem Statements (Live Seats)' },
                { to: '/register-team', label: 'Team Registration Flow' },
                { to: '/contact', label: 'Contact & Venue' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500/60 shrink-0"></span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Venue Info (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-display flex items-center gap-2">
              <span>Host Campus & Venue</span>
              <span className="h-px w-6 bg-sky-500/40"></span>
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-slate-200 block text-xs">JECRC Foundation Campus</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Shri Ram ki Nangal, via Sitapura RIICO, Tonk Road, Jaipur - 302022</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">SRC Desk: </span>
                  <a href="mailto:src@jecrc.ac.in" className="font-medium text-sky-600 dark:text-sky-400 hover:underline transition-colors">src@jecrc.ac.in</a>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href="https://jecrcfoundation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800/60 transition-all shadow-xs font-display"
                >
                  <span>jecrcfoundation.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Sub-Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3 text-center sm:text-left font-sans">
          <p>© 2026 Techno Spiritual Hackathon (TSH). All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400 font-display">
            Built with purpose & reverence for the future of tech.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
