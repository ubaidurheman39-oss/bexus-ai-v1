export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  createdAt: number;
  customInstructions?: string;
  preferredVoice?: string;
  themeColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  soundEnabled?: boolean;
}

export type ModelId = 
  | 'bexus-v1'              // Bexus AI v1
  | 'bexus-3.7-ultra'       // Bexus 3.7 Ultra Flagship
  | 'bexus-reasoning-pro'   // Deep Reasoning
  | 'bexus-creative'        // Creative Vision
  | 'bexus-canvas-coder'    // Canvas Coder
  | 'bexus-quantum-4.8'     // Bexus Quantum 4.8
  | 'bexus-core';           // Core engine

export interface ModelOption {
  id: ModelId;
  name: string;
  tagline: string;
  icon: string;
  badge?: string;
  description: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'code' | 'document' | 'audio';
  mimeType: string;
  url?: string;
  dataBase64?: string;
  size: number;
  extractedText?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
  domain?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: ModelId;
  attachments?: Attachment[];
  thinkingSteps?: string[];
  thinkingTimeSec?: number;
  groundingSources?: GroundingSource[];
  isStreaming?: boolean;
  type?: 'chat' | 'image' | 'music' | 'canvas' | 'learning';
  mediaUrl?: string;
  mediaMetadata?: Record<string, any>;
  canvasCode?: {
    language: string;
    code: string;
    title: string;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: ModelId;
  isPinned?: boolean;
  category?: 'general' | 'coding' | 'creative' | 'music' | 'learning';
  tags?: string[];
}

export interface ToolAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  action: () => void;
  badge?: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  concept: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  codeExample?: string;
}

export interface LearningCourse {
  id: string;
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Master';
  lessons: LearningLesson[];
  currentLessonIndex: number;
  isCompleted?: boolean;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  tag?: string;
  color?: string;
  children?: MindMapNode[];
  isExpanded?: boolean;
}

export interface MindMapData {
  id: string;
  title: string;
  description: string;
  layout: 'tree' | 'flowchart' | 'roadmap';
  themeColor: string;
  root: MindMapNode;
  createdAt: number;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  title: string;
  visualPrompt: string;
  imageUrl?: string;
  narration: string;
  durationSeconds: number;
  colorScheme?: string;
  bgGradient?: string;
  keywords: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  genre: string;
  language?: string;
  character?: string;
  totalDurationSeconds: number;
  scenes: VideoScene[];
  voiceSettings?: {
    speed: number;
    pitch: number;
    voiceName?: string;
  };
  prompt: string;
  createdAt: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  chords: string[];
  notes: number[];
  lyrics: string;
  mood: string;
  prompt: string;
  audioBlobUrl?: string;
  createdAt: number;
}

export interface DeepResearchSource {
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  reliability: 'verified' | 'high' | 'academic';
}

export interface DeepResearchSection {
  title: string;
  icon?: string;
  content: string;
  bulletPoints?: string[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface DeepResearchMetric {
  label: string;
  value: string;
  trend?: string;
  description?: string;
}

export interface DeepResearchAction {
  priority: 'Critical' | 'High' | 'Strategic';
  title: string;
  action: string;
}

export interface DeepResearchGoal {
  id: string;
  title: string;
  status: 'completed' | 'analyzing' | 'synthesizing' | 'pending';
  queryUsed: string;
}

export interface DeepResearchReport {
  id: string;
  query: string;
  title: string;
  overview: string;
  confidenceScore: number;
  readTime: string;
  keyMetrics: DeepResearchMetric[];
  subGoals: DeepResearchGoal[];
  sources: DeepResearchSource[];
  sections: DeepResearchSection[];
  strategicRecommendations: DeepResearchAction[];
  conclusion: string;
  createdAt: number;
}

export interface SlideItem {
  id: string;
  slideNumber: number;
  layout: 'title' | 'split' | 'bullets' | 'metrics' | 'quote' | 'timeline' | 'cta' | 'table' | 'comparison' | 'code';
  title: string;
  subtitle?: string;
  bullets?: string[];
  metrics?: Array<{ label: string; value: string; detail?: string }>;
  quote?: { text: string; author: string; role?: string };
  timeline?: Array<{ step: string; title: string; desc: string }>;
  table?: { headers: string[]; rows: string[][] };
  comparison?: { leftTitle: string; leftItems: string[]; rightTitle: string; rightItems: string[] };
  codeSnippet?: { language: string; code: string; explanation?: string };
  takeaway?: string;
  speakerNotes?: string;
}

export interface SlideDeck {
  id: string;
  topic: string;
  theme: 'cyberpunk' | 'corporate-emerald' | 'minimal-dark' | 'sunset-glow' | 'royal-violet' | 'midnight-gold';
  title: string;
  description: string;
  slides: SlideItem[];
  createdAt: number;
}



