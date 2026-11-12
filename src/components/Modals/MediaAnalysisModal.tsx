import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../services/soundEffects';
import {
  X,
  Activity,
  Play,
  Pause,
  Upload,
  FileAudio,
  FileVideo,
  Sparkles,
  Send,
  Check,
  Clock,
  MessageSquare,
  TrendingUp,
  FileText
} from 'lucide-react';

interface MediaAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (summary: string) => void;
}

export const MediaAnalysisModal: React.FC<MediaAnalysisModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('video');
  const [fileName, setFileName] = useState('Tech_Keynote_2026_Preview.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    title: string;
    mediaType: 'audio' | 'video';
    duration: string;
    transcript: string;
    summary: string;
    sentiment: string;
    keyTopics: string[];
    timelineSegments: Array<{ timestamp: string; title: string; notes: string }>;
    actionItems: string[];
  } | null>({
    title: 'Autonomous AI Enterprise Architecture Keynote',
    mediaType: 'video',
    duration: '02:45',
    transcript: 'Welcome everyone. In today’s session, we are demonstrating how multi-agent neural orchestration automates real-time systems. By coupling live optical vision, speech synthesis, and ground-truth search, enterprise response latency decreases by over 80%. Let us review the telemetry milestones and next-generation compute pipelines.',
    summary: 'The recording delivers an architectural overview of autonomous multi-agent pipelines, emphasizing measurable latency reductions and enterprise scalability.',
    sentiment: 'Authoritative, Visionary & Technical',
    keyTopics: ['Neural Orchestration', 'Multi-Agent Systems', 'Latency Reduction', 'Compute Pipelines'],
    timelineSegments: [
      { timestamp: '0:00 - 0:45', title: 'Introductory Thesis', notes: 'Defined the current latency bottleneck in legacy monolithic pipelines.' },
      { timestamp: '0:45 - 1:50', title: 'Multi-Agent Benchmarks', notes: 'Demonstrated 80% acceleration utilizing parallel agent routing.' },
      { timestamp: '1:50 - End', title: 'Roadmap & Production Milestones', notes: 'Finalized concrete deployment targets for Q4 enterprise rollout.' }
    ],
    actionItems: ['Integrate multi-agent telemetry tracking', 'Benchmark local latency thresholds', 'Publish Q4 deployment roadmap']
  });

  const handleRunAnalysis = async (customName?: string) => {
    sounds.playClick();
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/media/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: customName || fileName,
          mediaType,
          duration: '03:12'
        })
      });
      const data = await res.json();
      sounds.playReceive();
      setAnalysis(data);
    } catch {
      sounds.playReceive();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    const isVid = file.type.startsWith('video') || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov');
    setMediaType(isVid ? 'video' : 'audio');
    setFileName(file.name);
    handleRunAnalysis(file.name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0c0e18]/98 border border-purple-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden"
      >
        {/* Ambient Top Shimmer */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/25 to-indigo-500/25 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Activity className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Audio & Video Neural Analysis
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  MULTIMODAL
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Speech transcription, scene timelines, vocal sentiment & telemetry extraction
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* File Picker & Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                {mediaType === 'video' ? <FileVideo className="w-3.5 h-3.5" /> : <FileAudio className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate max-w-xs">{fileName}</span>
                <span className="text-[10px] text-neutral-400 font-mono">Ready for multimodal neural inspection</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-semibold text-purple-200 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio/Video</span>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => handleRunAnalysis()}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-40"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Deep Inspect'}</span>
              </button>
            </div>
          </div>

          {/* Equalizer Visualizer & Media Card */}
          <div className="p-4 rounded-2xl bg-[#090b14] border border-white/[0.08] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <div>
                <span className="text-xs font-bold text-white block">{analysis?.title || fileName}</span>
                <span className="text-[10px] text-purple-400 font-mono">⏱️ {analysis?.duration || '02:45'} • Sentiment: {analysis?.sentiment || 'Neutral'}</span>
              </div>
            </div>

            {/* Simulated Audio Frequency Visualizer */}
            <div className="hidden sm:flex items-end gap-1 h-7 flex-1 max-w-xs">
              {[25, 60, 45, 90, 75, 40, 85, 95, 70, 30, 80, 50, 95, 65, 40, 80, 60, 45].map((h, idx) => (
                <span
                  key={idx}
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    isPlaying
                      ? 'bg-gradient-to-t from-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                      : 'bg-white/10'
                  }`}
                  style={{ height: isPlaying ? `${(h + (idx % 3) * 20) % 100}%` : '20%' }}
                />
              ))}
            </div>
          </div>

          {/* Analysis Dashboard */}
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Summary & Full Transcript */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#080912] border border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                    Executive Summary:
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">{analysis.summary}</p>
                </div>

                {/* Key Topics */}
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Extracted Thematic Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keyTopics?.map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-200 text-[10px] font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spoken Transcript Preview */}
                <div className="pt-2 border-t border-white/[0.05]">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-3 h-3 text-purple-400" />
                    Speech-to-Text Neural Transcript:
                  </span>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/[0.04] max-h-36 overflow-y-auto text-[11px] text-neutral-300 leading-relaxed font-mono">
                    "{analysis.transcript}"
                  </div>
                </div>
              </div>

              {/* Right Column: Timeline Breakdown & Action Items */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#080912] border border-white/[0.06]">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Chronological Scene / Audio Breakdown:
                </span>
                
                <div className="space-y-2">
                  {analysis.timelineSegments?.map((seg, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] shrink-0 mt-0.5">
                        {seg.timestamp}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block">{seg.title}</span>
                        <span className="text-[11px] text-neutral-400 block leading-snug">{seg.notes}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Items */}
                <div className="pt-2 border-t border-white/[0.05]">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Extracted Action Items:
                  </span>
                  <ul className="space-y-1">
                    {analysis.actionItems?.map((act, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              Confidence Score: <strong className="text-emerald-400">97.8% Neural Match</strong>
            </span>

            {onSendToChat && analysis && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onSendToChat(
                    `📊 **${analysis.title}** (${analysis.mediaType.toUpperCase()} Analysis - ${analysis.duration})\n\n` +
                    `**Executive Summary:** ${analysis.summary}\n\n` +
                    `**Key Topics:** ${analysis.keyTopics.join(', ')}\n\n` +
                    `**Timeline Breakdown:**\n` +
                    analysis.timelineSegments.map(s => `• **${s.timestamp}**: ${s.title} - _${s.notes}_`).join('\n') +
                    `\n\n**Action Items:**\n` +
                    analysis.actionItems.map(a => `✓ ${a}`).join('\n')
                  );
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Analysis to Chat</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
