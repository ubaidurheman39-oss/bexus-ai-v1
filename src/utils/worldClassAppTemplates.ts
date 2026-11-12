/**
 * Bexus AppForge — World-Class Standalone Web Application Engine
 * Generates self-contained, publication-ready, interactive web apps with:
 * - Tailwind CSS + Modern Fonts + Lucide SVG Icons + Chart.js
 * - LocalStorage data persistence
 * - Zero external framework dependencies
 * - High-polish interactive workspaces
 */

import {
  generateFoodDeliveryAppHtml,
  generateFitnessTrackerHtml,
  generateCryptoTradingHtml,
  generateKanbanSprintBoardHtml,
  generateCarRentalAppHtml,
  generateHealthcareClinicAppHtml,
  generateRealEstateAppHtml
} from './extraAppTemplates.ts';

export function generateWorldClassApp(prompt: string, category: string = 'custom', theme: string = 'dark-luxury'): string {
  const pLower = prompt.toLowerCase();
  const isAskingForBexus =
    pLower.includes('bexus ai clone') ||
    pLower.includes('clone of bexus') ||
    pLower.includes('bexus studio clone');

  const isCarRental = pLower.includes('car') || pLower.includes('rental') || pLower.includes('vehicle') || pLower.includes('auto') || pLower.includes('gari') || pLower.includes('drive') || category === 'car';
  const isHealthcare = pLower.includes('hospital') || pLower.includes('doctor') || pLower.includes('clinic') || pLower.includes('medical') || pLower.includes('patient') || pLower.includes('health') || pLower.includes('treatment') || category === 'healthcare';
  const isRealEstate = pLower.includes('estate') || pLower.includes('property') || pLower.includes('villa') || pLower.includes('penthouse') || pLower.includes('mansion') || pLower.includes('house') || pLower.includes('apartment') || category === 'realestate';
  const isFoodDelivery = pLower.includes('food') || pLower.includes('delivery') || pLower.includes('restaurant') || pLower.includes('burger') || pLower.includes('pizza') || pLower.includes('menu') || pLower.includes('dish') || pLower.includes('kitchen') || pLower.includes('bakery') || pLower.includes('cafe') || category === 'food';
  const isFitness = pLower.includes('fitness') || pLower.includes('workout') || pLower.includes('gym') || pLower.includes('calorie') || pLower.includes('exercise') || pLower.includes('training') || category === 'fitness';
  const isCrypto = pLower.includes('crypto') || pLower.includes('bitcoin') || pLower.includes('btc') || pLower.includes('trade') || pLower.includes('trading') || pLower.includes('coin') || pLower.includes('exchange') || category === 'crypto';
  const isKanban = pLower.includes('kanban') || pLower.includes('sprint') || pLower.includes('scrum') || pLower.includes('jira') || pLower.includes('trello') || pLower.includes('todo') || pLower.includes('task') || pLower.includes('project management') || category === 'kanban';
  const isEcommerce = pLower.includes('shop') || pLower.includes('store') || pLower.includes('ecommerce') || pLower.includes('cart') || pLower.includes('product') || pLower.includes('buy') || category === 'ecommerce';
  const isGame = pLower.includes('game') || pLower.includes('arcade') || pLower.includes('play') || pLower.includes('shooter') || pLower.includes('snake') || pLower.includes('retro') || category === 'game';
  const isAiApp = isAskingForBexus || pLower.includes('nexus') || ((pLower.includes('assistant') || pLower.includes('neural') || pLower.includes('chatbot') || pLower.includes('ai studio')) && (category === 'ai' || pLower.includes('ai')));
  
  // Clean, professional title extraction
  let cleanTitle = prompt
    .replace(/^(make|build|create|generate|please make|please build|please create)\s+(a|an)?\s*/i, '')
    .replace(/(app banao|website banao|system banao|banao|kholo|chahiye)/i, '')
    .trim();

  if (isAskingForBexus) {
    cleanTitle = 'Bexus AI — Autonomous Neural Studio';
  } else if (pLower.includes('nexus')) {
    cleanTitle = 'NexusAI — Autonomous Neural Studio';
  } else if (isCarRental && (cleanTitle.length < 3 || cleanTitle.toLowerCase().includes('car'))) {
    cleanTitle = 'ApexDrive — Luxury & Exotic Fleet';
  } else if (isHealthcare && (cleanTitle.length < 3 || cleanTitle.toLowerCase().includes('clinic') || cleanTitle.toLowerCase().includes('hospital'))) {
    cleanTitle = 'CuraMed — Specialist Care & Clinic';
  } else if (isRealEstate && (cleanTitle.length < 3 || cleanTitle.toLowerCase().includes('estate'))) {
    cleanTitle = 'AuraEstates — Ultra-Luxury Residences';
  } else if (isFoodDelivery && (cleanTitle.length < 3 || cleanTitle.toLowerCase().includes('food') || cleanTitle.toLowerCase().includes('restaurant'))) {
    cleanTitle = 'SavorCraft — Gourmet Dining & Express';
  } else if (cleanTitle.length > 40) {
    cleanTitle = cleanTitle.slice(0, 37) + '...';
  } else if (!cleanTitle || cleanTitle.length < 3) {
    cleanTitle = 'NovaSuite Interactive Platform';
  }

  if (isCarRental) {
    return generateCarRentalAppHtml(cleanTitle);
  } else if (isHealthcare) {
    return generateHealthcareClinicAppHtml(cleanTitle);
  } else if (isRealEstate) {
    return generateRealEstateAppHtml(cleanTitle);
  } else if (isFoodDelivery) {
    return generateFoodDeliveryAppHtml(cleanTitle);
  } else if (isFitness) {
    return generateFitnessTrackerHtml(cleanTitle);
  } else if (isCrypto) {
    return generateCryptoTradingHtml(cleanTitle);
  } else if (isKanban) {
    return generateKanbanSprintBoardHtml(cleanTitle);
  } else if (isEcommerce) {
    return generateEcommerceStoreHtml(cleanTitle);
  } else if (isGame) {
    return generateCyberArcadeHtml(cleanTitle);
  } else if (isAiApp) {
    return generateAiNeuralWorkspaceHtml(cleanTitle);
  } else {
    return generateEnterpriseDashboardHtml(cleanTitle);
  }
}

function generateAiNeuralWorkspaceHtml(appTitle: string): string {
  const appInitial = (appTitle.replace(/[^a-zA-Z0-9]/g, '').charAt(0) || '✦').toUpperCase();
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Autonomous Super-Intelligence Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #06070b; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(8, 10, 16, 0.6); }
    ::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.25); border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.6); }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    .ambient-glow {
      animation: pulseGlow 8s ease-in-out infinite;
    }
    @keyframes floatOrb {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(180deg); }
    }
    .orb-float {
      animation: floatOrb 10s ease-in-out infinite;
    }
  </style>
</head>
<body class="bg-[#06070b] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-purple-500 selection:text-white relative">

  <!-- BACKGROUND AMBIENT NEBULA GLOW -->
  <div class="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-[120px] pointer-events-none ambient-glow"></div>
  <div class="absolute bottom-[-100px] right-[-50px] w-[500px] h-[400px] bg-gradient-to-t from-cyan-600/10 via-emerald-600/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

  <!-- 1. TOP GLOBAL HEADER (Ultra-responsive at any width) -->
  <header class="border-b border-white/[0.08] bg-[#090b12]/95 backdrop-blur-2xl px-3 sm:px-6 py-2 flex items-center justify-between flex-shrink-0 z-30 shadow-xl">
    <div class="flex items-center gap-2.5 min-w-0">
      <!-- Logo -->
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-extrabold text-white text-xs shadow-md shadow-purple-600/30 shrink-0">
        ${appInitial}
      </div>

      <div class="min-w-0">
        <h1 class="font-extrabold text-xs sm:text-sm text-white tracking-tight truncate max-w-[130px] sm:max-w-[200px]">
          ${appTitle}
        </h1>
        <div class="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online</span>
          <span class="text-zinc-600 hidden sm:inline">•</span>
          <span class="text-zinc-400 hidden sm:inline font-mono">140 tok/s</span>
        </div>
      </div>
    </div>

    <!-- Center Navigation Tabs -->
    <div class="flex items-center p-0.5 bg-black/60 border border-white/[0.08] rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
      <button onclick="switchTab('chat')" id="tabBtn-chat" class="px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shrink-0">
        <span>💬</span>
        <span class="text-[11px] sm:text-xs">Chat</span>
      </button>
      <button onclick="switchTab('builder')" id="tabBtn-builder" class="px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 text-zinc-400 hover:text-white shrink-0">
        <span>🚀</span>
        <span class="text-[11px] sm:text-xs font-bold text-cyan-300">App Builder</span>
      </button>
      <button onclick="switchTab('image')" id="tabBtn-image" class="px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 text-zinc-400 hover:text-white shrink-0">
        <span>🎨</span>
        <span class="text-[11px] sm:text-xs">Art</span>
      </button>
      <button onclick="switchTab('code')" id="tabBtn-code" class="px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 text-zinc-400 hover:text-white shrink-0">
        <span>⚡</span>
        <span class="text-[11px] sm:text-xs">Sandbox</span>
      </button>
      <button onclick="switchTab('research')" id="tabBtn-research" class="px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 text-zinc-400 hover:text-white shrink-0">
        <span>🧠</span>
        <span class="text-[11px] sm:text-xs">Research</span>
      </button>
    </div>

    <!-- Right Controls: Audio FX & New Chat -->
    <div class="flex items-center gap-1.5">
      <button onclick="toggleAudio()" id="audioToggleBtn" class="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-300 hover:text-white transition-all cursor-pointer" title="Audio FX">
        🔊
      </button>
      <button onclick="clearChat()" class="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer">
        + New
      </button>
    </div>
  </header>

  <!-- 2. MAIN WORKSPACE VIEWPORT -->
  <main class="flex-1 flex overflow-hidden min-h-0 relative z-10">

    <!-- ========================================== -->
    <!-- TAB 1: NEURAL CONVERSATIONAL CHAT          -->
    <!-- ========================================== -->
    <section id="view-chat" class="flex-1 flex flex-col h-full overflow-hidden w-full relative">
      <!-- Messages Stream -->
      <div id="messagesArea" class="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 min-h-0 relative z-10 scroll-smooth">
        <!-- HERO WELCOME (Clean, Always Visible, Never Blank) -->
        <div id="heroWelcome" class="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-4 sm:py-8 space-y-4">
          <!-- Compact Glowing Icon -->
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-xl text-white shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            ✦
          </div>

          <!-- Hero Headline (SOLID CRISP WHITE - NEVER TRANSPARENT) -->
          <div class="space-y-1.5 max-w-xl">
            <h2 class="text-lg sm:text-2xl font-extrabold text-white tracking-tight" style="color: #ffffff !important;">
              What can Nexus AI create for you today?
            </h2>
            <p class="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed" style="color: #d1d5db !important;">
              Ask questions, generate 8K visual concept art, write full-stack code, or explore ideas.
            </p>
          </div>

          <!-- 4 Interactive Starter Cards (Responsive 2-col Grid) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1 max-w-xl">
            <button onclick="triggerQuickStarter('Build a complete high-converting landing page with responsive navbar, hero, pricing cards and modern dark glassmorphism styling in HTML & Tailwind CSS')" class="p-3 rounded-2xl bg-[#0e101c] hover:bg-purple-600/20 border border-white/[0.08] hover:border-purple-500/40 text-left transition-all group cursor-pointer shadow-md hover:-translate-y-0.5">
              <div class="text-xs font-bold text-white group-hover:text-purple-300 flex items-center gap-1.5">
                <span>⚡</span> Full-Stack SaaS Landing Page
              </div>
              <p class="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">Responsive hero, pricing tables & auth.</p>
            </button>

            <button onclick="triggerQuickStarter('Synthesize a photorealistic 8K concept art prompt for a futuristic cybernetic metropolis with neon rain reflections and anamorphic lens')" class="p-3 rounded-2xl bg-[#0e101c] hover:bg-cyan-600/20 border border-white/[0.08] hover:border-cyan-500/40 text-left transition-all group cursor-pointer shadow-md hover:-translate-y-0.5">
              <div class="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                <span>🎨</span> 8K Neural Visual Art
              </div>
              <p class="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">Cinematic raytraced concept render.</p>
            </button>

            <button onclick="triggerQuickStarter('Analyze the future market impact of autonomous humanoid robotics in 2026-2030, covering hardware cost curves, AI foundation models, and commercial adoption')" class="p-3 rounded-2xl bg-[#0e101c] hover:bg-emerald-600/20 border border-white/[0.08] hover:border-emerald-500/40 text-left transition-all group cursor-pointer shadow-md hover:-translate-y-0.5">
              <div class="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                <span>🧠</span> Autonomous Deep Research
              </div>
              <p class="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">Humanoid robotics hardware economics.</p>
            </button>

            <button onclick="triggerQuickStarter('Write an ultra-fast interactive HTML5 Canvas 3D particle vortex script with mouse interactivity and smooth audio-reactive waves')" class="p-3 rounded-2xl bg-[#0e101c] hover:bg-pink-600/20 border border-white/[0.08] hover:border-pink-500/40 text-left transition-all group cursor-pointer shadow-md hover:-translate-y-0.5">
              <div class="text-xs font-bold text-white group-hover:text-pink-300 flex items-center gap-1.5">
                <span>💻</span> Interactive Canvas Code
              </div>
              <p class="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">Interactive 3D particle vortex physics.</p>
            </button>
          </div>
        </div>

        <!-- Chat Stream Appends Here Dynamically -->
      </div>

      <!-- Floating Glass Input Dock -->
      <div class="p-3 sm:p-5 bg-gradient-to-t from-[#06070b] via-[#06070b]/90 to-transparent flex-shrink-0 z-20">
        <div class="max-w-3xl mx-auto">
          <form id="chatForm" onsubmit="event.preventDefault(); submitChatMessage();" class="flex items-center gap-2 bg-[#10121e]/90 border border-white/[0.12] focus-within:border-purple-500/70 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.25)] rounded-full px-3.5 py-2 shadow-2xl transition-all backdrop-blur-xl">
            <!-- Voice Dictation Mic Button -->
            <button type="button" onclick="triggerMic()" id="micBtn" class="p-2 text-zinc-400 hover:text-purple-400 rounded-full hover:bg-white/[0.05] transition-all cursor-pointer" title="Speak via Microphone">
              🎙️
            </button>

            <!-- Text Input -->
            <input type="text" id="userInput" placeholder="Ask Nexus AI anything, request code, or explore ideas..." class="flex-1 bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none px-2 py-1" autocomplete="off">

            <!-- Send Button -->
            <button type="button" onclick="submitChatMessage()" id="sendBtn" class="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 shrink-0">
              <span>Send</span>
              <span>✦</span>
            </button>
          </form>

          <!-- Input Footer Note -->
          <div class="flex items-center justify-between px-3 pt-2 text-[10px] text-zinc-500">
            <span>Model: <strong class="text-zinc-400 font-mono">Nexus-4 Omni (Ultra-Fast)</strong></span>
            <span>Press <kbd class="px-1 py-0.5 rounded bg-white/[0.08] text-zinc-400 font-mono">Enter ↵</kbd> to send</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- TAB 2: AUTONOMOUS AI APP BUILDER STUDIO    -->
    <!-- ========================================== -->
    <section id="view-builder" class="flex-1 hidden flex flex-col h-full overflow-hidden w-full bg-[#080a12]">
      <!-- Builder Sub-Header -->
      <div class="px-3 sm:px-6 py-2.5 bg-[#0b0e1a] border-b border-white/[0.08] flex items-center justify-between flex-shrink-0 text-xs">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
            🚀
          </div>
          <div>
            <h2 class="font-extrabold text-white text-xs sm:text-sm">AppForge Visual Builder</h2>
            <span class="text-[10px] text-zinc-400 hidden sm:inline">Build, customize & export production web apps</span>
          </div>
        </div>

        <!-- Controls: Viewport & Export -->
        <div class="flex items-center gap-2">
          <!-- Device Switcher -->
          <div class="flex items-center p-0.5 bg-black/60 border border-white/10 rounded-lg text-xs">
            <button onclick="setBuilderViewport('desktop')" id="bView-desktop" class="px-2.5 py-1 rounded bg-white/15 text-white font-semibold cursor-pointer">
              🖥️ Desktop
            </button>
            <button onclick="setBuilderViewport('mobile')" id="bView-mobile" class="px-2.5 py-1 rounded text-zinc-400 hover:text-white cursor-pointer">
              📱 Mobile
            </button>
          </div>

          <button onclick="exportBuilderHtml()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition-all cursor-pointer flex items-center gap-1 active:scale-95">
            <span>📦 Export App</span>
          </button>
        </div>
      </div>

      <!-- Main Split Studio Body -->
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        <!-- Left: Components & AI Refinement Drawer -->
        <div class="w-full md:w-80 lg:w-96 flex flex-col border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#090b14] p-3 sm:p-4 space-y-4 overflow-y-auto shrink-0">
          <!-- AI Prompt Quick-Add -->
          <div class="p-3.5 rounded-2xl bg-[#0f1120] border border-white/10 space-y-2.5 shadow-lg">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-white flex items-center gap-1.5">
                <span>✦</span> AI Section Generator
              </span>
              <span class="text-[10px] text-purple-400 font-mono">Instant Insert</span>
            </div>
            <div class="flex gap-1.5">
              <input type="text" id="builderPromptInput" placeholder="e.g. Add 3-tier pricing, FAQ, stats..." class="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400">
              <button onclick="handleBuilderPromptAdd()" class="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer shrink-0">
                Add ✦
              </button>
            </div>
          </div>

          <!-- Component Palette -->
          <div class="space-y-2">
            <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Component Blocks (Click to Insert)
            </span>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="insertComponentBlock('hero')" class="p-2.5 rounded-xl bg-[#121424] hover:bg-cyan-600/20 border border-white/[0.06] hover:border-cyan-500/40 text-left transition-all cursor-pointer group">
                <span class="text-base">🌟</span>
                <div class="font-bold text-xs text-zinc-200 group-hover:text-cyan-300 mt-1">Hero Section</div>
                <div class="text-[10px] text-zinc-500">CTA & Glassmorphism</div>
              </button>
              <button onclick="insertComponentBlock('pricing')" class="p-2.5 rounded-xl bg-[#121424] hover:bg-purple-600/20 border border-white/[0.06] hover:border-purple-500/40 text-left transition-all cursor-pointer group">
                <span class="text-base">💳</span>
                <div class="font-bold text-xs text-zinc-200 group-hover:text-purple-300 mt-1">Pricing Grid</div>
                <div class="text-[10px] text-zinc-500">Monthly/Yearly toggle</div>
              </button>
              <button onclick="insertComponentBlock('stats')" class="p-2.5 rounded-xl bg-[#121424] hover:bg-emerald-600/20 border border-white/[0.06] hover:border-emerald-500/40 text-left transition-all cursor-pointer group">
                <span class="text-base">📊</span>
                <div class="font-bold text-xs text-zinc-200 group-hover:text-emerald-300 mt-1">Metrics & KPIs</div>
                <div class="text-[10px] text-zinc-500">Live Counter Cards</div>
              </button>
              <button onclick="insertComponentBlock('testimonials')" class="p-2.5 rounded-xl bg-[#121424] hover:bg-amber-600/20 border border-white/[0.06] hover:border-amber-500/40 text-left transition-all cursor-pointer group">
                <span class="text-base">💬</span>
                <div class="font-bold text-xs text-zinc-200 group-hover:text-amber-300 mt-1">Testimonials</div>
                <div class="text-[10px] text-zinc-500">Verified reviews</div>
              </button>
              <button onclick="insertComponentBlock('contact')" class="p-2.5 rounded-xl bg-[#121424] hover:bg-rose-600/20 border border-white/[0.06] hover:border-rose-500/40 text-left transition-all cursor-pointer group">
                <span class="text-base">📬</span>
                <div class="font-bold text-xs text-zinc-200 group-hover:text-rose-300 mt-1">Contact Form</div>
                <div class="text-[10px] text-zinc-500">Instant submission</div>
              </button>
              <button onclick="insertComponentBlock('auth')" class="p-2.5 rounded-xl bg-[#121424] hover:bg-indigo-600/20 border border-white/[0.06] hover:border-indigo-500/40 text-left transition-all cursor-pointer group">
                <span class="text-base">🔐</span>
                <div class="font-bold text-xs text-zinc-200 group-hover:text-indigo-300 mt-1">Auth Modal</div>
                <div class="text-[10px] text-zinc-500">Sign In & Register</div>
              </button>
            </div>
          </div>

          <!-- Color Theme Switcher -->
          <div class="space-y-2 pt-2 border-t border-white/[0.06]">
            <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Aesthetic Palettes
            </span>
            <div class="flex items-center gap-2">
              <button onclick="applyBuilderTheme('dark-luxury')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600/30 text-purple-300 border border-purple-500/40 cursor-pointer">
                Dark Luxury
              </button>
              <button onclick="applyBuilderTheme('cyan-cyber')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 cursor-pointer">
                Cyber Cyan
              </button>
              <button onclick="applyBuilderTheme('emerald')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 cursor-pointer">
                Emerald Pro
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Live Canvas Viewport -->
        <div class="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80">
          <div id="builderCanvasContainer" class="w-full max-w-5xl bg-[#090b14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 min-h-[580px] flex flex-col">
            <!-- Canvas Website Header -->
            <header class="px-6 py-4 border-b border-white/[0.08] bg-[#0c0e1c] flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                  ✦
                </div>
                <div>
                  <h3 class="font-black text-white text-sm" id="canvasAppTitle">${appTitle}</h3>
                  <span class="text-[10px] text-emerald-400 font-mono">● Production v2.4</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <nav class="hidden sm:flex items-center gap-4 text-xs font-medium text-zinc-400">
                  <a href="#features" class="hover:text-white transition-colors">Features</a>
                  <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
                  <a href="#testimonials" class="hover:text-white transition-colors">Testimonials</a>
                </nav>
                <button onclick="openCanvasAuthModal()" class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer hover:opacity-95 transition-all">
                  Get Started
                </button>
              </div>
            </header>

            <!-- Dynamic Canvas Sections Container -->
            <div id="canvasSections" class="flex-1 p-4 sm:p-8 space-y-12">
              <!-- Default Hero Block -->
              <section class="text-center py-10 sm:py-16 space-y-6 max-w-3xl mx-auto relative">
                <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-sm">
                  <span>✦</span> Next-Generation Neural Experience
                </div>
                <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Supercharge Your Workflow with Autonomous Intelligence
                </h1>
                <p class="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
                  Engineered with sub-second execution, dynamic reactive state, and beautiful dark glassmorphism styling.
                </p>
                <div class="flex items-center justify-center gap-3 pt-2">
                  <button onclick="alert('Welcome to your live application!')" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-purple-600/30 cursor-pointer transition-all active:scale-95">
                    Explore Platform ✦
                  </button>
                  <button onclick="openCanvasAuthModal()" class="px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-xs cursor-pointer transition-all">
                    Sign In
                  </button>
                </div>
              </section>

              <!-- Default KPI Stats Grid -->
              <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-5 rounded-2xl bg-[#0f1224] border border-white/[0.08] shadow-lg">
                  <span class="text-xs text-zinc-400">Total Processed Events</span>
                  <div class="text-2xl font-black text-white mt-1">1,489,200+</div>
                  <span class="text-[11px] text-emerald-400 font-semibold font-mono">↑ 48.2% this month</span>
                </div>
                <div class="p-5 rounded-2xl bg-[#0f1224] border border-white/[0.08] shadow-lg">
                  <span class="text-xs text-zinc-400">Average Inference Latency</span>
                  <div class="text-2xl font-black text-cyan-300 mt-1">14.8 ms</div>
                  <span class="text-[11px] text-emerald-400 font-semibold font-mono">● Zero Cold Start</span>
                </div>
                <div class="p-5 rounded-2xl bg-[#0f1224] border border-white/[0.08] shadow-lg">
                  <span class="text-xs text-zinc-400">Customer Satisfaction</span>
                  <div class="text-2xl font-black text-purple-300 mt-1">99.98%</div>
                  <span class="text-[11px] text-purple-400 font-semibold font-mono">5,000+ Enterprise Teams</span>
                </div>
              </section>

              <!-- Interactive 3-Tier Pricing -->
              <section id="pricing" class="space-y-6 pt-6 border-t border-white/[0.08]">
                <div class="text-center space-y-2">
                  <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Transparent Investment</span>
                  <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Simple, Powerful Pricing</h2>
                  <!-- Monthly / Annual Toggle -->
                  <div class="flex items-center justify-center gap-3 pt-2">
                    <span class="text-xs text-zinc-400 font-semibold">Monthly</span>
                    <button onclick="toggleCanvasBilling()" id="canvasBillingToggle" class="w-12 h-6 rounded-full bg-cyan-600 p-1 flex items-center transition-all cursor-pointer">
                      <div id="canvasToggleKnob" class="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform"></div>
                    </button>
                    <span class="text-xs text-white font-semibold flex items-center gap-1">
                      <span>Annual</span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Save 20%</span>
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Starter -->
                  <div class="p-6 rounded-3xl bg-[#0e1122] border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-6">
                    <div class="space-y-3">
                      <h4 class="font-extrabold text-white text-base">Starter</h4>
                      <p class="text-xs text-zinc-400">For individuals and prototyping</p>
                      <div class="text-3xl font-black text-white" id="price-starter">$0<span class="text-xs text-zinc-400 font-normal">/mo</span></div>
                      <ul class="text-xs text-zinc-300 space-y-2 pt-2">
                        <li>✓ 10,000 Fast Inferences</li>
                        <li>✓ 5 Active Projects</li>
                        <li>✓ Community Discord Support</li>
                      </ul>
                    </div>
                    <button onclick="alert('Starter plan selected!')" class="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs transition-colors cursor-pointer">
                      Get Started Free
                    </button>
                  </div>

                  <!-- Pro (Featured) -->
                  <div class="p-6 rounded-3xl bg-gradient-to-b from-[#141230] to-[#0f1122] border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 flex flex-col justify-between space-y-6 relative">
                    <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-[10px] shadow-sm uppercase tracking-wider">
                      Most Popular
                    </span>
                    <div class="space-y-3">
                      <h4 class="font-extrabold text-white text-base">Professional</h4>
                      <p class="text-xs text-zinc-400">For fast-growing builders</p>
                      <div class="text-3xl font-black text-cyan-300" id="price-pro">$29<span class="text-xs text-zinc-400 font-normal">/mo</span></div>
                      <ul class="text-xs text-zinc-200 space-y-2 pt-2">
                        <li>✓ Unlimited Fast Inferences</li>
                        <li>✓ 100 Active Projects</li>
                        <li>✓ Priority 24/7 Dedicated SLA</li>
                        <li>✓ Custom Domain Hosting</li>
                      </ul>
                    </div>
                    <button onclick="alert('Professional subscription initialized!')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-500/30 cursor-pointer">
                      Start Pro Trial ✦
                    </button>
                  </div>

                  <!-- Enterprise -->
                  <div class="p-6 rounded-3xl bg-[#0e1122] border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-6">
                    <div class="space-y-3">
                      <h4 class="font-extrabold text-white text-base">Enterprise</h4>
                      <p class="text-xs text-zinc-400">For mission-critical orgs</p>
                      <div class="text-3xl font-black text-white" id="price-enterprise">$99<span class="text-xs text-zinc-400 font-normal">/mo</span></div>
                      <ul class="text-xs text-zinc-300 space-y-2 pt-2">
                        <li>✓ Unlimited Dedicated Clusters</li>
                        <li>✓ Dedicated Account Architect</li>
                        <li>✓ Custom Security & HIPAA</li>
                        <li>✓ Air-Gapped Deployment</li>
                      </ul>
                    </div>
                    <button onclick="alert('Enterprise representative will contact you!')" class="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs transition-colors cursor-pointer">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- TAB 3: AI IMAGE STUDIO (8K PHOTOREAL)      -->
    <!-- ========================================== -->
    <section id="view-image" class="flex-1 hidden flex flex-col h-full overflow-y-auto p-4 sm:p-8 space-y-6">
      <div class="max-w-5xl mx-auto w-full space-y-6">
        <!-- Header -->
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1 text-[11px] font-bold text-pink-400 uppercase tracking-wider">
            <span>🎨</span> Neural Visual Engine 3.5
          </div>
          <h2 class="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            8K Optical Art & Cinematic Visual Studio
          </h2>
          <p class="text-xs sm:text-sm text-zinc-400">Synthesize photorealistic concept art, 3D Octane renders, and hyper-detailed visual assets with real-time prompt diffusion.</p>
        </div>

        <!-- Prompt Synthesizer Card -->
        <div class="p-5 rounded-3xl bg-[#0f111d] border border-white/[0.08] shadow-2xl space-y-4">
          <div class="flex flex-col sm:flex-row gap-2">
            <input type="text" id="imagePrompt" value="Hyper-realistic cyberpunk metropolis in rain, volumetric neon reflections, anamorphic cinema lens, 8k masterpiece" class="flex-1 px-4 py-3 rounded-2xl bg-black/60 border border-white/[0.1] text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition-all">
            <button onclick="synthesizeImage()" id="genImgBtn" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95">
              <span>Synthesize 8K Artwork ✦</span>
            </button>
          </div>

          <!-- Style Preset Pills -->
          <div class="flex flex-wrap items-center gap-2 pt-1" id="stylePills">
            <button type="button" onclick="selectStyle(this, 'photoreal')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white border border-purple-500 cursor-pointer shadow-sm">Photoreal 8K</button>
            <button type="button" onclick="selectStyle(this, 'cyberpunk')" class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-zinc-400 hover:text-white border border-white/[0.08] cursor-pointer">Cyberpunk Neon</button>
            <button type="button" onclick="selectStyle(this, '3d')" class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-zinc-400 hover:text-white border border-white/[0.08] cursor-pointer">3D Isometric Octane</button>
            <button type="button" onclick="selectStyle(this, 'anime')" class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-zinc-400 hover:text-white border border-white/[0.08] cursor-pointer">Anime Studio Ghibli</button>
            <button type="button" onclick="selectStyle(this, 'scifi')" class="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-zinc-400 hover:text-white border border-white/[0.08] cursor-pointer">Interstellar Sci-Fi</button>
          </div>
        </div>

        <!-- Gallery Grid -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs text-zinc-400">
            <span class="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Generated Masterpieces (8K Ultra HD)
            </span>
            <span>Click any image to view details or download</span>
          </div>
          <div id="imageGallery" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Dynamically Populated -->
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- TAB 3: CODE SANDBOX (LIVE RUNNING IDE)     -->
    <!-- ========================================== -->
    <section id="view-code" class="flex-1 hidden flex flex-col h-full overflow-hidden w-full">
      <!-- Toolbar -->
      <div class="px-4 py-2.5 bg-[#0a0c14] border-b border-white/[0.08] flex items-center justify-between flex-shrink-0 text-xs">
        <div class="flex items-center gap-3">
          <span class="font-extrabold text-white flex items-center gap-1.5">
            <span>⚡</span> Monaco Live Code Sandbox
          </span>
          <span class="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] mono">
            HTML5 / JS / WebGL / Canvas
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Preset switcher -->
          <select id="codePresetSelect" onchange="loadCodePreset(this.value)" class="bg-[#121422] border border-white/10 text-zinc-300 text-xs px-2.5 py-1.5 rounded-xl outline-none cursor-pointer">
            <option value="particles">3D Particle Vortex</option>
            <option value="crypto">Crypto Live Ticker</option>
            <option value="matrix">Matrix Cyber Rain</option>
          </select>

          <button onclick="copyCode()" class="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer">
            Copy Code
          </button>
          <button onclick="runCode()" class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/25 cursor-pointer transition-all flex items-center gap-1.5 active:scale-95">
            <span>▶ Run Code Live</span>
          </button>
        </div>
      </div>

      <!-- Split Screen: Editor on Left, Live Runner on Right -->
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        <div class="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#07080f] overflow-hidden min-h-0">
          <div class="px-3 py-1 bg-black/40 border-b border-white/5 text-[11px] mono text-zinc-400 flex items-center justify-between">
            <span>index.html (Source)</span>
            <span class="text-purple-400">Editable</span>
          </div>
          <textarea id="codeEditor" class="flex-1 w-full p-4 bg-[#07080f] text-zinc-200 mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-purple-500 selection:text-white min-h-0" spellcheck="false"></textarea>
        </div>

        <div class="w-full md:w-1/2 flex flex-col bg-black overflow-hidden min-h-0">
          <div class="px-3 py-1 bg-black/40 border-b border-white/5 text-[11px] mono text-zinc-400 flex items-center justify-between">
            <span>Live Interactive Preview</span>
            <span class="text-emerald-400">● 60 FPS</span>
          </div>
          <iframe id="codePreviewFrame" class="w-full flex-1 border-none bg-black"></iframe>
        </div>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- TAB 4: DEEP RESEARCH DOSSIER AGENT        -->
    <!-- ========================================== -->
    <section id="view-research" class="flex-1 hidden flex flex-col h-full overflow-y-auto p-4 sm:p-8 space-y-6">
      <div class="max-w-4xl mx-auto w-full space-y-6">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            <span>🧠</span> Autonomous Research Dossier
          </div>
          <h2 class="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Source Strategic Intelligence Reports
          </h2>
          <p class="text-xs sm:text-sm text-zinc-400">Search any industry, science, or technology topic to generate a comprehensive structured dossier with key insights and data projections.</p>
        </div>

        <div class="flex gap-2">
          <input type="text" id="researchQuery" value="Autonomous Humanoid Robotics: Commercial Adoption & Hardware Cost Curves 2026-2030" class="flex-1 px-4 py-3 rounded-2xl bg-[#0f111d] border border-white/[0.1] text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-all">
          <button onclick="runResearchDossier()" id="researchBtn" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0">
            Synthesize Dossier ✦
          </button>
        </div>

        <!-- Rendered Report Container -->
        <div id="researchReport" class="p-6 rounded-3xl bg-[#0e101b] border border-white/[0.08] shadow-2xl space-y-4">
          <!-- Populated dynamically -->
        </div>
      </div>
    </section>

  </main>

  <!-- JAVASCRIPT BULLETPROOF ENGINE -->
  <script>
    let currentTab = 'chat';
    let currentStyle = 'photoreal';
    let audioEnabled = true;

    // Web Audio Synthesizer (Futuristic Chimes without external files)
    const AudioEngine = {
      ctx: null,
      init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
      },
      play(freq, type, duration, delay = 0) {
        if (!audioEnabled) return;
        try {
          this.init();
          if (!this.ctx) return;
          if (this.ctx.state === 'suspended') this.ctx.resume();
          setTimeout(() => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
          }, delay);
        } catch(e) {}
      },
      chimeSend() {
        this.play(520, 'sine', 0.15);
        this.play(780, 'sine', 0.2, 80);
      },
      chimeReceive() {
        this.play(600, 'sine', 0.12);
        this.play(800, 'sine', 0.15, 60);
        this.play(1040, 'triangle', 0.25, 120);
      }
    };

    function toggleAudio() {
      audioEnabled = !audioEnabled;
      const btn = document.getElementById('audioToggleBtn');
      btn.innerText = audioEnabled ? '🔊' : '🔇';
      btn.title = audioEnabled ? 'Audio FX Enabled' : 'Audio FX Muted';
    }

    const SAMPLE_GALLERY = [
      {
        title: 'Cyberpunk Neo-Metropolis 8K',
        url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
        prompt: 'Futuristic hyper-dense skyscraper skyline in neon rain, volumetric atmospheric reflections',
        metadata: '85mm f/1.2 • ISO 100 • Octane Raytraced'
      },
      {
        title: 'Quantum Neural Supercomputer',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        prompt: 'Abstract liquid glass and glowing violet energy conduits with quantum subatomic flow',
        metadata: 'Macro Prime • Sub-Surface Scattering'
      },
      {
        title: 'Autonomous Synthetic Android',
        url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
        prompt: 'Ultra-detailed robotic cybernetic face with optical crystal sensors and gold fiber circuit wiring',
        metadata: '105mm Portrait • Soft Studio Keylight'
      },
      {
        title: 'Interstellar Nebula Horizon',
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
        prompt: 'Deep cosmic violet stars, planetary accretion ring and ethereal stardust nebula',
        metadata: 'Space Telephoto • 32K Celestial Render'
      },
      {
        title: 'Bioluminescent Cyber Ecosystem',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        prompt: 'Alien crystalline forest glowing with teal and magenta phosphorescent veins',
        metadata: '50mm Wide • Night Exposure • 8K'
      },
      {
        title: 'Autonomous Drone Flight Over Cyber Tokyo',
        url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1200&auto=format&fit=crop',
        prompt: 'Aerial cityscape with high-speed holographic bullet trains and neon billboards',
        metadata: 'Anamorphic Cinema • 2.39:1 Aspect'
      }
    ];

    const CODE_PRESETS = {
      particles: \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; overflow: hidden; background: #06070b; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    let mouse = { x: null, y: null };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for(let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? '#a855f7' : '#06b6d4'
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(6, 7, 11, 0.2)';
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > w) p.vx *= -1;
        if(p.y < 0 || p.y > h) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            p.x += dx * 0.02;
            p.y += dy * 0.02;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(168, 85, 247, ' + (1 - dist / 85) * 0.25 + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  <\\/script>
</body>
</html>\`,

      crypto: \`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"><\\/script>
</head>
<body class="bg-[#090b14] text-white p-6 font-sans flex flex-col items-center justify-center min-h-screen">
  <div class="max-w-md w-full bg-[#121526] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
    <div class="flex items-center justify-between border-b border-white/10 pb-3">
      <div>
        <h2 class="text-lg font-bold">BTC / USD Quantum Feed</h2>
        <span class="text-xs text-emerald-400">● Live WebSocket Simulation</span>
      </div>
      <span class="text-2xl font-extrabold text-emerald-400" id="btcPrice">$94,820.50</span>
    </div>
    <div class="space-y-2">
      <div class="flex justify-between text-xs text-zinc-400">
        <span>24h Volume</span>
        <span class="text-white font-mono">$48.2 Billion</span>
      </div>
      <div class="flex justify-between text-xs text-zinc-400">
        <span>Neural Predictor</span>
        <span class="text-purple-400 font-bold">Strong Buy (98.4%)</span>
      </div>
    </div>
    <div class="pt-3">
      <button onclick="alert('Order submitted to smart contract!')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-xs shadow-lg shadow-emerald-500/25">
        Execute Instant Swap
      </button>
    </div>
  </div>
  <script>
    let price = 94820.50;
    setInterval(() => {
      price += (Math.random() - 0.48) * 45;
      document.getElementById('btcPrice').innerText = '$' + price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }, 1200);
  <\\/script>
</body>
</html>\`,

      matrix: \`<!DOCTYPE html>
<html>
<head>
  <style>body { margin:0; background:black; overflow:hidden; }</style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    const chars = '0123456789ABCDEF✦NEXUSAI';
    const fontSize = 14;
    const columns = c.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#10b981';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    setInterval(draw, 33);
  <\\/script>
</body>
</html>\`
    };

    function switchTab(tab) {
      currentTab = tab;
      AudioEngine.play(700, 'sine', 0.08);
      ['chat', 'builder', 'image', 'code', 'research'].forEach(t => {
        const view = document.getElementById('view-' + t);
        const btn = document.getElementById('tabBtn-' + t);
        if (!view || !btn) return;
        if (t === tab) {
          view.classList.remove('hidden');
          btn.className = 'px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/40 shrink-0';
        } else {
          view.classList.add('hidden');
          btn.className = 'px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 text-zinc-400 hover:text-white hover:bg-white/[0.05] shrink-0';
        }
      });

      if (tab === 'code' && !document.getElementById('codeEditor').value) {
        loadCodePreset('particles');
      }
    }

    // Visual App Builder Engine Functions
    let isCanvasAnnual = false;
    function toggleCanvasBilling() {
      isCanvasAnnual = !isCanvasAnnual;
      AudioEngine.play(600, 'sine', 0.1);
      const knob = document.getElementById('canvasToggleKnob');
      const toggle = document.getElementById('canvasBillingToggle');
      if (isCanvasAnnual) {
        knob.style.transform = 'translateX(24px)';
        toggle.className = 'w-12 h-6 rounded-full bg-emerald-500 p-1 flex items-center transition-all cursor-pointer';
        document.getElementById('price-starter').innerHTML = '$0<span class="text-xs text-zinc-400 font-normal">/yr</span>';
        document.getElementById('price-pro').innerHTML = '$279<span class="text-xs text-zinc-400 font-normal">/yr</span>';
        document.getElementById('price-enterprise').innerHTML = '$950<span class="text-xs text-zinc-400 font-normal">/yr</span>';
      } else {
        knob.style.transform = 'translateX(0px)';
        toggle.className = 'w-12 h-6 rounded-full bg-cyan-600 p-1 flex items-center transition-all cursor-pointer';
        document.getElementById('price-starter').innerHTML = '$0<span class="text-xs text-zinc-400 font-normal">/mo</span>';
        document.getElementById('price-pro').innerHTML = '$29<span class="text-xs text-zinc-400 font-normal">/mo</span>';
        document.getElementById('price-enterprise').innerHTML = '$99<span class="text-xs text-zinc-400 font-normal">/mo</span>';
      }
    }

    function setBuilderViewport(mode) {
      AudioEngine.play(550, 'sine', 0.08);
      const container = document.getElementById('builderCanvasContainer');
      const btnDesk = document.getElementById('bView-desktop');
      const btnMob = document.getElementById('bView-mobile');
      if (mode === 'mobile') {
        container.style.maxWidth = '390px';
        btnMob.className = 'px-2.5 py-1 rounded bg-white/15 text-white font-semibold cursor-pointer';
        btnDesk.className = 'px-2.5 py-1 rounded text-zinc-400 hover:text-white cursor-pointer';
      } else {
        container.style.maxWidth = '1000px';
        btnDesk.className = 'px-2.5 py-1 rounded bg-white/15 text-white font-semibold cursor-pointer';
        btnMob.className = 'px-2.5 py-1 rounded text-zinc-400 hover:text-white cursor-pointer';
      }
    }

    function applyBuilderTheme(theme) {
      AudioEngine.play(600, 'sine', 0.1);
      const container = document.getElementById('builderCanvasContainer');
      if (theme === 'cyan-cyber') {
        container.className = 'w-full max-w-5xl bg-[#060e18] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden transition-all duration-300 min-h-[580px] flex flex-col';
      } else if (theme === 'emerald') {
        container.className = 'w-full max-w-5xl bg-[#06120d] border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden transition-all duration-300 min-h-[580px] flex flex-col';
      } else {
        container.className = 'w-full max-w-5xl bg-[#090b14] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 min-h-[580px] flex flex-col';
      }
    }

    function insertComponentBlock(type) {
      AudioEngine.chimeReceive();
      const canvas = document.getElementById('canvasSections');
      const div = document.createElement('section');
      div.className = 'p-6 rounded-3xl bg-[#0f1224] border border-white/10 space-y-4 shadow-xl';

      if (type === 'testimonials') {
        div.innerHTML = \`
          <div class="text-center space-y-1 mb-4">
            <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">Social Proof</span>
            <h3 class="text-xl font-bold text-white">Loved by Thousands of Visionary Engineers</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <p class="text-xs text-zinc-300">"This autonomous studio reduced our deployment cycle from 3 days to under 4 minutes. A genuine game-changer."</p>
              <div class="flex items-center gap-2 pt-1 text-xs">
                <span class="font-bold text-white">Sarah Jenkins</span>
                <span class="text-zinc-500">• CTO at HyperFlow</span>
              </div>
            </div>
            <div class="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <p class="text-xs text-zinc-300">"The code generation quality and reactive components are completely production-ready right out of the box."</p>
              <div class="flex items-center gap-2 pt-1 text-xs">
                <span class="font-bold text-white">Alex Rivera</span>
                <span class="text-zinc-500">• Principal Architect</span>
              </div>
            </div>
          </div>
        \`;
      } else if (type === 'contact') {
        div.innerHTML = \`
          <div class="max-w-xl mx-auto space-y-4 text-center">
            <h3 class="text-xl font-bold text-white">Send Us a Direct Dispatch</h3>
            <p class="text-xs text-zinc-400">Our engineering leads respond within 24 hours.</p>
            <div class="space-y-2 text-left">
              <input type="text" placeholder="Your Full Name" class="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white">
              <input type="email" placeholder="Work Email" class="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white">
              <textarea placeholder="Tell us about your project requirements..." class="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-white h-20"></textarea>
              <button onclick="alert('Message dispatched to team successfully!')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 font-bold text-xs text-white shadow-lg cursor-pointer">Submit Message</button>
            </div>
          </div>
        \`;
      } else if (type === 'auth') {
        openCanvasAuthModal();
        return;
      } else {
        div.innerHTML = \`
          <div class="text-center py-6 space-y-2">
            <span class="text-xs font-bold text-cyan-400 uppercase">Live Modular Section</span>
            <h3 class="text-xl font-bold text-white">Custom Component Initialized</h3>
            <p class="text-xs text-zinc-400">This section has been added into your canvas architecture and is fully responsive.</p>
          </div>
        \`;
      }

      canvas.appendChild(div);
      div.scrollIntoView({ behavior: 'smooth' });
    }

    function handleBuilderPromptAdd() {
      const input = document.getElementById('builderPromptInput');
      const val = input ? input.value.trim() : '';
      if (!val) return;
      insertComponentBlock('custom');
      input.value = '';
    }

    function openCanvasAuthModal() {
      AudioEngine.chimeSend();
      alert('Secure Authentication Gateway: OAuth 2.0 & Passkeys ready for integration.');
    }

    function exportBuilderHtml() {
      AudioEngine.play(800, 'sine', 0.15);
      const html = document.getElementById('builderCanvasContainer').outerHTML;
      const blob = new Blob(['<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-[#090b14] text-white p-6">' + html + '</body></html>'], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'appforge-website.html';
      a.click();
      URL.revokeObjectURL(url);
    }

    function triggerQuickStarter(promptText) {
      const input = document.getElementById('userInput');
      input.value = promptText;
      submitChatMessage();
    }

    function submitChatMessage() {
      const input = document.getElementById('userInput');
      const text = input ? input.value.trim() : '';
      if (!text) return;

      AudioEngine.chimeSend();

      // Hide Hero Welcome instantly
      const hero = document.getElementById('heroWelcome');
      if (hero) hero.style.display = 'none';

      // Append User message
      appendUserMessage(text);
      input.value = '';

      // Append Thinking Skeleton
      const thinkingId = 'thinking_' + Date.now();
      appendThinkingSkeleton(thinkingId);

      // Attempt real backend AI response with ultra-smart fallback
      fetchChatResponse(text, thinkingId);
    }

    function appendUserMessage(text) {
      const area = document.getElementById('messagesArea');
      const div = document.createElement('div');
      div.className = 'flex justify-end';
      div.innerHTML = \`
        <div class="max-w-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-xs sm:text-sm shadow-xl leading-relaxed border border-purple-400/20">
          \${escapeHtml(text)}
        </div>
      \`;
      area.appendChild(div);
      area.scrollTop = area.scrollHeight;
    }

    function appendThinkingSkeleton(id) {
      const area = document.getElementById('messagesArea');
      const div = document.createElement('div');
      div.id = id;
      div.className = 'flex items-start gap-3.5 max-w-3xl animate-pulse';
      div.innerHTML = \`
        <div class="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
          ✦
        </div>
        <div class="bg-[#0f111e] border border-white/[0.08] rounded-2xl rounded-tl-sm p-4 text-xs text-purple-300 flex items-center gap-2.5 shadow-xl">
          <span class="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          <span>Nexus AI is synthesizing deep reasoning...</span>
        </div>
      \`;
      area.appendChild(div);
      area.scrollTop = area.scrollHeight;
    }

    async function fetchChatResponse(userPrompt, thinkingId) {
      let resolvedAnswer = '';
      const p = userPrompt.toLowerCase().trim();
      const isGreeting = (
        p === 'hello' || p === 'hi' || p === 'hey' || p === 'salam' ||
        p === 'assalam o alaikum' || p === 'assalamu alaikum' ||
        p === 'kya haal hai' || p === 'kaise ho' || p === 'kese ho' ||
        p.startsWith('hello') || p.startsWith('hi ') || p.startsWith('salam')
      );

      if (isGreeting) {
        // Direct, warm and polite greeting response
        const thinkingEl = document.getElementById(thinkingId);
        if (thinkingEl) thinkingEl.remove();
        AudioEngine.chimeReceive();
        const greetingReply = (p.includes('salam') || p.includes('assalam'))
          ? 'Walaikum Assalam! Nexus AI Super-Studio tayar hai. Aap aaj kis cheez par kaam karna chahte hain? Koi sawal poochiye ya naya feature batayein!'
          : 'Hello! Nexus AI Super-Studio is ready. How can I assist you today? You can ask me questions, request custom code, or generate 8K creative art!';
        appendAssistantMessage(greetingReply);
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: userPrompt }],
            modelId: 'gemini-3.8-flash'
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && (data.text || data.message)) {
            resolvedAnswer = data.text || data.message;
          }
        }
      } catch (err) {
        // Network timeout or offline - fallback
      }

      if (!resolvedAnswer) {
        resolvedAnswer = synthesizeComprehensiveLocalResponse(userPrompt);
      }

      // Remove thinking skeleton
      const thinkingEl = document.getElementById(thinkingId);
      if (thinkingEl) thinkingEl.remove();

      AudioEngine.chimeReceive();
      appendAssistantMessage(resolvedAnswer);
    }

    function synthesizeComprehensiveLocalResponse(prompt) {
      const p = prompt.toLowerCase();

      if (p.includes('landing') || p.includes('saas') || p.includes('website') || p.includes('app') || p.includes('code') || p.includes('build')) {
        return \`### 🚀 Architecture & Code Specification for: "\${prompt}"

I have synthesized the full production-grade component layout and state architecture:

1. **Frontend Architecture**: React 19 + Tailwind CSS + High-Fidelity Glassmorphism with 60 FPS hardware acceleration.
2. **State & Real-time Flow**: Zero-latency WebSocket worker with automatic optimistic UI reconciliation.
3. **Enterprise Security**: Token-bucket rate limiting and role-based access validation.

\`\`\`html
<!-- Production Hero Architecture Component -->
<section class="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
  <div class="max-w-4xl text-center space-y-6 relative z-10">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
      <span>✦</span> Super-Intelligence Platform Live
    </div>
    <h1 class="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
      Empower Your Digital Workflow
    </h1>
    <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
      Next-generation autonomous intelligence engineered for elite engineers, founders, and creators.
    </p>
    <div class="flex items-center justify-center gap-3 pt-4">
      <button class="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold text-sm shadow-xl shadow-purple-600/30 transition-all">
        Launch Console
      </button>
    </div>
  </div>
</section>
\`\`\`

💡 **Action Tip:** Click **"⚡ Run in Sandbox"** to instantly test this code in the live Code Sandbox!\`;
      }

      if (p.includes('image') || p.includes('art') || p.includes('picture') || p.includes('draw') || p.includes('photo')) {
        return \`🎨 **8K Neural Optical Diffusion Parameters Formulated!**

I have engineered the hyper-detailed optical diffusion prompt for your artwork:
- **Optical Lens**: 85mm f/1.2 Anamorphic Cinema Prime (T-Stop 1.3)
- **Volumetric Lighting**: Soft neon violet raytraced dispersion with atmospheric moisture haze
- **Resolution**: 8K Ultra High Definition (7680 × 4320)
- **Render Engine**: Octane Unbiased Photoreal Raytracing

Switch to the **Image Studio** tab at the top to view, remix, and download the full 8K resolution masterpiece!\`;
      }

      const isUrdu = /(kya|kaise|karo|batao|chahiye|samjha|yar|bhai|hai|haan|nhi|nahi|shukriya|mujhe|salam|kese)/i.test(prompt);
      if (isUrdu) {
        return \`Ji bilkul! Aapke sawal: **"\${prompt}"** par analysis mukammal hai. Agar aapko iske mutabiq koi specific working code, custom logic ya calculation chahiye to batayein, main foran deliver kar doonga!\`;
      }

      return \`Here is the verified analysis for **"\${prompt}"**: The system is fully operational and synchronized. Let me know if you would like me to generate full working code, components, or step-by-step guidance!\`;
    }

    function appendAssistantMessage(content) {
      const area = document.getElementById('messagesArea');
      const msgId = 'msg_' + Date.now();
      const div = document.createElement('div');
      div.className = 'flex items-start gap-3.5 max-w-3xl';

      // Parse code block if any
      const formattedHtml = formatMarkdown(content, msgId);

      div.innerHTML = \`
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 text-white font-extrabold flex items-center justify-center text-xs flex-shrink-0 shadow-lg shadow-purple-600/30">
          ✦
        </div>
        <div class="bg-[#0e101c] border border-white/[0.08] rounded-2xl rounded-tl-sm p-5 text-xs sm:text-sm text-zinc-200 space-y-3 leading-relaxed shadow-2xl flex-1">
          <div class="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[11px] text-zinc-400">
            <span class="font-bold text-purple-300 flex items-center gap-1.5">
              <span>✦</span> ${appTitle} Assistant
            </span>
            <div class="flex items-center gap-2">
              <button onclick="speakText('\${msgId}')" class="p-1 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer" title="Speak Answer Aloud">🔊</button>
              <button onclick="copyMsgText('\${msgId}')" class="p-1 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer" title="Copy Text">📋</button>
            </div>
          </div>
          <div id="\${msgId}" class="prose prose-invert text-xs sm:text-sm leading-relaxed">\${formattedHtml}</div>
        </div>
      \`;

      area.appendChild(div);
      area.scrollTop = area.scrollHeight;
    }

    function formatMarkdown(text, msgId) {
      // Extract code block
      let processed = text;
      const codeRegex = /\\\\\`\\\\\`\\\\\`([a-zA-Z]*)\\n([\\s\\S]*?)\\\\\`\\\\\`\\\\\`/g;
      
      processed = processed.replace(codeRegex, (match, lang, code) => {
        const cleanCode = escapeHtml(code);
        const encoded = encodeURIComponent(code);
        return \`
          <div class="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#06070c] shadow-lg">
            <div class="px-3.5 py-1.5 bg-[#121422] border-b border-white/5 flex items-center justify-between text-[11px] mono text-zinc-400">
              <span>\${lang || 'code'}</span>
              <div class="flex items-center gap-2">
                <button onclick="sendCodeToSandbox(decodeURIComponent('\${encoded}'))" class="text-purple-400 hover:text-purple-300 transition-colors font-bold cursor-pointer">⚡ Run in Sandbox</button>
                <button onclick="navigator.clipboard.writeText(decodeURIComponent('\${encoded}')); alert('Code copied!');" class="hover:text-white transition-colors cursor-pointer">Copy</button>
              </div>
            </div>
            <pre class="p-4 text-xs mono text-zinc-200 overflow-x-auto"><code>\${cleanCode}</code></pre>
          </div>
        \`;
      });

      // Headers, bold, line breaks
      processed = processed.replace(/### (.*?)\\n/g, '<h3 class="text-sm sm:text-base font-extrabold text-white mt-3 mb-1">$1</h3>');
      processed = processed.replace(/## (.*?)\\n/g, '<h2 class="text-base sm:text-lg font-extrabold text-white mt-4 mb-2">$1</h2>');
      processed = processed.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-white font-bold">$1</strong>');
      processed = processed.replace(/\\n/g, '<br>');

      return processed;
    }

    function sendCodeToSandbox(code) {
      switchTab('code');
      const editor = document.getElementById('codeEditor');
      if (editor) {
        editor.value = code;
        runCode();
      }
    }

    function clearChat() {
      AudioEngine.play(400, 'sine', 0.1);
      const area = document.getElementById('messagesArea');
      area.innerHTML = '';
      const hero = document.getElementById('heroWelcome');
      if (hero) {
        hero.style.display = 'flex';
        area.appendChild(hero);
      }
    }

    function selectStyle(btn, style) {
      currentStyle = style;
      AudioEngine.play(600, 'sine', 0.08);
      const pills = document.getElementById('stylePills').children;
      for (let p of pills) {
        p.className = 'px-3.5 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-zinc-400 hover:text-white border border-white/[0.08] cursor-pointer';
      }
      btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white border border-purple-500 cursor-pointer shadow-sm';
    }

    function synthesizeImage() {
      const btn = document.getElementById('genImgBtn');
      const input = document.getElementById('imagePrompt');
      const userPrompt = (input ? input.value.trim() : '') || 'Hyper-realistic cyberpunk metropolis in rain, 8k masterpiece';
      AudioEngine.play(800, 'triangle', 0.2);
      btn.innerHTML = '<span>Synthesizing 8K Art...</span>';
      btn.disabled = true;

      // Add user custom masterpiece to top of gallery
      const dynamicArt = {
        title: userPrompt.length > 32 ? userPrompt.slice(0, 30) + '...' : userPrompt,
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        prompt: userPrompt,
        metadata: currentStyle.toUpperCase() + ' • 8K UHD • Octane Raytraced'
      };
      SAMPLE_GALLERY.unshift(dynamicArt);

      setTimeout(() => {
        renderGallery();
        AudioEngine.chimeReceive();
        btn.innerHTML = '<span>Synthesize 8K Artwork ✦</span>';
        btn.disabled = false;
      }, 700);
    }

    function renderGallery() {
      const grid = document.getElementById('imageGallery');
      if (!grid) return;
      grid.innerHTML = SAMPLE_GALLERY.map((img) => \`
        <div class="group relative rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0e101c] shadow-2xl transition-all hover:scale-[1.015] hover:border-purple-500/40">
          <img src="\${img.url}" alt="\${img.title}" class="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <span class="text-[10px] mono text-purple-300 font-bold uppercase">\${img.metadata}</span>
            <h4 class="font-bold text-white text-sm mt-0.5">\${img.title}</h4>
            <p class="text-[11px] text-zinc-300 line-clamp-1 mt-0.5 opacity-90">\${img.prompt}</p>
            <div class="flex items-center gap-2 mt-3">
              <a href="\${img.url}" target="_blank" download="artwork-8k.jpg" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 backdrop-blur-md text-xs font-bold text-white transition-all shadow-md shadow-purple-600/30">
                Download 8K
              </a>
              <button onclick="triggerQuickStarter('Analyze the visual style and composition of this 8K artwork: ' + '\${img.title}')" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
                Inspect ✦
              </button>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function loadCodePreset(presetKey) {
      const code = CODE_PRESETS[presetKey] || CODE_PRESETS.particles;
      document.getElementById('codeEditor').value = code;
      runCode();
    }

    function runCode() {
      AudioEngine.play(650, 'sine', 0.1);
      const code = document.getElementById('codeEditor').value;
      const frame = document.getElementById('codePreviewFrame');
      frame.srcdoc = code;
    }

    function copyCode() {
      const code = document.getElementById('codeEditor').value;
      navigator.clipboard.writeText(code);
      alert('Complete source code copied to clipboard!');
    }

    function copyMsgText(id) {
      const el = document.getElementById(id);
      if (el) {
        navigator.clipboard.writeText(el.innerText);
        alert('Answer copied to clipboard!');
      }
    }

    function speakText(id) {
      const el = document.getElementById(id);
      if (el && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(el.innerText);
        utter.rate = 1.0;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      }
    }

    function triggerMic() {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        const recog = new SpeechRec();
        const mic = document.getElementById('micBtn');
        mic.classList.add('text-purple-400', 'animate-ping');
        recog.onresult = (e) => {
          document.getElementById('userInput').value = e.results[0][0].transcript;
          mic.classList.remove('text-purple-400', 'animate-ping');
        };
        recog.onerror = () => {
          mic.classList.remove('text-purple-400', 'animate-ping');
        };
        recog.start();
      } else {
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      }
    }

    function runResearchDossier() {
      const query = document.getElementById('researchQuery').value;
      const btn = document.getElementById('researchBtn');
      btn.innerText = 'Synthesizing Dossier...';
      AudioEngine.play(500, 'sine', 0.2);

      setTimeout(() => {
        const container = document.getElementById('researchReport');
        container.innerHTML = \`
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span class="text-[10px] mono text-emerald-400 font-bold uppercase tracking-wider">Intelligence Dossier #942</span>
                <h3 class="text-base sm:text-lg font-extrabold text-white mt-0.5">\${escapeHtml(query)}</h3>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">Confidential</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span class="text-[10px] text-zinc-400 uppercase">CAGR Growth (2026-30)</span>
                <div class="text-xl font-extrabold text-emerald-400">+48.6%</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span class="text-[10px] text-zinc-400 uppercase">Unit Hardware Cost Target</span>
                <div class="text-xl font-extrabold text-cyan-400">$18,500</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span class="text-[10px] text-zinc-400 uppercase">Commercial Pilot Volume</span>
                <div class="text-xl font-extrabold text-purple-400">120,000+ Units</div>
              </div>
            </div>

            <div class="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <h4 class="font-bold text-white">Executive Synthesis:</h4>
              <p>The convergence of embodied multi-modal models (VLA) with high-density rotary actuators has compressed humanoid manufacturing costs. Initial deployment clusters center around tier-1 automotive manufacturing, electronics assembly, and specialized logistics.</p>
            </div>
          </div>
        \`;
        btn.innerText = 'Synthesize Dossier ✦';
        AudioEngine.chimeReceive();
      }, 600);
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Auto-initialize on load
    window.addEventListener('DOMContentLoaded', () => {
      renderGallery();
      loadCodePreset('particles');
      runResearchDossier();
    });
  </script>
</body>
</html>`;
}


function generateEcommerceStoreHtml(storeTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${storeTitle} — Premium E-Commerce Storefront</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; } .mono { font-family: 'JetBrains Mono', monospace; }</style>
</head>
<body class="bg-[#090b10] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-amber-500 selection:text-black">
  <header class="border-b border-white/10 bg-[#10131d]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between flex-shrink-0 z-40">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center font-bold text-black text-sm shadow-lg shadow-amber-500/20">🛍️</div>
      <div>
        <h1 class="font-extrabold text-sm sm:text-base text-white tracking-tight">${storeTitle}</h1>
        <p class="text-[11px] text-zinc-400">Curated Boutique Catalog & Instant 1-Click Checkout</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="toggleCart()" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20">
        <span>🛒 Cart</span>
        <span id="cartCount" class="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-mono font-bold">0</span>
      </button>
    </div>
  </header>

  <main class="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 class="text-xl font-extrabold text-white">Trending Pro Collection</h2>
          <p class="text-xs text-zinc-400">Hardware, neural wearables, and precision peripherals.</p>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <input type="text" id="storeSearch" oninput="filterProducts()" placeholder="Search products..." class="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-400/50 w-full sm:w-64">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="productsGrid"></div>
    </div>
  </main>

  <div id="cartModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#121522] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 class="font-extrabold text-white text-base">Shopping Bag</h3>
        <button onclick="toggleCart()" class="text-zinc-400 hover:text-white text-sm">✕</button>
      </div>
      <div id="cartItemsList" class="space-y-3 max-h-60 overflow-y-auto"></div>
      <div class="border-t border-white/10 pt-4 flex items-center justify-between">
        <span class="text-xs text-zinc-400">Total Price:</span>
        <span id="cartTotal" class="text-xl font-extrabold text-amber-400 mono">$0.00</span>
      </div>
      <button onclick="checkout()" class="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-400/20 cursor-pointer">
        Complete Checkout ($)
      </button>
    </div>
  </div>

  <script>
    const products = [
      { id: 1, name: 'Neural Audio Spatial Headphones', price: 299.00, tag: 'Bestseller', desc: 'Spatial active noise cancellation with 48h battery.' },
      { id: 2, name: 'Quantum Core Mechanical Keyboard', price: 189.50, tag: 'Pro Gear', desc: 'CNC aluminum chassis with magnetic Hall-effect switches.' },
      { id: 3, name: 'Ultra-Wide OLED Curved Display 34"', price: 899.00, tag: 'Featured', desc: '240Hz 0.03ms true 10-bit HDR precision panel.' },
      { id: 4, name: 'Precision Wireless 4K Mouse', price: 89.00, tag: 'Accessory', desc: '4000Hz polling rate with optical featherweight design.' },
      { id: 5, name: 'Titanium Biometric Smart Ring', price: 279.00, tag: 'Wearable', desc: 'Continuous sleep, HRV, temperature, and recovery tracking.' },
      { id: 6, name: 'GaN 140W Rapid Charging Hub', price: 79.99, tag: 'Power', desc: 'Quad-port intelligent dynamic power allocation.' }
    ];

    let cart = [];

    function renderProducts(list = products) {
      document.getElementById('productsGrid').innerHTML = list.map(p => \`
        <div class="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">\${p.tag}</span>
              <span class="text-base font-extrabold text-white mono">$\${p.price.toFixed(2)}</span>
            </div>
            <h3 class="font-bold text-white text-sm mb-1">\${p.name}</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">\${p.desc}</p>
          </div>
          <button onclick="addToCart(\${p.id})" class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-amber-400 text-zinc-200 hover:text-black font-bold text-xs transition-all cursor-pointer">
            + Add to Cart
          </button>
        </div>
      \`).join('');
    }

    window.addToCart = (id) => {
      const prod = products.find(p => p.id === id);
      if (prod) {
        cart.push(prod);
        updateCartUI();
      }
    };

    function updateCartUI() {
      document.getElementById('cartCount').innerText = cart.length;
      const list = document.getElementById('cartItemsList');
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      document.getElementById('cartTotal').innerText = '$' + total.toFixed(2);

      if (cart.length === 0) {
        list.innerHTML = '<div class="text-center text-zinc-500 text-xs py-4">Shopping bag is empty.</div>';
        return;
      }

      list.innerHTML = cart.map((item, idx) => \`
        <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/5 text-xs">
          <div>
            <div class="font-bold text-white">\${item.name}</div>
            <div class="text-amber-400 mono">$\${item.price.toFixed(2)}</div>
          </div>
          <button onclick="cart.splice(\${idx}, 1); updateCartUI();" class="text-zinc-500 hover:text-rose-400 p-1">✕</button>
        </div>
      \`).join('');
    }

    window.toggleCart = () => document.getElementById('cartModal').classList.toggle('hidden');
    window.checkout = () => {
      if (cart.length === 0) return alert('Cart is empty!');
      alert('🎉 Order Placed Successfully! Total: $' + cart.reduce((s, i) => s + i.price, 0).toFixed(2));
      cart = [];
      updateCartUI();
      toggleCart();
    };

    window.filterProducts = () => {
      const q = document.getElementById('storeSearch').value.toLowerCase();
      renderProducts(products.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)));
    };

    renderProducts();
  </script>
</body>
</html>`;
}

function generateEnterpriseDashboardHtml(appTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appTitle} — Executive Command Center</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; } .mono { font-family: 'JetBrains Mono', monospace; }</style>
</head>
<body class="bg-[#080a10] text-zinc-100 h-full flex flex-col overflow-hidden selection:bg-emerald-500 selection:text-black">
  <header class="border-b border-white/10 bg-[#0e111a] px-6 py-3.5 flex items-center justify-between flex-shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-500/20">⚡</div>
      <div>
        <h1 class="font-extrabold text-sm sm:text-base text-white">${appTitle}</h1>
        <p class="text-[11px] text-zinc-400">Operational Data Pipeline & Metric Velocity</p>
      </div>
    </div>
    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      Online & Synced
    </span>
  </header>

  <main class="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1 shadow-xl">
          <div class="text-xs text-zinc-400">Total Active Records</div>
          <div class="text-3xl font-extrabold text-white mono" id="recordCount">4</div>
          <div class="text-[11px] text-emerald-400">↑ Real-time synced</div>
        </div>
        <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1 shadow-xl">
          <div class="text-xs text-zinc-400">Operational Velocity</div>
          <div class="text-3xl font-extrabold text-emerald-400 mono">99.98%</div>
          <div class="text-[11px] text-zinc-400">Optimal compute throughput</div>
        </div>
        <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1 shadow-xl">
          <div class="text-xs text-zinc-400">Client Memory Bank</div>
          <div class="text-3xl font-extrabold text-cyan-400 mono">Persistent</div>
          <div class="text-[11px] text-zinc-400">Zero data loss on reload</div>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-[#10131d] border border-white/10 shadow-2xl space-y-5">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 class="text-base font-extrabold text-white">Live Data Records</h2>
            <p class="text-xs text-zinc-400">Add, filter, and track records with local storage synchronization.</p>
          </div>
          <input type="text" id="searchBox" oninput="renderRecords()" placeholder="Search records..." class="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none">
        </div>

        <form id="recordForm" onsubmit="addRecord(event)" class="flex flex-col sm:flex-row gap-2.5">
          <input type="text" id="recTitle" required placeholder="Enter new item or mission milestone..." class="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500">
          <select id="recPriority" class="px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 focus:outline-none">
            <option value="High Priority">⚡ High Priority</option>
            <option value="In Progress">🔄 In Progress</option>
            <option value="Completed">✓ Completed</option>
          </select>
          <button type="submit" class="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs cursor-pointer shadow-md shadow-emerald-400/20">
            + Add Record
          </button>
        </form>

        <div id="recordsList" class="space-y-2 pt-2"></div>
      </div>
    </div>
  </main>

  <script>
    const KEY = 'bexus_dashboard_records';
    let data = JSON.parse(localStorage.getItem(KEY) || 'null') || [
      { id: 1, title: 'Deploy Global Multi-Region Edge Replication', tag: 'High Priority', date: 'Just now' },
      { id: 2, title: 'Run Automated OWASP Security Vulnerability Audit', tag: 'In Progress', date: '12m ago' },
      { id: 3, title: 'Calibrate Real-Time Machine Learning Classifiers', tag: 'High Priority', date: '1h ago' },
      { id: 4, title: 'Publish Release Candidate 4.5 to Staging Nodes', tag: 'Completed', date: '2h ago' }
    ];

    function save() {
      localStorage.setItem(KEY, JSON.stringify(data));
      renderRecords();
    }

    function addRecord(e) {
      e.preventDefault();
      const title = document.getElementById('recTitle').value.trim();
      const tag = document.getElementById('recPriority').value;
      if (!title) return;
      data.unshift({ id: Date.now(), title, tag, date: 'Just now' });
      document.getElementById('recTitle').value = '';
      save();
    }

    function removeRecord(id) {
      data = data.filter(d => d.id !== id);
      save();
    }

    function renderRecords() {
      const q = (document.getElementById('searchBox')?.value || '').toLowerCase();
      const filtered = data.filter(d => d.title.toLowerCase().includes(q));
      document.getElementById('recordCount').innerText = data.length;
      document.getElementById('recordsList').innerHTML = filtered.map(d => \`
        <div class="p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 flex items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${d.tag.includes('High') ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30' : d.tag.includes('Completed') ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/30' : 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/30'}">\${d.tag}</span>
            <span class="font-medium text-white">\${d.title}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] text-zinc-500">\${d.date}</span>
            <button onclick="removeRecord(\${d.id})" class="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer">✕</button>
          </div>
        </div>
      \`).join('');
    }

    renderRecords();
  </script>
</body>
</html>`;
}

function generateCyberArcadeHtml(gameTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameTitle} — Cyber Arcade 60FPS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'JetBrains Mono', monospace; }</style>
</head>
<body class="bg-[#05060a] text-zinc-100 h-full flex flex-col overflow-hidden select-none">
  <header class="border-b border-white/10 bg-[#0d0f17] px-6 py-3 flex items-center justify-between flex-shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-black text-sm">🕹️</div>
      <div>
        <h1 class="font-extrabold text-sm sm:text-base text-white">${gameTitle}</h1>
        <p class="text-[10px] text-zinc-400">60 FPS Arcade Engine</p>
      </div>
    </div>
    <div class="flex items-center gap-4 text-xs">
      <div>SCORE: <span id="scoreText" class="text-emerald-400 font-bold">0</span></div>
      <div>BEST: <span id="bestText" class="text-cyan-400 font-bold">0</span></div>
    </div>
  </header>

  <main class="flex-1 flex flex-col items-center justify-center p-4 relative">
    <canvas id="gameCanvas" width="400" height="400" class="border-2 border-emerald-500/40 rounded-2xl bg-black shadow-2xl shadow-emerald-500/10"></canvas>
    <div class="mt-4 text-[11px] text-zinc-400 flex items-center gap-4">
      <span>Controls: Arrow Keys or WASD to move</span>
      <button onclick="resetGame()" class="px-3 py-1 rounded-lg bg-zinc-900 border border-white/10 hover:border-emerald-400 text-white text-xs">Restart 🔄</button>
    </div>
  </main>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let snake = [{ x: 160, y: 160 }];
    let dx = grid, dy = 0;
    let food = { x: 320, y: 320 };
    let score = 0, best = parseInt(localStorage.getItem('arcade_best') || '0');
    document.getElementById('bestText').innerText = best;

    function resetGame() {
      snake = [{ x: 160, y: 160 }];
      dx = grid; dy = 0;
      score = 0;
      document.getElementById('scoreText').innerText = '0';
    }

    function main() {
      setTimeout(() => {
        requestAnimationFrame(main);
        update();
        draw();
      }, 100);
    }

    function update() {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      if (head.x < 0) head.x = canvas.width - grid;
      if (head.x >= canvas.width) head.x = 0;
      if (head.y < 0) head.y = canvas.height - grid;
      if (head.y >= canvas.height) head.y = 0;

      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          resetGame();
          return;
        }
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('scoreText').innerText = score;
        if (score > best) {
          best = score;
          localStorage.setItem('arcade_best', best);
          document.getElementById('bestText').innerText = best;
        }
        food = {
          x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
          y: Math.floor(Math.random() * (canvas.height / grid)) * grid
        };
      } else {
        snake.pop();
      }
    }

    function draw() {
      ctx.fillStyle = '#05060a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(food.x, food.y, grid - 1, grid - 1);
      ctx.fillStyle = '#10b981';
      snake.forEach((s, idx) => {
        ctx.fillStyle = idx === 0 ? '#34d399' : '#10b981';
        ctx.fillRect(s.x, s.y, grid - 1, grid - 1);
      });
    }

    window.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowUp' || e.key === 'w') && dy === 0) { dx = 0; dy = -grid; }
      if ((e.key === 'ArrowDown' || e.key === 's') && dy === 0) { dx = 0; dy = grid; }
      if ((e.key === 'ArrowLeft' || e.key === 'a') && dx === 0) { dx = -grid; dy = 0; }
      if ((e.key === 'ArrowRight' || e.key === 'd') && dx === 0) { dx = grid; dy = 0; }
    });

    main();
  </script>
</body>
</html>`;
}
