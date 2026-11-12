import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Code2, 
  ImagePlus, 
  Film, 
  Music, 
  Presentation, 
  Mic, 
  Globe, 
  Trash2, 
  Layers, 
  Command, 
  ArrowRight,
  Sliders,
  X
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string, payload?: any) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const COMMANDS = [
    {
      id: 'gemini_ultra',
      category: 'Flagship Intelligence',
      title: 'Gemini Ultra Suite (11 Unlocked Features)',
      description: 'Veo 3 Video, Autonomous Deep Research, NotebookLM Pro, and Mariner agent',
      icon: Sparkles,
      color: '#f59e0b',
      action: () => onSelectAction('studio', 'ultra')
    },
    {
      id: 'app_apexdrive',
      category: 'Instant Apps',
      title: 'Build ApexDrive Supercar Fleet App',
      description: 'Generate luxury exotic car rental platform with interactive booking',
      icon: Code2,
      color: '#3b82f6',
      action: () => onSelectAction('prompt', 'Create ApexDrive ultra luxury supercar rental web app with live vehicle filters, interactive specs, booking modal and persistent reservations')
    },
    {
      id: 'app_curamed',
      category: 'Instant Apps',
      title: 'Build CuraMed Medical Clinic App',
      description: 'Generate health specialist portal with appointment calendar',
      icon: Code2,
      color: '#10b981',
      action: () => onSelectAction('prompt', 'Build CuraMed medical clinic web app with doctor profiles, appointment booking system, specialty filters and live patient records')
    },
    {
      id: 'app_crypto',
      category: 'Instant Apps',
      title: 'Build AlphaPulse Crypto Trading Desk',
      description: 'Generate dark-luxury candlestick trading desk with order book',
      icon: Code2,
      color: '#f59e0b',
      action: () => onSelectAction('prompt', 'Build AlphaPulse cryptocurrency exchange terminal with live candlestick simulation, order book, portfolio ledger and instant buy/sell trade execution')
    },
    {
      id: 'app_nexus',
      category: 'Instant Apps',
      title: 'Build NexusAI Autonomous Neural Studio',
      description: 'Generate AI workbench with real-time telemetry and code engine',
      icon: Code2,
      color: '#a855f7',
      action: () => onSelectAction('prompt', 'Build NexusAI autonomous neural studio web application with model switcher, code workbench, real-time telemetry and project management')
    },
    {
      id: 'studio_appbuilder',
      category: 'Neural Studios',
      title: 'Open AppForge Full IDE Studio',
      description: 'Full-screen split code editor, live console and multi-device preview',
      icon: Layers,
      color: '#8b5cf6',
      action: () => onSelectAction('studio', 'appbuilder')
    },
    {
      id: 'studio_image',
      category: 'Neural Studios',
      title: 'Open 8K Visual Canvas Studio',
      description: 'Photorealistic diffusion with Hasselblad lenses and lighting',
      icon: ImagePlus,
      color: '#ec4899',
      action: () => onSelectAction('studio', 'image')
    },
    {
      id: 'studio_deepresearch',
      category: 'Neural Studios',
      title: 'Open Autonomous Deep Research Hub',
      description: 'Comprehensive research, multi-agent fact verification, and deep Q&A',
      icon: Globe,
      color: '#06b6d4',
      action: () => onSelectAction('studio', 'deepresearch')
    },
    {
      id: 'studio_slides',
      category: 'Neural Studios',
      title: 'Open Keynote Slide Studio',
      description: 'Corporate pitch decks and slide layouts with executive metrics',
      icon: Presentation,
      color: '#10b981',
      action: () => onSelectAction('studio', 'slides')
    },
    {
      id: 'studio_voice',
      category: 'Neural Studios',
      title: 'Open Neural Voice Studio',
      description: 'Real-time speech synthesis and conversational audio stream',
      icon: Mic,
      color: '#d946ef',
      action: () => onSelectAction('studio', 'voice')
    },
    {
      id: 'action_deepresearch',
      category: 'Intelligence',
      title: 'Activate Deep Web Research Mode',
      description: 'Autonomous multi-domain index scanner with real citations',
      icon: Globe,
      color: '#06b6d4',
      action: () => onSelectAction('deep_research')
    },
    {
      id: 'action_sound_toggle',
      category: 'System',
      title: 'Toggle Haptic & UI Sound Effects',
      description: 'Switch tactile sound feedback on or off',
      icon: Sliders,
      color: '#64748b',
      action: () => onSelectAction('toggle_sound')
    },
    {
      id: 'action_new_chat',
      category: 'System',
      title: 'Initialize Fresh Neural Chat Session',
      description: 'Clear current context and start fresh conversation',
      icon: Sparkles,
      color: '#c084fc',
      action: () => onSelectAction('new_chat')
    },
    {
      id: 'action_reset',
      category: 'System',
      title: 'Reset to Celestial Welcome Portal',
      description: 'Restore initial hero showcase',
      icon: Trash2,
      color: '#ef4444',
      action: () => onSelectAction('reset')
    }
  ];

  const filtered = COMMANDS.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
        sounds.playClick();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
        sounds.playClick();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          sounds.playReceive();
          filtered[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#0f0d1a]/95 border border-purple-500/35 shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(168,85,247,0.18)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, studio name, or press Enter to launch..."
            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">ESC</span>
            <span>to close</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No matching command found for "{query}".
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    sounds.playReceive();
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-purple-600/25 border border-purple-500/40 text-white shadow-md' 
                      : 'hover:bg-white/[0.04] text-neutral-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                      style={{ 
                        backgroundColor: `${cmd.color}20`,
                        border: `1px solid ${cmd.color}40`,
                        color: cmd.color 
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{cmd.title}</span>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/5 text-neutral-400 font-mono">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">{cmd.description}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-purple-300 translate-x-1' : 'text-neutral-600'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">↑</span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">↓</span>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">↵</span>
              <span>to run</span>
            </span>
          </div>
          <span className="text-[10px] text-purple-400 font-mono font-medium">BEXUS COMMAND MATRIX</span>
        </div>
      </div>
    </div>
  );
};
