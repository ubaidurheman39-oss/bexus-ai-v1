import React, { useState } from 'react';
import { 
  Play, 
  Code2, 
  ExternalLink, 
  Copy, 
  Check, 
  RotateCw, 
  Smartphone, 
  Tablet,
  Monitor, 
  Download,
  Sparkles,
  Maximize2,
  Minimize2,
  Share2,
  Zap,
  Globe
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface InteractiveAppCardProps {
  title: string;
  code: string;
  language?: string;
  onOpenStudio: () => void;
}

const getEnhancedCardHtml = (rawHtml: string): string => {
  if (!rawHtml) return '';
  const toastScript = `
<script>
window.alert = function(msg) {
  let box = document.getElementById('bexusToastBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'bexusToastBox';
    box.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:8px;pointer-events:none;font-family:Plus Jakarta Sans,sans-serif;';
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.style.cssText = 'padding:10px 16px;border-radius:14px;background:rgba(15,13,24,0.96);border:1px solid rgba(168,85,247,0.45);box-shadow:0 12px 30px rgba(0,0,0,0.7),0 0 15px rgba(168,85,247,0.25);color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px;pointer-events:auto;transition:all 0.3s;opacity:0;transform:translateY(12px);';
  t.innerHTML = '<span>⚡</span><span>' + msg + '</span>';
  box.appendChild(t);
  setTimeout(function() { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; }, 10);
  setTimeout(function() { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(function(){ t.remove(); }, 300); }, 3500);
};
</script>
`;
  if (rawHtml.includes('<head>')) {
    return rawHtml.replace('<head>', '<head>' + toastScript);
  }
  return toastScript + rawHtml;
};

export const InteractiveAppCard: React.FC<InteractiveAppCardProps> = ({
  title,
  code,
  language = 'html',
  onOpenStudio,
}) => {
  const isHtml = language === 'html' || code.includes('<!DOCTYPE') || code.includes('<html');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>(isHtml ? 'preview' : 'code');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    sounds.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sounds.playClick();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    sounds.playClick();
    setReloadKey(k => k + 1);
  };

  const handlePublish = async () => {
    try {
      sounds.playClick();
      setIsPublishing(true);
      const res = await fetch('/api/app/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          html: code
        })
      });
      const data = await res.json();
      if (data.url) {
        setPublishedUrl(data.url);
        navigator.clipboard.writeText(data.url);
        sounds.playReceive();
      }
    } catch (e) {
      console.warn('Publish failed:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <div className="mt-3.5 rounded-2xl bg-[#0d0c16]/95 border border-purple-500/40 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.15)] transition-all">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/[0.08]">
          {/* Title and Badges */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.45)]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">{title}</h4>
              <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Client Engine
                </span>
                <span>•</span>
                <span className="font-mono text-purple-300">60 FPS Ultra</span>
              </div>
            </div>
          </div>

          {/* View Switchers & Studio Actions */}
          <div className="flex items-center gap-1.5">
            {/* Tab Selector */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/[0.08]">
              {isHtml && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('preview');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Preview</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('code');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Code</span>
              </button>
            </div>

            {/* Fullscreen Expand Action */}
            {isHtml && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsFullscreen(true);
                }}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                title="Open in Fullscreen Focus Mode"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Open Studio Action Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenStudio();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-[0_0_18px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
              title="Open in Fullscreen IDE App Studio"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in App Studio</span>
              <span className="sm:hidden">Studio</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === 'preview' && isHtml ? (
          <div className="relative bg-[#08080f]">
            {/* Controls Bar for Live View */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/50 border-b border-white/[0.06] text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/[0.08] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Reload live application sandbox"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Reload</span>
                </button>
                <span className="text-neutral-600">•</span>
                
                {/* Viewport Toggles: Desktop, Tablet, Mobile */}
                <div className="flex items-center p-0.5 rounded-lg bg-white/[0.05] border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setDeviceView('desktop')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1 transition-colors ${
                      deviceView === 'desktop' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                    title="Desktop 100% responsive width"
                  >
                    <Monitor className="w-3 h-3" />
                    <span className="hidden xs:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceView('tablet')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1 transition-colors ${
                      deviceView === 'tablet' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                    title="Tablet 768px width"
                  >
                    <Tablet className="w-3 h-3" />
                    <span className="hidden xs:inline">Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceView('mobile')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-medium flex items-center gap-1 transition-colors ${
                      deviceView === 'mobile' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                    title="Mobile 375px iPhone width"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span className="hidden xs:inline">Mobile</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Publish to Web Button */}
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/[0.06] hover:bg-purple-600/30 text-neutral-300 hover:text-purple-200 border border-white/[0.08] transition-colors cursor-pointer"
                  title="Generate public live shareable URL"
                >
                  <Globe className="w-3 h-3 text-purple-400" />
                  <span>{isPublishing ? 'Publishing...' : publishedUrl ? 'Copied URL!' : 'Share Live URL'}</span>
                </button>

                {/* Export HTML */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/[0.08] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Download standalone HTML file"
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Export HTML</span>
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div className="w-full flex justify-center bg-[#06060c] p-1.5 sm:p-3 overflow-hidden">
              <div 
                className={`transition-all duration-300 rounded-xl overflow-hidden border border-white/[0.1] shadow-2xl bg-white ${
                  deviceView === 'mobile' 
                    ? 'w-[375px] h-[540px] max-w-full' 
                    : deviceView === 'tablet'
                    ? 'w-[768px] h-[520px] max-w-full'
                    : 'w-full h-[500px]'
                }`}
              >
                <iframe
                  key={reloadKey}
                  title={title}
                  srcDoc={getEnhancedCardHtml(code)}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-[#070710]">
            {/* Code Header Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-black/50 border-b border-white/[0.05] text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-purple-400 font-bold">{language.toUpperCase()}</span>
                <span>•</span>
                <span className="font-mono">{(code.length / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">100% Self-Contained</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-4 text-xs text-purple-200/90 font-mono overflow-x-auto max-h-[480px] leading-relaxed select-text">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Fullscreen Immersion Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#0d0c17]/95">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">Fullscreen Live Sandbox</span>
                </h3>
                <p className="text-[11px] text-neutral-400">Interactive Web Application Preview</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reload</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsFullscreen(false);
                  onOpenStudio();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Open in App Studio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsFullscreen(false);
                }}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 cursor-pointer transition-colors"
                title="Exit Fullscreen (ESC)"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fullscreen Iframe Viewport */}
          <div className="flex-1 w-full bg-[#05050a] p-2 sm:p-4">
            <iframe
              key={`fs_${reloadKey}`}
              title={`${title} Fullscreen`}
              srcDoc={getEnhancedCardHtml(code)}
              className="w-full h-full rounded-2xl border border-white/10 shadow-2xl bg-white"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            />
          </div>
        </div>
      )}
    </>
  );
};
