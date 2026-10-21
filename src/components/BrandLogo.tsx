import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showCopyright?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  theme = 'dark',
  size = 'md',
  showCopyright = true,
}) => {
  const isWhite = theme === 'light';
  const [imageError, setImageError] = useState(false);

  // Dimension scaling
  const glyphHeights = {
    sm: 'h-5',
    md: 'h-6 sm:h-7',
    lg: 'h-8 sm:h-9',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const copySizes = {
    sm: 'text-[8px] -translate-y-1',
    md: 'text-[9px] -translate-y-1.5',
    lg: 'text-[11px] -translate-y-2',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* Modern Minimal S-Ribbon Geometric Logo Glyph */}
      <div className="relative flex items-center justify-center shrink-0">
        {!imageError ? (
          <img
            src={isWhite ? '/assets/painfinder_logo_white.png' : '/assets/painfinder_logo_dark.png'}
            alt="Pain Finder Logo"
            draggable={false}
            loading="eager"
            onError={() => setImageError(true)}
            className={`${glyphHeights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
          />
        ) : (
          /* Pure Mathematical Vector SVG Fallback */
          <svg
            className={`${glyphHeights[size]} w-auto transition-transform duration-200 group-hover:scale-105`}
            viewBox="0 0 100 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 50 40 L 96 40 L 68 12 C 54 -2 30 -2 16 12 C 2 26 2 50 16 64 L 30 64 C 20 54 20 38 30 28 C 40 18 56 18 66 28 L 50 40 Z"
              fill={isWhite ? '#FFFFFF' : '#0A0A0A'}
            />
            <path
              d="M 50 40 L 4 40 L 32 68 C 46 82 70 82 84 68 C 98 54 98 30 84 16 L 70 16 C 80 26 80 42 70 52 C 60 62 44 62 34 52 L 50 40 Z"
              fill={isWhite ? '#FFFFFF' : '#0A0A0A'}
            />
          </svg>
        )}
      </div>

      {/* Modern Lowercase Geometric Wordmark with Copyright symbol */}
      <div className="flex items-baseline font-sans leading-none">
        <span
          className={`font-bold tracking-[-0.035em] lowercase ${textSizes[size]} ${
            isWhite ? 'text-white' : 'text-[#0A0A0A]'
          }`}
        >
          painfinder
        </span>
        {showCopyright && (
          <span
            className={`inline-block font-normal font-mono ml-0.5 ${copySizes[size]} ${
              isWhite ? 'text-neutral-400' : 'text-neutral-400'
            }`}
          >
            ©
          </span>
        )}
      </div>
    </div>
  );
};
