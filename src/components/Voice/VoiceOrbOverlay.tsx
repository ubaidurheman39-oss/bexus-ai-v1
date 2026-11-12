import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../services/soundEffects';
import { 
  X, 
  Mic, 
  MicOff, 
  Radio, 
  Send 
} from 'lucide-react';

interface VoiceOrbOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTranscript: (text: string) => void;
}

export const VoiceOrbOverlay: React.FC<VoiceOrbOverlayProps> = ({
  isOpen,
  onClose,
  onSendTranscript,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusText, setStatusText] = useState('Tap microphone to start speaking');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setStatusText('Listening to your voice...');
      };

      rec.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e);
        setStatusText('Microphone active. Speak clearly.');
      };

      rec.onend = () => {
        setIsListening(false);
        setStatusText('Voice input stopped.');
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    sounds.playClick();
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type directly in the prompt input!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusText('Processing your audio prompt...');
    } else {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch {
        // already active
      }
    }
  };

  const handleSend = () => {
    if (!transcript.trim()) return;
    sounds.playSend();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onSendTranscript(transcript);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (isListening && recognitionRef.current) recognitionRef.current.stop();
              onClose();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md flex flex-col items-center text-center p-6 bg-[#14151a] border border-white/[0.1] rounded-2xl shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                if (isListening && recognitionRef.current) recognitionRef.current.stop();
                sounds.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Brand Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-white/[0.08] text-zinc-300 text-xs font-medium mb-8">
              <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>Voice Live Mode</span>
            </div>

            {/* Live Orb */}
            <div
              onClick={toggleListening}
              className="relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-105"
            >
              <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-xl transition-all ${isListening ? 'scale-110 animate-pulse opacity-80' : 'opacity-20'}`} />
              
              <div className="relative w-28 h-28 rounded-full bg-zinc-900 border border-white/[0.15] shadow-xl flex flex-col items-center justify-center">
                {isListening ? (
                  <div className="flex items-center gap-1 h-8">
                    <span className="w-1 bg-blue-400 h-4 rounded-full animate-bounce [animation-delay:0s]" />
                    <span className="w-1 bg-blue-400 h-8 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 bg-blue-400 h-6 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span className="w-1 bg-blue-400 h-7 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 bg-blue-400 h-3 rounded-full animate-bounce [animation-delay:0.35s]" />
                  </div>
                ) : (
                  <Mic className="w-8 h-8 text-zinc-300 group-hover:scale-110 transition-transform" />
                )}
              </div>
            </div>

            {/* Status */}
            <div className="mt-5 text-sm font-medium text-zinc-200">
              {statusText}
            </div>

            {/* Transcript */}
            {transcript ? (
              <div className="mt-3 p-3.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-200 text-xs max-h-28 overflow-y-auto w-full text-left font-sans">
                <span className="text-[10px] text-zinc-400 font-semibold block mb-1">TRANSCRIPT:</span>
                {transcript}
              </div>
            ) : (
              <p className="mt-1 text-xs text-zinc-500">
                Click the orb to dictate your prompt in any language.
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-6 w-full">
              <button
                onClick={toggleListening}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-zinc-800 border border-white/[0.08] text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Stop' : 'Start Recording'}</span>
              </button>

              {transcript && (
                <button
                  onClick={handleSend}
                  className="py-2.5 px-5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
