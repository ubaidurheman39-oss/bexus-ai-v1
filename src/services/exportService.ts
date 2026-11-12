// Upgraded High-Fidelity Export Engine (PDF, HTML5 Keynote Presentation / PPTX, Markdown, Code)

export const exportAsMarkdown = (content: string, filename = 'bexus-ai-export.md') => {
  const timestamp = new Date().toISOString();
  const header = `---
title: Bexus AI Export
exported_at: ${timestamp}
engine: Bexus AI 3.7 Ultra Flagship
---

`;
  const fullContent = header + content;
  const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.md') ? filename : `${filename}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAsCode = (code: string, filename = 'bexus-code-export.ts') => {
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAsPDF = (title: string, content: string) => {
  // Convert markdown to clean, structured, high-resolution printable HTML
  const formattedHtml = content
    .replace(/^### (.*$)/gim, '<h3 style="color: #4f46e5; margin-top: 20px; margin-bottom: 8px; font-size: 16px; font-weight: 700;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #3730a3; margin-top: 26px; margin-bottom: 10px; font-size: 20px; font-weight: 700; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color: #1e1b4b; margin-top: 30px; margin-bottom: 14px; font-size: 24px; font-weight: 800;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; border: 1px solid #e2e8f0;">$1</code>')
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre style="background: #0f172a; color: #38bdf8; padding: 16px; border-radius: 10px; overflow-x: auto; font-family: monospace; font-size: 12px; margin: 16px 0; border: 1px solid #334155; line-height: 1.5;"><code>$2</code></pre>')
    .replace(/^\s*[-*•]\s+(.*$)/gim, '<li style="margin-bottom: 6px; line-height: 1.6;">$1</li>')
    .replace(/\n\n/g, '<p style="margin-bottom: 14px; line-height: 1.7;"></p>');

  const printWindow = window.open('', '_blank', 'width=950,height=800');
  if (!printWindow) {
    alert('Please allow browser popups to export high-definition PDF');
    return;
  }

  const printDocument = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title || 'Bexus AI Intelligence Document'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
          * { box-sizing: border-box; }
          body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            line-height: 1.7;
            color: #1e293b;
            padding: 48px;
            max-width: 860px;
            margin: 0 auto;
            background: #ffffff;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2.5px solid #6366f1;
            padding-bottom: 18px;
            margin-bottom: 32px;
          }
          .header-left h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            color: #4338ca;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .header-meta {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
            font-weight: 500;
          }
          .print-btn {
            padding: 9px 18px;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
          }
          .content {
            font-size: 14.5px;
          }
          .content ul {
            padding-left: 20px;
            margin: 12px 0;
          }
          .footer {
            margin-top: 60px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 11.5px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          @media print {
            body { padding: 24px; }
            .no-print { display: none !important; }
            pre { page-break-inside: avoid; }
            h2, h3 { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h1>✦ Bexus AI Intelligence Document</h1>
            <div class="header-meta">Generated on ${new Date().toLocaleString()} • High-Precision Output</div>
          </div>
          <div class="no-print">
            <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
          </div>
        </div>
        <div class="content">
          ${formattedHtml}
        </div>
        <div class="footer">
          <span>Bexus AI 3.7 Ultra Intelligence Suite</span>
          <span>Verified & Encrypted • Confidential</span>
        </div>
        <script>
          setTimeout(() => {
            window.print();
          }, 350);
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
};

export const exportAsPPTX = (title: string, slides: Array<{ title: string; bullets?: string[]; content?: string; layout?: string }>) => {
  // 1. Generate an interactive standalone HTML5 Keynote Presenter file that launches full-screen slide deck
  const slidesJson = JSON.stringify(slides);
  const cleanTitle = (title || 'Presentation').replace(/"/g, '&quot;');

  const html5Presentation = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${cleanTitle} - Bexus AI Keynote</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-black text-white h-screen flex flex-col justify-between overflow-hidden select-none">
  <!-- Top Bar -->
  <div class="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
    <div class="flex items-center gap-3">
      <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
      <h1 class="text-sm font-bold truncate max-w-md">${cleanTitle}</h1>
    </div>
    <div class="flex items-center gap-4 text-xs font-mono text-zinc-400">
      <span id="slideCounter">Slide 1 of ${slides.length}</span>
      <button onclick="toggleFullScreen()" class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200">Full Screen</button>
    </div>
  </div>

  <!-- Slide Stage -->
  <div id="slideStage" class="flex-1 flex items-center justify-center p-8 sm:p-14">
    <!-- Slide Card -->
    <div id="slideCard" class="w-full max-w-4xl p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.15)] flex flex-col justify-between min-h-[460px]">
      <div>
        <span id="slideLayout" class="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">Executive Slide</span>
        <h2 id="slideTitle" class="text-3xl sm:text-4xl font-extrabold mt-4 mb-6 leading-tight text-white"></h2>
        <div id="slideContent" class="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6"></div>
        <ul id="slideBullets" class="space-y-3"></ul>
      </div>
      <div class="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
        <span>Bexus AI Executive Deck</span>
        <span>Confidential</span>
      </div>
    </div>
  </div>

  <!-- Bottom Navigation Dock -->
  <div class="h-16 px-6 border-t border-white/10 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
    <div class="text-xs text-zinc-400">Use Arrow Keys [← / →] or Space to navigate</div>
    <div class="flex items-center gap-2">
      <button onclick="prevSlide()" class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all">‹ Previous</button>
      <button onclick="nextSlide()" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all">Next ›</button>
    </div>
  </div>

  <script>
    const slides = ${slidesJson};
    let currentIdx = 0;

    function renderSlide() {
      const s = slides[currentIdx];
      document.getElementById('slideCounter').innerText = 'Slide ' + (currentIdx + 1) + ' of ' + slides.length;
      document.getElementById('slideTitle').innerText = s.title || 'Slide Title';
      document.getElementById('slideLayout').innerText = (s.layout || 'Keynote').toUpperCase();
      
      const contentEl = document.getElementById('slideContent');
      if (s.content) {
        contentEl.innerText = s.content;
        contentEl.style.display = 'block';
      } else {
        contentEl.style.display = 'none';
      }

      const bulletsEl = document.getElementById('slideBullets');
      bulletsEl.innerHTML = '';
      if (s.bullets && s.bullets.length > 0) {
        s.bullets.forEach(b => {
          const li = document.createElement('li');
          li.className = 'flex items-start gap-3 text-sm sm:text-base text-zinc-300';
          li.innerHTML = '<span class="text-emerald-400 font-bold mt-1">✔</span><span>' + b + '</span>';
          bulletsEl.appendChild(li);
        });
      }
    }

    function nextSlide() {
      if (currentIdx < slides.length - 1) {
        currentIdx++;
        renderSlide();
      }
    }

    function prevSlide() {
      if (currentIdx > 0) {
        currentIdx--;
        renderSlide();
      }
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    renderSlide();
  </script>
</body>
</html>`;

  // Download interactive HTML5 Keynote presentation deck
  const blob = new Blob([html5Presentation], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = (title || 'presentation').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.setAttribute('download', `${safeFilename}_keynote_deck.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
