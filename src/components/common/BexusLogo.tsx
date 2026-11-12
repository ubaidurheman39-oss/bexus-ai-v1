import React from 'react';

interface BexusLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  withGlow?: boolean;
}

export const BexusLogo: React.FC<BexusLogoProps> = ({ 
  size = 'md', 
  className = '',
  withGlow = false 
}) => {
  const sizeMap = {
    xs: 'w-5 h-5 text-[10px] rounded-md',
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-8 h-8 text-sm rounded-xl',
    lg: 'w-10 h-10 text-base rounded-xl',
    xl: 'w-12 h-12 text-lg rounded-2xl',
    hero: 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-3xl',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Ambient background glow if requested */}
      {withGlow && (
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 blur-md opacity-75 animate-pulse-glow" />
      )}

      {/* Futuristic B Container */}
      <div 
        className={`relative ${currentSizeClass} bg-gradient-to-br from-[#00d2ff] via-[#3a7bd5] to-[#4a00e0] flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25 border border-white/20 overflow-hidden shrink-0`}
      >
        {/* Subtle geometric glass shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/25 pointer-events-none" />
        
        {/* Bold Cybernetic 'B' Letter mark with modern angular cuts */}
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          <path
            d="M9 7C9 5.89543 9.89543 5 11 5H22C26.4183 5 30 8.58172 30 13C30 15.6548 28.7071 18.0076 26.7113 19.4563C29.6247 20.8931 31.6 23.9149 31.6 27.4C31.6 32.1496 27.7496 36 23 36H11C9.89543 36 9 35.1046 9 34V7Z"
            fill="url(#b_grad_fill)"
          />
          <path
            d="M16 11H21.5C23.433 11 25 12.567 25 14.5C25 16.433 23.433 18 21.5 18H16V11Z"
            fill="#0b1120"
          />
          <path
            d="M16 23H22.5C24.433 23 26 24.567 26 26.5C26 28.433 24.433 30 22.5 30H16V23Z"
            fill="#0b1120"
          />
          <circle cx="21" cy="14.5" r="1.5" fill="#38bdf8" />
          <circle cx="22" cy="26.5" r="1.5" fill="#60a5fa" />
          <defs>
            <linearGradient id="b_grad_fill" x1="9" y1="5" x2="31.6" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#e0f2fe" />
              <stop offset="1" stopColor="#bae6fd" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
