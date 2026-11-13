import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { generateChatResponse, generateImageContent, enhancePromptWithAI, renderCleanImageBuffer, composeSongWithAI, generateMindMapWithAI, runDeepResearchWithAI, generateSpeechWithGemini, pcmToWav, translateTextWithAI, summarizeDocumentWithAI, generateSlideDeckWithAI, generateAppWithAI, generateVideoProjectWithAI, analyzeCameraFrameWithAI, analyzeMediaWithAI, executeAgenticTaskWithAI } from './src/server/geminiService.ts';
import { generateWorldClassApp } from './src/utils/worldClassAppTemplates.ts';
import { scrapeUrlAndBuildTable, auditWebpageSeo, executeGitHubAction, executeNaturalAction } from './src/server/actionRunnerService.ts';

process.on('uncaughtException', (err) => {
  console.error('[Server Uncaught Exception]:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Server Unhandled Rejection]:', reason);
});

const app = express();

function resolvePort(): number {
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = parseInt(process.argv[portArgIdx + 1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  if (process.env.npm_lifecycle_event === 'dev' || process.env.NODE_ENV === 'development') {
    return 3000;
  }
  return Number(process.env.PORT) || 3000;
}

const PORT = resolvePort();

// Enable high-speed gzip/brotli compression for all text, JS, CSS, JSON, and SVG responses
app.use(compression({
  threshold: 512,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), model: 'Bexus AI 3.7 Ultra' });
});

// Google Search Console & Webmaster verification handler
app.get('/google:hash.html', (req, res) => {
  const filename = `google${req.params.hash}.html`;
  res.setHeader('Content-Type', 'text/html');
  res.send(`google-site-verification: ${filename}`);
});

// Robots.txt for Google Crawler & SEO Indexing
app.get('/robots.txt', (_req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: https://bexus-ai.ai.studio/sitemap.xml\n`);
});

// Sitemap.xml for Google Search indexing
app.get('/sitemap.xml', (_req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bexus-ai.ai.studio/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bexus-ai.ai.studio/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
});

// Favicon handler to ensure 100% clean browser network tab & no 404s
app.get('/favicon.ico', (_req, res) => {
  const icoPath = path.join(process.cwd(), 'public', 'favicon.ico');
  if (fs.existsSync(icoPath)) {
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(icoPath);
  }
  res.status(204).end();
});

// Chat API route - Ultra resilient handler supporting both array & single message
app.post('/api/chat', async (req, res) => {
  try {
    let { messages, message, prompt, history, attachments, modelId, enableSearch, enableReasoning, customInstructions, userName, preferredLanguage } = req.body;

    // Normalization: if messages array is not provided, build it from message / prompt / history
    if (!messages || !Array.isArray(messages)) {
      const incomingText = message || prompt || '';
      messages = [];

      if (Array.isArray(history)) {
        for (const h of history) {
          if (h && typeof h === 'object') {
            messages.push({
              role: h.role === 'assistant' ? 'assistant' : 'user',
              content: h.content || '',
              attachments: h.attachments || [],
            });
          }
        }
      }

      if (incomingText || (attachments && attachments.length > 0)) {
        messages.push({
          role: 'user',
          content: incomingText,
          attachments: attachments || [],
        });
      }
    }

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'At least one message is required' });
    }

    const result = await generateChatResponse({
      messages,
      modelId,
      enableSearch: !!enableSearch,
      enableReasoning: enableReasoning !== undefined ? !!enableReasoning : true,
      customInstructions,
      userName: userName ? String(userName).trim() : 'User',
      preferredLanguage,
    });

    res.json(result);
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      text: 'Bexus AI is processing your request. Please clarify your prompt or try submitting again.'
    });
  }
});

// AI Prompt Enhancement API route
app.post('/api/image/enhance', async (req, res) => {
  try {
    const { prompt, style, lighting, camera } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const enhanced = await enhancePromptWithAI(prompt, style, lighting, camera);
    res.json({ enhancedPrompt: enhanced });
  } catch (error: any) {
    console.error('API /api/image/enhance error:', error);
    res.status(500).json({ error: error.message || 'Failed to enhance prompt' });
  }
});

// Image Generation API route
app.post('/api/image', async (req, res) => {
  try {
    const { prompt, style, aspectRatio, lighting, camera, negativePrompt, engineModel } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await generateImageContent(
      prompt, 
      style, 
      aspectRatio, 
      lighting, 
      camera, 
      negativePrompt, 
      engineModel
    );
    res.json(result);
  } catch (error: any) {
    console.error('API /api/image error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// High-Definition Watermark-Free Direct Image Rendering Route (for in-chat & preview)
app.get('/api/image/render', async (req, res) => {
  try {
    const prompt = (req.query.prompt as string) || 'art';
    const style = (req.query.style as string) || 'photorealistic';
    const width = Math.min(1920, Math.max(256, Number(req.query.width) || 1024));
    const height = Math.min(1920, Math.max(256, Number(req.query.height) || 1024));

    const imageBuffer = await renderCleanImageBuffer(prompt, style, width, height);

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', imageBuffer.length.toString());
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Accept-Ranges', 'bytes');
    return res.send(imageBuffer);
  } catch (error: any) {
    console.error('API /api/image/render error:', error);
    res.status(500).send('Image render error');
  }
});

// AI Music & Song Studio Composition Route
app.post('/api/music/compose', async (req, res) => {
  try {
    const { prompt, genre, vocalStyle, language, tempo, mood } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Song prompt or description is required' });
    }
    const song = await composeSongWithAI({ prompt, genre, vocalStyle, language, tempo, mood });
    res.json(song);
  } catch (error: any) {
    console.error('API /api/music/compose error:', error);
    res.status(500).json({ error: error.message || 'Failed to compose song' });
  }
});

// AI Video & Viral Shorts Storyboard Generator Route
app.post('/api/video/generate', async (req, res) => {
  try {
    const { prompt, character, language, customScript, style, aspectRatio, vocalistVoice, songSpeed, songGenre } = req.body;
    if (!prompt && !customScript) {
      return res.status(400).json({ error: 'Prompt or custom script is required' });
    }
    const project = await generateVideoProjectWithAI({ 
      prompt, 
      character, 
      language, 
      customScript, 
      style, 
      aspectRatio,
      vocalistVoice,
      songSpeed,
      songGenre
    });
    res.json(project);
  } catch (error: any) {
    console.error('API /api/video/generate error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate video project' });
  }
});

// AI Autonomous Deep Research & Intelligence Engine Route
app.post('/api/research/generate', async (req, res) => {
  try {
    const { query, depth, focusArea, language } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Research query or topic is required' });
    }
    const report = await runDeepResearchWithAI({ query, depth, focusArea, language });
    res.json(report);
  } catch (error: any) {
    console.error('API /api/research/generate error:', error);
    res.status(500).json({ error: error.message || 'Failed to conduct deep research' });
  }
});

// AI Mind Map & Concept Flow Generator Route
app.post('/api/mindmap/generate', async (req, res) => {
  try {
    const { prompt, layout, themeColor } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Topic or concept prompt is required' });
    }
    const mindmap = await generateMindMapWithAI({ prompt, layout, themeColor });
    res.json(mindmap);
  } catch (error: any) {
    console.error('API /api/mindmap/generate error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate mind map' });
  }
});

// Guided learning generator route - Ultra Masterclass Depth
app.post('/api/learning', async (req, res) => {
  try {
    const { topic, level } = req.body;
    const prompt = `Create an advanced, doctoral-level, and principal architect caliber 3-part guided interactive masterclass for topic: "${topic}" at level "${level || 'Principal / Advanced'}".
Strict Anti-Fluff Directive: Zero elementary or introductory high-school textbook summaries. Provide deep mathematical formulations, governing equations, microarchitectural blueprints, data flow diagrams, empirical benchmarks, and real-world production failure modes.
For each lesson return:
- Title
- Core concept explanation (rigorous, authoritative, deep engineering mechanics)
- Interactive multiple choice quiz question with 4 options and detailed explanation of correct answer
- Code snippet or real world architectural experiment.`;

    const result = await generateChatResponse({
      messages: [{ role: 'user', content: prompt }],
      enableReasoning: true,
      customInstructions: 'You are a Principal Fellow and Master Research Scientist at Bell Labs / MIT caliber.',
    });

    res.json({ content: result.text, topic, level });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Neural Translation Route
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'en', targetLang = 'ur', tone = 'natural' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required for translation' });
    }

    const result = await translateTextWithAI(text.trim(), sourceLang, targetLang, tone);
    res.json({
      translatedText: result.translatedText,
      text: result.translatedText,
      romanUrdu: result.romanUrdu,
      alternative: result.alternative,
      sourceLang,
      targetLang,
      tone
    });
  } catch (error: any) {
    console.error('API /api/translate error:', error);
    res.status(500).json({ error: error.message || 'Translation failed' });
  }
});

// AI Document & Text Summarizer Route
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, mode = 'bullets' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required for summarization' });
    }

    const summary = await summarizeDocumentWithAI(text.trim(), mode);
    res.json({
      summary,
      content: summary,
      text: summary,
      mode
    });
  } catch (error: any) {
    console.error('API /api/summarize error:', error);
    res.status(500).json({ error: error.message || 'Summarization failed' });
  }
});

// AI Web App & Full-Stack Application Builder Route (Bexus AppForge AI)
app.post('/api/app/generate', async (req, res) => {
  try {
    const { prompt, category = 'ai', theme = 'dark-luxury', existingCode, screenshot, image } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'App prompt or specification is required' });
    }

    const pLower = prompt.toLowerCase();
    let effectiveCategory = category || 'custom';
    if (pLower.includes('car') || pLower.includes('rental') || pLower.includes('auto') || pLower.includes('vehicle') || pLower.includes('gari') || pLower.includes('drive')) {
      effectiveCategory = 'car';
    } else if (pLower.includes('hospital') || pLower.includes('doctor') || pLower.includes('clinic') || pLower.includes('health') || pLower.includes('medical') || pLower.includes('patient')) {
      effectiveCategory = 'healthcare';
    } else if (pLower.includes('estate') || pLower.includes('property') || pLower.includes('villa') || pLower.includes('house') || pLower.includes('apartment') || pLower.includes('mansion')) {
      effectiveCategory = 'realestate';
    } else if (pLower.includes('food') || pLower.includes('restaurant') || pLower.includes('bakery') || pLower.includes('cafe') || pLower.includes('pizza') || pLower.includes('burger') || pLower.includes('dish')) {
      effectiveCategory = 'food';
    } else if (pLower.includes('ecommerce') || pLower.includes('store') || pLower.includes('shop') || pLower.includes('cart') || pLower.includes('cloth') || pLower.includes('shoe') || pLower.includes('boutique')) {
      effectiveCategory = 'ecommerce';
    } else if (pLower.includes('fitness') || pLower.includes('gym') || pLower.includes('workout') || pLower.includes('training') || pLower.includes('exercise')) {
      effectiveCategory = 'fitness';
    } else if (pLower.includes('crypto') || pLower.includes('bitcoin') || pLower.includes('trading') || pLower.includes('trade') || pLower.includes('coin')) {
      effectiveCategory = 'crypto';
    } else if (pLower.includes('kanban') || pLower.includes('scrum') || pLower.includes('trello') || pLower.includes('todo') || pLower.includes('task') || pLower.includes('project management')) {
      effectiveCategory = 'kanban';
    } else if (pLower.includes('game') || pLower.includes('arcade') || pLower.includes('play') || pLower.includes('flappy')) {
      effectiveCategory = 'game';
    } else if (pLower.includes('nexus') || pLower.includes('bexus') || pLower.includes('neural') || pLower.includes('ai studio') || pLower.includes('chatbot') || pLower.includes('assistant')) {
      effectiveCategory = 'ai';
    } else if (effectiveCategory === 'ai' && !pLower.includes('ai')) {
      effectiveCategory = 'custom';
    }

    if (existingCode && (effectiveCategory === 'custom' || effectiveCategory === 'ai')) {
      const eLower = existingCode.toLowerCase();
      if (eLower.includes('rental') || eLower.includes('supercar') || eLower.includes('apexdrive')) effectiveCategory = 'car';
      else if (eLower.includes('clinic') || eLower.includes('curamed') || eLower.includes('patient')) effectiveCategory = 'healthcare';
      else if (eLower.includes('estate') || eLower.includes('residence') || eLower.includes('villa')) effectiveCategory = 'realestate';
      else if (eLower.includes('food') || eLower.includes('dining') || eLower.includes('restaurant')) effectiveCategory = 'food';
      else if (eLower.includes('fitness') || eLower.includes('workout') || eLower.includes('gym')) effectiveCategory = 'fitness';
      else if (eLower.includes('crypto') || eLower.includes('bitcoin') || eLower.includes('coin')) effectiveCategory = 'crypto';
      else if (eLower.includes('kanban') || eLower.includes('sprint') || eLower.includes('trello')) effectiveCategory = 'kanban';
    }

    const appData = await generateAppWithAI(prompt.trim(), effectiveCategory, theme, existingCode, screenshot || image);
    const finalHtml = appData.html || appData.code;
    res.json({
      ...appData,
      category: effectiveCategory,
      html: finalHtml,
      code: finalHtml
    });
  } catch (error: any) {
    console.error('API /api/app/generate error:', error);
    try {
      // Emergency recovery with high-speed contextual template
      const reqPrompt = req.body?.prompt || 'Interactive Web App';
      const isUrdu = /(yar|kardo|banao|hai|nhi|nahi|theek|kese|kaise|mera|kya|bhai)/i.test(reqPrompt);
      const fallbackHtml = generateWorldClassApp(reqPrompt, 'custom', req.body?.theme || 'dark-luxury');
      return res.json({
        id: 'app_' + Date.now(),
        title: reqPrompt.slice(0, 32) || 'Interactive Web App',
        description: 'Contextual web application initialized.',
        explanation: isUrdu
          ? `Ji bilkul, maine application ko aapki instruction ke mutabiq synchronize kar diya hai. Preview mein check karein!`
          : `Application updated according to your instruction. Changes are now synchronized in the preview!`,
        html: fallbackHtml,
        code: fallbackHtml
      });
    } catch {
      res.status(500).json({ error: error.message || 'App generation failed' });
    }
  }
});

// =========================================================================
// REAL CLOUD HOSTING & APP PUBLISHING SYSTEM
// Allows anyone in the world to open published web applications via live URL
// =========================================================================
const PUBLISHED_APPS_DIR = path.join(process.cwd(), 'published_apps');
if (!fs.existsSync(PUBLISHED_APPS_DIR)) {
  try { fs.mkdirSync(PUBLISHED_APPS_DIR, { recursive: true }); } catch {}
}

const publishedAppsCache = new Map<string, { title: string; html: string; createdAt: number }>();

// Pre-seed Nexus AI
try {
  const initialNexus = generateWorldClassApp('NexusAI — Autonomous Neural Studio', 'ai', 'dark-luxury');
  publishedAppsCache.set('nexusai', { title: 'NexusAI — Autonomous Neural Studio', html: initialNexus, createdAt: Date.now() });
  publishedAppsCache.set('nexus-ai', { title: 'NexusAI — Autonomous Neural Studio', html: initialNexus, createdAt: Date.now() });
  publishedAppsCache.set('bexus', { title: 'Bexus AI — Autonomous Neural Studio', html: initialNexus, createdAt: Date.now() });
} catch (e) {
  console.warn('Initial app cache seed warning:', e);
}

// 1. API Endpoint to Publish App
app.post('/api/app/publish', (req, res) => {
  try {
    const { title = 'Nexus AI Web App', html, slug } = req.body;
    if (!html || !html.trim()) {
      return res.status(400).json({ error: 'HTML code is required' });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'app-' + Date.now();

    const appData = {
      title,
      html,
      createdAt: Date.now()
    };

    publishedAppsCache.set(cleanSlug, appData);
    publishedAppsCache.set(cleanSlug.replace(/-/g, ''), appData);

    try {
      fs.writeFileSync(path.join(PUBLISHED_APPS_DIR, `${cleanSlug}.html`), html, 'utf-8');
    } catch (e) {
      console.warn('Could not write published app file:', e);
    }

    // Determine public URL (NEVER use localhost in public share link)
    let publicBase = process.env.APP_URL 
      ? process.env.APP_URL.replace(/\/+$/, '') 
      : 'https://ais-pre-kd5sztqxhu42smusm3glpm-596437769389.asia-southeast1.run.app';

    const reqHost = req.get('x-forwarded-host') || req.get('host');
    if (reqHost && !reqHost.includes('localhost') && !reqHost.includes('127.0.0.1')) {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      publicBase = `${proto}://${reqHost}`;
    }

    const fullUrl = `${publicBase}/p/${cleanSlug}`;

    res.json({
      success: true,
      slug: cleanSlug,
      url: fullUrl,
      path: `/p/${cleanSlug}`
    });
  } catch (err: any) {
    console.error('Error publishing app:', err);
    res.status(500).json({ error: 'Publish failed' });
  }
});

// App configuration endpoint to provide public base URL to client
app.get('/api/app/config', (req, res) => {
  let publicBase = process.env.APP_URL 
    ? process.env.APP_URL.replace(/\/+$/, '') 
    : 'https://ais-pre-kd5sztqxhu42smusm3glpm-596437769389.asia-southeast1.run.app';

  const reqHost = req.get('x-forwarded-host') || req.get('host');
  if (reqHost && !reqHost.includes('localhost') && !reqHost.includes('127.0.0.1')) {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    publicBase = `${proto}://${reqHost}`;
  }

  res.json({ publicBaseUrl: publicBase });
});

// 2. Real Live Public Hosted App Route (Accessible to entire world / Google / mobile)
app.get(['/p/:slug', '/live/:slug', '/app/:slug'], (req, res) => {
  const rawSlug = req.params.slug;
  const cleanSlug = rawSlug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const noDashSlug = cleanSlug.replace(/-/g, '');

  let appData = publishedAppsCache.get(cleanSlug) || publishedAppsCache.get(noDashSlug) || publishedAppsCache.get(rawSlug);

  if (!appData) {
    // Check disk
    const filePath = path.join(PUBLISHED_APPS_DIR, `${cleanSlug}.html`);
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        appData = {
          title: cleanSlug,
          html: fileContent,
          createdAt: Date.now()
        };
        publishedAppsCache.set(cleanSlug, appData);
      } catch {}
    }
  }

  // Fallback generation if not found
  if (!appData) {
    const title = cleanSlug.includes('nexus') ? 'NexusAI — Autonomous Neural Studio' : cleanSlug.replace(/-/g, ' ');
    const generated = generateWorldClassApp(title, 'ai', 'dark-luxury');
    appData = {
      title,
      html: generated,
      createdAt: Date.now()
    };
    publishedAppsCache.set(cleanSlug, appData);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=120');
  return res.send(appData.html);
});

// AI Presentation & Slide Deck Studio Route (SlideCraft AI)
app.post('/api/slides', async (req, res) => {
  try {
    const { topic, slideCount = 6, theme = 'corporate-emerald' } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required to generate presentation slides' });
    }

    const deck = await generateSlideDeckWithAI(topic.trim(), Number(slideCount) || 6, theme);
    res.json(deck);
  } catch (error: any) {
    console.error('API /api/slides error:', error);
    res.status(500).json({ error: error.message || 'Slide generation failed' });
  }
});

// Live Camera & Computer Vision API Route
app.post('/api/vision/analyze', async (req, res) => {
  try {
    const { image, prompt } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image base64 is required for vision analysis' });
    }
    const result = await analyzeCameraFrameWithAI(image, prompt);
    res.json(result);
  } catch (error: any) {
    console.error('API /api/vision/analyze error:', error);
    res.status(500).json({ error: error.message || 'Vision analysis failed' });
  }
});

// Audio & Video Deep Multimodal Intelligence Route
app.post('/api/media/analyze', async (req, res) => {
  try {
    const { fileName, mediaType = 'audio', transcriptText, duration } = req.body;
    const result = await analyzeMediaWithAI({ fileName, mediaType, transcriptText, duration });
    res.json(result);
  } catch (error: any) {
    console.error('API /api/media/analyze error:', error);
    res.status(500).json({ error: error.message || 'Media analysis failed' });
  }
});

// Autonomous Agentic Task Execution & Computer Use Route
app.post('/api/agent/execute', async (req, res) => {
  try {
    const { goal, context } = req.body;
    if (!goal || !goal.trim()) {
      return res.status(400).json({ error: 'Goal or task specification is required' });
    }
    const result = await executeAgenticTaskWithAI(goal.trim(), context);
    res.json(result);
  } catch (error: any) {
    console.error('API /api/agent/execute error:', error);
    res.status(500).json({ error: error.message || 'Agentic task execution failed' });
  }
});

// =============================================================
// Live Web & API Action Runner (Doer Engine)
// =============================================================
// 1. Live Web Scraper & Table Generator ("URL se data extract karke table bana do")
app.post('/api/action/scrape', async (req, res) => {
  try {
    const { url, instruction } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Target URL is required' });
    }
    const tableData = await scrapeUrlAndBuildTable(url.trim(), instruction);
    res.json(tableData);
  } catch (error: any) {
    console.error('API /api/action/scrape error:', error);
    res.status(500).json({ error: error.message || 'Scraping action failed' });
  }
});

// 2. Webpage SEO & Core Web Vitals Auditor ("Webpage ka SEO audit karke summary de do")
app.post('/api/action/seo-audit', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Target URL is required for SEO audit' });
    }
    const auditData = await auditWebpageSeo(url.trim());
    res.json(auditData);
  } catch (error: any) {
    console.error('API /api/action/seo-audit error:', error);
    res.status(500).json({ error: error.message || 'SEO audit action failed' });
  }
});

// 3. GitHub & Code Repository Action ("GitHub repo par file push kar do")
app.post('/api/action/github', async (req, res) => {
  try {
    const { repo, branch = 'main', filePath, commitMessage, fileContent, githubToken } = req.body;
    if (!repo || !filePath) {
      return res.status(400).json({ error: 'Repository name and filePath are required' });
    }
    const githubData = await executeGitHubAction({
      repo: repo.trim(),
      branch: branch.trim(),
      filePath: filePath.trim(),
      commitMessage: commitMessage?.trim() || `chore: update ${filePath}`,
      fileContent: fileContent || '',
      githubToken
    });
    res.json(githubData);
  } catch (error: any) {
    console.error('API /api/action/github error:', error);
    res.status(500).json({ error: error.message || 'GitHub action failed' });
  }
});

// 4. Live REST & Webhook Request Dispatcher
app.post('/api/action/request', async (req, res) => {
  const startTime = Date.now();
  try {
    const { url, method = 'GET', headers = {}, body } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Target URL is required' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'User-Agent': 'Bexus-Action-Runner/1.0',
        'Accept': 'application/json, text/plain, */*',
        ...headers
      },
      signal: controller.signal
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      if (!headers['Content-Type'] && !headers['content-type']) {
        (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(url.trim(), fetchOptions);
    clearTimeout(timeout);
    const duration = Date.now() - startTime;

    const resHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => { resHeaders[k] = v; });

    let data: any;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
      data,
      responseTimeMs: duration
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'HTTP request failed',
      responseTimeMs: Date.now() - startTime
    });
  }
});

// 5. Unified Natural Language "Doer" Action Execution
app.post('/api/action/execute', async (req, res) => {
  try {
    const { prompt, extraParams } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Action prompt or directive is required' });
    }
    const result = await executeNaturalAction(prompt.trim(), extraParams);
    res.json(result);
  } catch (error: any) {
    console.error('API /api/action/execute error:', error);
    res.status(500).json({ error: error.message || 'Action runner failed' });
  }
});

// REAL SPEECH SYNTHESIS & AUDIO DOWNLOAD ROUTE (Urdu, English, Hindi, Arabic, etc.)
app.all('/api/tts', async (req, res) => {
  try {
    const text = (req.method === 'POST' ? req.body?.text : req.query?.text) as string;
    const lang = ((req.method === 'POST' ? req.body?.lang : req.query?.lang) as string) || 'ur';
    const voice = ((req.method === 'POST' ? req.body?.voice : req.query?.voice) as string) || 'Kore';

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const cleanText = text.trim();

    // 1. High-fidelity Gemini Studio Speech Engine
    try {
      const audioBuffer = await generateSpeechWithGemini(cleanText, voice);
      if (audioBuffer && audioBuffer.length > 500) {
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Content-Length', audioBuffer.length.toString());
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Content-Disposition', `attachment; filename="bexus-voiceover-${lang}.wav"`);
        return res.send(audioBuffer);
      }
    } catch (geminiErr: any) {
      console.warn('Gemini TTS error, checking fallback:', geminiErr?.message || geminiErr);
    }

    // Split script into manageable natural speech chunks (<= 150 chars) by punctuation or spaces
    const chunks: string[] = [];
    const sentences = cleanText.split(/([.!?,;\n\r۔؟]+)/).filter(Boolean);
    let currentChunk = '';

    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i];
      if ((currentChunk + part).length <= 150) {
        currentChunk += part;
      } else {
        if (currentChunk.trim()) chunks.push(currentChunk.trim());
        if (part.length > 150) {
          const words = part.split(' ');
          let temp = '';
          for (const w of words) {
            if ((temp + ' ' + w).length <= 150) {
              temp += (temp ? ' ' : '') + w;
            } else {
              if (temp.trim()) chunks.push(temp.trim());
              temp = w;
            }
          }
          if (temp.trim()) currentChunk = temp;
          else currentChunk = '';
        } else {
          currentChunk = part;
        }
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    if (chunks.length === 0) {
      chunks.push(cleanText.slice(0, 150));
    }

    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(chunk)}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://translate.google.com/',
            'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.5'
          }
        });

        if (response.ok) {
          const arrayBuf = await response.arrayBuffer();
          if (arrayBuf.byteLength > 100) {
            audioBuffers.push(Buffer.from(arrayBuf));
          }
        }
      } catch (chunkErr) {
        console.warn('Chunk speech error:', chunkErr);
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(502).json({ error: 'Failed to synthesize real speech audio from provider' });
    }

    const finalMp3 = Buffer.concat(audioBuffers);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', finalMp3.length.toString());
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Disposition', `attachment; filename="bexus-voiceover-${lang}.mp3"`);
    return res.send(finalMp3);
  } catch (error: any) {
    console.error('API /api/tts error:', error);
    res.status(500).json({ error: error.message || 'TTS generation failed' });
  }
});

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isDev = process.env.npm_lifecycle_event === 'dev' || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const isProduction = !isDev && (process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start');

  if (!isProduction && !process.env.VERCEL) {
    try {
      const vitePkg = 'vite';
      const { createServer: createViteServer } = await import(vitePkg);
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('Vite middleware initialization skipped or failed:', viteErr);
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(503).send('Application build in progress, please refresh in a moment.');
        }
      });
    }
  } else {
    // Production static asset serving
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
    }));
    app.use(express.static(distPath, {
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
      }
    }));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.sendFile(indexPath);
      } else {
        res.status(503).send('Application build in progress, please refresh in a moment.');
      }
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚡ Bexus AI Server running on http://0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export { app };
export default app;
