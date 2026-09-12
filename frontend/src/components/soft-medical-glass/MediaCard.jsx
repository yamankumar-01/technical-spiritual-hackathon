import React from 'react';

/**
 * MediaCard
 * Media + Text Stacked Card Pattern:
 * Rounded-corner photo on top with subtle color-grade tint overlay, bold title below,
 * short gray description below that, white card background, no harsh borders, diffused shadow.
 *
 * @param {string} image - Image URL
 * @param {string} imageAlt - Image alt text
 * @param {string} badge - Optional overlay badge on image
 * @param {React.ReactNode | string} title - Card title
 * @param {React.ReactNode | string} description - Card description
 * @param {React.ReactNode} footer - Optional bottom action or link
 * @param {() => void} onClick - Optional click handler
 * @param {string} imageHeight - Height class for image (default 'h-44 sm:h-48')
 * @param {string} className - Additional CSS classes
 */
export const MediaCard = ({
  image,
  imageAlt = 'Card media preview',
  badge,
  title,
  description,
  footer,
  onClick,
  imageHeight = 'h-44 sm:h-48',
  className = '',
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(18,20,26,0.06)] border border-white/85 transition-all flex flex-col group ${
        onClick ? 'cursor-pointer hover:shadow-[0_15px_35px_rgba(18,20,26,0.10)] hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {/* Top Rounded Photo with Subtle Cyan Grade Overlay */}
      {image && (
        <div className={`relative w-full ${imageHeight} rounded-xl sm:rounded-2xl overflow-hidden mb-3.5 sm:mb-4 bg-slate-100 shrink-0`}>
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Color-grade subtle tint overlay */}
          <div className="absolute inset-0 bg-[#2EB88A]/12 mix-blend-color pointer-events-none" />

          {/* Optional badge */}
          {badge && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-semibold text-[#1E9470] px-2.5 py-1 rounded-full shadow-sm">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      {typeof title === 'string' ? (
        <h3 className="text-base sm:text-lg font-bold text-[#12141A] mb-1.5 leading-snug">
          {title}
        </h3>
      ) : (
        title
      )}

      {/* Description */}
      {description && (
        <p className="text-xs sm:text-sm text-[#5B6470] leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>
      )}

      {/* Footer / CTA Action */}
      {footer && (
        <div className="mt-auto pt-1">
          {footer}
        </div>
      )}
    </div>
  );
};

export default MediaCard;
