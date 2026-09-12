import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * PillNavbar
 * Floating rounded pill navbar with glassmorphism, responsive navigation links, and primary CTA.
 *
 * @param {React.ReactNode} logo - Brand logo or wordmark element
 * @param {Array<{ label: string, href: string, active?: boolean, onClick?: () => void }>} links - Nav links
 * @param {{ label: string, onClick?: () => void, href?: string }} cta - Primary action button
 * @param {string} maxWidth - Container max width class (default 'max-w-6xl')
 * @param {string} className - Additional CSS classes
 */
export const PillNavbar = ({
  logo,
  links = [],
  cta,
  maxWidth = 'max-w-6xl',
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 ${maxWidth} mx-auto relative z-30 ${className}`}>
      <nav className="bg-white/95 backdrop-blur-md rounded-full px-5 sm:px-8 py-3 sm:py-3.5 shadow-[0_10px_30px_rgba(18,20,26,0.06)] border border-white/85 flex items-center justify-between transition-all">
        {/* Left: Brand / Logo */}
        <div className="flex items-center shrink-0">
          {logo}
        </div>

        {/* Center-Left: Desktop Navigation Links */}
        {links && links.length > 0 && (
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[14px] sm:text-[15px]">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href || '#'}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className={`transition-colors font-medium ${
                  link.active
                    ? 'text-[#1E9470] font-semibold relative after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#1E9470] after:rounded-full'
                    : 'text-[#5B6470] hover:text-[#12141A]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Right: CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {cta && (
            cta.href ? (
              <a
                href={cta.href}
                className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_18px_rgba(46,184,138,0.35)] hover:shadow-[0_8px_24px_rgba(46,184,138,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center"
              >
                {cta.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={cta.onClick}
                className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#2EB88A] to-[#1E9470] shadow-[0_6px_18px_rgba(46,184,138,0.35)] hover:shadow-[0_8px_24px_rgba(46,184,138,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {cta.label}
              </button>
            )
          )}

          {/* Mobile hamburger button */}
          {links && links.length > 0 && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#5B6470] hover:bg-[#DDF5EB] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown sheet */}
      {mobileMenuOpen && links && links.length > 0 && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-[0_15px_35px_rgba(18,20,26,0.08)] border border-white/85 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href || '#'}
              onClick={(e) => {
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                }
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                link.active
                  ? 'bg-[#DDF5EB] text-[#1E9470] font-semibold'
                  : 'text-[#5B6470] hover:bg-slate-50'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default PillNavbar;
