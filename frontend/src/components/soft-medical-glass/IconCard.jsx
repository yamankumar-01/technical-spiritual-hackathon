import React from 'react';
import DuotoneIcon from './DuotoneIcon';

/**
 * IconCard
 * Signature Icon-Card Pattern:
 * Centered duotone icon-in-blob at top, bold title/label centered below,
 * generous padding, heavy rounded corners, and soft diffused shadow.
 *
 * @param {React.ReactNode | React.ComponentType} icon - Icon component or element
 * @param {React.ReactNode | string} title - Card title / label
 * @param {React.ReactNode | string} description - Optional secondary description
 * @param {string} badge - Optional small tag
 * @param {() => void} onClick - Optional click handler
 * @param {boolean} active - Active/selected state
 * @param {'sm' | 'md' | 'lg'} iconSize - Size of top icon blob (default 'md')
 * @param {string} className - Additional CSS classes
 */
export const IconCard = ({
  icon,
  title,
  description,
  badge,
  onClick,
  active = false,
  iconSize = 'md',
  className = '',
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 shadow-[0_10px_30px_rgba(18,20,26,0.06)] border transition-all flex flex-col items-center text-center group ${
        onClick ? 'cursor-pointer hover:shadow-[0_15px_35px_rgba(18,20,26,0.10)] hover:-translate-y-1' : ''
      } ${
        active
          ? 'border-[#2EB88A] ring-2 ring-[#2EB88A]/20'
          : 'border-white/85 hover:border-[#DDF5EB]'
      } ${className}`}
      {...props}
    >
      {/* Top Duotone Icon in Blob */}
      <div className="mb-2.5 sm:mb-4">
        {React.isValidElement(icon) && icon.type === DuotoneIcon ? (
          icon
        ) : (
          <DuotoneIcon icon={icon} size={iconSize} />
        )}
      </div>

      {/* Optional Badge */}
      {badge && (
        <span className="mb-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DDF5EB] text-[#1E9470]">
          {badge}
        </span>
      )}

      {/* Title / Label */}
      {typeof title === 'string' ? (
        <h3 className="text-xs sm:text-base lg:text-lg font-bold text-[#12141A] leading-snug mb-1">
          {title}
        </h3>
      ) : (
        title
      )}

      {/* Optional Description */}
      {description && (
        <p className="hidden sm:block text-xs text-[#5B6470] leading-relaxed line-clamp-2 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

export default IconCard;
