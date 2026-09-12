import React from 'react';

/**
 * HeroCard
 * Signature Card-Style Hero Container:
 * The hero lives inside a large rounded-corner card (border-radius ~24-32px),
 * with a responsive two-column split (text content on one side, media/visual on the other).
 *
 * @param {React.ReactNode} tag - Optional badge or status tag above heading
 * @param {React.ReactNode | string} title - Large hero heading
 * @param {React.ReactNode | string} subtitle - Secondary description text
 * @param {React.ReactNode} media - Visual element (image, video, illustration, interactive preview)
 * @param {'right' | 'left'} mediaPosition - Position of media column on desktop (default 'right')
 * @param {React.ReactNode} actions - Call to action buttons or trust indicators
 * @param {React.ReactNode} children - Optional extra children rendered below description
 * @param {string} maxWidth - Max width class (default 'max-w-6xl')
 * @param {string} className - Additional CSS classes
 */
export const HeroCard = ({
  tag,
  title,
  subtitle,
  media,
  mediaPosition = 'right',
  actions,
  children,
  maxWidth = 'max-w-6xl',
  className = '',
}) => {
  return (
    <section className={`px-4 sm:px-6 lg:px-8 ${maxWidth} mx-auto mt-4 sm:mt-6 ${className}`}>
      <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#EBF8F2]/80 backdrop-blur-md rounded-[28px] sm:rounded-[36px] shadow-[0_15px_40px_rgba(18,20,26,0.06)] border border-white/85 p-6 sm:p-10 lg:p-12 overflow-hidden transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content Column */}
          <div
            className={`space-y-4 sm:space-y-6 lg:col-span-6 ${
              mediaPosition === 'left' ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            {/* Tag/Badge */}
            {tag && (
              <div className="inline-block">
                {typeof tag === 'string' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDF5EB] text-[#1E9470] text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#2EB88A] animate-pulse" />
                    <span>{tag}</span>
                  </div>
                ) : (
                  tag
                )}
              </div>
            )}

            {/* Main Heading */}
            {typeof title === 'string' ? (
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#12141A] tracking-tight leading-[1.1]">
                {title}
              </h1>
            ) : (
              title
            )}

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm sm:text-base text-[#5B6470] font-normal leading-relaxed max-w-md">
                {subtitle}
              </p>
            )}

            {/* Actions / Buttons */}
            {actions && (
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                {actions}
              </div>
            )}

            {/* Extra children */}
            {children}
          </div>

          {/* Media Column */}
          {media && (
            <div
              className={`lg:col-span-6 ${
                mediaPosition === 'left' ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              <div className="relative w-full rounded-[22px] sm:rounded-[30px] overflow-hidden shadow-sm">
                {media}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroCard;
