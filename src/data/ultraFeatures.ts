export interface UltraFeature {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'sparkles' | 'video' | 'deepResearch' | 'flow' | 'whisk' | 'credits' | 'notebook' | 'mariner' | 'workspace' | 'youtube' | 'storage';
  badge?: string;
  category: 'core' | 'creation' | 'research' | 'perks';
  promptTemplate: string;
  details?: string;
}

export const ULTRA_FEATURES: UltraFeature[] = [
  {
    id: 'gemini-ultra',
    title: 'Gemini Ultra',
    subtitle: 'Highest access to our premium features',
    iconName: 'sparkles',
    badge: 'Flagship',
    category: 'core',
    promptTemplate: 'Switch to Gemini Ultra highest intelligence mode and solve complex reasoning, deep planning, and comprehensive architectural tasks.',
    details: 'Full unthrottled access to Google’s flagship Ultra models with 2M token context window, deep chain-of-thought, and native multimodal reasoning.'
  },
  {
    id: 'video-generation',
    title: 'Video generation',
    subtitle: 'Highest access in Gemini Ultra',
    iconName: 'video',
    badge: 'Ultra High-Def',
    category: 'creation',
    promptTemplate: 'Generate a cinematic high-definition video with realistic lighting, smooth motion, and camera angles: ',
    details: 'Generate photorealistic 1080p and 4K video clips up to 60 seconds with fluid physics, custom aspect ratios, and cinematic camera trajectories.'
  },
  {
    id: 'deep-research',
    title: 'Deep Research',
    subtitle: 'Highest access with 2.5 Pro in Gemini Ultra',
    iconName: 'deepResearch',
    badge: 'Autonomous',
    category: 'research',
    promptTemplate: 'Conduct an in-depth autonomous deep research investigation with 2.5 Pro, aggregating cross-verified citations, data synthesis, and executive summaries on: ',
    details: 'Multi-agent deep research that browses dozens of academic and web sources, builds comprehensive synthesis reports, and verifies citations.'
  },
  {
    id: 'flow-ultra',
    title: 'Flow Ultra',
    subtitle: 'Get access to Veo 3 with audio, ingredients to video, and highest limits',
    iconName: 'flow',
    badge: 'Veo 3 Audio',
    category: 'creation',
    promptTemplate: 'Use Flow Ultra with Veo 3 to create an immersive video complete with synchronized spatial audio, Foley sound effects, and ingredients-to-video workflow: ',
    details: 'Next-generation video creation powered by Veo 3. Direct scenes using storyboard ingredients, character continuity, and generative audio tracks.'
  },
  {
    id: 'whisk-ultra',
    title: 'Whisk Ultra',
    subtitle: 'Highest access to image-to-video creation with Veo 2 model',
    iconName: 'whisk',
    badge: 'Veo 2 Motion',
    category: 'creation',
    promptTemplate: 'Use Whisk Ultra image-to-video with Veo 2 model to animate this visual concept with fluid cinematic camera pan: ',
    details: 'Transform static images into hyper-realistic motion video sequences with precise camera steering, frame interpolation, and style retention.'
  },
  {
    id: 'notebooklm-pro',
    title: 'NotebookLM Pro',
    subtitle: '5x more Audio Overviews, notebooks, and more',
    iconName: 'notebook',
    badge: '5x Audio Overviews',
    category: 'research',
    promptTemplate: 'Open NotebookLM Pro to synthesize my documents and generate a dynamic podcast-style Audio Overview discussion: ',
    details: 'Turn complex PDFs, notes, and transcripts into natural two-host conversational podcasts with interactive deep-dive Q&A.'
  },
  {
    id: 'project-mariner',
    title: 'Project Mariner',
    subtitle: 'Access to an agentic research prototype',
    iconName: 'mariner',
    badge: 'Agent Prototype',
    category: 'research',
    promptTemplate: 'Activate Project Mariner agentic prototype to autonomously navigate web research, compare products, and synthesize structured data tables for: ',
    details: 'Experimental agentic AI prototype that operates web workflows, extracts structured tabular data, and performs multi-tab research.'
  },
  {
    id: 'gemini-workspace',
    title: 'Gemini in Gmail, Docs, Vids & more',
    subtitle: 'Access Gemini directly in Google apps',
    iconName: 'workspace',
    badge: 'Workspace 365',
    category: 'core',
    promptTemplate: 'Draft a professional executive proposal ready for Google Docs and prepare a clean email draft for Gmail regarding: ',
    details: 'Native integration across the entire Google Workspace ecosystem — compose emails, draft docs, create video storyboards in Vids, and analyze sheets.'
  },
  {
    id: 'youtube-premium',
    title: 'YouTube Premium individual plan',
    subtitle: 'YouTube ad-free, offline, and in the background',
    iconName: 'youtube',
    badge: 'Ad-Free 4K',
    category: 'perks',
    promptTemplate: 'Play relaxing ambient background audio and YouTube ad-free focus music for deep coding and concentration.',
    details: 'Seamless ad-free viewing, picture-in-picture background playback on mobile, and YouTube Music Premium streaming in lossless audio.'
  }
];
