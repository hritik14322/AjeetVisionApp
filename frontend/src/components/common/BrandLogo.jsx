import React from 'react';

/**
 * Reusable BrandLogo component using authentic original logo and colors
 */
export const BrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'dark', // 'dark' (original colors for light bg) | 'light' (white text for dark bg)
  showSymbol = true,
  showName = true,
  className = '',
  onClick,
}) => {
  const fullSizes = {
    sm: 'h-6 max-h-6',
    md: 'h-7 sm:h-8 max-h-8',
    lg: 'h-9 sm:h-10 max-h-10',
    xl: 'h-12 sm:h-14 max-h-14',
  };

  const symbolSizes = {
    sm: 'w-7 h-6',
    md: 'w-8 h-7',
    lg: 'w-11 h-9',
    xl: 'w-14 h-12',
  };

  const textSizes = {
    sm: 'h-5 max-w-[120px]',
    md: 'h-6 sm:h-7 max-w-[155px]',
    lg: 'h-8 sm:h-9 max-w-[190px]',
    xl: 'h-10 sm:h-12 max-w-[240px]',
  };

  // If showing both symbol & name on standard light background, use the authentic full original logo directly
  if (showSymbol && showName && variant === 'dark') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <img
          src="/nav-logo-full.png"
          alt="New AJEET Vision"
          className={`${fullSizes[size] || fullSizes.md} object-contain flex-shrink-0 drop-shadow-xs transition-transform hover:scale-105`}
        />
      </div>
    );
  }

  const textSrc = variant === 'light' 
    ? '/nav-brand-text-white.png' 
    : '/nav-brand-text.png';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {showSymbol && (
        <img
          src="/nav-logo.png"
          alt="New Ajeet Vision Logo"
          className={`${symbolSizes[size] || symbolSizes.md} object-contain flex-shrink-0 drop-shadow-xs transition-transform hover:scale-105`}
        />
      )}

      {showName && (
        <img
          src={textSrc}
          alt="New AJEET Vision"
          className={`${textSizes[size] || textSizes.md} object-contain flex-shrink-0`}
        />
      )}
    </div>
  );
};
