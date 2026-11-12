import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, User, Attachment } from '../../types';
import { PromptInput } from './PromptInput';
import { sounds } from '../../services/soundEffects';
import { BexusLogo } from '../common/BexusLogo';
import { 
  Bot, 
  Copy, 
  Check, 
  Download,
  Volume2, 
  VolumeX, 
  Code, 
  Play, 
  Sparkles, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink, 
  Brain, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Terminal,
  Image as ImageIcon,
  Network,
  GraduationCap,
  Compass,
  Languages
} from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  onRegenerate: () => void;
  user: User;
  onOpenCanvasWithCode: (code: string, title: string) => void;
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
  enableSearch: boolean;
  onToggleSearch: () => void;
  enableReasoning: boolean;
  onToggleReasoning: () => void;
  enableDeepResearch?: boolean;
  onToggleDeepResearch?: () => void;
}

const STARTER_PROMPTS = [
  {
    title: 'Code an interactive Web App',
    desc: 'Generate complete HTML, Tailwind & JS to run in Canvas',
    prompt: 'Create an interactive financial budget calculator web app with clean sliders, charts, and summary cards.',
    icon: Code,
    color: 'text-blue-400',
  },
  {
    title: 'Deep Multi-Step Reasoning',
    desc: 'Analyze algorithms, math proofs or system architectures',
    prompt: 'Explain the architecture and concurrency model of Node.js event loop vs Go goroutines with code examples.',
    icon: Brain,
    color: 'text-purple-400',
  },
  {
    title: 'Roman Urdu & Fluent Multilingual',
    desc: 'Ask complex tech or business questions in natural Urdu',
    prompt: 'Yar mujhe full-stack web development seekhne ka 30 days ka practical roadmap Roman Urdu mein batao.',
    icon: Sparkles,
    color: 'text-amber-400',
  },
  {
    title: 'Generate Visual Art & Audio',
    desc: 'Create futuristic visuals and synthesizer melodies',
    prompt: 'Design a prompt for a cinematic cyberpunk metropolis at twilight and explain its color theory.',
    icon: ImageIcon,
    color: 'text-pink-400',
  },
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onRegenerate,
  user,
  onOpenCanvasWithCode,
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
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const isFirstMountRef = useRef(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [expandedThinkingIds, setExpandedThinkingIds] = useState<Record<string, boolean>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'like' | 'dislike' | null>>({});

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    requestAnimationFrame(() => {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = (id: string, text: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleToggleSpeech = (id: string, text: string) => {
    sounds.playClick();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (activeSpeechId === id) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setActiveSpeechId(null);
      utterance.onerror = () => setActiveSpeechId(null);
      window.speechSynthesis.speak(utterance);
      setActiveSpeechId(id);
    }
  };

  const toggleThinking = (id: string) => {
    sounds.playClick();
    setExpandedThinkingIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFeedback = (msgId: string, type: 'like' | 'dislike') => {
    sounds.playClick();
    setFeedbackMap(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type,
    }));
  };

  const handleQuickFollowUp = (prompt: string) => {
    sounds.playClick();
    onSendMessage(prompt);
  };

  // Inline markdown parser
  const parseInlineMarkdown = (text: string) => {
    const parts = [];
    const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-zinc-100">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-zinc-300">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[12px] border border-white/[0.08]">
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Block markdown parser
  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={lineIdx} className="text-sm sm:text-base font-semibold text-zinc-100 mt-3 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={lineIdx} className="text-base sm:text-lg font-semibold text-zinc-100 mt-4 mb-1.5">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={lineIdx} className="text-lg sm:text-xl font-bold text-zinc-100 mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }

      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletContent = line.slice(2);
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
            <span className="leading-relaxed">{parseInlineMarkdown(bulletContent)}</span>
          </div>
        );
      }

      // Numbered list
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1 text-zinc-300">
            <span className="text-zinc-400 font-mono text-xs font-semibold shrink-0 mt-0.5">{numMatch[1]}.</span>
            <span className="leading-relaxed">{parseInlineMarkdown(numMatch[2])}</span>
          </div>
        );
      }

      // Empty line spacing
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Markdown Image (e.g. ![alt](url))
      const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        const altText = imgMatch[1] || 'Generated visual';
        const imgUrl = imgMatch[2];
        return (
          <div key={lineIdx} className="my-3 rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0b0c10] max-w-lg shadow-xl group/card">
            <div className="relative overflow-hidden bg-black/40 flex items-center justify-center min-h-[180px]">
              <img
                src={imgUrl}
                alt={altText}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-96 object-contain rounded-t-2xl transition-transform duration-300 group-hover/card:scale-[1.01]"
              />
            </div>
            
            <div className="px-3.5 py-2.5 bg-zinc-900/95 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
              <div className="text-zinc-300 font-medium truncate flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
                <span className="truncate">{altText}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={imgUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`bexus-ai-${Date.now()}.png`}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Download Image"
                >
                  <Download className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(imgUrl);
                    sounds.playClick();
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy Image URL"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Normal paragraph
      return (
        <p key={lineIdx} className="leading-relaxed my-0.5 text-zinc-300">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Code Block Renderer
  const renderMessageContent = (content: string, msgId: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <div key={`text-${lastIndex}`} className="space-y-1">
            {renderFormattedMarkdown(content.slice(lastIndex, match.index))}
          </div>
        );
      }

      const lang = match[1] || 'code';
      const code = match[2].trim();
      const isRunnableInCanvas = ['html', 'javascript', 'js', 'react', 'jsx', 'css'].includes(lang.toLowerCase()) || code.includes('<html') || code.includes('<div');

      parts.push(
        <div key={`code-${match.index}`} className="my-3 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0d0e12] shadow-lg">
          <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/90 border-b border-white/[0.06] text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Terminal className="w-3.5 h-3.5" />
              <span>{lang.toLowerCase() || 'code'}</span>
            </span>
            <div className="flex items-center gap-1.5">
              {isRunnableInCanvas && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenCanvasWithCode(code, `Artifact`);
                  }}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Run Canvas</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleCopy(`${msgId}-${match?.index}`, code)}
                className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer border border-white/[0.06]"
              >
                {copiedMsgId === `${msgId}-${match?.index}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <pre className="p-3.5 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed scrollbar-thin">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="space-y-1">
          {renderFormattedMarkdown(content.slice(lastIndex))}
        </div>
      );
    }

    return parts;
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden relative">
      {/* Scrollable Message Stream */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-6 space-y-6 max-w-3xl w-full mx-auto">
        {/* If no messages: Authentic High-End Empty State */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="h-full flex flex-col items-center justify-center pt-8 pb-4"
          >
            {/* Logo Badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/[0.12] shadow-xl flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-zinc-100" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 text-center tracking-tight mb-2">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 text-center max-w-md mb-8">
              How can Bexus AI assist you with your projects, code, or ideas today?
            </p>

            {/* Starter Suggestion Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl">
              {STARTER_PROMPTS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.015, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sounds.playClick();
                      onSendMessage(item.prompt);
                    }}
                    className="p-3.5 rounded-xl bg-[#14151a] hover:bg-[#1b1c23] border border-white/[0.08] hover:border-white/[0.16] text-left transition-all cursor-pointer group shadow-sm flex flex-col justify-between min-h-[90px]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Tool Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {onOpenDeepResearch && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenDeepResearch();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-xs text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Deep Research QA</span>
                </button>
              )}
              {onOpenTranslator && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenTranslator();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Neural Translator</span>
                </button>
              )}
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenCanvas();
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-blue-400" />
                <span>Canvas Sandbox</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenGuidedLearning();
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive Learning</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Message Stream */}
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const hasThinking = msg.thinkingSteps && msg.thinkingSteps.length > 0;
          const isThinkingExpanded = expandedThinkingIds[msg.id] ?? false;
          const userFeedback = feedbackMap[msg.id];
          const isLastMessage = idx === messages.length - 1;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`flex gap-3 sm:gap-3.5 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Assistant Icon */}
              {!isUser && (
                <div className="shrink-0 mt-0.5">
                  <BexusLogo size="sm" />
                </div>
              )}

              {/* Message Container */}
              <div className={`flex flex-col max-w-[88%] sm:max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {msg.attachments.map(att => (
                      <div
                        key={att.id}
                        className="rounded-lg overflow-hidden border border-white/[0.1] bg-zinc-900 shadow-sm max-w-[200px]"
                      >
                        {att.type === 'image' && att.dataBase64 ? (
                          <img src={att.dataBase64} alt={att.name} referrerPolicy="no-referrer" className="w-full h-24 object-cover" />
                        ) : (
                          <div className="p-2 flex items-center gap-2 text-xs text-zinc-300">
                            <FileText className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="truncate">{att.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reasoning Accordion */}
                {!isUser && hasThinking && (
                  <div className="w-full mb-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleThinking(msg.id)}
                      className="w-full px-3 py-1.5 flex items-center justify-between text-xs font-medium text-purple-300 hover:bg-purple-900/20 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-purple-400" />
                        <span>Thought Process ({msg.thinkingTimeSec || 1.1}s)</span>
                      </span>
                      {isThinkingExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {isThinkingExpanded && (
                      <div className="px-3.5 py-2 border-t border-purple-500/20 text-xs text-purple-200/90 font-mono space-y-1 bg-purple-950/30">
                        {msg.thinkingSteps?.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold">›</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#24252e] text-zinc-100 border border-white/[0.08] rounded-tr-md shadow-sm'
                      : 'bg-transparent text-zinc-200 w-full pl-0 pt-0'
                  }`}
                >
                  {renderMessageContent(msg.content, msg.id)}
                </div>

                {/* Assistant Message Actions Toolbar */}
                {!isUser && (
                  <div className="flex flex-col gap-2 mt-1.5 w-full">
                    <div className="flex items-center gap-1 text-zinc-400 text-xs">
                      {/* Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer"
                        title="Copy message"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Speech TTS */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeech(msg.id, msg.content)}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          activeSpeechId === msg.id
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'hover:bg-white/[0.06] hover:text-zinc-200'
                        }`}
                        title="Read aloud"
                      >
                        {activeSpeechId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Thumbs Up */}
                      <button
                        type="button"
                        onClick={() => handleFeedback(msg.id, 'like')}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          userFeedback === 'like'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'hover:bg-white/[0.06] hover:text-zinc-200'
                        }`}
                        title="Good response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Thumbs Down */}
                      <button
                        type="button"
                        onClick={() => handleFeedback(msg.id, 'dislike')}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          userFeedback === 'dislike'
                            ? 'text-rose-400 bg-rose-500/10'
                            : 'hover:bg-white/[0.06] hover:text-zinc-200'
                        }`}
                        title="Bad response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Regenerate on last message */}
                      {isLastMessage && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onRegenerate();
                          }}
                          className="p-1.5 rounded-md hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer ml-1 flex items-center gap-1 text-[11px]"
                          title="Regenerate response"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>

                    {/* Quick Follow-up Pills */}
                    {isLastMessage && !isLoading && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleQuickFollowUp('Simplify this explanation.')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-200 text-[11px] font-medium transition-all cursor-pointer shadow-sm"
                        >
                          Simplify explanation
                        </button>
                        <button
                          onClick={() => handleQuickFollowUp('Give a clean step-by-step practical code example.')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-200 text-[11px] font-medium transition-all cursor-pointer shadow-sm"
                        >
                          Add code sample
                        </button>
                        <button
                          onClick={() => handleQuickFollowUp('Roman Urdu mein short aur easy summary batao.')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-200 text-[11px] font-medium transition-all cursor-pointer shadow-sm"
                        >
                          🇵🇰 Roman Urdu Summary
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/[0.12] shrink-0 mt-1 shadow-sm">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    width={28} 
                    height={28} 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Streaming / Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex gap-3 sm:gap-3.5"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-white/[0.1] flex items-center justify-center text-zinc-300 shrink-0 mt-1 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="py-2 flex items-center gap-2 text-xs text-zinc-400">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.3s]" />
                </div>
                <span className="font-mono text-zinc-300">Thinking & generating answer...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollEndRef} />
      </div>

      {/* Floating Bottom Input Bar */}
      <div className="relative z-20 pt-2 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/95 to-transparent">
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
          placeholder="Ask a question, request code, or explore ideas..."
        />
      </div>
    </div>
  );
};
