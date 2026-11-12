import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../../services/soundEffects';
import { getClientDirectImageUrl } from '../../utils/imageFallback';
import { 
  X, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Send, 
  Image as ImageIcon, 
  Wand2, 
  Camera, 
  SunMedium, 
  ShieldAlert, 
  RefreshCw, 
  Maximize2,
  History,
  Layers,
  Flame
} from 'lucide-react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (imageUrl: string, prompt: string) => void;
}

interface GeneratedHistoryItem {
  id: string;
  url: string;
  prompt: string;
  originalPrompt: string;
  style: string;
  engine: string;
  timestamp: number;
}

const STYLE_PRESETS = [
  { id: 'automotive-action', label: 'Speed & Automotive', icon: '🏎️' },
  { id: 'cinematic-night', label: 'Rainy Night Cinema', icon: '🌧️' },
  { id: 'photorealistic', label: 'Photoreal 8K', icon: '📸' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: '🌆' },
  { id: '3d-render', label: '3D Octane Render', icon: '🧊' },
  { id: 'anime', label: 'Anime & Manga', icon: '🌸' },
  { id: 'cinematic-fantasy', label: 'Fantasy Art', icon: '🐉' },
];

const CAMERA_PRESETS = [
  { id: 'action-tracking', label: '35mm Action Rig (Rolling Shot)', icon: '🏎️' },
  { id: '85mm-portrait', label: '85mm Hasselblad Prime (Portrait)', icon: '📸' },
  { id: 'wide-16mm', label: '16mm Ultra-Wide Angle Panoramic', icon: '🔭' },
  { id: 'drone-aerial', label: 'Drone High-Altitude Cinematic', icon: '🚁' },
  { id: 'anamorphic-239', label: 'Anamorphic 2.39:1 Cinema Lens', icon: '🎬' },
];

const LIGHTING_PRESETS = [
  { id: 'rainy-wet-neon', label: 'Wet Asphalt & Rainy Night Glow', icon: '🌧️' },
  { id: 'golden-hour', label: 'Golden Hour Sunset Glow', icon: '🌅' },
  { id: 'studio-rim', label: 'Studio Precision Soft Rim Light', icon: '💡' },
  { id: 'cyberpunk-neon', label: 'Cyberpunk Neon Glow', icon: '🟣' },
  { id: 'dramatic-storm', label: 'Volumetric Storm & Moody Mist', icon: '⚡' },
];

const RATIOS = [
  { id: '16:9', label: '16:9 Landscape', icon: '▬' },
  { id: '1:1', label: '1:1 Square', icon: '■' },
  { id: '9:16', label: '9:16 Story/Reels', icon: '▮' },
  { id: '4:3', label: '4:3 Classic', icon: '▰' },
  { id: '21:9', label: '21:9 Cinematic', icon: '━' },
];

const INSPIRATION_PRESETS = [
  'BMW M4 Competition rolling on a rain-slicked highway at night, glowing neon reflections, dynamic panning shot, headlights cutting through mist, 8k',
  'Porsche 911 GT3 RS carving through mountain switchbacks at sunrise, wheel motion blur, crisp metallic paint',
  'Aggressive matte black supercar drifting on wet Tokyo streets under neon rain, water spray, motion blur',
  'A majestic Bengal tiger stalking through a sunlit misty rainforest with golden hour sunbeams',
  'Futuristic neon cyborg girl with glowing fiber-optic hair in Tokyo rain reflections',
  'Luxury glass architecture penthouse overlooking a futuristic Tokyo skyline at twilight',
  'Fluffy adorable baby snow leopard playing with glowing magical crystal in snow',
];

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [selectedLighting, setSelectedLighting] = useState('golden-hour');
  const [selectedCamera, setSelectedCamera] = useState('action-tracking');
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, deformed, extra fingers, watermark, bad anatomy, cartoonish, low resolution');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const [currentImage, setCurrentImage] = useState<GeneratedHistoryItem | null>(null);
  const [history, setHistory] = useState<GeneratedHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLightbox, setIsLightbox] = useState(false);

  // Auto-detect automotive or dynamic subject from prompt
  const isAutomotive = /(bmw|mercedes|audi|porsche|ferrari|lamborghini|car|vehicle|supercar|bike|motorcycle)/i.test(prompt);
  const isDynamicMotion = /(rolling|racing|highway|speed|motion|drifting|driving|track)/i.test(prompt);
  const isRainOrNight = /(rain|rainy|night|wet|dark|neon|midnight)/i.test(prompt);

  // Helper to sanitize prompt from conversational chatter and typos
  const cleanPromptText = (raw: string) => {
    return raw
      .replace(/^(please\s+)?(can\s+you\s+)?(make|create|generate|render|draw|build|paint|give\s+me|show\s+me)\s+(an?\s+)?(ai\s+)?(image|imge|pic|picture|photo|wallpaper|artwork|render)\s+(of|for|about)?\s+/i, '')
      .replace(/^(ai\s+)?(image|imge|picture|pic|photo|wallpaper)\s+(of|for|about)?\s+/i, '')
      .replace(/\bimge\b/gi, 'image')
      .replace(/\bpic\b/gi, 'picture')
      .replace(/\bnite\b/gi, 'night')
      .replace(/\bcarz\b/gi, 'cars')
      .replace(/\bgaari\b/gi, 'car')
      .trim();
  };

  // AI Magic Prompt Enhancer
  const handleEnhancePrompt = async () => {
    sounds.playClick();
    if (!prompt.trim()) {
      const randomPreset = INSPIRATION_PRESETS[Math.floor(Math.random() * INSPIRATION_PRESETS.length)];
      setPrompt(randomPreset);
      return;
    }

    setIsEnhancing(true);
    const cleaned = cleanPromptText(prompt);

    // Contextual camera/lighting for enhance
    let cameraToUse = selectedCamera;
    let lightingToUse = selectedLighting;
    if (isAutomotive && isDynamicMotion) {
      cameraToUse = '35mm action tracking rig, panning shutter with wheel motion blur';
    }
    if (isRainOrNight) {
      lightingToUse = 'wet asphalt reflections, streetlights and headlights glowing through dark rain';
    }

    try {
      const res = await fetch('/api/image/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleaned,
          style: selectedStyle,
          lighting: lightingToUse,
          camera: cameraToUse,
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        sounds.playReceive();
      }
    } catch (err) {
      console.error('Enhance prompt error:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Image
  const handleGenerate = async (overridePrompt?: string) => {
    const rawPromptToUse = (overridePrompt || prompt).trim();
    if (!rawPromptToUse) return;
    
    const promptToUse = cleanPromptText(rawPromptToUse);
    sounds.playClick();
    setIsGenerating(true);

    const effectiveRatio = (isAutomotive && selectedRatio === '1:1') ? '16:9' : selectedRatio;
    const effectiveCamera = (isAutomotive && isDynamicMotion) ? '35mm action tracking rig (rolling shot)' : selectedCamera;
    const effectiveLighting = isRainOrNight ? 'wet asphalt reflections & rainy night' : selectedLighting;

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          style: selectedStyle,
          aspectRatio: effectiveRatio,
          lighting: effectiveLighting,
          camera: effectiveCamera,
          negativePrompt: showAdvanced ? negativePrompt : undefined,
          engineModel: 'flux',
        }),
      });

      const data = await res.json();
      if (data && data.imageUrl) {
        const newItem: GeneratedHistoryItem = {
          id: 'img_' + Date.now(),
          url: data.imageUrl,
          prompt: data.prompt || promptToUse,
          originalPrompt: rawPromptToUse,
          style: selectedStyle,
          engine: data.engine || 'Bexus Neural Flux.1 Realism Ultra 8K',
          timestamp: Date.now(),
        };

        setCurrentImage(newItem);
        setHistory(prev => [newItem, ...prev.filter(h => h.url !== newItem.url)]);
        sounds.playReceive();
      } else {
        let width = 1024;
        if (effectiveRatio === '16:9') width = 1280;
        else if (effectiveRatio === '21:9') width = 1344;

        const directUrl = getClientDirectImageUrl(rawPromptToUse, width);
        const newItem: GeneratedHistoryItem = {
          id: 'img_' + Date.now(),
          url: directUrl,
          prompt: promptToUse,
          originalPrompt: rawPromptToUse,
          style: selectedStyle,
          engine: 'Bexus Neural Realism Ultra 8K',
          timestamp: Date.now(),
        };
        setCurrentImage(newItem);
        setHistory(prev => [newItem, ...prev.filter(h => h.url !== newItem.url)]);
        sounds.playReceive();
      }
    } catch (err) {
      console.warn('Image generation client fallback activated:', err);
      let width = 1024;
      if (effectiveRatio === '16:9') width = 1280;
      else if (effectiveRatio === '21:9') width = 1344;

      const directUrl = getClientDirectImageUrl(rawPromptToUse, width);
      const newItem: GeneratedHistoryItem = {
        id: 'img_' + Date.now(),
        url: directUrl,
        prompt: promptToUse,
        originalPrompt: rawPromptToUse,
        style: selectedStyle,
        engine: 'Bexus Neural Realism Ultra 8K',
        timestamp: Date.now(),
      };
      setCurrentImage(newItem);
      setHistory(prev => [newItem, ...prev.filter(h => h.url !== newItem.url)]);
      sounds.playReceive();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!currentImage) return;
    sounds.playClick();
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentImage.url);
        success = true;
      }
    } catch {
      // Fallback
    }
    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = currentImage.url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // Ignored
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertChat = () => {
    if (!currentImage) return;
    sounds.playSend();
    onSendToChat(currentImage.url, currentImage.originalPrompt || currentImage.prompt);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl max-h-[86vh] flex flex-col bg-[#0c0919]/98 border border-pink-500/30 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(236,72,153,0.18)] overflow-hidden z-10"
          >
            {/* Top Pink Shimmer Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/25 to-purple-500/25 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Bexus AI Image Studio</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-mono font-bold tracking-wide">
                      Ultra HD 8K
                    </span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-neutral-400">
                    High-definition neural diffusion, camera optic presets & AI prompt expansion
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Controls Column (Left) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Prompt Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>Prompt Idea</span>
                    </label>
                    
                    {/* Magic AI Prompt Enhancer */}
                    <button
                      type="button"
                      disabled={isEnhancing || isGenerating}
                      onClick={handleEnhancePrompt}
                      className="text-[11px] font-medium text-pink-300 hover:text-pink-200 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 hover:bg-pink-500/25 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Wand2 className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} />
                      <span>{isEnhancing ? 'Optimizing with AI...' : '✨ Magic AI Enhance'}</span>
                    </button>
                  </div>

                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Apna concept likhein (e.g., 'A majestic white tiger with blue eyes in snowy mountains', ya Roman Urdu mein: 'aik sher jungle me')..."
                    rows={3}
                    className="w-full p-3 bg-zinc-900/90 border border-white/[0.1] rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 resize-none transition-all leading-relaxed"
                  />
                  
                  {/* Quick Inspiration Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-1.5 no-scrollbar">
                    <span className="text-[10px] text-zinc-500 font-medium shrink-0 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" /> Ideas:
                    </span>
                    {INSPIRATION_PRESETS.slice(0, 4).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setPrompt(item);
                          if (item.toLowerCase().includes('bmw') || item.toLowerCase().includes('porsche') || item.toLowerCase().includes('supercar')) {
                            setSelectedRatio('16:9');
                            setSelectedCamera('action-tracking');
                            if (item.toLowerCase().includes('rain') || item.toLowerCase().includes('night')) {
                              setSelectedLighting('rainy-wet-neon');
                            }
                          }
                        }}
                        className="text-[10px] text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-white/[0.06] hover:bg-zinc-700 whitespace-nowrap transition-colors cursor-pointer"
                      >
                        {item.slice(0, 32)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Automotive Action Auto-detection Badge */}
                {isAutomotive && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500/15 to-pink-500/15 border border-orange-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-orange-300">
                      <Flame className="w-4 h-4 text-orange-400 shrink-0 animate-pulse" />
                      <span className="font-semibold text-[11px]">Automotive Rolling Mode Active</span>
                      <span className="text-[10px] text-zinc-400 hidden sm:inline">• Pacing chase rig & wheel motion blur applied</span>
                    </div>
                    <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-500/30 font-mono">
                      16:9 Widescreen
                    </span>
                  </div>
                )}



                {/* Permanent Ultra 8K Masterpiece Engine Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-indigo-500/15 border border-pink-500/30 flex items-center justify-between shadow-lg shadow-pink-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 shrink-0 shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>Engine: FLUX.1 Realism Ultra 8K</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 border border-pink-500/40 font-mono font-bold tracking-wider">
                          ACTIVE • 8K FLUX
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Dynamic vehicle action, radial motion blur, wet tarmac reflections & cinematic color grading (Watermark-free).
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" /> 100% Watermark Free
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-200 mb-1">
                    Canvas Dimensions (Aspect Ratio)
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {RATIOS.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setSelectedRatio(r.id);
                        }}
                        className={`py-1.5 px-1 rounded-xl text-[10px] font-medium border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          selectedRatio === r.id
                            ? 'bg-pink-500/20 border-pink-500/50 text-pink-200 shadow-sm'
                            : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-[11px]">{r.icon}</span>
                        <span className="font-mono text-[9.5px]">{r.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer py-1"
                  >
                    <ShieldAlert className="w-3 h-3 text-zinc-500" />
                    <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Negative Prompt & Fine-Tuning'}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-2 p-3 bg-zinc-950/60 border border-white/[0.06] rounded-xl space-y-2">
                      <label className="text-[11px] font-medium text-zinc-400 block">
                        Negative Prompt (Things to exclude):
                      </label>
                      <input
                        type="text"
                        value={negativePrompt}
                        onChange={e => setNegativePrompt(e.target.value)}
                        placeholder="e.g. blurry, low resolution, bad hands, distorted"
                        className="w-full p-2 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-pink-500/40"
                      />
                    </div>
                  )}
                </div>

                {/* Generate Master Button */}
                <button
                  type="button"
                  disabled={isGenerating || !prompt.trim()}
                  onClick={() => handleGenerate()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-pink-500/20"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing Ultra HD Artwork...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Masterpiece</span>
                    </>
                  )}
                </button>
              </div>

              {/* Image Preview & Output Column (Right) */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                {/* Main Viewport */}
                <div className="flex-1 flex flex-col items-center justify-center p-3 bg-[#0a0b0e] border border-white/[0.08] rounded-2xl relative min-h-[300px] overflow-hidden group">
                  {isGenerating ? (
                    <div className="flex flex-col items-center text-center space-y-3 p-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 animate-pulse blur-md opacity-60" />
                        <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-zinc-900 border border-pink-500/40 flex items-center justify-center text-pink-400">
                          <Wand2 className="w-8 h-8 animate-spin" />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-zinc-100">Rendering Diffusion Neural Pass...</div>
                        <div className="text-[11px] text-pink-400 font-mono mt-0.5">8K Upscaling • Raymarching • Volumetric Shader</div>
                      </div>
                    </div>
                  ) : currentImage ? (
                    <div className="w-full flex flex-col items-center space-y-3">
                      <div className="relative w-full">
                        {/* Ambient Backlight Glow */}
                        <div 
                          className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-pink-600/30 via-purple-600/30 to-indigo-600/30 opacity-75 blur-xl pointer-events-none"
                        />
                        <div 
                          onClick={() => setIsLightbox(true)}
                          className="relative w-full rounded-2xl overflow-hidden border border-pink-500/40 group/img shadow-2xl bg-black/80 flex items-center justify-center max-h-[360px] cursor-zoom-in"
                        >
                          <img
                            src={currentImage.url}
                            alt={currentImage.prompt}
                            referrerPolicy="no-referrer"
                            className="w-full h-auto max-h-[360px] object-contain rounded-2xl transition-transform duration-500 group-hover/img:scale-[1.02]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3.5 pointer-events-none">
                            <div className="text-[11px] text-white/90 line-clamp-2 font-medium">
                              {currentImage.prompt}
                            </div>
                          </div>

                          <div className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Info Badge */}
                      <div className="w-full flex items-center justify-between text-[11px] text-zinc-400 px-1">
                        <span className="flex items-center gap-1 text-pink-400 font-mono">
                          <Layers className="w-3 h-3" />
                          <span>{currentImage.engine}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleGenerate()}
                          className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Re-roll Seed</span>
                        </button>
                      </div>

                      {/* Action Toolbar */}
                      <div className="flex items-center gap-2 w-full pt-1">
                        <button
                          onClick={handleInsertChat}
                          className="flex-1 py-2 px-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send to Chat</span>
                        </button>
                        <button
                          onClick={handleCopyLink}
                          className="p-2.5 rounded-xl bg-zinc-800/90 border border-white/[0.08] hover:bg-zinc-700 text-zinc-200 text-xs transition-colors cursor-pointer"
                          title="Copy Direct Image Link"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a
                          href={currentImage.url}
                          target="_blank"
                          rel="noreferrer"
                          download={`bexus-art-${Date.now()}.png`}
                          className="p-2.5 rounded-xl bg-zinc-800/90 border border-white/[0.08] hover:bg-zinc-700 text-zinc-200 text-xs transition-colors cursor-pointer"
                          title="Download Image"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-zinc-500 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mx-auto text-zinc-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-medium text-zinc-400">Ready to create visuals</div>
                      <p className="text-[11px] text-zinc-600 max-w-xs">
                        Enter your concept and click &quot;Generate Masterpiece&quot; to render photo-quality art.
                      </p>
                    </div>
                  )}
                </div>

                {/* Session Gallery Strip */}
                {history.length > 0 && (
                  <div className="p-2.5 bg-zinc-950/80 border border-white/[0.06] rounded-xl">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <History className="w-3 h-3" />
                        <span>Session Gallery ({history.length})</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {history.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setCurrentImage(item);
                          }}
                          className={`relative w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                            currentImage?.id === item.id
                              ? 'border-pink-500 ring-2 ring-pink-500/30 scale-105'
                              : 'border-white/[0.1] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.prompt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Fullscreen Lightbox Modal */}
          {isLightbox && currentImage && (
            <div 
              onClick={() => setIsLightbox(false)}
              className="fixed inset-0 z-60 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 cursor-zoom-out"
            >
              <button 
                onClick={() => setIsLightbox(false)}
                className="absolute top-4 right-4 p-3 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={currentImage.url}
                alt={currentImage.prompt}
                referrerPolicy="no-referrer"
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
