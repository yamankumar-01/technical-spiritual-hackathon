import React from 'react';

/**
 * FloatingOverlapBar
 * Signature Floating Glassmorphic Overlap Bar:
 * A white, semi-transparent, rounded card (border-radius ~20-24px) positioned so it
 * visually overlaps the bottom edge of the hero section/image (roughly half inside, half outside).
 *
 * @param {React.ReactNode} children - Form fields, dropdowns, search bar, or action buttons
 * @param {string} overlapClass - Negative margin class (default '-mt-10 sm:-mt-14')
 * @param {string} maxWidth - Max width class (default 'max-w-5xl')
 * @param {string} className - Additional CSS classes
 */
export const FloatingOverlapBar = ({
  children,
  overlapClass = '-mt-10 sm:-mt-14',
  maxWidth = 'max-w-5xl',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative ${overlapClass} z-20 ${maxWidth} mx-auto px-4 sm:px-6 ${className}`} {...props}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-[24px] p-4 sm:p-6 shadow-[0_15px_35px_rgba(18,20,26,0.08)] border border-white/85 transition-all hover:shadow-[0_20px_45px_rgba(18,20,26,0.11)]">
        {children}
      </div>
    </div>
  );
};

export default FloatingOverlapBar;
