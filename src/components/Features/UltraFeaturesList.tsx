import React, { useState } from 'react';
import { UltraFeature, ULTRA_FEATURES } from '../../data/ultraFeatures';
import { sounds } from '../../services/soundEffects';
import { 
  Sparkles, 
  Video, 
  Globe, 
  Wand2, 
  Film, 
  Coins, 
  Headphones, 
  Compass, 
  PenTool, 
  Youtube, 
  Cloud,
  ChevronRight,
  CheckCircle2,
  Info
} from 'lucide-react';

interface UltraFeaturesListProps {
  onSelectFeature?: (feature: UltraFeature) => void;
  className?: string;
  variant?: 'full' | 'compact' | 'modal';
}

export const UltraFeaturesList: React.FC<UltraFeaturesListProps> = ({
  onSelectFeature,
  className = '',
  variant = 'full'
}) => {
  const [activeFeature, setActiveFeature] = useState<UltraFeature | null>(null);

  const getIcon = (iconName: UltraFeature['iconName']) => {
    const iconClass = "w-5 h-5 text-neutral-300 group-hover:text-amber-400 transition-colors shrink-0";
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'video':
        return <Video className={iconClass} />;
      case 'deepResearch':
        return <Globe className={iconClass} />;
      case 'flow':
        return <Film className={iconClass} />;
      case 'whisk':
        return <Wand2 className={iconClass} />;
      case 'credits':
        return <Coins className={iconClass} />;
      case 'notebook':
        return <Headphones className={iconClass} />;
      case 'mariner':
        return <Compass className={iconClass} />;
      case 'workspace':
        return <PenTool className={iconClass} />;
      case 'youtube':
        return <Youtube className={iconClass} />;
      case 'storage':
        return <Cloud className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const handleItemClick = (feature: UltraFeature) => {
    sounds.playClick();
    setActiveFeature(feature);
    if (onSelectFeature) {
      onSelectFeature(feature);
    }
  };

  return (
    <div className={`w-full text-left font-sans ${className}`}>
      {/* Sleek vertical list matching reference with compact footprint */}
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {ULTRA_FEATURES.map((feature) => (
          <button
            key={feature.id}
            type="button"
            onClick={() => handleItemClick(feature)}
            className="group w-full py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-lg flex items-center justify-between gap-3 text-left hover:bg-white/[0.04] active:bg-white/[0.07] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Icon */}
              <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-colors shrink-0">
                {getIcon(feature.iconName)}
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded-full bg-white/[0.06] text-neutral-400 group-hover:text-amber-200 group-hover:bg-amber-500/20 font-mono transition-colors">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 font-normal leading-tight mt-0.5 tracking-normal truncate">
                  {feature.subtitle}
                </p>
              </div>
            </div>

            {/* Right arrow */}
            <div className="hidden sm:flex items-center text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
