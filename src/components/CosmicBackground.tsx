import React from 'react';

interface CosmicBackgroundProps {
  isLightMode?: boolean;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ isLightMode = false }) => {
  if (isLightMode) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#f8fafc] transition-colors duration-500">
        {/* Soft Pearlescent Lavender Gradient Base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,#f1f0fb_0%,#f8fafc_70%)]" />

        {/* Ambient Top Light Beam */}
        <div className="absolute -top-16 -right-16 w-[700px] h-[700px] pointer-events-none select-none opacity-40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-300/30 blur-[90px] rounded-full" />
          <div className="absolute top-10 right-10 w-60 h-60 bg-indigo-200/30 blur-[60px] rounded-full" />
        </div>

        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0b12] transition-colors duration-500">
      {/* Deep Obsidian & Indigo/Violet Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,#161324_0%,#0c0b12_70%)]" />

      {/* Volumetric Top-Right Spotlight / God Rays System */}
      <div className="absolute -top-16 -right-16 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] pointer-events-none select-none opacity-85">
        {/* Soft atmospheric lavender bloom at source */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/25 blur-[90px] rounded-full" />
        <div className="absolute top-10 right-10 w-60 h-60 bg-indigo-400/20 blur-[60px] rounded-full" />
        <div className="absolute top-20 right-20 w-40 h-40 bg-fuchsia-300/30 blur-[40px] rounded-full" />

        {/* Volumetric Angled Light Beams (SVG God Rays) */}
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full mix-blend-screen overflow-visible opacity-75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="beamGrad1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.55" />
              <stop offset="25%" stopColor="#c084fc" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="beamGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3e8ff" stopOpacity="0.7" />
              <stop offset="20%" stopColor="#d8b4fe" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="beamGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.45" />
              <stop offset="30%" stopColor="#a78bfa" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#6366f1" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
            </linearGradient>

            <filter id="beamBlurLarge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="32" />
            </filter>
            <filter id="beamBlurMedium" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          {/* Wide diffuse glow cone */}
          <polygon
            points="1000,0 800,0 0,680 0,900"
            fill="url(#beamGrad1)"
            filter="url(#beamBlurLarge)"
          />

          {/* Main Bright Central Beam */}
          <polygon
            points="1000,0 900,0 120,1000 0,1000"
            fill="url(#beamGrad2)"
            filter="url(#beamBlurMedium)"
          />

          {/* Secondary dynamic beam */}
          <polygon
            points="950,0 850,0 300,1000 150,1000"
            fill="url(#beamGrad3)"
            filter="url(#beamBlurMedium)"
          />
        </svg>
      </div>

      {/* Grid line accents */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
