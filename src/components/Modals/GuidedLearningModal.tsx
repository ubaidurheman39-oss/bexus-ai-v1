import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { 
  X, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Send, 
  Lightbulb 
} from 'lucide-react';

interface GuidedLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (content: string) => void;
}

const PREBUILT_COURSES = [
  {
    topic: 'Quantum Computing & Qubits',
    level: 'Beginner to Intermediate',
    icon: '⚛️',
    summary: 'Master Superposition, Quantum Entanglement, and Quantum Gates with interactive visual analogies.',
    lessons: [
      {
        title: 'Lesson 1: Superposition vs Classical Bits',
        concept: 'Classical bits exist in binary 0 or 1. A Quantum Bit (qubit) exists in a mathematical linear combination (α|0⟩ + β|1⟩) until measured, allowing exponential simultaneous parallel state computations.',
        quiz: {
          question: 'What is the primary difference between a classical bit and a quantum qubit?',
          options: [
            'Qubits can only store text, not numbers',
            'Qubits can exist in a superposition of |0⟩ and |1⟩ states simultaneously before measurement',
            'Qubits are slower than standard silicon transistors',
            'Qubits do not require quantum gates'
          ],
          correctIndex: 1,
          explanation: 'Superposition enables qubits to represent probabilities of both 0 and 1 at once, unlocking vast combinatorial parallelism.'
        }
      },
      {
        title: 'Lesson 2: Quantum Entanglement & Spooky Action',
        concept: 'When two qubits are entangled, measuring the state of one instantaneously determines the state of the other, regardless of spatial distance. This forms the foundation of Quantum Key Distribution (QKD) and teleportation protocols.',
        quiz: {
          question: 'What happens when you measure one qubit of a Bell entangled pair?',
          options: [
            'Both qubits disconnect permanently',
            'The other qubit state is instantly determined according to the entanglement correlation',
            'The computer resets to factory state',
            'Quantum entanglement increases in size'
          ],
          correctIndex: 1,
          explanation: 'Measuring one half of an entangled pair collapses the combined wave function into a correlated deterministic outcome.'
        }
      }
    ]
  },
  {
    topic: 'Full-Stack Modern AI Architecture',
    level: 'Intermediate to Advanced',
    icon: '⚡',
    summary: 'Explore Server-Sent Events (SSE) streaming, multimodal token processing, vector embeddings, and reasoning pipelines.',
    lessons: [
      {
        title: 'Lesson 1: Real-time Streaming vs Batch Inference',
        concept: 'LLM responses take seconds for high-token outputs. Server-Sent Events (SSE) stream incremental tokens back to the client immediately upon generation, reducing perceived Time-To-First-Token (TTFT) to under 200ms.',
        quiz: {
          question: 'Why is SSE streaming preferred over simple JSON fetch for interactive AI assistants?',
          options: [
            'It saves database storage space',
            'It minimizes TTFT (Time To First Token) and delivers immediate user feedback as text generates',
            'It is the only protocol that supports CSS',
            'It prevents prompt injection'
          ],
          correctIndex: 1,
          explanation: 'Streaming delivers chunks progressively as the neural network computes them, vastly improving perceived responsiveness.'
        }
      }
    ]
  }
];

export const GuidedLearningModal: React.FC<GuidedLearningModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(PREBUILT_COURSES[0]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customLessonData, setCustomLessonData] = useState<string | null>(null);

  const currentLesson = selectedCourse.lessons[currentLessonIdx] || selectedCourse.lessons[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    sounds.playClick();
    setSelectedAnswer(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null) return;
    sounds.playClick();
    setIsAnswerSubmitted(true);

    if (selectedAnswer === currentLesson.quiz.correctIndex) {
      sounds.playReceive();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextLesson = () => {
    sounds.playClick();
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (currentLessonIdx < selectedCourse.lessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
    } else {
      setCurrentLessonIdx(0);
    }
  };

  const handleGenerateCustomTopic = async () => {
    if (!customTopic.trim()) return;
    sounds.playClick();
    setIsGeneratingCustom(true);
    try {
      const res = await fetch('/api/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: customTopic.trim(), level: 'Intermediate' })
      });
      const data = await res.json();
      setCustomLessonData(data.content);
      sounds.playReceive();
    } catch {
      setCustomLessonData('Unable to generate custom track at this moment.');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleSendToChat = () => {
    sounds.playSend();
    const content = customLessonData 
      ? `### Guided Learning Path: ${customTopic}\n\n${customLessonData}`
      : `### 📖 Guided Learning: ${selectedCourse.topic}\n\n**${currentLesson.title}**\n\n${currentLesson.concept}\n\n*Quiz Checkpoint*: ${currentLesson.quiz.question}\n*Answer*: ${currentLesson.quiz.options[currentLesson.quiz.correctIndex]}\n*Explanation*: ${currentLesson.quiz.explanation}`;
    
    onSendToChat(content);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#14151a] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#0c0d10]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                    <span>Interactive Guided Learning</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
                      AI Tutor
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">Step-by-step masterclasses and active checkpoint quizzes</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Track selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PREBUILT_COURSES.map((course, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCourse(course);
                      setCurrentLessonIdx(0);
                      setSelectedAnswer(null);
                      setIsAnswerSubmitted(false);
                      setCustomLessonData(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCourse.topic === course.topic && !customLessonData
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-sm'
                        : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{course.icon}</span>
                      <span className="text-xs font-bold text-zinc-200">{course.topic}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{course.summary}</p>
                  </button>
                ))}
              </div>

              {/* Custom Topic Generator */}
              <div className="p-3 rounded-xl bg-[#0c0d10] border border-white/[0.06] flex gap-2 items-center">
                <input
                  type="text"
                  value={customTopic}
                  onChange={e => setCustomTopic(e.target.value)}
                  placeholder="Or teach me any custom topic (e.g. Distributed Systems consensus)..."
                  className="flex-1 px-3 py-1.5 bg-zinc-900/90 border border-white/[0.08] rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40"
                />
                <button
                  onClick={handleGenerateCustomTopic}
                  disabled={isGeneratingCustom || !customTopic.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingCustom ? 'Generating...' : 'Learn'}</span>
                </button>
              </div>

              {/* Custom Generated Lesson View */}
              {customLessonData ? (
                <div className="p-4 rounded-xl bg-[#0c0d10] border border-emerald-500/20 text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {customLessonData}
                </div>
              ) : (
                /* Interactive Course Step */
                <div className="space-y-4 p-4 rounded-xl bg-[#0c0d10] border border-white/[0.06]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      {currentLesson.title}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Step {currentLessonIdx + 1} of {selectedCourse.lessons.length}
                    </span>
                  </div>

                  {/* Concept explanation */}
                  <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-white/[0.06] text-xs text-zinc-200 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Core Intuitive Concept</span>
                    </div>
                    {currentLesson.concept}
                  </div>

                  {/* Checkpoint Quiz */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-zinc-200">
                      Checkpoint: {currentLesson.quiz.question}
                    </div>
                    <div className="space-y-1.5">
                      {currentLesson.quiz.options.map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect = idx === currentLesson.quiz.correctIndex;
                        let style = 'bg-zinc-900/60 border-white/[0.06] text-zinc-300 hover:border-white/[0.14]';

                        if (isAnswerSubmitted) {
                          if (isCorrect) style = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200';
                          else if (isSelected && !isCorrect) style = 'bg-rose-500/10 border-rose-500/40 text-rose-200';
                        } else if (isSelected) {
                          style = 'bg-emerald-500/10 border-emerald-500/40 text-white';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${style}`}
                          >
                            <span>{opt}</span>
                            {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                            {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit Quiz / Explanation */}
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={selectedAnswer === null}
                        className="w-full py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                      >
                        Check Understanding
                      </button>
                    ) : (
                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 space-y-2.5">
                        <p>💡 {currentLesson.quiz.explanation}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleNextLesson}
                            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Next Lesson</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer Action */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
                <button
                  onClick={handleSendToChat}
                  className="py-2 px-3.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notes to Chat</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
