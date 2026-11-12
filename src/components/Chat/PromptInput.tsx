import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Attachment } from '../../types';
import { sounds } from '../../services/soundEffects';
import { 
  ArrowUp, 
  Image as ImageIcon, 
  Paperclip, 
  Globe, 
  Brain, 
  X, 
  Wand2, 
  Sparkles
} from 'lucide-react';

interface PromptInputProps {
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
  enableSearch: boolean;
  onToggleSearch: () => void;
  enableReasoning: boolean;
  onToggleReasoning: () => void;
  enableDeepResearch?: boolean;
  onToggleDeepResearch?: () => void;
  placeholder?: string;
}

const QUICK_TAGS = [
  { label: '💻 Web App', prefix: 'Create a fully functional interactive web application with HTML/Tailwind/JS in Canvas: ' },
  { label: '🧠 Deep Analysis', prefix: 'Provide a step-by-step deep technical breakdown with trade-offs: ' },
  { label: '🇵🇰 Urdu Dost', prefix: 'Mujhe asan Roman Urdu mein practical tareeqe se samjhao: ' },
  { label: '⚡ Code Refactor', prefix: 'Optimize and clean up this code for production standards: ' }
];

export const PromptInput: React.FC<PromptInputProps> = ({
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
  placeholder = 'Ask anything, request code, or explore ideas...',
}) => {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea without triggering layout thrashing / forced reflow
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    if (!prompt) {
      el.style.height = '48px';
      return;
    }
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
      }
    });
  }, [prompt]);

  const handleSend = () => {
    if ((!prompt.trim() && attachments.length === 0) || isLoading) return;
    sounds.playSend();
    onSendMessage(prompt.trim(), attachments);
    setPrompt('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMagicEnhance = async () => {
    if (!prompt.trim()) {
      setPrompt('Create an interactive modern web dashboard with live charts, filtering, and theme support.');
      return;
    }
    sounds.playClick();
    setIsEnhancing(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Refine and improve this user prompt to be more structured, detailed, and high-impact for an AI assistant. Return ONLY the refined prompt text without any introductory explanations:\n\n"${prompt}"`,
            },
          ],
          customInstructions: 'Return only the refined single-paragraph prompt.',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setPrompt(data.text.trim());
        sounds.playReceive();
      }
    } catch {
      setPrompt(`Please provide a comprehensive, step-by-step implementation and detailed explanation for: ${prompt}`);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    sounds.playClick();
    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      const isImg = file.type.startsWith('image/');
      
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
  };

  const removeAttachment = (id: string) => {
    sounds.playClick();
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 pb-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
      />

      {/* Quick Mode Tag Pills */}
      {!prompt && attachments.length === 0 && (
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto py-1 scrollbar-thin">
          {QUICK_TAGS.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sounds.playClick();
                setPrompt(tag.prefix);
                textareaRef.current?.focus();
              }}
              className="px-2.5 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-[11px] text-zinc-300 hover:text-white transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 mb-2 overflow-x-auto py-1"
          >
            {attachments.map(att => (
              <div
                key={att.id}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/[0.1] text-xs text-zinc-200 shrink-0 shadow-sm"
              >
                {att.type === 'image' && att.dataBase64 ? (
                  <img src={att.dataBase64} alt={att.name} className="w-5 h-5 rounded object-cover" />
                ) : (
                  <Paperclip className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <span className="max-w-[120px] truncate">{att.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="text-zinc-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern elevated input card */}
      <motion.div 
        layout
        className="relative rounded-2xl sm:rounded-3xl bg-[#161311]/90 backdrop-blur-xl border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-orange-500/45 focus-within:shadow-[0_0_25px_rgba(255,120,40,0.15)] transition-all p-3.5 sm:p-4"
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm sm:text-base focus:outline-none resize-none leading-relaxed min-h-[28px] max-h-[160px]"
        />

        {/* Bottom Bar Controls */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06]">
          {/* Left Actions: Clean Image Upload Button matching reference screenshot */}
          <div className="flex items-center gap-2">
            {/* Direct Image/File Attachment Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                fileInputRef.current?.click();
              }}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-amber-500/40 text-neutral-400 hover:text-white transition-all cursor-pointer shadow-sm group"
              title="Attach image or file"
            >
              <ImageIcon className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition-colors" />
            </button>

            {/* AI Magic Prompt Enhancer */}
            <button
              type="button"
              onClick={handleMagicEnhance}
              disabled={isEnhancing}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isEnhancing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/[0.08] text-neutral-400 hover:text-amber-300'
              }`}
              title="AI Magic Prompt Enhancer"
            >
              <Wand2 className="w-4 h-4" />
            </button>

            {/* Grounding, Reasoning & Deep Research active indicators */}
            {enableSearch && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-300">
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">Search on</span>
              </span>
            )}
            {enableReasoning && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium text-purple-300">
                <Brain className="w-3 h-3" />
                <span className="hidden sm:inline">Reasoning on</span>
              </span>
            )}
            {enableDeepResearch && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                <span className="hidden sm:inline">Deep Research on</span>
              </span>
            )}
          </div>

          {/* Right Action: Send Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || (!prompt.trim() && attachments.length === 0)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:from-orange-600 disabled:hover:to-orange-500 cursor-pointer shadow-[0_2px_14px_rgba(255,100,20,0.35)] hover:shadow-[0_0_20px_rgba(255,120,30,0.55)] active:scale-95"
              title="Design it / Send"
            >
              <span>Design it</span>
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5] rotate-45" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
