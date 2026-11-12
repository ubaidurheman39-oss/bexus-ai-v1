import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ULTRA_FEATURES, UltraFeature } from '../../data/ultraFeatures';
import { sounds } from '../../services/soundEffects';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  ShieldCheck,
  Video,
  Globe,
  Film,
  Wand2,
  Coins,
  Headphones,
  Compass,
  PenTool,
  Youtube,
  Cloud
} from 'lucide-react';

interface UltraPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateFeature: (feature: UltraFeature) => void;
}

export const UltraPlanModal: React.FC<UltraPlanModalProps> = ({
  isOpen,
  onClose,
  onActivateFeature
}) => {
  const [selectedFeature, setSelectedFeature] = useState<UltraFeature>(ULTRA_FEATURES[0]);

  if (!isOpen) return null;

  const getIcon = (iconName: UltraFeature['iconName']) => {
    const iconClass = "w-5 h-5 text-amber-400 shrink-0";
    switch (iconName) {
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'video': return <Video className={iconClass} />;
      case 'deepResearch': return <Globe className={iconClass} />;
      case 'flow': return <Film className={iconClass} />;
      case 'whisk': return <Wand2 className={iconClass} />;
      case 'credits': return <Coins className={iconClass} />;
      case 'notebook': return <Headphones className={iconClass} />;
      case 'mariner': return <Compass className={iconClass} />;
      case 'workspace': return <PenTool className={iconClass} />;
      case 'youtube': return <Youtube className={iconClass} />;
      case 'storage': return <Cloud className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#12100d] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden font-sans text-neutral-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/[0.08] bg-[#16130f]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Gemini Ultra Access</h2>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ALL FEATURES UNLOCKED
                  </span>
                </div>
                <p className="text-xs text-neutral-400">Everything included in your ultimate AI suite</p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Split View with all 11 features on left and detail on right */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {/* Left 11 Features List */}
            <div className="md:col-span-7 p-3 sm:p-4 space-y-1 overflow-y-auto max-h-[60vh] scrollbar-thin">
              {ULTRA_FEATURES.map((feature) => {
                const isSelected = selectedFeature.id === feature.id;
                return (
                  <button
                    key={feature.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedFeature(feature);
                    }}
                    className={`w-full p-2 sm:p-2.5 rounded-lg flex items-center justify-between gap-2.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border border-amber-500/40 shadow-sm'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0">
                        {getIcon(feature.iconName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                            {feature.title}
                          </span>
                          {feature.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.08] text-neutral-300 font-mono">
                              {feature.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {feature.subtitle}
                        </div>
                      </div>
                    </div>

                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'text-neutral-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Feature Spotlight & Action */}
            <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-[#14110e]/70">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
                    {getIcon(selectedFeature.iconName)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedFeature.title}</h3>
                    <p className="text-xs text-amber-400 font-medium">{selectedFeature.subtitle}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-300 leading-relaxed">
                  {selectedFeature.details}
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Included in Ultra active license</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant priority GPU queue</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero rate limits & maximum context</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onActivateFeature(selectedFeature);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch {selectedFeature.title}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
