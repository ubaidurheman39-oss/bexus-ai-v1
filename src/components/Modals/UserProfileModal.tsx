import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';
import { StorageService, AVATAR_OPTIONS } from '../../services/storage';
import { sounds } from '../../services/soundEffects';
import { 
  X, 
  User as UserIcon, 
  Save, 
  LogOut, 
  Volume2, 
  VolumeX, 
  LogIn,
  ArrowRightLeft,
  Key,
  ShieldCheck
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  chatCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onOpenLogin,
  chatCount,
}) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [customInstructions, setCustomInstructions] = useState(user.customInstructions || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled ?? true);
  const [savedAlert, setSavedAlert] = useState(false);

  const otherAccounts = StorageService.getUsers().filter(u => u.id !== user.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const updated: User = {
      ...user,
      name: name.trim(),
      bio: bio.trim(),
      customInstructions: customInstructions.trim(),
      avatar,
      soundEnabled,
    };
    StorageService.setCurrentUser(updated);
    sounds.setEnabled(soundEnabled);
    onUpdateUser(updated);
    sounds.playReceive();
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 800);
  };

  const handleToggleSound = () => {
    sounds.playClick();
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-[#14151a] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0c0d10]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 border border-white/[0.1] text-zinc-300">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-100">User Profile & Persona</h2>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Profile Avatar
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {AVATAR_OPTIONS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setAvatar(av);
                      }}
                      className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        avatar === av
                          ? 'border-white scale-105 shadow-md'
                          : 'border-white/[0.1] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={av} 
                        alt="Avatar" 
                        width={44} 
                        height={44} 
                        loading="lazy" 
                        decoding="async" 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#0c0d10] border border-white/[0.06] text-center">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Chats</div>
                  <div className="text-sm font-bold text-zinc-200">{chatCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Model</div>
                  <div className="text-sm font-bold text-blue-400">Gemini 3.7</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Status</div>
                  <div className="text-sm font-bold text-emerald-400">Verified</div>
                </div>
              </div>

              {/* Name & Bio */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900/90 border border-white/[0.08] rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-white/[0.25]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Bio / Status
                  </label>
                  <input
                    type="text"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="e.g. Full-Stack Developer, AI Researcher..."
                    className="w-full px-3 py-2 bg-zinc-900/90 border border-white/[0.08] rounded-xl text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-white/[0.25]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
                    <span>Custom System Instructions</span>
                    <span className="text-[10px] text-zinc-400">Applied to every prompt</span>
                  </label>
                  <textarea
                    value={customInstructions}
                    onChange={e => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Always provide complete executable code in Canvas, concise explanations, and friendly Roman Urdu summaries when asked."
                    rows={3}
                    className="w-full p-3 bg-zinc-900/90 border border-white/[0.08] rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/[0.25] resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Account Login & Operator Authentication Management */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Account Credentials</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Signed In</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-zinc-300">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-100">{user.name}</div>
                        <div className="text-[11px] text-zinc-400">{user.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onOpenLogin();
                        }}
                        className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Switch Account</span>
                      </button>
                    </div>
                  </div>

                  {/* Other saved profiles */}
                  {otherAccounts.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                      <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3 text-zinc-400" />
                        <span>Quick Switch:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {otherAccounts.map(acc => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              StorageService.setCurrentUser(acc);
                              sounds.playReceive();
                              onUpdateUser(acc);
                              onClose();
                            }}
                            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.06] flex items-center justify-between text-left transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img 
                                src={acc.avatar} 
                                alt={acc.name} 
                                width={24} 
                                height={24} 
                                loading="lazy" 
                                decoding="async" 
                                className="w-6 h-6 rounded-full object-cover shrink-0" 
                              />
                              <div className="min-w-0 truncate">
                                <div className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">{acc.name}</div>
                                <div className="text-[10px] text-zinc-500 truncate">{acc.email}</div>
                              </div>
                            </div>
                            <span className="text-[10px] text-zinc-300 px-1.5 py-0.5 rounded bg-zinc-800 border border-white/[0.08] shrink-0">
                              Switch
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sound & Audio FX Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0d10] border border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-zinc-300" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">UI Sound Effects</div>
                    <div className="text-[10px] text-zinc-500">Audio feedback on actions and messages</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-white text-zinc-950 font-semibold'
                      : 'bg-zinc-800 text-zinc-400 border border-white/[0.08]'
                  }`}
                >
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    if (confirm('Are you sure you want to sign out?')) {
                      onLogout();
                    }
                  }}
                  className="py-2 px-3.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedAlert ? 'Saved ✓' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
