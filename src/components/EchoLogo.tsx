import React from 'react';

interface EchoLogoProps {
  size?: number;
  className?: string;
}

export const EchoLogo: React.FC<EchoLogoProps> = ({ size = 48, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Radiant ambient glow backing */}
      <div 
        className="absolute inset-0 rounded-full blur-[14px] opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.7) 0%, rgba(147, 51, 234, 0.4) 60%, transparent 100%)'
        }}
      />

      {/* SVG Planetary Orb & Orbital Ring */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_12px_rgba(192,132,252,0.85)]"
      >
        <defs>
          {/* Sphere Body Gradient */}
          <radialGradient id="sphereGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="30%" stopColor="#d8b4fe" />
            <stop offset="65%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>

          {/* Orbital Ring Gradient */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#e9d5ff" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>

          {/* Core Star Filter */}
          <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Back segment of orbital ring */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="14"
          stroke="url(#ringGrad)"
          strokeWidth="3.2"
          transform="rotate(-25 50 50)"
          strokeDasharray="90 120"
          strokeDashoffset="75"
          opacity="0.6"
        />

        {/* Center Celestial Sphere */}
        <circle
          cx="50"
          cy="50"
          r="24"
          fill="url(#sphereGrad)"
        />

        {/* Front segment of orbital ring */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="14"
          stroke="url(#ringGrad)"
          strokeWidth="3.5"
          transform="rotate(-25 50 50)"
          strokeDasharray="100 120"
          strokeDashoffset="-25"
          strokeLinecap="round"
        />

        {/* Inner Luminous Sparkle / Core Reflection */}
        <circle
          cx="42"
          cy="40"
          r="3"
          fill="#ffffff"
          opacity="0.95"
          filter="url(#starGlow)"
        />
        <circle
          cx="42"
          cy="40"
          r="1.8"
          fill="#ffffff"
        />

        {/* Tiny Orbit Particle */}
        <circle
          cx="76"
          cy="36"
          r="2.2"
          fill="#f5d0fe"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
