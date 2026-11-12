import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  Crown, 
  Check, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Gauge, 
  Flame 
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface UsageQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'free' | 'pro';
  tokensUsed: number;
  tokenLimit: number;
  messagesSent: number;
  onToggleTier: (newTier: 'free' | 'pro') => void;
  onResetQuota: () => void;
  isLightMode?: boolean;
}

export const UsageQuotaModal: React.FC<UsageQuotaModalProps> = ({
  isOpen,
  onClose,
  tier,
  tokensUsed,
  tokenLimit,
  messagesSent,
  onToggleTier,
  onResetQuota,
  isLightMode = false,
}) => {
  if (!isOpen) return null;

  const percentage = tier === 'pro' 
    ? 15 
    : Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));
    
  const remainingTokens = tier === 'pro' 
    ? 'Unlimited' 
    : Math.max(0, tokenLimit - tokensUsed).toLocaleString();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-lg rounded-2xl overflow-hidden border shadow-2xl transition-all ${
            isLightMode 
              ? 'bg-white border-slate-200 text-slate-800' 
              : 'bg-[#110f1e] border-purple-500/30 text-white'
          }`}
          style={{
            boxShadow: isLightMode 
              ? '0 25px 60px rgba(0,0,0,0.15)' 
              : '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(168,85,247,0.18)'
          }}
        >
          {/* Header */}
          <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
            isLightMode ? 'border-slate-100 bg-slate-50/70' : 'border-white/[0.08] bg-white/[0.02]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold">Token & Usage Telemetry</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tier === 'pro'
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  }`}>
                    {tier === 'pro' ? '★ PRO TIER' : 'FREE TIER'}
                  </span>
                </div>
                <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Real-time compute tokens and inference quota tracking.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isLightMode ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/[0.06] text-neutral-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Usage Metrics Card */}
          <div className="p-5 space-y-4">
            <div className={`p-4 rounded-xl border ${
              isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.08]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  isLightMode ? 'text-slate-500' : 'text-neutral-400'
                }`}>
                  Daily Quota Consumption
                </span>
                <span className="text-xs font-mono font-bold text-purple-400">
                  {tier === 'pro' ? 'Unlimited' : `${percentage}% Used`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tier === 'pro' ? 100 : percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    tier === 'pro'
                      ? 'bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500'
                      : percentage > 85 
                      ? 'bg-rose-500' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between mt-3 text-xs">
                <div>
                  <span className={`block text-[10px] ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>Tokens Used Today</span>
                  <span className="font-mono font-bold text-sm">{tokensUsed.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className={`block text-[10px] ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>Remaining Quota</span>
                  <span className="font-mono font-bold text-sm text-emerald-400">{remainingTokens}</span>
                </div>
              </div>
            </div>

            {/* Grid of stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className={`p-3 rounded-xl border ${
                isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.06]'
              }`}>
                <div className="text-lg font-bold font-mono text-purple-400">{messagesSent}</div>
                <div className={`text-[11px] ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>Messages Sent</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.06]'
              }`}>
                <div className="text-lg font-bold font-mono text-emerald-400">Midnight UTC</div>
                <div className={`text-[11px] ${isLightMode ? 'text-slate-500' : 'text-neutral-400'}`}>Daily Reset Window</div>
              </div>
            </div>

            {/* Plan Switcher */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              tier === 'pro'
                ? 'bg-amber-500/10 border-amber-500/30'
                : isLightMode ? 'bg-purple-50 border-purple-200' : 'bg-purple-950/20 border-purple-500/25'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    {tier === 'pro' ? 'Active: Pro Unlimited Plan' : 'Upgrade to Pro Unlimited'}
                  </h4>
                  <p className={`text-[11px] ${isLightMode ? 'text-slate-600' : 'text-neutral-400'}`}>
                    {tier === 'pro' 
                      ? 'Infinite tokens, priority reasoning, highest speed.' 
                      : 'Remove 10,000 token limit & unlock full throughput.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onToggleTier(tier === 'pro' ? 'free' : 'pro');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0 ${
                  tier === 'pro'
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold shadow-amber-500/20'
                }`}
              >
                {tier === 'pro' ? 'Switch to Free' : 'Activate Pro (Free)'}
              </button>
            </div>

            {/* Reset button */}
            <div className="flex items-center justify-between pt-2">
              <span className={`text-[11px] ${isLightMode ? 'text-slate-500' : 'text-neutral-500'}`}>
                Testing daily limits?
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onResetQuota();
                }}
                className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLightMode ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Token Counter</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
