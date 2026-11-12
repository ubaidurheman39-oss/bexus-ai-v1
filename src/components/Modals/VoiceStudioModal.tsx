import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../services/soundEffects';
import { generateNaturalConversationalReply } from '../../utils/intelligentConversationalEngine';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Radio,
  FileAudio,
  Languages,
  Mic,
  MicOff,
  MessageSquare,
  Film,
  Scissors,
  CheckCircle2,
  Globe,
  Loader2,
  Send,
  Zap,
  Ear,
  PhoneCall,
  PhoneOff
} from 'lucide-react';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (text: string) => void;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  defaultScript: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    defaultScript: 'السلام علیکم! بیکسس اے آئی میں خوش آمدید۔ آپ کا یہ وائس اوور یوٹیوب، ٹک ٹاک اور ریلز کے لیے بالکل تیار ہے۔'
  },
  {
    code: 'en',
    name: 'English (US)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    defaultScript: 'Welcome to Bexus AI. This is a crystal-clear, studio-grade neural voiceover ready for your YouTube videos, podcasts, and reels.'
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
    defaultScript: 'Greetings! This British broadcast-grade audio is synthesized with natural cadence and tone for documentaries and storytelling.'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    defaultScript: 'नमस्ते! बेक्सस एआई में आपका स्वागत है। अपनी यूट्यूब वीडियो और रील्स के लिए यह हाई-क्واलिटी वॉइसओवर तुरंत डाउनलोड करें।'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    defaultScript: 'مرحباً بكم في استوديو بيكسس للذكاء الاصطناعي. تسجيل صوتي عالي الدقة جاهز لمقاطع الفيديو الخاصة بك.'
  },
  {
    code: 'ps',
    name: 'Pashto',
    nativeName: 'پښتو',
    flag: '🇦🇫',
    defaultScript: 'ستاسو هرکلی کوو. د بیکسس مصنوعي هوښیارتیا سره خپلو ویډیوګانو لپاره په زړه پورې غږونه جوړ کړئ.'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ / پنجابی',
    flag: '🇵🇰',
    defaultScript: 'جی آیاں نوں! بیکسس اے آئی نال اپنی ویڈیو لئی اعلیٰ کوالٹی دی آواز تیار کرو۔'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    defaultScript: 'Bexus AI stüdyosuna hoş geldiniz. YouTube ve video projeleriniz için ultra net seslendirme dosyası hazır.'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    defaultScript: 'Bienvenido a Bexus AI. Esta es una locución neuronal de alta definición lista para tus videos y proyectos.'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    defaultScript: '欢迎使用 Bexus AI。这是专为您的视频和项目准备的高品质语音旁白。'
  }
];

export interface VoicePreset {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  accent: string;
  description: string;
  langCode: string;
  avatarColor: string;
  pitch: number;
  rateModifier: number;
  characterTitle: string;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'zara-ur',
    name: 'Zara (Urdu / Hindi)',
    gender: 'Female',
    accent: 'Urdu Natural Conversational',
    description: 'Sweet, friendly, warm and expressive for reels, storytelling & voice chat.',
    langCode: 'ur',
    avatarColor: 'from-pink-500 to-purple-600',
    pitch: 1.25,
    rateModifier: 1.05,
    characterTitle: 'Warm Soprano'
  },
  {
    id: 'bilal-ur',
    name: 'Bilal (Urdu Voiceover)',
    gender: 'Male',
    accent: 'Urdu Radio & Broadcast',
    description: 'Clear, authoritative tone for news, YouTube documentaries & explainers.',
    langCode: 'ur',
    avatarColor: 'from-amber-500 to-orange-600',
    pitch: 0.82,
    rateModifier: 0.95,
    characterTitle: 'Deep Baritone'
  },
  {
    id: 'nova-en',
    name: 'Nova AI (English)',
    gender: 'Female',
    accent: 'American (Clear & Professional)',
    description: 'Crisp, articulate voice ideal for tutorials, business & ads.',
    langCode: 'en',
    avatarColor: 'from-cyan-500 to-blue-600',
    pitch: 1.12,
    rateModifier: 1.02,
    characterTitle: 'Crisp Neutral'
  },
  {
    id: 'atlas-en',
    name: 'Atlas Deep (Cinematic)',
    gender: 'Male',
    accent: 'British Bass (Podcasts)',
    description: 'Authoritative, resonant voice for cinematic trailers & deep audiobooks.',
    langCode: 'en-GB',
    avatarColor: 'from-purple-500 to-indigo-600',
    pitch: 0.68,
    rateModifier: 0.88,
    characterTitle: 'Cinematic Bass'
  },
  {
    id: 'priya-hi',
    name: 'Priya (Hindi)',
    gender: 'Female',
    accent: 'Hindi Expressive',
    description: 'Sweet, engaging tone for stories, podcasts and YouTube vlogs.',
    langCode: 'hi',
    avatarColor: 'from-rose-500 to-pink-600',
    pitch: 1.30,
    rateModifier: 1.02,
    characterTitle: 'Melodic Hindi'
  },
  {
    id: 'tariq-ar',
    name: 'Tariq (Arabic)',
    gender: 'Male',
    accent: 'Standard Modern Arabic',
    description: 'Eloquent, clear classical Arabic voice for recitations and videos.',
    langCode: 'ar',
    avatarColor: 'from-blue-600 to-indigo-700',
    pitch: 0.86,
    rateModifier: 0.92,
    characterTitle: 'Classical Resonance'
  }
];

interface DialogueTurn {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({
  isOpen,
  onClose,
  onSendToChat
}) => {
  // Main Studio Mode Switcher: Live Conversational vs Studio TTS
  const [mode, setMode] = useState<'live' | 'tts'>('live');

  // CONVERSATIONAL VOICE MODE STATE (Gemini Live / ChatGPT style)
  const [convStatus, setConvStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [userSpeechText, setUserSpeechText] = useState('');
  const [dialogue, setDialogue] = useState<DialogueTurn[]>([
    {
      role: 'assistant',
      text: 'Assalam o Alaikum! Main Bexus AI hoon. Aaj kya seekhna ya explore karna hai?',
      time: 'Just now'
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [manualInput, setManualInput] = useState('');

  // STUDIO TTS MODE STATE
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [text, setText] = useState<string>(
    SUPPORTED_LANGUAGES.find(l => l.code === 'en')?.defaultScript || 'Welcome to Bexus AI. How can I help you today?'
  );
  const [selectedVoice, setSelectedVoice] = useState<VoicePreset>(
    VOICE_PRESETS.find(v => v.id === 'nova-en') || VOICE_PRESETS[0]
  );
  const [rate, setRate] = useState(1.0);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [audioWaves, setAudioWaves] = useState<number[]>(new Array(28).fill(12));

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const convActiveRef = useRef(false);

  // Audio wave visualizer animation loop
  useEffect(() => {
    let interval: any;
    const isAudioActive = convStatus === 'speaking' || convStatus === 'listening' || isPlayingTTS;
    if (isAudioActive) {
      interval = setInterval(() => {
        setAudioWaves(
          new Array(28).fill(0).map(() => Math.floor(Math.random() * (convStatus === 'speaking' ? 75 : 45)) + 12)
        );
      }, 90);
    } else {
      setAudioWaves(new Array(28).fill(10));
    }
    return () => clearInterval(interval);
  }, [convStatus, isPlayingTTS]);

  // Initialize Web Speech Recognition for Live Conversational Voice Mode
  useEffect(() => {
    if (!isOpen) {
      handleStopAll();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = selectedLang === 'ur' ? 'ur-PK' : (selectedLang === 'hi' ? 'hi-IN' : 'en-US');

        recog.onstart = () => {
          setConvStatus('listening');
        };

        recog.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          const spoken = final || interim;
          setUserSpeechText(spoken);

          if (final && final.trim()) {
            handleProcessUserVoiceInput(final.trim());
          }
        };

        recog.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e?.error);
          if (convActiveRef.current && convStatus === 'listening') {
            // Keep ready
            setConvStatus('idle');
          }
        };

        recog.onend = () => {
          if (convActiveRef.current && convStatus === 'listening') {
            setConvStatus('idle');
          }
        };

        recognitionRef.current = recog;
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    }

    return () => {
      handleStopAll();
    };
  }, [isOpen, selectedLang]);

  // Start Listening in Live Mode
  const startLiveListening = () => {
    sounds.playClick();
    if (convStatus === 'speaking') {
      stopAudioPlayback();
    }

    convActiveRef.current = true;
    setUserSpeechText('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setConvStatus('listening');
      } catch {
        // If already started or browser blocked, toggle to ready
        setConvStatus('listening');
      }
    } else {
      setConvStatus('listening');
    }
  };

  const stopLiveListening = () => {
    sounds.playClick();
    convActiveRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setConvStatus('idle');
  };

  const stopAudioPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setConvStatus('idle');
    setIsPlayingTTS(false);
  };

  const handleStopAll = () => {
    stopLiveListening();
    stopAudioPlayback();
  };

  // Process user voice input and converse back
  const handleProcessUserVoiceInput = async (spokenQuery: string) => {
    if (!spokenQuery.trim()) return;

    sounds.playReceive();
    setConvStatus('thinking');

    // Add user turn to dialogue
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDialogue(prev => [
      ...prev,
      { role: 'user', text: spokenQuery, time: nowTime }
    ]);

    // Fast instant response for greetings & conversational small talk
    const instantReply = generateNaturalConversationalReply(spokenQuery, { lang: selectedLang, voiceMode: true });
    const isSmallTalk = /^(how are you|hoy are you|how r u|how do you do|kese ho|kaise ho|kya hal|kya haal|sab theek|hello|hi|hey|salam|assalam|aoa|who are you|tum kon ho|what can you do|kya kar sakte ho|ok|theek hai|thank you|thanks|shukriya|time|date)/i.test(spokenQuery.trim());

    if (isSmallTalk) {
      setDialogue(prev => [
        ...prev,
        { role: 'assistant', text: instantReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      await playVoiceResponse(instantReply);
      return;
    }

    try {
      // Call chat API for questions or complex topics
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...dialogue.slice(-6).map(d => ({ role: d.role, content: d.text })),
            { role: 'user', content: spokenQuery }
          ],
          modelId: 'gemini-3.8-flash'
        })
      });

      if (!res.ok) {
        throw new Error(`Chat API status: ${res.status}`);
      }

      const data = await res.json();
      let replyText = data.text;

      // Filter out robotic or template fallbacks
      if (!replyText || replyText.includes('I understand your question about') || replyText.includes('I am listening.') || replyText.includes('How can I assist you further')) {
        replyText = instantReply;
      }

      setDialogue(prev => [
        ...prev,
        { role: 'assistant', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      // Speak reply aloud
      await playVoiceResponse(replyText);
    } catch (err) {
      console.warn('Conversational voice error, using natural conversational engine:', err);
      setDialogue(prev => [
        ...prev,
        { role: 'assistant', text: instantReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      await playVoiceResponse(instantReply);
    }
  };

  // Helper to synthesize distinctive speech via Web Speech API fallback
  const speakWithDistinctVoice = (
    spokenText: string,
    onFinish: () => void,
    onError: () => void
  ) => {
    if (!('speechSynthesis' in window)) {
      onError();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText.trim());
    const cleanLang = selectedLang === 'ur-roman' ? 'ur' : selectedLang;
    utterance.lang = cleanLang === 'ur' ? 'ur-PK' : (cleanLang === 'hi' ? 'hi-IN' : cleanLang === 'en-GB' ? 'en-GB' : cleanLang === 'ar' ? 'ar-SA' : 'en-US');

    // Distinct pitch & rate per voice persona so every voice is unmistakably unique
    utterance.pitch = selectedVoice.pitch;
    utterance.rate = Math.max(0.65, Math.min(1.5, rate * selectedVoice.rateModifier));

    // Select matching gender from system voices
    try {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices && allVoices.length > 0) {
        const langMatches = allVoices.filter(v => v.lang.toLowerCase().startsWith(cleanLang.toLowerCase().slice(0, 2)));
        const searchPool = langMatches.length > 0 ? langMatches : allVoices;
        if (selectedVoice.gender === 'Female') {
          const f = searchPool.find(v => /female|zira|samantha|victoria|karen|susan|moira|veena|lekha|sabina|priya/i.test(v.name));
          if (f) utterance.voice = f;
        } else {
          const m = searchPool.find(v => /male|david|mark|george|alex|daniel|oliver|rishi|tarik|ravi|guy/i.test(v.name));
          if (m) utterance.voice = m;
        }
      }
    } catch {}

    utterance.onend = onFinish;
    utterance.onerror = onError;
    window.speechSynthesis.speak(utterance);
  };

  // Play audio voice response
  const playVoiceResponse = async (voiceText: string) => {
    setConvStatus('speaking');

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
    }
    const audio = audioPlayerRef.current;
    audio.pause();
    audio.currentTime = 0;

    const cleanLang = selectedLang === 'ur-roman' ? 'ur' : selectedLang;
    const ttsUrl = `/api/tts?lang=${encodeURIComponent(cleanLang)}&voice=${encodeURIComponent(selectedVoice.id)}&text=${encodeURIComponent(voiceText.trim())}`;
    audio.src = ttsUrl;
    audio.playbackRate = Math.max(0.65, Math.min(1.5, rate * selectedVoice.rateModifier));

    const onPlaybackEnd = () => {
      if (convActiveRef.current && !isMuted) {
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start();
              setConvStatus('listening');
            } catch {
              setConvStatus('idle');
            }
          } else {
            setConvStatus('idle');
          }
        }, 500);
      } else {
        setConvStatus('idle');
      }
    };

    audio.onended = onPlaybackEnd;

    audio.onerror = () => {
      console.warn('Neural audio stream fallback, using distinct voice synthesis...');
      speakWithDistinctVoice(voiceText, onPlaybackEnd, () => setConvStatus('idle'));
    };

    try {
      await audio.play();
    } catch (e) {
      console.warn('Audio play notice, falling back:', e);
      speakWithDistinctVoice(voiceText, () => setConvStatus('idle'), () => setConvStatus('idle'));
    }
  };

  // Studio TTS audio playback
  const handleTogglePlayTTS = async () => {
    if (!text.trim()) return;
    sounds.playClick();

    if (isPlayingTTS) {
      stopAudioPlayback();
      return;
    }

    setIsLoadingAudio(true);

    try {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio();
      }
      const audio = audioPlayerRef.current;
      audio.pause();
      audio.currentTime = 0;

      const cleanLang = selectedLang === 'ur-roman' ? 'ur' : selectedLang;
      const ttsUrl = `/api/tts?lang=${encodeURIComponent(cleanLang)}&voice=${encodeURIComponent(selectedVoice.id)}&text=${encodeURIComponent(text.trim())}`;
      audio.src = ttsUrl;
      audio.playbackRate = Math.max(0.65, Math.min(1.5, rate * selectedVoice.rateModifier));

      audio.onplay = () => {
        setIsLoadingAudio(false);
        setIsPlayingTTS(true);
      };
      audio.onended = () => {
        setIsPlayingTTS(false);
        setIsLoadingAudio(false);
      };
      audio.onerror = () => {
        speakWithDistinctVoice(
          text,
          () => setIsPlayingTTS(false),
          () => setIsPlayingTTS(false)
        );
        setIsPlayingTTS(true);
        setIsLoadingAudio(false);
      };

      await audio.play();
    } catch {
      speakWithDistinctVoice(
        text,
        () => setIsPlayingTTS(false),
        () => setIsPlayingTTS(false)
      );
      setIsPlayingTTS(true);
      setIsLoadingAudio(false);
    }
  };

  const handleDownloadAudio = async () => {
    if (!text.trim()) return;
    sounds.playClick();
    setIsDownloading(true);

    try {
      const cleanLang = selectedLang === 'ur-roman' ? 'ur' : selectedLang;
      const ttsUrl = `/api/tts?lang=${encodeURIComponent(cleanLang)}&voice=${encodeURIComponent(selectedVoice.id)}&text=${encodeURIComponent(text.trim())}`;
      const response = await fetch(ttsUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bexus-voiceover-${selectedVoice.id}-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      sounds.playReceive();
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl h-[92vh] max-h-[820px] bg-[#0c0a15] border border-purple-500/35 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#130f24] border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Bexus Neural Voice Mode
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-mono border border-fuchsia-500/30">
                  Real-Time Voice AI
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Hands-free conversational dialogue & studio speech synthesis
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/[0.08] rounded-xl text-xs">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMode('live');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                mode === 'live'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Ear className="w-3.5 h-3.5" />
              <span>Live Voice Chat</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setMode('tts');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                mode === 'tts'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileAudio className="w-3.5 h-3.5" />
              <span>Studio Voiceover</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              handleStopAll();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB 1: LIVE CONVERSATIONAL VOICE MODE (ChatGPT / Gemini Live Style) */}
        {mode === 'live' && (
          <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto bg-[radial-gradient(ellipse_at_top,#1e1236_0%,#090712_70%)] relative">
            {/* Top Status Indicator */}
            <div className="flex items-center justify-between w-full max-w-xl">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  convStatus === 'speaking' ? 'bg-emerald-400 animate-ping' :
                  convStatus === 'listening' ? 'bg-rose-500 animate-pulse' :
                  convStatus === 'thinking' ? 'bg-amber-400 animate-spin' :
                  'bg-purple-500'
                }`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {convStatus === 'speaking' ? 'Bexus Speaking...' :
                   convStatus === 'listening' ? 'Listening to You...' :
                   convStatus === 'thinking' ? 'Thinking...' :
                   'Ready • Tap Orb to Speak'}
                </span>
              </div>

              {/* Voice Persona Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-400 text-[11px]">Voice:</span>
                <select
                  value={selectedVoice.id}
                  onChange={e => {
                    const v = VOICE_PRESETS.find(item => item.id === e.target.value);
                    if (v) setSelectedVoice(v);
                  }}
                  className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-purple-300 font-medium focus:outline-none cursor-pointer"
                >
                  {VOICE_PRESETS.map(v => (
                    <option key={v.id} value={v.id} className="bg-neutral-900 text-white">
                      {v.name} • {v.characterTitle} ({v.gender})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pulsating Celestial Voice Orb */}
            <div className="my-auto flex flex-col items-center justify-center py-4 relative">
              {/* Outer Radiant Glow Rings */}
              <motion.div
                animate={{
                  scale: convStatus === 'speaking' ? [1, 1.25, 1.05] :
                         convStatus === 'listening' ? [1, 1.18, 1] :
                         convStatus === 'thinking' ? [1, 1.1, 1] : 1,
                  opacity: convStatus === 'idle' ? 0.35 : 0.85
                }}
                transition={{
                  duration: convStatus === 'speaking' ? 1.6 : 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-purple-600/40 via-fuchsia-600/30 to-cyan-500/25 blur-3xl pointer-events-none"
              />

              {/* Interactive Orb Center Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (convStatus === 'speaking') {
                    stopAudioPlayback();
                  } else if (convStatus === 'listening') {
                    stopLiveListening();
                  } else {
                    startLiveListening();
                  }
                }}
                className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-400 shadow-[0_0_50px_rgba(168,85,247,0.5)] cursor-pointer flex items-center justify-center group"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1c1538] via-[#100b22] to-[#070510] flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Fluid Wave Rings inside Orb */}
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: convStatus === 'speaking' || convStatus === 'listening' ? [0.95, 1.1, 0.95] : 1
                    }}
                    transition={{
                      rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    }}
                    className="absolute inset-0 rounded-full opacity-60 bg-[radial-gradient(circle_at_30%_30%,#a855f7_0%,transparent_60%)]"
                  />

                  {convStatus === 'listening' ? (
                    <div className="relative z-10 flex flex-col items-center text-rose-400 animate-pulse">
                      <Mic className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Listening</span>
                    </div>
                  ) : convStatus === 'speaking' ? (
                    <div className="relative z-10 flex flex-col items-center text-emerald-300">
                      <Volume2 className="w-10 h-10 mb-1 animate-bounce" />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Speaking</span>
                    </div>
                  ) : convStatus === 'thinking' ? (
                    <div className="relative z-10 flex flex-col items-center text-amber-300">
                      <Loader2 className="w-10 h-10 mb-1 animate-spin" />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Thinking</span>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center text-purple-200 group-hover:text-white transition-colors">
                      <Mic className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Tap to Talk</span>
                    </div>
                  )}
                </div>
              </motion.button>

              {/* Dynamic Audio Frequency Bars */}
              <div className="flex items-center gap-1 mt-6 h-8">
                {audioWaves.map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.1 }}
                    className={`w-1 rounded-full ${
                      convStatus === 'speaking'
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-300'
                        : convStatus === 'listening'
                        ? 'bg-gradient-to-t from-rose-500 to-pink-400'
                        : 'bg-purple-500/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Live Conversation Transcript Drawer */}
            <div className="w-full max-w-xl space-y-3">
              {/* Latest Spoken / Generated Transcript Pill */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] backdrop-blur-md shadow-lg max-h-36 overflow-y-auto space-y-2">
                {dialogue.slice(-2).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded uppercase shrink-0 ${
                      item.role === 'user' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {item.role === 'user' ? 'You' : 'Bexus'}
                    </span>
                    <p className="text-neutral-200 leading-relaxed font-sans">{item.text}</p>
                  </div>
                ))}
                {userSpeechText && convStatus === 'listening' && (
                  <div className="flex items-start gap-2 text-xs text-rose-300 italic">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded uppercase bg-rose-500/20 text-rose-300 shrink-0">
                      Hearing
                    </span>
                    <span>"{userSpeechText}..."</span>
                  </div>
                )}
              </div>

              {/* Manual Voice Query Input Fallback (If Mic is Restricted) */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  placeholder="Or type here to hear AI speak aloud..."
                  className="flex-1 p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && manualInput.trim()) {
                      handleProcessUserVoiceInput(manualInput.trim());
                      setManualInput('');
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualInput.trim()) {
                      handleProcessUserVoiceInput(manualInput.trim());
                      setManualInput('');
                    }
                  }}
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsMuted(!isMuted);
                    if (!isMuted) stopAudioPlayback();
                  }}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDIO TTS VOICEOVER & MP3 EXPORT */}
        {mode === 'tts' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#090812]">
            {/* Language Selector Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Choose Voiceover Language
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedLang(lang.code);
                      setText(lang.defaultScript);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                      selectedLang === lang.code
                        ? 'bg-purple-600 border border-purple-400 text-white font-bold shadow-md'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06]'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Script to Synthesize
              </label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                placeholder="Type your script here..."
                className="w-full p-3.5 bg-black/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 resize-none font-sans"
              />
            </div>

            {/* Voice Actor Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Select Neural Voice Actor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {VOICE_PRESETS.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedVoice(v);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedVoice.id === v.id
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/40'
                        : 'bg-black/40 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${v.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {v.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">{v.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold shrink-0">
                          {v.characterTitle}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-neutral-400 truncate mt-0.5">{v.accent} • {v.gender}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Play & Download Action Bar */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlayTTS}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isLoadingAudio ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlayingTTS ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  <span>{isPlayingTTS ? 'Stop Audio' : 'Preview Voice'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadAudio}
                  disabled={isDownloading}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isDownloading ? 'Downloading...' : 'Export MP3 Audio'}</span>
                </button>
              </div>

              {onSendToChat && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSendToChat(text);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer"
                >
                  Send Script to Chat
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
