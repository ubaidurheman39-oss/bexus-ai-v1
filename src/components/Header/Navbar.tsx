import React, { useState, useRef, useEffect } from 'react';
import { ModelId, User } from '../../types';
import { sounds } from '../../services/soundEffects';
import { BexusLogo } from '../common/BexusLogo';
import { 
  PanelLeft, 
  Sparkles, 
  Globe, 
  Brain, 
  Radio, 
  ChevronDown, 
  Zap, 
  Code, 
  User as UserIcon, 
  LogOut, 
  LogIn,
  Settings,
  Check,
  Search
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  selectedModel: ModelId;
  onSelectModel: (model: ModelId) => void;
  enableSearch: boolean;
  onToggleSearch: () => void;
  enableReasoning: boolean;
  onToggleReasoning: () => void;
  enableDeepResearch?: boolean;
  onToggleDeepResearch?: () => void;
  onOpenSlideStudio?: () => void;
  onOpenDeepResearch?: () => void;
  onOpenVoiceStudio?: () => void;
  onOpenTranslator?: () => void;
  onOpenSummarizer?: () => void;
  onOpenVoiceOrb: () => void;
  onOpenUltraModal?: () => void;
  user: User;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

const MODELS = [
  { id: 'bexus-3.7-ultra', name: 'Bexus 3.7 Ultra', desc: 'Default • Ultra-fast, versatile & intelligent', speed: 'Sub-second' },
  { id: 'bexus-reasoning-pro', name: 'Deep Reasoning', desc: 'Thinking Mode • Multi-step logic & math proofs', speed: 'High precision' },
  { id: 'bexus-creative', name: 'Creative Vision', desc: 'Creative • Storytelling, writing & brainstorming', speed: 'Fluid' },
  { id: 'bexus-canvas-coder', name: 'Canvas Coder', desc: 'Developer • Full-stack architecture & web sandboxes', speed: 'Interactive' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  selectedModel,
  onSelectModel,
  enableSearch,
  onToggleSearch,
  enableReasoning,
  onToggleReasoning,
  enableDeepResearch,
  onToggleDeepResearch,
  onOpenSlideStudio,
  onOpenDeepResearch,
  onOpenVoiceStudio,
  onOpenTranslator,
  onOpenSummarizer,
  onOpenVoiceOrb,
  onOpenUltraModal,
  user,
  onOpenProfile,
  onOpenSettings,
  onOpenLogin,
  onLogout,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-20 h-14 border-b border-white/[0.08] bg-[#0c0d10]/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between">
      {/* Left side: Sidebar Toggle, Logo & Model Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            onToggleSidebar();
          }}
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pr-1">
          <BexusLogo size="sm" withGlow={false} />
          <span className="font-bold text-xs tracking-tight text-white">Bexus</span>
        </div>

        {/* Model Selector Dropdown */}
        <div className="relative" ref={modelDropdownRef}>
          <button
            onClick={() => {
              sounds.playClick();
              setModelDropdownOpen(!modelDropdownOpen);
            }}
            aria-label={`Current AI model: ${currentModel.name}. Click to change.`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/[0.08] hover:border-white/[0.16] text-xs font-semibold text-zinc-100 transition-all cursor-pointer shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span>{currentModel.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-xl bg-[#14151a] border border-white/[0.1] shadow-2xl p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Select Model Engine
              </div>
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    sounds.playModeSwitch();
                    onSelectModel(m.id as ModelId);
                    setModelDropdownOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    selectedModel === m.id
                      ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                      : 'hover:bg-white/[0.06] text-zinc-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-100">{m.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.08] text-zinc-400 font-mono">
                        {m.speed}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-tight">{m.desc}</div>
                  </div>
                  {selectedModel === m.id && (
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Tools, Web Grounding, Reasoning, Voice Live & User */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Gemini Ultra Suite Button */}
        {onOpenUltraModal && (
          <button
            onClick={() => {
              sounds.playClick();
              onOpenUltraModal();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border border-amber-500/35 hover:border-amber-400/70 text-amber-300 hover:text-amber-200 transition-all cursor-pointer shadow-sm shadow-amber-950/30"
            title="Open Gemini Ultra Features Suite"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Ultra Features</span>
          </button>
        )}

        {/* Web Search Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleSearch();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
            enableSearch
              ? 'bg-blue-500/15 border-blue-400/40 text-blue-300 shadow-sm'
              : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
          }`}
          title="Toggle Google Search Grounding"
          aria-label={`Toggle Google Web Search Grounding. Currently ${enableSearch ? 'enabled' : 'disabled'}.`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Web Search</span>
        </button>

        {/* Deep Reasoning Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleReasoning();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
            enableReasoning
              ? 'bg-purple-500/15 border-purple-400/40 text-purple-300 shadow-sm'
              : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
          }`}
          title="Toggle Deep Reasoning (Thinking Mode)"
          aria-label={`Toggle Deep Reasoning mode. Currently ${enableReasoning ? 'enabled' : 'disabled'}.`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reasoning</span>
        </button>

        {/* Deep Research In-Chat Toggle */}
        {onToggleDeepResearch && (
          <button
            onClick={() => {
              sounds.playClick();
              onToggleDeepResearch();
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              enableDeepResearch
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
            }`}
            title="Toggle Autonomous Deep Research Mode in Chat"
            aria-label={`Toggle Autonomous Deep Research Mode in Chat. Currently ${enableDeepResearch ? 'enabled' : 'disabled'}.`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${enableDeepResearch ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">Deep Research</span>
          </button>
        )}

        {/* Voice Orb Live */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenVoiceOrb();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/[0.08] text-xs font-medium transition-all cursor-pointer"
          title="Open Voice Mode"
          aria-label="Open Voice Interaction Mode"
        >
          <Radio className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden md:inline">Voice Mode</span>
        </button>

        {/* User Avatar Menu */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => {
              sounds.playClick();
              setUserDropdownOpen(!userDropdownOpen);
            }}
            aria-label={`Open user account menu for ${user.name}`}
            className="w-8 h-8 rounded-full overflow-hidden border border-white/[0.15] hover:border-white/[0.3] transition-all cursor-pointer shrink-0"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              width={32} 
              height={32} 
              decoding="async" 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover" 
            />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#14151a] border border-white/[0.1] shadow-2xl p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <div className="text-xs font-semibold text-zinc-100 truncate">{user.name}</div>
                <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setUserDropdownOpen(false);
                  onOpenProfile();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>Profile & Persona</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setUserDropdownOpen(false);
                  onOpenSettings();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setUserDropdownOpen(false);
                  onOpenLogin();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                <span>Create Another Account</span>
              </button>

              <div className="border-t border-white/[0.06] my-1" />

              <button
                onClick={() => {
                  sounds.playClick();
                  setUserDropdownOpen(false);
                  onLogout();
                }}
                className="w-full px-2.5 py-1.5 text-xs text-left text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
