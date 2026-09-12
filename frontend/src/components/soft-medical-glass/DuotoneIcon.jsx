import React from 'react';

/**
 * DuotoneIcon
 * Signature two-tone icon pattern: A flat colored glyph sitting inside a soft pale rounded blob of the same hue family.
 *
 * @param {React.ReactNode | React.ComponentType} icon - Lucide icon component or custom SVG/element
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Dimension scale of the blob and icon
 * @param {string} blobColor - Optional custom background for the blob (defaults to pale mint #DDF5EB)
 * @param {string} iconColor - Optional custom glyph color (defaults to primary emerald-mint #2EB88A)
 * @param {string} className - Additional CSS classes
 */
export const DuotoneIcon = ({
  icon: Icon,
  size = 'md',
  blobColor = 'bg-[#DDF5EB]',
  iconColor = 'text-[#2EB88A]',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 rounded-3xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl',
  };

  const iconSizes = {
    sm: 18,
    md: 26,
    lg: 32,
    xl: 38,
  };

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    if (typeof Icon === 'function' || typeof Icon === 'object') {
      const IconComponent = Icon;
      return <IconComponent size={iconSizes[size] || 26} strokeWidth={2} />;
    }
    return Icon;
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${sizeClasses[size] || sizeClasses.md} ${blobColor} ${iconColor} ${className}`}
      {...props}
    >
      {renderIcon()}
    </div>
  );
};

export default DuotoneIcon;
