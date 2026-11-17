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
    description: 'Sweet, friendly, warm and expressive for voice chat and storytelling.',
    langCode: 'ur',
    avatarColor: 'from-pink-500 to-purple-600',
    pitch: 1.25,
    rateModifier: 1.05,
    characterTitle: 'Warm Soprano'
  },
  {
    id: 'bilal-ur',
    name: 'Bilal (Urdu Voice)',
    gender: 'Male',
    accent: 'Urdu Conversational & Broadcast',
    description: 'Clear, authoritative tone for explanations and dialogue.',
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
    description: 'Crisp, articulate voice ideal for tutorials and conversation.',
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
    description: 'Authoritative, resonant voice for deep conversations.',
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
    description: 'Sweet, engaging tone for conversation in Hindi.',
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
    description: 'Eloquent, clear classical Arabic voice for dialogue and recitations.',
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
  const [convStatus, setConvStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [userSpeechText, setUserSpeechText] = useState('');
  const [dialogue, setDialogue] = useState<DialogueTurn[]>([
    {
      role: 'assistant',
      text: 'Hello! I am Bexus AI. What would you like to learn, build, or explore today?',
      time: 'Just now'
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [selectedVoice, setSelectedVoice] = useState<VoicePreset>(
    VOICE_PRESETS.find(v => v.id === 'nova-en') || VOICE_PRESETS[0]
  );
  const [rate, setRate] = useState(1.0);
  const [audioWaves, setAudioWaves] = useState<number[]>(new Array(28).fill(12));

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const convActiveRef = useRef(false);

  // Keep selectedLang synchronized with selectedVoice.langCode
  useEffect(() => {
    if (selectedVoice?.langCode) {
      setSelectedLang(selectedVoice.langCode);
    }
  }, [selectedVoice]);

  // Audio wave visualizer animation loop
  useEffect(() => {
    let interval: any;
    const isAudioActive = convStatus === 'speaking' || convStatus === 'listening';
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
  }, [convStatus]);

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
        recog.lang =
          selectedLang === 'ur' ? 'ur-PK' :
          selectedLang === 'ar' ? 'ar-SA' :
          selectedLang === 'hi' ? 'hi-IN' :
          selectedLang === 'es' ? 'es-ES' :
          selectedLang === 'tr' ? 'tr-TR' :
          selectedLang === 'zh' ? 'zh-CN' : 'en-US';

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
  };

  const handleStopAll = () => {
    stopLiveListening();
    stopAudioPlayback();
  };

  // Map langCode to language name for backend and LLM instruction
  const getLanguageName = (code: string) => {
    const map: Record<string, string> = {
      ur: 'Urdu',
      en: 'English',
      'en-GB': 'English',
      hi: 'Hindi',
      ar: 'Arabic',
      ps: 'Pashto',
      pa: 'Punjabi',
      tr: 'Turkish',
      es: 'Spanish',
      zh: 'Chinese'
    };
    return map[code] || 'English';
  };

  const handleProcessUserVoiceInput = async (spokenQuery: string) => {
    if (!spokenQuery.trim()) return;

    sounds.playReceive();
    setConvStatus('thinking');

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDialogue(prev => [
      ...prev,
      { role: 'user', text: spokenQuery, time: nowTime }
    ]);

    const targetLangName = getLanguageName(selectedVoice.langCode);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...dialogue.slice(-6).map(d => ({ role: d.role, content: d.text })),
            { role: 'user', content: spokenQuery }
          ],
          modelId: 'gemini-4-hydrogen',
          enableReasoning: false,
          preferredLanguage: targetLangName,
          customInstructions: `You are Bexus AI Voice Assistant. Respond strictly in fluent, natural ${targetLangName}. Give a direct, accurate, problem-solving answer suitable for voice playback (concise but complete).`
        })
      });

      if (!res.ok) {
        throw new Error(`Chat API status: ${res.status}`);
      }

      const data = await res.json();
      let replyText = data.text;

      if (!replyText || replyText.includes('I understand your question about') || replyText.includes('I am listening.')) {
        const rescueRes = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'openai',
            messages: [
              { role: 'system', content: `You are Bexus AI Voice Assistant. Give a concise, clear, accurate answer in ${targetLangName}.` },
              { role: 'user', content: spokenQuery }
            ]
          })
        });
        if (rescueRes.ok) {
          const txt = (await rescueRes.text()).trim();
          if (txt && !txt.startsWith('{') && txt.length > 10) {
            replyText = txt;
          }
        }
      }

      if (!replyText) {
        replyText = `I hear you! Let's work on this together.`;
      }

      setDialogue(prev => [
        ...prev,
        { role: 'assistant', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);

      await playVoiceResponse(replyText);
    } catch (err) {
      console.warn('Conversational voice error:', err);
      const fallbackReply = `I am here and ready to help you with that!`;
      setDialogue(prev => [
        ...prev,
        { role: 'assistant', text: fallbackReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      await playVoiceResponse(fallbackReply);
    }
  };

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
    const cleanLang = selectedVoice.langCode;
    utterance.lang =
      cleanLang === 'ur' ? 'ur-PK' :
      cleanLang === 'ar' ? 'ar-SA' :
      cleanLang === 'hi' ? 'hi-IN' :
      cleanLang === 'en-GB' ? 'en-GB' : 'en-US';

    utterance.pitch = selectedVoice.pitch;
    utterance.rate = Math.max(0.65, Math.min(1.5, rate * selectedVoice.rateModifier));

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

  const playVoiceResponse = async (voiceText: string) => {
    setConvStatus('speaking');

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
    }
    const audio = audioPlayerRef.current;
    audio.pause();
    audio.currentTime = 0;

    const cleanLang = selectedVoice.langCode;
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
      speakWithDistinctVoice(voiceText, onPlaybackEnd, () => setConvStatus('idle'));
    };

    try {
      await audio.play();
    } catch (e) {
      speakWithDistinctVoice(voiceText, () => setConvStatus('idle'), () => setConvStatus('idle'));
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
                Hands-free conversational dialogue in your selected language
              </p>
            </div>
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

        {/* LIVE CONVERSATIONAL VOICE MODE VIEW */}
        <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto bg-[radial-gradient(ellipse_at_top,#1e1236_0%,#090712_70%)] relative">
          {/* Top Status & Voice / Language Selector */}
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

            {/* Voice & Language Persona Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-neutral-400 text-[11px]">Voice / Lang:</span>
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

            {/* Manual Voice Query Input Fallback */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                placeholder="Or type here to hear AI speak aloud in your language..."
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
      </motion.div>
    </div>
  );
};
