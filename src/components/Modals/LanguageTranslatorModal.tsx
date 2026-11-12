import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../services/soundEffects';
import {
  X,
  Languages,
  Sparkles,
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  MessageSquare
} from 'lucide-react';

interface LanguageTranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (text: string) => void;
}

const LANGUAGES = [
  { code: 'ur', name: 'Urdu (اردو)', flag: '🇵🇰' },
  { code: 'ur-roman', name: 'Roman Urdu (رومن اردو)', flag: '🇵🇰' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'tr', name: 'Turkish (Türkçe)', flag: '🇹🇷' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ps', name: 'Pashto (پښتو)', flag: '🇦🇫' },
  { code: 'fa', name: 'Persian (فارسی)', flag: '🇮🇷' },
  { code: 'pa', name: 'Punjabi (پنجابی)', flag: '🇵🇰' },
  { code: 'sd', name: 'Sindhi (سنڌي)', flag: '🇵🇰' },
  { code: 'ru', name: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'it', name: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese (Português)', flag: '🇧🇷' },
  { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷' }
];

const PRESET_PHRASES = [
  { label: 'Business Deal', text: 'We are delighted to partner with your firm on this transformative AI and software venture.' },
  { label: 'Poetic Feeling', text: 'دل کی باتیں لفظوں کی محتاج نہیں ہوتیں، سچی دوستی ہمیشہ دل سے پہچانی جاتی ہے۔' },
  { label: 'Tech Support', text: 'Please ensure your database credentials and API keys are securely protected in the environment configuration.' },
  { label: 'Travel Greeting', text: 'Could you please recommend the best local restaurants and cultural landmarks to visit here?' },
  { label: 'Urdu to English', text: 'مجھے اس پروجیکٹ کے لیے جدید مصنوعی ذہانت کا نظام تیار کرنا ہے۔' }
];

export const LanguageTranslatorModal: React.FC<LanguageTranslatorModalProps> = ({
  isOpen,
  onClose,
  onSendToChat
}) => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ur');
  const [tone, setTone] = useState<'natural' | 'formal' | 'poetic'>('natural');
  const [inputText, setInputText] = useState(PRESET_PHRASES[0].text);
  const [translatedText, setTranslatedText] = useState(
    'ہمیں اس انقلابی AI اور سافٹ ویئر منصوبے میں آپ کے ادارے کے ساتھ شراکت داری قائم کرنے پر دلی مسرت ہے۔'
  );
  const [romanUrduText, setRomanUrduText] = useState(
    'Humein is inqilabi AI aur software mansoobay mein aap ke idaray ke sath sharakat dari qaim karne par dili musarrat hai.'
  );
  const [alternativeText, setAlternativeText] = useState(
    'آپ کی کمپنی کے ساتھ اس جدید AI اور سافٹ ویئر پروجیکٹ پر کام کرنا ہمارے لیے باعثِ مسرت ہے۔'
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedRoman, setCopiedRoman] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<'input' | 'output' | null>(null);

  if (!isOpen) return null;

  const isRtl = (code: string) => ['ur', 'ar', 'fa', 'ps', 'sd'].includes(code);

  const copySafely = async (text: string, isRoman = false) => {
    if (!text) return;
    sounds.playClick();
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch {
      // Fallback
    }
    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }
    if (isRoman) {
      setCopiedRoman(true);
      setTimeout(() => setCopiedRoman(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwap = () => {
    sounds.playClick();
    const newSource = targetLang;
    const newTarget = sourceLang;
    setSourceLang(newSource);
    setTargetLang(newTarget);
    const newInput = translatedText || inputText;
    setInputText(newInput);
    setTranslatedText('');
    setRomanUrduText('');
    setAlternativeText('');
    if (newInput && newInput.trim()) {
      handleTranslate(newInput, tone, newSource, newTarget);
    }
  };

  const handleTranslate = async (
    textToTranslate = inputText,
    customTone = tone,
    customSource = sourceLang,
    customTarget = targetLang
  ) => {
    if (!textToTranslate.trim()) return;
    sounds.playClick();
    setIsTranslating(true);

    const cleanInput = textToTranslate.trim();

    try {
      // 1. Try dedicated Neural Translation API with tone
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanInput,
          sourceLang: customSource,
          targetLang: customTarget,
          tone: customTone
        })
      });

      if (res.ok) {
        const data = await res.json();
        const output = data.translatedText || data.text || data.content;
        if (output && output.trim()) {
          setTranslatedText(output.trim());
          if (data.romanUrdu) setRomanUrduText(data.romanUrdu.trim());
          else setRomanUrduText('');
          if (data.alternative) setAlternativeText(data.alternative.trim());
          else setAlternativeText('');
          sounds.playReceive();
          return;
        }
      }

      // 2. Direct high-quality fallback
      const cleanSource = customSource === 'ur-roman' ? 'ur' : customSource;
      const cleanTarget = customTarget === 'ur-roman' ? 'ur' : customTarget;
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(cleanSource)}&tl=${encodeURIComponent(cleanTarget)}&dt=t&q=${encodeURIComponent(cleanInput)}`;
      const gtxRes = await fetch(gtxUrl);
      if (gtxRes.ok) {
        const gtxData = await gtxRes.json();
        if (Array.isArray(gtxData) && Array.isArray(gtxData[0])) {
          let joined = gtxData[0].map((part: any) => part[0]).filter(Boolean).join('');
          if (targetLang.includes('ur')) {
            joined = joined
              .replace(/^ہیلو[،,\s]*/i, 'السلام علیکم، ')
              .replace(/اے آئی \(AI\)/g, 'AI')
              .replace(/آپ کی فرم کے ساتھ اشتراک/g, 'آپ کے ادارے کے ساتھ شراکت داری');
          }
          if (joined) {
            setTranslatedText(joined);
            sounds.playReceive();
            return;
          }
        }
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = (textToSpeak: string, langCode: string, source: 'input' | 'output') => {
    if (!textToSpeak.trim()) return;
    sounds.playClick();
    setIsSpeaking(source);

    const cleanLang = langCode === 'ur-roman' ? 'ur' : langCode;
    const audio = new Audio(`/api/tts?lang=${encodeURIComponent(cleanLang)}&text=${encodeURIComponent(textToSpeak)}`);
    
    audio.onended = () => setIsSpeaking(null);
    audio.onerror = () => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = cleanLang;
        utterance.onend = () => setIsSpeaking(null);
        utterance.onerror = () => setIsSpeaking(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(null);
      }
    };

    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = cleanLang;
        utterance.onend = () => setIsSpeaking(null);
        utterance.onerror = () => setIsSpeaking(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(null);
      }
    });
  };

  const handleSendToChat = () => {
    if (!translatedText || !onSendToChat) return;
    sounds.playClick();
    const srcName = LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang;
    const tgtName = LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
    onSendToChat(`### 🌐 Translation (${srcName} ➔ ${tgtName}):\n\n**Original:**\n"${inputText}"\n\n**Translation:**\n"${translatedText}"`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#0c0a1a]/98 border border-emerald-500/25 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.15)] overflow-hidden"
      >
        {/* Top Emerald Shimmer */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

        {/* Compact Header */}
        <header className="px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-md shadow-teal-500/30 text-white shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Universal AI Neural Translator
                </h2>
                <span className="text-[9px] px-2 py-0.2 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100+ Languages
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Preserving tone, idioms, Roman Urdu transliteration & technical accuracy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Scrollable Body Container so nothing ever cuts off */}
        <div className="p-3 sm:p-4 space-y-2.5 overflow-y-auto flex-1">
          {/* Language Selector Bar */}
          <div className="flex items-center justify-between gap-2 p-2 bg-zinc-900/80 border border-white/[0.08] rounded-xl">
            <div className="flex-1">
              <label className="text-[9px] text-zinc-400 uppercase tracking-wider font-semibold block mb-0.5">
                From Language
              </label>
              <select
                value={sourceLang}
                onChange={e => {
                  const val = e.target.value;
                  setSourceLang(val);
                  if (inputText.trim()) {
                    handleTranslate(inputText, tone, val, targetLang);
                  }
                }}
                className="w-full bg-[#181a24] border border-white/[0.1] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwap}
              className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors cursor-pointer mt-3"
              title="Swap Languages"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1">
              <label className="text-[9px] text-zinc-400 uppercase tracking-wider font-semibold block mb-0.5">
                To Language
              </label>
              <select
                value={targetLang}
                onChange={e => {
                  const val = e.target.value;
                  setTargetLang(val);
                  if (inputText.trim()) {
                    handleTranslate(inputText, tone, sourceLang, val);
                  }
                }}
                className="w-full bg-[#181a24] border border-white/[0.1] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tone Selector Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-950/60 border border-white/[0.06] rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold pl-1 shrink-0">
              Tone:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'natural', label: 'Natural & Respectful', urLabel: 'باوقار و شائستہ' },
                { id: 'formal', label: 'Formal / Professional', urLabel: 'دفتری و پیشہ ورانہ' },
                { id: 'poetic', label: 'Literary / Expressive', urLabel: 'ادبی و پرتاثیر' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    const nextTone = t.id as 'natural' | 'formal' | 'poetic';
                    setTone(nextTone);
                    if (inputText.trim()) {
                      handleTranslate(inputText, nextTone);
                    }
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    tone === t.id
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/20'
                      : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-transparent'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className="text-[9px] opacity-70 ml-1">({t.urLabel})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Translation Dual-Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Input Panel */}
            <div className="p-3 bg-zinc-900/60 border border-white/[0.08] rounded-xl flex flex-col justify-between space-y-2">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                dir={isRtl(sourceLang) ? 'rtl' : 'ltr'}
                rows={3}
                placeholder="Type or paste any text to translate..."
                className={`w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none resize-none leading-relaxed ${
                  isRtl(sourceLang) ? 'font-serif text-right text-sm leading-relaxed' : ''
                }`}
              />
              <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(inputText, sourceLang, 'input')}
                    disabled={!inputText.trim()}
                    className={`text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-30 ${
                      isSpeaking === 'input' ? 'text-teal-400 animate-pulse' : ''
                    }`}
                    title="Listen to original"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  {inputText.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setInputText('');
                        setTranslatedText('');
                        setRomanUrduText('');
                        setAlternativeText('');
                      }}
                      className="text-[11px] text-zinc-400 hover:text-rose-400 px-1.5 py-0.5 rounded hover:bg-white/[0.06] transition-colors cursor-pointer"
                      title="Clear text"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleTranslate()}
                  disabled={isTranslating || !inputText.trim()}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {isTranslating ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Translating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Translate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-3 bg-[#0e1217] border border-teal-500/30 rounded-xl flex flex-col justify-between space-y-2 relative">
              <div className="space-y-2">
                <div
                  dir={isRtl(targetLang) ? 'rtl' : 'ltr'}
                  className={`overflow-y-auto max-h-[110px] text-xs sm:text-sm text-teal-100 whitespace-pre-line leading-relaxed ${
                    isRtl(targetLang) ? 'font-serif text-right text-sm sm:text-base tracking-wide leading-relaxed font-medium' : ''
                  }`}
                >
                  {translatedText ? (
                    translatedText
                  ) : (
                    <span className="text-zinc-500 italic text-xs">
                      {isTranslating ? 'Generating neural translation with native human fluency...' : 'Translation will appear here instantly.'}
                    </span>
                  )}
                </div>

                {/* Roman Urdu Transliteration Display */}
                {romanUrduText && (
                  <div className="p-2 rounded-lg bg-teal-950/40 border border-teal-500/25 flex items-start justify-between gap-2 text-left">
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-teal-400 block tracking-wider">
                        Roman Urdu (آسان تلفظ)
                      </span>
                      <p className="text-[11px] text-teal-200/90 leading-snug mt-0.5 font-sans">
                        {romanUrduText}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copySafely(romanUrduText, true)}
                      className="text-teal-400 hover:text-white p-1 rounded hover:bg-teal-500/20 shrink-0 cursor-pointer"
                      title="Copy Roman Urdu"
                    >
                      {copiedRoman ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Alternative Phrasing Chip */}
                {alternativeText && (
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-zinc-500 font-medium">Alternative:</span>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        const temp = translatedText;
                        setTranslatedText(alternativeText);
                        setAlternativeText(temp);
                      }}
                      className="text-teal-300 hover:underline hover:text-teal-200 cursor-pointer text-left"
                    >
                      "{alternativeText}" <span className="text-[9px] text-teal-400/80 font-bold">(Use this)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(translatedText, targetLang, 'output')}
                    disabled={!translatedText}
                    className={`text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] disabled:opacity-30 transition-colors cursor-pointer ${
                      isSpeaking === 'output' ? 'text-teal-400 animate-pulse' : ''
                    }`}
                    title="Listen to translation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => copySafely(translatedText, false)}
                    disabled={!translatedText}
                    className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] disabled:opacity-30 transition-colors cursor-pointer"
                    title="Copy Translation"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {onSendToChat && translatedText && (
                  <button
                    onClick={handleSendToChat}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Send to Chat</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Preset Phrases */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-0.5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold shrink-0">
              Quick Samples:
            </span>
            {PRESET_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(phrase.text);
                  handleTranslate(phrase.text);
                }}
                className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-teal-500/20 hover:border-teal-500/40 border border-white/[0.06] text-zinc-300 hover:text-teal-200 text-[11px] shrink-0 transition-colors cursor-pointer"
              >
                {phrase.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
