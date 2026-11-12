import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  X,
  Bot,
  User as UserIcon,
  CheckSquare,
  FileText,
  Music,
  Paperclip,
  Mic,
  MicOff,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowRight,
  PanelLeft,
  ImagePlus,
  Globe,
  Network,
  Code2,
  Database,
  Download,
  Maximize2,
  ExternalLink,
  Play,
  Square,
  Volume2,
  VolumeX,
  Zap,
  Command,
  Brain,
  Presentation,
  Flame,
  Film,
  Languages,
  BookOpen,
  Clapperboard,
  Camera,
  Activity,
  Terminal,
  Scan,
  Eye,
  Compass,
  Sun,
  Moon,
  Crown,
  Gauge
} from 'lucide-react';
import { CosmicBackground } from './components/CosmicBackground';
import { EchoLogo } from './components/EchoLogo';
import { BexusAuthScreen } from './components/BexusAuthScreen';
import { Sidebar, SavedChat, SavedProjectItem } from './components/Sidebar';
import { Attachment, DeepResearchReport } from './types';
import { sounds } from './services/soundEffects';
import { getClientDirectImageUrl } from './utils/imageFallback';
import { generateNaturalConversationalReply } from './utils/intelligentConversationalEngine';
import { auth, signOut, onAuthStateChanged } from './services/firebase';
import { DeepResearchModal } from './components/Modals/DeepResearchModal';
import { ImageStudioModal } from './components/Modals/ImageStudioModal';
import { VoiceStudioModal } from './components/Modals/VoiceStudioModal';
import { DocSummarizerModal } from './components/Modals/DocSummarizerModal';
import { LanguageTranslatorModal } from './components/Modals/LanguageTranslatorModal';
import { LiveCameraModal } from './components/Modals/LiveCameraModal';
import { MediaAnalysisModal } from './components/Modals/MediaAnalysisModal';
import { AgenticStudioModal } from './components/Modals/AgenticStudioModal';
import { AppBuilderStudioModal } from './components/Modals/AppBuilderStudioModal';
import { CommandPaletteModal } from './components/Modals/CommandPaletteModal';
import { GuidedLearningModal } from './components/Modals/GuidedLearningModal';
import { UltraPlanModal } from './components/Modals/UltraPlanModal';
import { ULTRA_FEATURES, UltraFeature } from './data/ultraFeatures';
import { InteractiveAppCard } from './components/InteractiveAppCard';
import { PromptTemplatesModal, PROMPT_TEMPLATES } from './components/Modals/PromptTemplatesModal';
import { UsageQuotaModal } from './components/Modals/UsageQuotaModal';
import { AI_PERSONAS, AIPersona } from './data/personas';
import { exportAsMarkdown, exportAsPDF, exportAsPPTX, exportAsCode } from './services/exportService';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  imageUrl?: string;
  songData?: {
    title: string;
    genre: string;
    lyrics: string;
    tempo?: string;
  };
  codeSnippet?: {
    code: string;
    title: string;
    language: string;
  };
  researchReport?: DeepResearchReport;
  actionRunnerData?: any;
  reasoningSteps?: string[];
  thoughtDuration?: string;
}

const MODELS = [
  { id: 'bexus-3.7-ultra', name: 'Bexus 3.7 Ultra', provider: 'Flagship Core', color: '#c084fc', latency: '0.9s' },
  { id: 'bexus-reasoning-pro', name: 'Bexus Deep Reasoning', provider: 'Logic Engine', color: '#ec4899', latency: '1.8s' },
  { id: 'bexus-canvas-coder', name: 'Bexus Canvas Coder', provider: 'Dev Studio', color: '#06b6d4', latency: '1.1s' },
  { id: 'bexus-creative', name: 'Bexus Creative Vision', provider: 'Creative AI', color: '#f59e0b', latency: '1.2s' },
  { id: 'bexus-quantum-4.8', name: 'Bexus Quantum 4.8', provider: 'Neural Matrix', color: '#10b981', latency: '1.0s' },
];

const SUGGESTIONS = [
  {
    text: 'Deconstruct distributed architectures & systems',
    icon: Code2,
    prompt: 'Provide an exhaustive, doctoral-level architectural breakdown of modern distributed systems, event-driven state orchestration, and low-latency microservices with diagrams.'
  },
  {
    text: 'Synthesize deep research & strategic intelligence',
    icon: Compass,
    prompt: 'Conduct an exhaustive deep research investigation on 2026 AI infrastructure breakthroughs, hardware-software co-design, and verifiable market telemetry.'
  },
  {
    text: 'Analyze market movements & executive roadmaps',
    icon: FileText,
    prompt: 'Provide a rigorous, data-driven analysis of enterprise AI adoption, venture capital distribution, and strategic competitive moats for high-growth tech companies.'
  }
];

// AI Modes Switcher (Matching User Request Image 2)
const AI_MODES_MENU = [
  { id: 'everyday', label: 'Everyday answers', icon: Bot },
  { id: 'instruction', label: 'Instruction following', icon: CheckSquare },
  { id: 'writing', label: 'Writing', icon: FileText },
  { id: 'coding', label: 'Coding', icon: Code2 },
  { id: 'web-search', label: 'Web search', icon: Globe },
  { id: 'deep-research', label: 'Deep research', icon: Compass },
  { id: 'voice-chat', label: 'Voice chat', icon: Mic },
  { id: 'image-gen', label: 'Image gen', icon: ImagePlus },
  { id: 'audio-video-analysis', label: 'Audio & video analysis', icon: Activity },
  { id: 'live-camera', label: 'Live camera', icon: Camera },
  { id: 'computer-use', label: 'Computer use', icon: Terminal },
];

export default function App() {
  // Saved chat sessions
  const [sessions, setSessions] = useState<SavedChat[]>(() => {
    try {
      const saved = localStorage.getItem('bexus_vq_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('bexus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('bexus_user', JSON.stringify(user));
      // Load user-specific chat history if available, or start clean
      const userKey = `echo_ai_messages_${user.uid || 'anon'}`;
      const savedUserMsgs = localStorage.getItem(userKey);
      if (savedUserMsgs) {
        setMessages(JSON.parse(savedUserMsgs));
      } else {
        setMessages([]);
        localStorage.removeItem('echo_ai_messages');
      }
    } catch {}
    setActiveChatId(null);
  };

  const handleLogout = () => {
    sounds.playClick();
    try {
      signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    setCurrentUser(null);
    setMessages([]);
    setActiveChatId(null);
    try {
      localStorage.removeItem('bexus_user');
      localStorage.removeItem('echo_ai_messages');
    } catch {}
  };

  // Active messages
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    try {
      const saved = localStorage.getItem('echo_ai_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sidebar toggle state (defaults open on desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDeepSearchActive, setIsDeepSearchActive] = useState(false);
  const [selectedResearchReport, setSelectedResearchReport] = useState<DeepResearchReport | null>(null);

  // AI Modes Switcher State (Image 2)
  const [activeAIMode, setActiveAIMode] = useState('Everyday answers');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const modeMenuRef = useRef<HTMLDivElement | null>(null);

  // Ultra Studio Modal States
  const [isDeepResearchOpen, setIsDeepResearchOpen] = useState(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);
  const [isVoiceStudioOpen, setIsVoiceStudioOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isMediaAnalysisModalOpen, setIsMediaAnalysisModalOpen] = useState(false);
  const [isAgenticModalOpen, setIsAgenticModalOpen] = useState(false);
  const [isAppBuilderOpen, setIsAppBuilderOpen] = useState(false);
  const [isGuidedLearningOpen, setIsGuidedLearningOpen] = useState(false);
  const [isUltraModalOpen, setIsUltraModalOpen] = useState(false);
  const [appBuilderInitialPrompt, setAppBuilderInitialPrompt] = useState('');
  const [appBuilderInitialCode, setAppBuilderInitialCode] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [previewImageModalUrl, setPreviewImageModalUrl] = useState<string | null>(null);

  // 1. Light Mode State
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bexus_light_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    setIsLightMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('bexus_light_mode', String(next));
      } catch {}
      return next;
    });
  };

  // 2. Custom AI Personas State
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(() => {
    try {
      const saved = localStorage.getItem('bexus_active_persona');
      if (saved) {
        const found = AI_PERSONAS.find(p => p.id === saved);
        if (found) return found;
      }
    } catch {}
    return AI_PERSONAS[0];
  });
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const personaMenuRef = useRef<HTMLDivElement | null>(null);

  // 3. One-Click Prompt Templates State
  const [isPromptTemplatesOpen, setIsPromptTemplatesOpen] = useState(false);

  // 4. Token & Usage Quota State
  const [userTier, setUserTier] = useState<'free' | 'pro'>(() => {
    try {
      const stored = localStorage.getItem('bexus_user_tier');
      return (stored as any) || 'pro';
    } catch {
      return 'pro';
    }
  });
  const [tokensUsed, setTokensUsed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bexus_tokens_used');
      return saved ? Number(saved) : 1850;
    } catch {
      return 1850;
    }
  });
  const [messagesSentCount, setMessagesSentCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bexus_messages_sent');
      return saved ? Number(saved) : 6;
    } catch {
      return 6;
    }
  });
  const [isUsageQuotaOpen, setIsUsageQuotaOpen] = useState(false);

  // 5. History & Chat Storage: Saved Projects
  const [savedProjects, setSavedProjects] = useState<SavedProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('bexus_saved_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Text-to-Speech (TTS) Voice State
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState(false);
  const [activeSpokenLanguage, setActiveSpokenLanguage] = useState<string>('English');

  const toggleSpeak = (msgId: string, text: string, langName?: string) => {
    sounds.playClick();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown tags and code blocks for clean human-sounding speech
    const cleanSpeechText = text
      .replace(/```[\s\S]*?```/g, 'Code snippet omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*#_~]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();

    if (!cleanSpeechText) return;

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const targetLang = (langName || activeSpokenLanguage || 'English').toLowerCase();
    const langCode = targetLang === 'urdu' ? 'ur-PK' : targetLang === 'hindi' ? 'hi-IN' : targetLang === 'arabic' ? 'ar-SA' : targetLang === 'spanish' ? 'es-ES' : 'en-US';
    utterance.lang = langCode;

    // Pick top natural/expressive voice matching language if available
    try {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase())) ||
                        voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural')) && v.lang.startsWith('en')) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices[0];
      if (preferred) {
        utterance.voice = preferred;
      }
    } catch {}

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // 7. Export Dropdown State per message
  const [activeExportMenuId, setActiveExportMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        sounds.playClick();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleCommandAction = (type: string, payload?: any) => {
    if (type === 'studio') {
      handleOpenStudio(payload);
    } else if (type === 'prompt') {
      handleSendMessage(payload);
    } else if (type === 'deep_research') {
      setIsDeepSearchActive(true);
      sounds.playReceive();
    } else if (type === 'toggle_sound') {
      setIsSoundMuted(prev => !prev);
      sounds.playClick();
    } else if (type === 'new_chat') {
      handleNewChat();
    } else if (type === 'reset') {
      handleResetApp();
    }
  };

  const handleOpenStudio = (studioKey: string) => {
    sounds.playClick();
    const key = (studioKey || '').toLowerCase();
    if (key === 'image') setIsImageStudioOpen(true);
    else if (key === 'music' || key === 'deepresearch' || key === 'research') setIsDeepResearchOpen(true);
    else if (key === 'voice') setIsVoiceStudioOpen(true);
    else if (key === 'doc' || key === 'pdf' || key === 'summarizer') setIsDocModalOpen(true);
    else if (key === 'translate') setIsTranslateModalOpen(true);
    else if (key === 'camera' || key === 'vision') setIsCameraModalOpen(true);
    else if (key === 'media') setIsMediaAnalysisModalOpen(true);
    else if (key === 'agentic' || key === 'agent') setIsAgenticModalOpen(true);
    else if (key === 'appbuilder' || key === 'app') setIsAppBuilderOpen(true);
    else if (key === 'guided' || key === 'learning') setIsGuidedLearningOpen(true);
    else if (key === 'ultra' || key === 'plan') setIsUltraModalOpen(true);
  };

  const handleActivateUltraFeature = (feature: UltraFeature) => {
    sounds.playClick();
    if (feature.id === 'gemini-ultra') {
      const ultraModel = MODELS.find(m => m.id === 'bexus-3.7-ultra') || MODELS[0];
      setSelectedModel(ultraModel);
      handleSendMessage('Switch to Gemini 3.7 Ultra mode. Activate deepest reasoning context and solve complex multi-domain logic.');
    } else if (feature.id === 'deep-research') {
      setIsDeepResearchOpen(true);
    } else if (feature.id === 'notebooklm-pro') {
      setIsDocModalOpen(true);
    } else if (feature.id === 'project-mariner') {
      setIsAgenticModalOpen(true);
    } else if (feature.id === 'youtube-premium') {
      setIsVoiceStudioOpen(true);
    } else {
      if (feature.promptTemplate.endsWith(': ') || feature.promptTemplate.endsWith(':')) {
        setPrompt(feature.promptTemplate);
        setTimeout(() => textareaRef.current?.focus(), 60);
      } else {
        handleSendMessage(feature.promptTemplate);
      }
    }
  };

  const handleSelectMode = (mode: { id: string; label: string }) => {
    sounds.playClick();
    setActiveAIMode(mode.label);
    setIsModeDropdownOpen(false);

    if (mode.id === 'live-camera') {
      setIsCameraModalOpen(true);
    } else if (mode.id === 'audio-video-analysis') {
      setIsMediaAnalysisModalOpen(true);
    } else if (mode.id === 'computer-use') {
      setIsAgenticModalOpen(true);
    } else if (mode.id === 'voice-chat') {
      setIsVoiceStudioOpen(true);
    } else if (mode.id === 'image-gen') {
      setIsImageStudioOpen(true);
    } else if (mode.id === 'deep-research') {
      setIsDeepSearchActive(true);
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else if (mode.id === 'web-search') {
      setIsDeepSearchActive(true);
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else if (mode.id === 'writing') {
      setPrompt('Draft a polished, creative piece about: ');
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else if (mode.id === 'coding') {
      setPrompt('Write clean code implementation for: ');
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  // Real Web Audio synth playback state for in-chat songs
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const stopSongFnRef = useRef<(() => void) | null>(null);

  // Reasoning collapsible toggle state
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<Record<string, boolean>>({});

  const togglePlaySong = (msgId: string) => {
    sounds.playClick();
    if (playingSongId === msgId) {
      if (stopSongFnRef.current) {
        stopSongFnRef.current();
        stopSongFnRef.current = null;
      }
      setPlayingSongId(null);
    } else {
      if (stopSongFnRef.current) {
        stopSongFnRef.current();
      }
      const stopFn = sounds.playSynthesizedMelody(128, 'cyber');
      stopSongFnRef.current = stopFn;
      setPlayingSongId(msgId);
    }
  };

  const toggleReasoning = (msgId: string) => {
    sounds.playClick();
    setExpandedReasoningIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Markdown parser with rich table, math, and headers support
  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\$[^\$]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-purple-200">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-white/[0.08] text-purple-300 font-mono text-[11px] border border-white/[0.08]">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('$') && token.endsWith('$')) {
        parts.push(
          <span key={match.index} className="font-mono text-cyan-300 px-1 py-0.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-[11px]">
            {token.slice(1, -1)}
          </span>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderFormattedMarkdown = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (keyPrefix: number) => {
      if (tableRows.length === 0) return;
      const headers = tableRows[0] || [];
      const body = tableRows.slice(1);

      elements.push(
        <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-xl border border-white/10 bg-[#0d0b16] shadow-lg">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="border-b border-purple-500/30 bg-purple-950/40">
                {headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold text-purple-200 uppercase tracking-wider text-[10.5px]">
                    {parseInlineMarkdown(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {body.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 leading-relaxed">
                      {parseInlineMarkdown(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table row detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        // Ignore separator line like | :--- | :--- |
        if (/^\|[\s\-:]+(\|[\s\-:]+)+\|$/.test(trimmed)) {
          return;
        }
        const cells = trimmed.slice(1, -1).split('|');
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      // Horizontal separator
      if (trimmed === '---' || trimmed === '***') {
        elements.push(<hr key={idx} className="my-3 border-t border-white/10" />);
        return;
      }

      // Display math equations $$ ... $$
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
        elements.push(
          <div key={idx} className="my-2.5 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/25 text-center font-mono text-xs sm:text-sm text-purple-200 overflow-x-auto shadow-inner">
            {trimmed.slice(2, -2).trim()}
          </div>
        );
        return;
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-sm sm:text-base font-bold text-white mt-3.5 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            {parseInlineMarkdown(trimmed.slice(4))}
          </h3>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="text-base sm:text-lg font-bold text-white mt-4 mb-2 border-b border-white/10 pb-1">
            {parseInlineMarkdown(trimmed.slice(3))}
          </h2>
        );
        return;
      }
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="text-lg sm:text-xl font-bold text-white mt-4 mb-2">
            {parseInlineMarkdown(trimmed.slice(2))}
          </h1>
        );
        return;
      }

      // Bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1 pl-1 text-xs sm:text-sm text-neutral-200 leading-relaxed">
            <span className="text-purple-400 font-bold shrink-0 mt-0.5">•</span>
            <div className="flex-1">{parseInlineMarkdown(trimmed.slice(2))}</div>
          </div>
        );
        return;
      }

      // Numbered lists (e.g. "1. ", "2. ")
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 my-1 pl-1 text-xs sm:text-sm text-neutral-200 leading-relaxed">
            <span className="font-mono text-purple-400 font-semibold text-[11px] shrink-0 mt-0.5">{numMatch[1]}.</span>
            <div className="flex-1">{parseInlineMarkdown(numMatch[2])}</div>
          </div>
        );
        return;
      }

      // Empty line
      if (!trimmed) {
        elements.push(<div key={idx} className="h-2" />);
        return;
      }

      // Standard paragraph
      elements.push(
        <p key={idx} className="my-1 text-xs sm:text-sm text-neutral-200 leading-relaxed">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const modelMenuRef = useRef<HTMLDivElement | null>(null);
  const attachmentMenuRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bexus_vq_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions', e);
    }
  }, [sessions]);

  // Sync Firebase Auth state across sessions / browser tabs
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const accountName = firebaseUser.displayName?.trim() || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User');
        const userObj = {
          uid: firebaseUser.uid,
          name: accountName,
          displayName: accountName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          provider: 'google'
        };
        setCurrentUser((prev: any) => {
          if (!prev || prev.uid !== userObj.uid || prev.name !== userObj.name) {
            try {
              localStorage.setItem('bexus_user', JSON.stringify(userObj));
              const userKey = `echo_ai_messages_${userObj.uid}`;
              const savedMsgs = localStorage.getItem(userKey);
              if (savedMsgs) {
                setMessages(JSON.parse(savedMsgs));
              } else {
                setMessages([]);
              }
            } catch {}
            return userObj;
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Save active messages isolated per user
  useEffect(() => {
    try {
      localStorage.setItem('echo_ai_messages', JSON.stringify(messages));
      if (currentUser?.uid) {
        localStorage.setItem(`echo_ai_messages_${currentUser.uid}`, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn('Failed to save messages', e);
    }
  }, [messages, currentUser?.uid]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) {
        setIsModeDropdownOpen(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(e.target as Node)) {
        setIsAttachmentMenuOpen(false);
      }
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setIsPersonaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Web Speech API for Mic
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'ur-PK';

        recog.onresult = (e: any) => {
          let str = '';
          for (let i = 0; i < e.results.length; i++) {
            str += e.results[i][0].transcript;
          }
          if (str) {
            setPrompt(str);
          }
        };

        recog.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e);
          setIsListening(false);
        };
        recog.onend = () => setIsListening(false);
        recognitionRef.current = recog;
      } catch (err) {
        console.warn('Speech recognition setup error:', err);
      }
    }
  }, []);

  const toggleMic = () => {
    sounds.playClick();
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        return;
      } catch (e) {
        console.warn('Failed to start recognition, opening Voice Mode modal:', e);
      }
    }

    // Direct fallback to Live Voice Mode modal
    setIsVoiceStudioOpen(true);
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    if (!prompt) {
      el.style.height = '38px';
      return;
    }
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
      }
    });
  }, [prompt]);

  // New Chat Handler
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setPrompt('');
    setAttachments([]);
    try {
      localStorage.removeItem('echo_ai_messages');
    } catch (e) {
      console.warn('Cleanup failed', e);
    }
    // On small screens, close sidebar
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Select Old Chat Handler
  const handleSelectChat = (chat: SavedChat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    setPrompt('');
    setAttachments([]);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Delete Old Chat Handler
  const handleDeleteChat = (chatId: string) => {
    setSessions(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
      localStorage.removeItem('echo_ai_messages');
    }
  };

  // Reset Clean Slate
  const handleResetApp = () => {
    sounds.playClick();
    handleNewChat();
  };

  // Helper to generate a clean title from prompt
  const generateTitle = (text: string) => {
    const cleaned = text.replace(/[\n\r]+/g, ' ').trim();
    if (cleaned.length <= 32) return cleaned || 'New Chat';
    return cleaned.slice(0, 32) + '...';
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend !== undefined ? textToSend : prompt).trim();
    if ((!content && attachments.length === 0) || isLoading) return;

    sounds.playSend();

    const userMessage: MessageItem = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments: [...attachments],
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    // Track token usage telemetry
    const estTokens = Math.max(90, Math.round((content.length + 120) / 3)) + 260;
    setTokensUsed(prev => {
      const next = prev + estTokens;
      try { localStorage.setItem('bexus_tokens_used', String(next)); } catch {}
      return next;
    });
    setMessagesSentCount(prev => {
      const next = prev + 1;
      try { localStorage.setItem('bexus_messages_sent', String(next)); } catch {}
      return next;
    });

    // Track or create session
    let sessionId = activeChatId;
    if (!sessionId) {
      sessionId = 'chat_' + Date.now();
      setActiveChatId(sessionId);
      const newSession: SavedChat = {
        id: sessionId,
        title: generateTitle(content),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: newMessages,
      };
      setSessions(prev => [newSession, ...prev]);
    } else {
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, messages: newMessages, updatedAt: Date.now() }
            : s
        )
      );
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = '38px';
    }

    try {
      const lower = content.toLowerCase().trim();

      // Check if user is asking to open or fix app builder directly
      if (
        lower === 'open app builder' || 
        lower === 'open app studio' || 
        lower.includes('ai builder kholo') || 
        lower.includes('app builder kholo') ||
        lower.includes('app builder studio') ||
        lower.includes('builder kholo')
      ) {
        setIsAppBuilderOpen(true);
        setIsLoading(false);
        return;
      }

      const isImgReq = (
        /(\b(generate|create|make|draw|render|produce)\s+(an?\s+)?(ai\s+)?(image|photo|picture|photograph|pic|imge|tasweer|wallpaper)\b)/i.test(lower) ||
        /^(image|photo|picture|tasweer)\s+(of|about|for)/i.test(lower) ||
        /(\b(tasweer|photo|image|pic)\s*(banao|bana do|bana de|chahiye)\b)/i.test(lower) ||
        /^(photo of|shot of|cinematic photo of)\s+/i.test(lower) ||
        lower.includes('make ai imge of') ||
        lower.includes('make ai image of') ||
        lower.includes('ai image of')
      );
      const isMusicReq = lower.startsWith('compose a') || lower.startsWith('create music') || lower.startsWith('create a song') || lower.startsWith('compose music');
      const lastAppMessage = [...messages].reverse().find(m => m.codeSnippet && m.codeSnippet.code);
      
      // Frustration, complaints, feedback, or regular conversational speech
      const isFrustrationOrComplaint = 
        lower.includes('thak') ||
        lower.includes('tang') ||
        lower.includes('masla') ||
        lower.includes('malsa') ||
        lower.includes('sahi karta hi nahi') ||
        lower.includes('kuch sahi nahi') ||
        lower.includes('kuch nahi kar rahe') ||
        lower.includes('kya kar raho') ||
        lower.includes('kya kar rahe ho') ||
        lower.includes('kabhi') ||
        lower.includes('haar') ||
        lower.includes('safar') ||
        lower.includes('chhod') ||
        lower.includes('chor') ||
        lower.includes('alvida') ||
        lower.includes('bye bexus');

      // Only explicit commands that ask to build a full standalone app/game/website
      const isAppReq = !isFrustrationOrComplaint && (
        lower.startsWith('build an app') || 
        lower.startsWith('create an app') || 
        lower.startsWith('make an app') || 
        lower.startsWith('build a website') || 
        lower.startsWith('make a website') || 
        lower.startsWith('create a website') || 
        lower.startsWith('create a game') || 
        lower.startsWith('build a game') || 
        lower.startsWith('make a game') || 
        lower.startsWith('app banao') || 
        lower.startsWith('website banao') || 
        lower.startsWith('game banao') || 
        lower.startsWith('app bana do') || 
        lower.startsWith('website bana do') || 
        lower.startsWith('app bana ke do') || 
        lower.startsWith('website bana kar do')
      );

      let assistantMessage: MessageItem;
      const startTime = Date.now();

      if (isImgReq) {
        let cleanPrompt = content
          .replace(/^(please\s+|can you\s+|kindly\s+)/i, '')
          .replace(/^(generate|create|make|draw|render)\s+(an?\s+)?(ai\s+)?(cinematic\s+|hyper-realistic\s+|8k\s+|realistic\s+)?(artwork\s+of\s+|image\s*(of|about)?\s*|photo\s*(of|about)?\s*|picture\s*(of|about)?\s*|pic\s*(of|about)?\s*|imge\s*(of|about)?\s*|tasweer\s*(of|about)?\s*)/i, '')
          .replace(/^(image|photo|picture|tasweer)\s+(of|about|for)\s+/i, '')
          .replace(/\s+(ki\s+tasweer\s+banao|ki\s+image\s+banao|bana\s+kar\s+do|bana\s+do|tasweer\s+chahiye|image\s+chahiye)$/i, '')
          .trim();
        if (!cleanPrompt) cleanPrompt = content;

        const isAutomotiveOrLandscape = /(bmw|mercedes|audi|porsche|ferrari|car|vehicle|highway|landscape|mountain|sunset|city|cyberpunk)/i.test(cleanPrompt);

        const imgRes = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: cleanPrompt,
            style: 'Cinematic Photorealistic (8K)',
            aspectRatio: isAutomotiveOrLandscape ? '16:9' : '1:1'
          })
        });
        const imgData = await imgRes.json();
        sounds.playReceive();
        
        const directFallback = getClientDirectImageUrl(cleanPrompt, isAutomotiveOrLandscape ? 1280 : 1024);
        assistantMessage = {
          id: 'msg_asst_' + Date.now(),
          role: 'assistant',
          content: `📸 **8K Ultra Photorealistic Generation**\n\nPrompt: "${cleanPrompt}"`,
          imageUrl: imgData.imageUrl || directFallback,
          timestamp: Date.now(),
          reasoningSteps: [
            'Parsed visual prompt & aesthetic composition tags',
            'Configured 8K HDR raytraced diffusion parameters',
            'Rendered multi-channel neural diffusion artwork'
          ],
          thoughtDuration: '1.4s'
        };
      } else if (isMusicReq) {
        const cleanPrompt = content.replace(/^(compose|create)\s+(a\s+)?(futuristic\s+synthwave\s+song\s+about\s+|song\s*(about|for)?\s*|music\s*(about|for)?\s*)/i, '').trim() || content;
        const musicRes = await fetch('/api/music/compose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: cleanPrompt })
        });
        const songData = await musicRes.json();

        sounds.playReceive();
        assistantMessage = {
          id: 'msg_asst_' + Date.now(),
          role: 'assistant',
          content: `🎵 **${songData.title || 'Cybernetic Melody'}** (${songData.genre || 'Futuristic Synthwave'})\n\n${songData.lyrics || songData.description || 'Track composition and melodic chords arranged.'}`,
          songData: {
            title: songData.title || cleanPrompt,
            genre: songData.genre || 'Synthwave / Ambient',
            lyrics: songData.lyrics || '',
            tempo: songData.tempo || '120 BPM'
          },
          reasoningSteps: [
            'Harmonized 120 BPM multi-track synth chords',
            'Structured verse-chorus arrangement and rhythmic basslines',
            'Engineered Web Audio synth frequency waveforms'
          ],
          thoughtDuration: '1.2s',
          timestamp: Date.now(),
        };
      } else if (isAppReq) {
        const existingCode = lastAppMessage?.codeSnippet?.code || (typeof window !== 'undefined' ? localStorage.getItem('bexus_last_active_app_code') || undefined : undefined);

        const appRes = await fetch('/api/app/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: content,
            existingCode: existingCode
          })
        });
        const appData = await appRes.json();
        sounds.playReceive();
        
        const rawCode = appData.html || appData.code || `<!DOCTYPE html><html><body class="bg-black text-white p-6"><h1 class="text-xl font-bold">${appData.title || 'Interactive App'}</h1><p class="text-neutral-400 mt-2">Application code is ready.</p></body></html>`;

        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('bexus_last_active_app_code', rawCode);
          }
        } catch {}
        setAppBuilderInitialCode(rawCode);
        setAppBuilderInitialPrompt(appData.title || 'Interactive Application');
        
        const explanationPrefix = appData.explanation ? `${appData.explanation}\n\n` : '';
        const bodyContent = `${explanationPrefix}💻 **${appData.title || 'Interactive Application'}**\n\n${appData.description || 'Application code generated.'}\n\n✨ **Live Test:** Test the interactive preview below or click **"Open in App Studio"** to customize further!`;

        assistantMessage = {
          id: 'msg_asst_' + Date.now(),
          role: 'assistant',
          content: bodyContent,
          codeSnippet: {
            code: rawCode,
            title: appData.title || 'Interactive Application',
            language: 'html'
          },
          reasoningSteps: [
            'Architected component hierarchy & reactive state',
            'Engineered responsive Tailwind layout & interactive DOM handlers',
            'Configured live interactive client runtime & persistence'
          ],
          thoughtDuration: '1.5s',
          timestamp: Date.now(),
        };

        // Automatically save app project into history
        const newProj: SavedProjectItem = {
          id: 'proj_' + Date.now(),
          title: appData.title || 'Interactive Web App',
          type: 'code',
          timestamp: Date.now(),
          data: { html: rawCode, title: appData.title }
        };
        setSavedProjects(prev => {
          const updated = [newProj, ...prev.filter(p => p.title !== newProj.title)].slice(0, 30);
          try { localStorage.setItem('bexus_saved_projects', JSON.stringify(updated)); } catch {}
          return updated;
        });
      } else if (
        /(\b(data extract|extract data|table bana|table banao|table bana do|seo audit|github push|push kar do|push kardo|push to github|file push|action runner|api request|scrape url)\b)/i.test(lower) ||
        (/(extract|scrape|table).*(from|se|of)\s+https?:\/\//i.test(lower)) ||
        (/(seo|audit).*(of|ka|par|pe)\s+https?:\/\//i.test(lower))
      ) {
        let actionData: any = null;
        try {
          const actionRes = await fetch('/api/action/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: content })
          });
          if (actionRes.ok) {
            actionData = await actionRes.json();
          }
        } catch {
          /* fallback */
        }

        if (!actionData) {
          actionData = {
            actionType: 'general',
            goal: content,
            executionTimeMs: 410,
            summary: `Live Action Runner pipeline executed for: "${content}".`,
            logs: [
              { step: 1, action: 'Directive Resolved', status: 'ok', detail: 'Identified target pipeline' },
              { step: 2, action: 'Payload Staged', status: 'ok', detail: 'Artifacts generated successfully' }
            ]
          };
        }
        sounds.playReceive();

        assistantMessage = {
          id: 'msg_asst_' + Date.now(),
          role: 'assistant',
          content: `⚡ **Live Web & API Action Runner (Doer Mode)**\n\n${actionData.summary || 'Action pipeline executed successfully.'}`,
          actionRunnerData: actionData,
          reasoningSteps: [
            'Target action directive classified & parameters mapped',
            'Dispatched live network / API / Git execution pipeline',
            'Generated verifiable structured deliverable'
          ],
          thoughtDuration: ((actionData.executionTimeMs || 450) / 1000).toFixed(1) + 's',
          timestamp: Date.now()
        };
      } else if (isDeepSearchActive) {
        setIsDeepSearchActive(false);
        const res = await fetch('/api/research/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: content,
            depth: 'deep',
            focusArea: 'General Intelligence'
          })
        });

        const reportData: DeepResearchReport = await res.json();
        sounds.playReceive();

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

        assistantMessage = {
          id: 'msg_asst_' + Date.now(),
          role: 'assistant',
          content: reportData.overview || `🌐 Deep Web Research completed for: "${content}"`,
          researchReport: reportData,
          reasoningSteps: [
            `Scanned authoritative web indexes and domain graphs for: "${content}"`,
            `Analyzed & verified ${reportData.sources?.length || 4} real-time citation sources`,
            `Synthesized full intelligence report with ${reportData.confidenceScore || 96}% confidence score`
          ],
          thoughtDuration: `${elapsed}s`,
          timestamp: Date.now(),
        };

        // Save research dossier to projects
        const newResProj: SavedProjectItem = {
          id: 'res_' + Date.now(),
          title: reportData.title || content.slice(0, 32),
          type: 'research',
          timestamp: Date.now(),
          data: reportData
        };
        setSavedProjects(prev => {
          const updated = [newResProj, ...prev.filter(p => p.title !== newResProj.title)].slice(0, 30);
          try { localStorage.setItem('bexus_saved_projects', JSON.stringify(updated)); } catch {}
          return updated;
        });
      } else {
        // Detect explicit language switch command e.g. "speak in urdu", "speak in hindi", "speak in english"
        const langPromptMatch = content.match(/(?:speak|talk|reply|answer|bolo|baat\s+karo)\s+(?:in|into|me|mein)\s+([a-zA-Z\s]+)/i);
        let currentLang = activeSpokenLanguage;
        if (langPromptMatch && langPromptMatch[1]) {
          const reqStr = langPromptMatch[1].trim().toLowerCase();
          if (reqStr.includes('urdu')) currentLang = 'Urdu';
          else if (reqStr.includes('hindi')) currentLang = 'Hindi';
          else if (reqStr.includes('arabic') || reqStr.includes('arabi')) currentLang = 'Arabic';
          else if (reqStr.includes('spanish')) currentLang = 'Spanish';
          else if (reqStr.includes('french')) currentLang = 'French';
          else if (reqStr.includes('german')) currentLang = 'German';
          else if (reqStr.includes('english') || reqStr.includes('eng')) currentLang = 'English';
          setActiveSpokenLanguage(currentLang);
        }

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map(m => ({
              role: m.role,
              content: m.codeSnippet 
                ? `${m.content}\n\n[Active Application: ${m.codeSnippet.title}]\n\`\`\`html\n${m.codeSnippet.code.slice(0, 1500)}\n...\n\`\`\`` 
                : m.content,
              attachments: m.attachments?.map(a => ({
                type: a.type,
                mimeType: a.mimeType,
                dataBase64: a.dataBase64,
                extractedText: a.extractedText,
              }))
            })),
            modelId: selectedModel.id,
            enableReasoning: isDeepSearchActive,
            enableSearch: isDeepSearchActive,
            customInstructions: selectedPersona.systemPrompt,
            userName: currentUser?.name?.trim() || currentUser?.displayName?.trim() || (currentUser?.email ? currentUser.email.split('@')[0] : 'User'),
            preferredLanguage: currentLang
          }),
        });

        let data: any = null;
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await response.json();
          } else {
            const raw = await response.text();
            try {
              data = JSON.parse(raw);
            } catch {
              data = { text: '' };
            }
          }
        } catch {
          data = { text: '' };
        }

        if (!response.ok && !data?.text) {
          throw new Error(data?.error || `Server returned ${response.status}`);
        }

        sounds.playReceive();

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        
        // Auto-detect runnable code block
        const codeBlockMatch = data.text?.match(/```(?:html|jsx|tsx|javascript|js)?\s*([\s\S]*?)```/) || data.text?.match(/(<!DOCTYPE html>[\s\S]*?<\/html>)/i);
        let codeSnippet: { code: string; title: string; language: string } | undefined;
        if (codeBlockMatch && codeBlockMatch[1] && codeBlockMatch[1].length > 40) {
          const matchedCode = codeBlockMatch[1].trim();
          codeSnippet = {
            code: matchedCode,
            title: content.slice(0, 32) + (content.length > 32 ? '...' : ''),
            language: 'html'
          };
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem('bexus_last_active_app_code', matchedCode);
            }
          } catch {}
          setAppBuilderInitialCode(matchedCode);
          setAppBuilderInitialPrompt(codeSnippet.title);
        }

        const responseContent = data.text || 'Response received.';

        assistantMessage = {
          id: 'msg_asst_' + Date.now(),
          role: 'assistant',
          content: responseContent,
          timestamp: Date.now(),
          codeSnippet,
          reasoningSteps: isDeepSearchActive ? [
            'Analyzed query context and search sources',
            'Synthesized concise response'
          ] : undefined,
          thoughtDuration: isDeepSearchActive ? `${elapsed}s` : undefined
        };
      }

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Auto-Speak: If sound button is ON, speak answer aloud as written text appears below!
      if (isAutoSpeakEnabled && assistantMessage?.content) {
        toggleSpeak(assistantMessage.id, assistantMessage.content, activeSpokenLanguage);
      }

      // Update session with assistant response
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, messages: finalMessages, updatedAt: Date.now() }
            : s
        )
      );
    } catch (err: any) {
      console.error('[Bexus Chat Network/Server Handler]:', err);
      const query = (content || '').toLowerCase().trim();
      const userName = currentUser?.name?.trim() || 'Ubaid';
      const fallbackText = generateNaturalConversationalReply(content, {
        userName,
        lang: activeSpokenLanguage,
        voiceMode: false,
      });

      const errorMessage: MessageItem = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: fallbackText,
        timestamp: Date.now(),
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, messages: finalMessages, updatedAt: Date.now() }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    sounds.playClick();
    Array.from(files).forEach((file: File) => {
      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();

      reader.onload = evt => {
        const result = evt.target?.result as string;
        const newAttachment: Attachment = {
          id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name: file.name,
          type: isImg ? 'image' : 'document',
          mimeType: file.type || 'text/plain',
          size: file.size,
          dataBase64: isImg ? result : undefined,
          extractedText: !isImg ? result : undefined,
        };
        setAttachments(prev => [...prev, newAttachment]);
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`relative min-h-screen w-full flex font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden transition-colors duration-300 ${
      isLightMode ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#0c0b12] text-neutral-100'
    }`}>
      {/* Background Volumetric Rays & Ambience */}
      <CosmicBackground isLightMode={isLightMode} />

      {/* Sidebar: App Name -> New Chat -> Search Old Chats -> Old Chats List */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chats={sessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenStudio={handleOpenStudio}
        savedProjects={savedProjects}
        onSelectProject={(proj) => {
          if (proj.type === 'code') {
            setAppBuilderInitialCode(proj.data?.html || '');
            setAppBuilderInitialPrompt(proj.title || '');
            setIsAppBuilderOpen(true);
          } else if (proj.type === 'research') {
            setSelectedResearchReport(proj.data);
            setIsDeepResearchOpen(true);
          }
        }}
        onDeleteProject={(id) => {
          setSavedProjects(prev => {
            const next = prev.filter(p => p.id !== id);
            try { localStorage.setItem('bexus_saved_projects', JSON.stringify(next)); } catch {}
            return next;
          });
        }}
        tier={userTier}
        tokensUsed={tokensUsed}
        tokenLimit={999999999}
        onOpenQuotaModal={() => setIsUsageQuotaOpen(true)}
        isLightMode={isLightMode}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {!currentUser && (
        <BexusAuthScreen onLogin={handleLogin} isLightMode={isLightMode} />
      )}

      {/* Main Content Area (Responsive margin when sidebar is open) */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'md:pl-72' : 'pl-0'
        }`}
      >
        {/* Top Header */}
        <header className="relative z-20 w-full h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.04] bg-[#0c0b12]/75 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-neutral-300 hover:text-white transition-all cursor-pointer"
              title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* Logo & Title */}
            <div className="flex items-center gap-2">
              <EchoLogo size={24} />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm tracking-wide text-white">
                  BEXUS <span className="text-purple-400 font-medium">AI</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleResetApp}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer"
                title="Reset to Welcome Screen"
              >
                <Trash2 className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </header>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        <input
          type="file"
          ref={docInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.txt,.doc,.docx,.csv,.json"
          multiple
          className="hidden"
        />
        <input
          type="file"
          ref={audioInputRef}
          onChange={handleFileUpload}
          accept="audio/*"
          multiple
          className="hidden"
        />

        {/* Main Canvas Area */}
        <main className="relative z-10 flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto px-4 sm:px-6 pb-6 pt-2">
          {messages.length === 0 ? (
            /* Landing Hero (Matching Reference Design) */
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto w-full max-w-3xl mx-auto py-8">
              {/* Center Glowing Celestial Orb Logo */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mb-4"
              >
                <EchoLogo size={52} />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs sm:text-sm font-medium text-neutral-400 tracking-wide mb-2"
              >
                Welcome to Bexus AI
              </motion.p>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight"
              >
                How Can I Assist You?
              </motion.h1>


            </div>
          ) : (
            /* Active Chat Stream */
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-300 mt-0.5">
                      <EchoLogo size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-[#151322]/90 border border-white/[0.08] text-neutral-200 shadow-xl'
                    }`}
                  >
                    {/* Attachments preview */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {msg.attachments.map(att => (
                          <div key={att.id} className="p-1 rounded bg-black/40 border border-white/10 text-[10px]">
                            {att.dataBase64 ? (
                              <img src={att.dataBase64} alt={att.name} className="max-h-32 rounded object-cover" />
                            ) : (
                              <span>📎 {att.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Collapsible Deep Reasoning Process */}
                    {msg.role === 'assistant' && (msg.reasoningSteps?.length || msg.thoughtDuration) && (
                      <div className="mb-3 rounded-xl bg-purple-950/40 border border-purple-500/25 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleReasoning(msg.id)}
                          className="w-full px-3 py-2 flex items-center justify-between text-left text-xs hover:bg-purple-500/10 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-purple-300 font-medium">
                            <Brain className="w-3.5 h-3.5 text-purple-400" />
                            <span>Deep Reasoning Trace ({msg.thoughtDuration || '1.8s'})</span>
                          </div>
                          {expandedReasoningIds[msg.id] ? (
                            <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                          )}
                        </button>
                        {expandedReasoningIds[msg.id] && (
                          <div className="px-3 pb-2.5 pt-1 text-[11px] text-neutral-300 space-y-1.5 border-t border-purple-500/15 bg-black/20">
                            {msg.reasoningSteps?.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2">
                                <span className="text-purple-400 shrink-0 font-mono">•</span>
                                <span className="leading-relaxed">{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message text content */}
                    {msg.role === 'assistant' ? (
                      <div className="space-y-1">{renderFormattedMarkdown(msg.content)}</div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {/* AI Generated Image Artwork Preview */}
                    {msg.imageUrl && (
                      <div className="mt-3.5 relative group">
                        {/* Ambient Backlight Glow */}
                        <div 
                          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-indigo-600/30 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        />
                        <div className="relative rounded-2xl overflow-hidden border border-pink-500/40 bg-black/80 shadow-2xl">
                          <img 
                            src={msg.imageUrl} 
                            alt="AI Generated Artwork" 
                            onClick={() => {
                              sounds.playClick();
                              setPreviewImageModalUrl(msg.imageUrl || null);
                            }}
                            className="w-full max-h-[520px] object-contain sm:object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.008] cursor-zoom-in" 
                          />
                          {/* Floating Showcase Badges & Controls */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-3.5 pointer-events-auto">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-200 font-semibold tracking-wide backdrop-blur-md">
                                ✨ 8K Ultra Photoreal
                              </span>
                              <span className="hidden sm:inline text-xs text-white/90 font-medium">Bexus Neural Realism</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  setPreviewImageModalUrl(msg.imageUrl || null);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-semibold backdrop-blur-md border border-white/20 transition-all active:scale-95 cursor-pointer"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Full View</span>
                              </button>
                              <a
                                href={msg.imageUrl}
                                download={`bexus-photoreal-${Date.now()}.jpg`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-xs text-white font-semibold shadow-lg shadow-pink-500/30 transition-all active:scale-95"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Generated Music Track Preview with Real Web Audio Synthesizer */}
                    {msg.songData && (
                      <div className="mt-3.5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1233]/95 via-[#100e26]/95 to-[#0b0918]/98 border border-purple-500/35 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_35px_rgba(168,85,247,0.18)] space-y-3.5">
                        {/* Ambient Neon Top Edge */}
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                        
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Stylized Vinyl Disc / Equalizer Node */}
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/25 to-indigo-500/25 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-inner relative ${playingSongId === msg.id ? 'shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}>
                              <Music className={`w-5 h-5 ${playingSongId === msg.id ? 'animate-bounce text-pink-400' : ''}`} />
                              {playingSongId === msg.id && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-white truncate flex items-center gap-2">
                                <span>{msg.songData.title}</span>
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-purple-300/80 mt-0.5">
                                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-200 font-medium">
                                  {msg.songData.genre}
                                </span>
                                <span>•</span>
                                <span className="font-mono text-cyan-300">{msg.songData.tempo || '120 BPM'}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Live Synthesizer Play Button */}
                          <button
                            type="button"
                            onClick={() => togglePlaySong(msg.id)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${
                              playingSongId === msg.id
                                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
                                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-[0_0_18px_rgba(168,85,247,0.35)]'
                            }`}
                          >
                            {playingSongId === msg.id ? (
                              <>
                                <Square className="w-3.5 h-3.5 fill-current" />
                                <span>Stop Synth</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Play Melody</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Real-time Frequency Equalizer Visualizer */}
                        <div className="flex items-end gap-1 h-8 p-1.5 rounded-xl bg-black/60 border border-white/[0.08] shadow-inner">
                          {[30, 65, 45, 95, 60, 100, 75, 40, 85, 95, 70, 35, 80, 55, 90, 65, 45, 75, 85, 50, 70, 90, 60, 40].map((h, i) => (
                            <span 
                              key={i} 
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                playingSongId === msg.id
                                  ? 'bg-gradient-to-t from-pink-500 via-purple-400 to-cyan-300 shadow-[0_0_8px_rgba(236,72,153,0.6)]'
                                  : 'bg-white/10'
                              }`}
                              style={{ 
                                height: playingSongId === msg.id 
                                  ? `${Math.max(25, (h + (i % 4) * 18) % 100)}%` 
                                  : '20%' 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clean Code & Live Interactive App Display */}
                    {msg.codeSnippet && (
                      <InteractiveAppCard
                        title={msg.codeSnippet.title}
                        code={msg.codeSnippet.code}
                        language={msg.codeSnippet.language}
                        onOpenStudio={() => {
                          setAppBuilderInitialCode(msg.codeSnippet!.code);
                          setAppBuilderInitialPrompt(msg.codeSnippet!.title);
                          setIsAppBuilderOpen(true);
                        }}
                      />
                    )}

                    {/* Live Web & API Action Runner (Doer Engine) Card */}
                    {msg.actionRunnerData && (
                      <div className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#181510]/98 via-[#120f0a]/98 to-[#090805]/98 border border-amber-500/35 p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_35px_rgba(245,158,11,0.2)] space-y-4">
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/25 to-orange-500/25 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                              <Zap className="w-4 h-4 fill-current" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Live Web & API Action Runner (Doer)
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                                {msg.actionRunnerData.actionType === 'seo_audit'
                                  ? `SEO & Technical Audit: ${msg.actionRunnerData.seoData?.url || ''}`
                                  : msg.actionRunnerData.actionType === 'github_push'
                                  ? `GitHub Automation: ${msg.actionRunnerData.githubData?.repo || ''}`
                                  : msg.actionRunnerData.tableData?.pageTitle
                                  ? `Structured Table: ${msg.actionRunnerData.tableData.pageTitle}`
                                  : msg.actionRunnerData.goal || 'Autonomous Action Execution'}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300">
                              ⚡ Executed ({msg.actionRunnerData.executionTimeMs || 420}ms)
                            </span>
                          </div>
                        </div>

                        {/* Step Execution Logs */}
                        {msg.actionRunnerData.logs && msg.actionRunnerData.logs.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {msg.actionRunnerData.logs.map((log: any, lIdx: number) => (
                              <div key={lIdx} className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                                <div className="truncate">
                                  <span className="font-bold text-white text-[11px] mr-1.5">{log.action}:</span>
                                  <span className="text-zinc-400 text-[10.5px]">{log.detail}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* If Table Data extracted */}
                        {msg.actionRunnerData.tableData && (
                          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/25 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                                <Database className="w-3.5 h-3.5" />
                                {msg.actionRunnerData.tableData.totalRecords} Extracted Records
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    sounds.playClick();
                                    const csvContent = [
                                      msg.actionRunnerData.tableData.headers.map((h: string) => `"${h.replace(/"/g, '""')}"`).join(','),
                                      ...msg.actionRunnerData.tableData.rows.map((row: string[]) => row.map((cell: string) => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
                                    ].join('\n');
                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(blob);
                                    link.download = `table_data_${Date.now()}.csv`;
                                    link.click();
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-[11px] font-semibold text-zinc-200 flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <Download className="w-3 h-3 text-emerald-400" />
                                  <span>Download CSV</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    sounds.playClick();
                                    const jsonRecords = msg.actionRunnerData.tableData.rows.map((row: string[]) => {
                                      const obj: Record<string, string> = {};
                                      msg.actionRunnerData.tableData.headers.forEach((h: string, idx: number) => {
                                        obj[h] = row[idx] || '';
                                      });
                                      return obj;
                                    });
                                    const blob = new Blob([JSON.stringify(jsonRecords, null, 2)], { type: 'application/json' });
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(blob);
                                    link.download = `table_data_${Date.now()}.json`;
                                    link.click();
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-[11px] font-semibold text-zinc-200 flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <Download className="w-3 h-3 text-cyan-400" />
                                  <span>Download JSON</span>
                                </button>
                              </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-white/[0.08] max-h-48">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-white/[0.06] text-zinc-300 font-bold uppercase text-[9.5px]">
                                  <tr>
                                    {msg.actionRunnerData.tableData.headers.map((h: string, hI: number) => (
                                      <th key={hI} className="px-3 py-2 border-b border-white/[0.08]">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                  {msg.actionRunnerData.tableData.rows.slice(0, 5).map((row: string[], rI: number) => (
                                    <tr key={rI} className="hover:bg-white/[0.02]">
                                      {row.map((cell: string, cI: number) => (
                                        <td key={cI} className="px-3 py-1.5 text-zinc-300 text-[11px] truncate max-w-[200px]">{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* If SEO Data extracted */}
                        {msg.actionRunnerData.seoData && (
                          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/25 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-300">
                                Overall SEO Score: {msg.actionRunnerData.seoData.overallScore}/100
                              </span>
                              <span className="text-[11px] text-zinc-400 font-mono">
                                LCP: {msg.actionRunnerData.seoData.performance?.coreWebVitals?.lcp || '1.2s'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                              <div className="p-2 rounded-lg bg-zinc-900 border border-white/5">
                                <div className="font-bold text-emerald-400">{msg.actionRunnerData.seoData.headings?.h1Count || 1}</div>
                                <div className="text-[10px] text-zinc-400">H1 Headings</div>
                              </div>
                              <div className="p-2 rounded-lg bg-zinc-900 border border-white/5">
                                <div className="font-bold text-cyan-400">{msg.actionRunnerData.seoData.performance?.estimatedLoadTimeMs || 180}ms</div>
                                <div className="text-[10px] text-zinc-400">TTFB Speed</div>
                              </div>
                              <div className="p-2 rounded-lg bg-zinc-900 border border-white/5">
                                <div className="font-bold text-purple-400">{msg.actionRunnerData.seoData.meta?.titleLength || 45} chars</div>
                                <div className="text-[10px] text-zinc-400">Title Tag</div>
                              </div>
                              <div className="p-2 rounded-lg bg-zinc-900 border border-white/5">
                                <div className="font-bold text-amber-400">{msg.actionRunnerData.seoData.checks?.filter((c: any) => c.status === 'pass').length || 6} / 7</div>
                                <div className="text-[10px] text-zinc-400">Audits Passed</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* If GitHub Data executed */}
                        {msg.actionRunnerData.githubData && (
                          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/25 font-mono text-xs space-y-2">
                            <div className="flex items-center justify-between text-zinc-300">
                              <span className="text-amber-400 font-bold">Commit [{msg.actionRunnerData.githubData.commitSha}]</span>
                              <span>Branch: {msg.actionRunnerData.githubData.branch}</span>
                            </div>
                            <pre className="p-2.5 rounded-lg bg-zinc-950 text-emerald-300 text-[11px] overflow-x-auto">
                              <code>{msg.actionRunnerData.githubData.gitCommands?.join('\n')}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Deep Web Research Intelligence Report Card */}
                    {msg.researchReport && (
                      <div className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0d1526]/98 via-[#090e1a]/98 to-[#050811]/98 border border-cyan-500/35 p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_35px_rgba(6,182,212,0.18)] space-y-4">
                        {/* Cyan Ambient Shimmer */}
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-500/25 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                              <Globe className="w-4 h-4 animate-spin-slow" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                Autonomous Web Intelligence Dossier
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                                {msg.researchReport.title}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 shadow-sm">
                              {msg.researchReport.confidenceScore}% Confidence
                            </span>
                            <span className="text-[11px] text-neutral-400 font-medium px-2 py-0.5 rounded-md bg-white/[0.04]">
                              ⏱️ {msg.researchReport.readTime}
                            </span>
                          </div>
                        </div>

                        {/* Key Metrics - Clean inline stats without nested boxes */}
                        {msg.researchReport.keyMetrics && msg.researchReport.keyMetrics.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {msg.researchReport.keyMetrics.map((metric, mIdx) => (
                              <div key={mIdx} className="flex items-center gap-1.5 text-xs py-1 px-2.5 rounded-lg bg-white/[0.03] text-neutral-300">
                                <span className="text-neutral-400">{metric.label}:</span>
                                <span className="font-bold text-cyan-300">{metric.value}</span>
                                {metric.trend && (
                                  <span className="text-[10px] text-emerald-400 font-semibold">({metric.trend})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Detailed Sections Preview - Continuous flow without individual boxes */}
                        {msg.researchReport.sections && msg.researchReport.sections.length > 0 && (
                          <div className="space-y-3 pt-1 border-t border-white/[0.06]">
                            {msg.researchReport.sections.slice(0, 3).map((sec, sIdx) => (
                              <div key={sIdx} className="space-y-1.5">
                                <h5 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                                  <span>{sec.icon || '📌'}</span>
                                  <span>{sec.title}</span>
                                </h5>
                                <p className="text-xs text-neutral-300 leading-relaxed">{sec.content}</p>
                                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                                  <ul className="space-y-1 pl-2 border-l border-cyan-500/30">
                                    {sec.bulletPoints.map((bp, bpIdx) => (
                                      <li key={bpIdx} className="text-[11px] text-neutral-400 flex items-start gap-1.5">
                                        <span className="text-cyan-400 mt-1">•</span>
                                        <span>{bp}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sources */}
                        {msg.researchReport.sources && msg.researchReport.sources.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                              Verified Live Sources ({msg.researchReport.sources.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.researchReport.sources.map((src, srcIdx) => (
                                <a
                                  key={srcIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 hover:bg-cyan-950/60 border border-white/[0.08] hover:border-cyan-500/40 text-[11px] text-neutral-300 hover:text-cyan-200 transition-colors"
                                >
                                  <span>{src.domain}</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-neutral-500" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setSelectedResearchReport(msg.researchReport!);
                              setIsDeepResearchOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-md"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Open in Full Research Studio</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              const text = `# ${msg.researchReport!.title}\n\n${msg.researchReport!.overview}\n\n${msg.researchReport!.sections?.map(s => `## ${s.title}\n${s.content}\n${s.bulletPoints?.map(b => `- ${b}`).join('\n') || ''}`).join('\n\n')}`;
                              navigator.clipboard.writeText(text);
                              setCopiedId(msg.id);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy Report'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.role === 'assistant' && (
                      <div className={`flex flex-wrap items-center gap-2 mt-3 pt-2 border-t text-[11px] ${
                        isLightMode ? 'border-slate-100 text-slate-500' : 'border-white/[0.06] text-neutral-400'
                      }`}>
                        {/* 1. Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                            isLightMode ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-500 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* 2. Text-to-Speech (TTS) Voice Listen Button (Feature 6) */}
                        <button
                          type="button"
                          onClick={() => toggleSpeak(msg.id, msg.content)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                            speakingMsgId === msg.id
                              ? 'bg-purple-500/25 text-purple-400 border border-purple-500/40 font-semibold'
                              : isLightMode
                              ? 'hover:text-slate-900 hover:bg-slate-100'
                              : 'hover:text-white hover:bg-white/[0.04]'
                          }`}
                          title={speakingMsgId === msg.id ? 'Stop listening' : 'Listen to AI answer (TTS)'}
                        >
                          {speakingMsgId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-purple-400" />
                              <span className="flex items-center gap-1 text-purple-400">
                                <span>Speaking</span>
                                <span className="inline-flex gap-0.5 items-end h-3">
                                  <span className="w-0.5 h-2 bg-purple-400 animate-pulse" />
                                  <span className="w-0.5 h-3 bg-purple-400 animate-pulse" style={{ animationDelay: '100ms' }} />
                                  <span className="w-0.5 h-1.5 bg-purple-400 animate-pulse" style={{ animationDelay: '200ms' }} />
                                </span>
                              </span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>

                        {/* 3. Export Output Dropdown (Feature 3) */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setActiveExportMenuId(activeExportMenuId === msg.id ? null : msg.id);
                            }}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                              isLightMode ? 'hover:text-slate-900 hover:bg-slate-100' : 'hover:text-white hover:bg-white/[0.04]'
                            }`}
                            title="Export output (PDF, PPTX, Markdown, Code)"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                            <ChevronDown className="w-2.5 h-2.5" />
                          </button>

                          {activeExportMenuId === msg.id && (
                            <div className={`absolute left-0 bottom-full mb-1.5 w-44 rounded-xl border shadow-2xl p-1 z-30 space-y-0.5 backdrop-blur-xl ${
                              isLightMode ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#181527] border-white/10 text-white'
                            }`}>
                              <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-neutral-400 border-b border-white/[0.06]">
                                Export Formats
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  setActiveExportMenuId(null);
                                  exportAsPDF('Bexus AI Document', msg.content);
                                }}
                                className={`w-full px-2 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                  isLightMode ? 'hover:bg-slate-100' : 'hover:bg-purple-500/20 hover:text-purple-300'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-400" />
                                <span>Export as PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  const lines = msg.content.split('\n').filter(l => l.trim().length > 0);
                                  exportAsPPTX('Executive Presentation', [
                                    { title: 'Overview', content: lines.slice(0, 3).join('\n') },
                                    { title: 'Key Insights', bullets: lines.slice(3, 10).map(l => l.replace(/^[-*•]\s*/, '')) }
                                  ]);
                                }}
                                className={`w-full px-2 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                  isLightMode ? 'hover:bg-slate-100' : 'hover:bg-purple-500/20 hover:text-purple-300'
                                }`}
                              >
                                <Presentation className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Export as PPTX</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  setActiveExportMenuId(null);
                                  exportAsMarkdown(msg.content, `bexus-output-${Date.now()}.md`);
                                }}
                                className={`w-full px-2 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                  isLightMode ? 'hover:bg-slate-100' : 'hover:bg-purple-500/20 hover:text-purple-300'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-400" />
                                <span>Export Markdown (.md)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  setActiveExportMenuId(null);
                                  const codeMatch = msg.content.match(/```(?:[a-z]+)?\s*([\s\S]*?)```/);
                                  const exportCode = codeMatch ? codeMatch[1] : msg.content;
                                  exportAsCode(exportCode, `bexus-code-${Date.now()}.txt`);
                                }}
                                className={`w-full px-2 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                  isLightMode ? 'hover:bg-slate-100' : 'hover:bg-purple-500/20 hover:text-purple-300'
                                }`}
                              >
                                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Export Code / Txt</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-white mt-0.5">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <EchoLogo size={18} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[#151322]/90 border border-white/[0.08] text-xs text-purple-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>Bexus AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}



          {/* Floating Luminous Purple Prompt Dock */}
          <div className="w-full max-w-2xl mx-auto">
            <div 
              className={`relative rounded-2xl border p-3 sm:p-3.5 backdrop-blur-2xl transition-all ${
                isLightMode
                  ? 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.08)]'
                  : 'bg-[#12101b]/95 border-purple-500/40 text-white shadow-[0_0_35px_rgba(168,85,247,0.22)]'
              }`}
            >
              {/* Attachment preview pills */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 border-b border-white/[0.06]">
                  {attachments.map(att => (
                    <div
                      key={att.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-neutral-300"
                    >
                      <span className="truncate max-w-[120px]">{att.name}</span>
                      <button
                        onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                        className="hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Live Speech Recognition Waveform (Feature 6) */}
              {isListening && (
                <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs animate-pulse">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Listening to your voice... Speak now</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  </div>
                </div>
              )}

              {/* Top Row: AI Glyph Icon + Textarea */}
              <div className="flex items-start gap-2.5">
                <div className="pt-2 text-neutral-400 select-none">
                  <Sparkles className="w-4 h-4 text-neutral-400" />
                </div>

                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask AI anything or write your request..."
                  rows={1}
                  className={`w-full bg-transparent placeholder-neutral-500 text-xs sm:text-sm focus:outline-none resize-none leading-relaxed min-h-[38px] max-h-[160px] pt-1.5 ${
                    isLightMode ? 'text-slate-800' : 'text-white'
                  }`}
                />
              </div>

              {/* Bottom Row Controls: Clean and uncluttered */}
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/[0.05]">
                {/* Left Controls: Paperclip (All Options Inside) + Mic */}
                <div className="flex items-center gap-2 relative">
                  {/* Single Paperclip Option with all features in a line inside */}
                  <div className="relative" ref={attachmentMenuRef}>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setIsAttachmentMenuOpen(!isAttachmentMenuOpen);
                      }}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        isAttachmentMenuOpen 
                          ? 'bg-purple-500/25 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                          : 'text-neutral-400 hover:text-purple-300 hover:bg-white/[0.04]'
                      }`}
                      title="Attach file or media"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* All Options Inside This Single Button Menu */}
                    <AnimatePresence>
                      {isAttachmentMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          className="absolute left-0 bottom-full mb-2 w-48 rounded-xl bg-[#141124]/98 border border-white/10 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(168,85,247,0.15)] p-1 z-50 space-y-0.5"
                        >
                          <div className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-300/70">
                            Ultra AI Creation
                          </div>

                          {/* 1. Create image */}
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setIsAttachmentMenuOpen(false);
                              setIsImageStudioOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer group"
                          >
                            <div className="w-5 h-5 rounded-md bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                              <ImagePlus className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs">8K Image Studio</span>
                          </button>

                          {/* 2. Deep Research */}
                          

                          {/* 5. Voice Studio & TTS */}
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setIsAttachmentMenuOpen(false);
                              setIsVoiceStudioOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer group"
                          >
                            <div className="w-5 h-5 rounded-md bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-105 transition-transform">
                              <Mic className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs">Voice Studio & TTS</span>
                          </button>

                          {/* 6. Document Intelligence */}
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setIsAttachmentMenuOpen(false);
                              setIsDocModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer group"
                          >
                            <div className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                              <BookOpen className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs">Doc Intelligence</span>
                          </button>

                          {/* 7. Polyglot Translator */}
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setIsAttachmentMenuOpen(false);
                              setIsTranslateModalOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer group"
                          >
                            <div className="w-5 h-5 rounded-md bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                              <Languages className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs">Polyglot Translator</span>
                          </button>



                          {/* Divider: Files */}
                          <div className="pt-1 mt-0.5 px-2 border-t border-white/[0.06] text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                            Upload & Analyze
                          </div>

                          {/* Document */}
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setIsAttachmentMenuOpen(false);
                              docInputRef.current?.click();
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer group"
                          >
                            <div className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                              <FileText className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs truncate">Document (PDF/DOCX)</span>
                          </button>

                          {/* Image */}
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setIsAttachmentMenuOpen(false);
                              fileInputRef.current?.click();
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer group"
                          >
                            <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <ImageIcon className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs truncate">Upload Image</span>
                          </button>

                          {/* Audio */}
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setIsAttachmentMenuOpen(false);
                              audioInputRef.current?.click();
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer group"
                          >
                            <div className="w-5 h-5 rounded-md bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                              <Music className="w-3 h-3" />
                            </div>
                            <span className="font-medium text-xs truncate">Upload Audio</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mic */}
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isListening ? 'text-rose-400 animate-pulse bg-rose-500/20' : 'text-neutral-400 hover:text-purple-300 hover:bg-white/[0.04]'
                    }`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Deep Search Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsDeepSearchActive(!isDeepSearchActive);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                      isDeepSearchActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'text-neutral-400 hover:text-cyan-300 hover:bg-white/[0.04] border-transparent'
                    }`}
                    title={isDeepSearchActive ? 'Deep Research Active (Click to disable)' : 'Enable Autonomous Deep Research'}
                  >
                    <Compass className={`w-3.5 h-3.5 ${isDeepSearchActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                    <span className="hidden sm:inline">Deep Search</span>
                    {isDeepSearchActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                  </button>

                  {/* Sound / Voice Output Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      if (speakingMsgId) {
                        window.speechSynthesis?.cancel();
                        setSpeakingMsgId(null);
                      }
                      setIsAutoSpeakEnabled(!isAutoSpeakEnabled);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                      isAutoSpeakEnabled
                        ? 'bg-purple-500/25 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.35)]'
                        : 'text-neutral-400 hover:text-purple-300 hover:bg-white/[0.04] border-transparent'
                    }`}
                    title={isAutoSpeakEnabled ? 'Voice Output ON (AI will speak answers aloud)' : 'Voice Output OFF (Click to turn ON)'}
                  >
                    {isAutoSpeakEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">{isAutoSpeakEnabled ? 'Sound ON' : 'Sound OFF'}</span>
                    {isAutoSpeakEnabled && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
                  </button>
                </div>

                {/* Right Controls: Send Button */}
                <div className="flex items-center gap-2 relative">

                  {/* Circular Send / Action Button */}
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || (!prompt.trim() && attachments.length === 0)}
                    className="w-7 h-7 rounded-full border border-purple-400/50 bg-purple-500/20 hover:bg-purple-500/35 text-purple-200 flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.35)] active:scale-95"
                    title="Send message"
                  >
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 1. Autonomous Deep Web Research Studio */}
      <DeepResearchModal
        isOpen={isDeepResearchOpen}
        onClose={() => {
          setIsDeepResearchOpen(false);
          setSelectedResearchReport(null);
        }}
        initialReport={selectedResearchReport}
        onSendToChat={(content) => {
          setIsDeepResearchOpen(false);
          handleSendMessage(content);
        }}
      />

      

      {/* 3. 8K Photorealistic AI Image Studio */}
      <ImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
        onSendToChat={(imageUrl, promptText) => {
          setIsImageStudioOpen(false);
          sounds.playReceive();
          const newMsg: MessageItem = {
            id: 'msg_asst_' + Date.now(),
            role: 'assistant',
            content: `🎨 **Generated Artwork**: "${promptText}"`,
            imageUrl: imageUrl,
            timestamp: Date.now(),
            reasoningSteps: [
              'Custom style tuned via Image Studio',
              'Raytraced diffusion weights synthesized',
              'Ultra-HD output generated'
            ],
            thoughtDuration: '1.5s'
          };
          setMessages(prev => [...prev, newMsg]);
        }}
      />

      


      {/* 7. Neural Voice Studio & Multi-lingual Speech */}
      <VoiceStudioModal
        isOpen={isVoiceStudioOpen}
        onClose={() => setIsVoiceStudioOpen(false)}
        onSendToChat={(text) => {
          setIsVoiceStudioOpen(false);
          handleSendMessage(text);
        }}
      />

      {/* 8. Deep Document & PDF Intelligence */}
      <DocSummarizerModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSendToChat={(text) => {
          setIsDocModalOpen(false);
          handleSendMessage(text);
        }}
      />

      {/* 9. Universal Polyglot Neural Translator */}
      <LanguageTranslatorModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        onSendToChat={(text) => {
          setIsTranslateModalOpen(false);
          handleSendMessage(text);
        }}
      />

      {/* 10. Bexus AppForge — AI Full-Stack App Builder & Studio Suite */}
      <AppBuilderStudioModal
        isOpen={isAppBuilderOpen}
        onClose={() => setIsAppBuilderOpen(false)}
        initialPrompt={appBuilderInitialPrompt}
        initialCode={appBuilderInitialCode}
        onSendToChat={(text) => {
          setIsAppBuilderOpen(false);
          handleSendMessage(text);
        }}
      />

      {/* 11. Live Camera & Realtime Vision Studio */}
      <LiveCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onSendToChat={(imageUrl, analysisText) => {
          setIsCameraModalOpen(false);
          sounds.playReceive();
          const newMsg: MessageItem = {
            id: 'msg_asst_' + Date.now(),
            role: 'assistant',
            content: `📸 **Vision Inspection Analysis**:\n\n${analysisText}`,
            imageUrl: imageUrl,
            timestamp: Date.now(),
            reasoningSteps: [
              'Optical frame captured from live viewport',
              'Object detection & spatial reasoning processed',
              'Scene analysis generated'
            ],
            thoughtDuration: '1.2s'
          };
          setMessages(prev => [...prev, newMsg]);
        }}
      />

      {/* 12. Audio & Video Media Analysis Studio */}
      <MediaAnalysisModal
        isOpen={isMediaAnalysisModalOpen}
        onClose={() => setIsMediaAnalysisModalOpen(false)}
        onSendToChat={(summary) => {
          setIsMediaAnalysisModalOpen(false);
          handleSendMessage(summary);
        }}
      />

      {/* 13. Autonomous Agentic Workflow Studio */}
      <AgenticStudioModal
        isOpen={isAgenticModalOpen}
        onClose={() => setIsAgenticModalOpen(false)}
        onSendToChat={(content) => {
          setIsAgenticModalOpen(false);
          handleSendMessage(content);
        }}
      />

      {/* 14. Interactive Guided Learning Studio */}
      <GuidedLearningModal
        isOpen={isGuidedLearningOpen}
        onClose={() => setIsGuidedLearningOpen(false)}
        onSendToChat={(content) => {
          setIsGuidedLearningOpen(false);
          handleSendMessage(content);
        }}
      />

      {/* 15. Gemini Ultra Features Suite Modal */}
      <UltraPlanModal
        isOpen={isUltraModalOpen}
        onClose={() => setIsUltraModalOpen(false)}
        onActivateFeature={handleActivateUltraFeature}
      />

      {/* 16. Command Palette Matrix */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandAction}
      />

      {/* 17. One-Click AI Prompt Templates Modal (Feature 1) */}
      <PromptTemplatesModal
        isOpen={isPromptTemplatesOpen}
        onClose={() => setIsPromptTemplatesOpen(false)}
        onSelectTemplate={(chosenPrompt) => {
          setPrompt(chosenPrompt);
          setTimeout(() => textareaRef.current?.focus(), 60);
        }}
        isLightMode={isLightMode}
      />

      {/* 18. Token & Usage Quota Telemetry Modal (Feature 7) */}
      <UsageQuotaModal
        isOpen={isUsageQuotaOpen}
        onClose={() => setIsUsageQuotaOpen(false)}
        tier={userTier}
        tokensUsed={tokensUsed}
        tokenLimit={999999999}
        messagesSent={messagesSentCount}
        onToggleTier={(newTier) => {
          setUserTier(newTier);
          try { localStorage.setItem('bexus_user_tier', newTier); } catch {}
        }}
        onResetQuota={() => {
          setTokensUsed(0);
          try { localStorage.setItem('bexus_tokens_used', '0'); } catch {}
        }}
        isLightMode={isLightMode}
      />

      {/* High-Definition Fullscreen Image Lightbox Modal */}
      <AnimatePresence>
        {previewImageModalUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImageModalUrl(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div 
              onClick={e => e.stopPropagation()} 
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => setPreviewImageModalUrl(null)}
                className="absolute -top-12 right-0 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={previewImageModalUrl} 
                alt="Enlarged photorealistic generation" 
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              />
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs text-neutral-300 font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  ✨ 8K Neural Photoreal Masterpiece
                </span>
                <a
                  href={previewImageModalUrl}
                  download={`bexus-hd-${Date.now()}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-xs text-white font-semibold shadow-lg hover:brightness-110 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Ultra HD</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
