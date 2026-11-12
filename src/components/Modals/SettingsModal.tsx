import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { sounds } from '../../services/soundEffects';
import { 
  X, 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  User as UserIcon,
  LogIn,
  LogOut
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onClearChats: () => void;
  onRefreshData: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onClearChats,
  onRefreshData,
  onOpenLogin,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = () => {
    sounds.playClick();
    const dataStr = StorageService.exportData(user.id);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bexus-ai-backup-${user.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) {
        const success = StorageService.importData(user.id, content);
        if (success) {
          sounds.playReceive();
          setImportStatus('Chat history successfully restored!');
          onRefreshData();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid Bexus backup JSON format.');
        }
      }
    };
    reader.readAsText(file);
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
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-100">Bexus Workspace Settings</h2>
                  <p className="text-xs text-zinc-400">Data persistence, backup & account configurations</p>
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {importStatus && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}

              {/* Account & Authentication Section */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Account & Identity
                </div>
                <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.1]">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          width={32} 
                          height={32} 
                          loading="lazy" 
                          decoding="async" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-100">{user.name}</div>
                        <div className="text-[11px] text-zinc-400">{user.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onOpenLogin();
                        }}
                        className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Switch Account</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          if (confirm('Are you sure you want to sign out?')) {
                            onLogout();
                            onClose();
                          }
                        }}
                        className="py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup & Persistence Section */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Chat History & Backup
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">Export All Chat Sessions</div>
                      <div className="text-[11px] text-zinc-400">Download complete JSON backup</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export JSON</span>
                    </button>
                  </div>

                  <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">Restore / Import Backup</div>
                      <div className="text-[11px] text-zinc-400">Load previous conversations from JSON file</div>
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportFile}
                        accept=".json"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Import JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neural Engine Specs */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Engine Specifications
                </div>
                <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-zinc-400">Primary Neural Model</span>
                    <span className="font-mono text-zinc-200">Gemini 2.5 Flash</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-zinc-400">Reasoning Engine</span>
                    <span className="font-mono text-purple-300">Adaptive Deep Logic</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.06]">
                    <span className="text-zinc-400">Image Generation Model</span>
                    <span className="font-mono text-pink-300">Imagen 3</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Audio Synthesizer Engine</span>
                    <span className="font-mono text-emerald-300">Web Audio API</span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                  Danger Zone
                </div>
                <div className="p-3.5 rounded-xl bg-rose-950/10 border border-rose-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-rose-200">Delete All Conversations</div>
                    <div className="text-[11px] text-zinc-400">Permanently wipe all stored chats for this account</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      if (confirm('Are you sure you want to permanently delete all conversations?')) {
                        onClearChats();
                        onClose();
                      }
                    }}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Wipe All</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
