import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, User, Mail, ShieldCheck, ArrowRight, Check, Image as ImageIcon, Zap, Lock } from 'lucide-react';
import { User as UserType } from '../../types';
import { StorageService, AVATAR_OPTIONS, INITIAL_WELCOME_CHAT } from '../../services/storage';
import { sounds } from '../../services/soundEffects';
import { BexusLogo } from '../common/BexusLogo';

interface AuthModalProps {
  onLoginSuccess: (user: UserType) => void;
  onClose?: () => void;
  currentUser?: UserType | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess, onClose, currentUser }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [themeColor, setThemeColor] = useState<'cyan' | 'blue' | 'purple' | 'emerald'>('cyan');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerSuccessCelebration = () => {
    import('canvas-confetti')
      .then(({ default: confetti }) => {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#3b82f6', '#10b981', '#a855f7', '#06b6d4', '#ffffff']
        });
      })
      .catch(() => {});
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your full name (kam az kam 2 characters).');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const newUser: UserType = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: cleanName,
        email: cleanEmail,
        avatar: selectedAvatar,
        bio: 'Bexus AI Pioneer & Neural Explorer',
        createdAt: Date.now(),
        customInstructions: 'Provide concise, intelligent, and beautifully structured responses with visual examples.',
        preferredVoice: 'Zephyr (Futuristic)',
        themeColor: themeColor,
        soundEnabled: true,
      };

      // Save user to storage
      StorageService.setCurrentUser(newUser);

      // Seed with fresh welcome chat for this brand new user
      const welcomeChat = INITIAL_WELCOME_CHAT(newUser.id, newUser.name);
      StorageService.saveSessions(newUser.id, [welcomeChat]);

      sounds.playReceive();
      triggerSuccessCelebration();
      onLoginSuccess(newUser);
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-4xl bg-[#101217] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden my-6 text-zinc-100 grid grid-cols-1 md:grid-cols-12 min-h-[560px]"
      >
        {/* Close Button (only if user is already logged in and just re-opening) */}
        {onClose && currentUser && (
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/[0.08] transition-colors cursor-pointer z-30"
            title="Close"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* LEFT COLUMN: Clean Create Account Form (7 cols) */}
        <div className="p-6 sm:p-9 md:col-span-7 flex flex-col justify-between bg-[#101217] relative">
          <div>
            {/* App Brand Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <BexusLogo size="md" withGlow={true} />
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Bexus AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-medium">
                  3.7 Ultra
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Create your Account
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your details to create a brand new account and launch your AI workspace.
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span className="flex-1">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign Up Form */}
            <form onSubmit={handleCreateAccount} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label htmlFor="auth-full-name" className="block text-xs font-semibold text-zinc-200 mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="auth-full-name"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    aria-required="true"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-white/[0.12] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="auth-email-address" className="block text-xs font-semibold text-zinc-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="auth-email-address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    required
                    aria-required="true"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-white/[0.12] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Choose Profile Avatar */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-2">
                  Choose Profile Avatar
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
                  {AVATAR_OPTIONS.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      aria-label={`Select avatar option ${idx + 1}`}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedAvatar(url);
                      }}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedAvatar === url
                          ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105 shadow-md shadow-blue-500/20'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={url} 
                        alt={`Avatar ${idx + 1}`} 
                        width={40} 
                        height={40} 
                        loading="lazy" 
                        decoding="async" 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover" 
                      />
                      {selectedAvatar === url && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Preference Accent */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Workspace Accent
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'cyan', name: 'Cyan Glow', bg: 'bg-cyan-500' },
                    { id: 'blue', name: 'Electric Blue', bg: 'bg-blue-600' },
                    { id: 'purple', name: 'Deep Violet', bg: 'bg-purple-600' },
                    { id: 'emerald', name: 'Neon Emerald', bg: 'bg-emerald-500' },
                  ].map(t => (
                    <button
                      type="button"
                      key={t.id}
                      aria-label={`Select ${t.name} workspace accent`}
                      onClick={() => {
                        sounds.playClick();
                        setThemeColor(t.id as any);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        themeColor === t.id
                          ? 'bg-white/[0.08] border-white/30 text-white shadow-sm'
                          : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${t.bg}`} />
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit / Create Account Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Start App</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Private Local & Cloud Storage
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Instant Secure Activation
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Feature Showcase Banner (5 cols) */}
        <div className="hidden md:flex flex-col justify-between p-8 md:col-span-5 bg-gradient-to-br from-blue-900/40 via-indigo-950/50 to-[#0c0e14] border-l border-white/[0.08] text-white relative overflow-hidden">
          {/* Ambient Lighting Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tagline */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Neural Suite</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
              One account for all your creative & reasoning tools.
            </h3>
          </div>

          {/* Features Card Stack */}
          <div className="my-auto py-4 space-y-2.5 relative z-10">
            <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 font-bold text-xs">
                🧠
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white">Gemini 3.7 Cognitive Engine</div>
                <div className="text-[10px] text-zinc-400">Deep Reasoning, Math proofs & Code</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs">
                🎨
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white">Generative Image & Audio Studio</div>
                <div className="text-[10px] text-zinc-400">Ultra-HD Visuals & procedural beats</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs">
                ⚡
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white">Live Interactive Canvas</div>
                <div className="text-[10px] text-zinc-400">Real-time frontend sandbox runner</div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/[0.08]">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ready for high-speed multi-turn generation</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
