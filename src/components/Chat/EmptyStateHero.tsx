import React from 'react';
import { PromptInput } from './PromptInput';
import { Attachment, User } from '../../types';
import { sounds } from '../../services/soundEffects';
import { BexusLogo } from '../common/BexusLogo';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Network, 
  GraduationCap, 
  Brain,
  Zap,
  Terminal,
  Compass,
  ArrowRight,
  Code2
} from 'lucide-react';

import { UltraFeaturesList } from '../Features/UltraFeaturesList';
import { UltraFeature, ULTRA_FEATURES } from '../../data/ultraFeatures';

interface EmptyStateHeroProps {
  user?: User | null;
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  isLoading: boolean;
  onOpenImageStudio: () => void;
  onOpenSlideStudio?: () => void;
  onOpenDeepResearch?: () => void;
  onOpenVoiceStudio?: () => void;
  onOpenTranslator?: () => void;
  onOpenSummarizer?: () => void;
  onOpenMindMapStudio: () => void;
  onOpenCanvas: () => void;
  onOpenGuidedLearning: () => void;
  onOpenVoiceOrb: () => void;
  onOpenUltraModal?: () => void;
  enableSearch: boolean;
  onToggleSearch: () => void;
  enableReasoning: boolean;
  onToggleReasoning: () => void;
  enableDeepResearch?: boolean;
  onToggleDeepResearch?: () => void;
}

const STARTER_PILLS = [
  { label: 'Meditation App', emoji: '🧘', prompt: 'Design a modern Meditation & Mindfulness mobile app with soothing dark UI, breathing timers, and streak tracking.' },
  { label: 'Fitness App', emoji: '🏋️', prompt: 'Create a sleek Fitness & Workout tracker app with interactive rep counting, calorie metrics, and workout routines.' },
  { label: 'Expense Tracker', emoji: '💳', prompt: 'Design an elegant Expense Tracker & Personal Finance dashboard with category breakdown charts and monthly budget goals.' },
  { label: 'Language Learning App', emoji: '🌐', prompt: 'Build an interactive Language Learning app interface with gamified flashcards, pronunciation practice, and progress XP.' },
  { label: 'Interactive Canvas Game', emoji: '🎮', prompt: 'Create a fully playable retro arcade game in HTML/Canvas with score tracking and sound effects.' },
  { label: 'Deep Code Architect', emoji: '⚡', prompt: 'Build a production-grade full-stack TypeScript React application with clean architecture and state management.' }
];

export const EmptyStateHero: React.FC<EmptyStateHeroProps> = ({
  user,
  onSendMessage,
  isLoading,
  onOpenImageStudio,
  onOpenSlideStudio,
  onOpenDeepResearch,
  onOpenVoiceStudio,
  onOpenTranslator,
  onOpenSummarizer,
  onOpenMindMapStudio,
  onOpenCanvas,
  onOpenGuidedLearning,
  onOpenVoiceOrb,
  enableSearch,
  onToggleSearch,
  enableReasoning,
  onToggleReasoning,
  enableDeepResearch,
  onToggleDeepResearch,
}) => {
  const userName = user?.name ? user.name.split(' ')[0] : 'Explorer';

  const handlePromptClick = (prompt: string) => {
    sounds.playClick();
    onSendMessage(prompt);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center px-4 py-6 max-w-5xl mx-auto w-full z-10 animate-in fade-in duration-500 min-h-[calc(100vh-4rem)]">
      <div className="h-2 sm:h-6" />

      {/* Center Hero Content */}
      <div className="w-full flex flex-col items-center text-center max-w-3xl">
        {/* Sleek Community Badge with Avatar Stack matching reference */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b1714]/80 border border-white/10 text-xs text-zinc-300 mb-6 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.4)]">
          <div className="flex -space-x-1.5 items-center">
            <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 border border-zinc-900 flex items-center justify-center text-[10px]">✨</span>
            <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border border-zinc-900 flex items-center justify-center text-[10px]">🚀</span>
            <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 border border-zinc-900 flex items-center justify-center text-[10px]">💡</span>
          </div>
          <span className="text-[12px] font-medium text-zinc-300">
            <strong className="text-white font-semibold">30k+</strong> creators & developers build with Bexus
          </span>
        </div>

        {/* Hero Title matching the user's reference screenshot */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 font-sans leading-tight">
          Design apps & code <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,140,40,0.35)]">in minutes ⚡</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 mb-7 max-w-xl font-normal leading-relaxed">
          Go from idea to beautiful apps, interactive mockups, and intelligent solutions in minutes by chatting with AI.
        </p>

        {/* Floating Input Dock */}
        <div className="w-full mb-5">
          <PromptInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onOpenImageStudio={onOpenImageStudio}
            onOpenSlideStudio={onOpenSlideStudio}
            onOpenDeepResearch={onOpenDeepResearch}
            onOpenVoiceStudio={onOpenVoiceStudio}
            onOpenTranslator={onOpenTranslator}
            onOpenSummarizer={onOpenSummarizer}
            onOpenMindMapStudio={onOpenMindMapStudio}
            onOpenCanvas={onOpenCanvas}
            onOpenGuidedLearning={onOpenGuidedLearning}
            onOpenVoiceOrb={onOpenVoiceOrb}
            enableSearch={enableSearch}
            onToggleSearch={onToggleSearch}
            enableReasoning={enableReasoning}
            onToggleReasoning={onToggleReasoning}
            enableDeepResearch={enableDeepResearch}
            onToggleDeepResearch={onToggleDeepResearch}
            placeholder={`I want to design an app that...`}
          />
        </div>

        {/* Starter Suggestion Pills matching reference aesthetic */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl px-2 mb-8">
          {STARTER_PILLS.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(pill.prompt)}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181512]/90 hover:bg-[#241f1a] border border-white/[0.08] hover:border-orange-500/35 text-zinc-300 hover:text-white text-xs font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_12px_rgba(255,120,40,0.15)] cursor-pointer"
            >
              <span className="text-sm opacity-90 group-hover:scale-110 transition-transform">{pill.emoji}</span>
              <span>{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Exact Ultra Features List matching user's reference screenshot */}
        <div className="w-full max-w-2xl text-left">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                Gemini Ultra Features Suite
              </span>
            </div>
            <span className="text-[11px] text-amber-400/90 font-mono font-medium">
              {ULTRA_FEATURES.length} Features Unlocked
            </span>
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-[#14110e]/90 border border-white/[0.09] backdrop-blur-2xl p-1.5 sm:p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            <UltraFeaturesList onSelectFeature={(feature) => onSendMessage(feature.promptTemplate)} />
          </div>
        </div>
      </div>

      {/* Sleek Footer */}
      <footer className="w-full pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-white/5 mt-6">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-cyan-400 font-mono font-semibold">BEXUS CORE 3.7</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Gemini 3.7 Flash Engine</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Ultra Fast • 100% Accurate</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400 font-mono">SECURE ZERO-LEAK SESSION</span>
        </div>
      </footer>
    </div>
  );
};
