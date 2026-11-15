/**
 * Bexus AI Instant Direct & Offline Helper Engine
 * Handles instant <2ms exact math, standalone greetings, and time/date queries
 * so trivial checks feel instantaneous while EVERY real question or problem routes directly to Gemini.
 */

export function cleanQuery(input: string): string {
  return (input || '')
    .trim()
    .replace(/[?!.,;:]+$/g, '')
    .toLowerCase()
    .replace(/\bhoy\b/g, 'how')
    .replace(/\bhw\b/g, 'how')
    .replace(/\br\b/g, 'are')
    .replace(/\bu\b/g, 'you')
    .replace(/\bur\b/g, 'your')
    .replace(/\bkesy\b/g, 'kese')
    .replace(/\bkaise\b/g, 'kese')
    .replace(/\bhaal\b/g, 'hal')
    .replace(/\bha\b/g, 'hai')
    .trim();
}

function tryEvaluateMathExpression(query: string): number | null {
  const pct = query.match(/^([0-9.]+)\s*%\s*(?:of)?\s*([0-9.]+)$/);
  if (pct) {
    return (parseFloat(pct[1]) / 100) * parseFloat(pct[2]);
  }

  const normalized = query
    .replace(/^(what is|calculate|solve|eval|evaluate)\s+/i, '')
    .replace(/\bplus\b/gi, '+')
    .replace(/\bminus\b/gi, '-')
    .replace(/\btimes\b|\bmultiplied by\b|\binto\b/gi, '*')
    .replace(/\bdivided by\b/gi, '/')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .trim();

  // Safe arithmetic evaluator: only digits, whitespace, parentheses, decimal points, and + - * /
  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) return null;
  if (!/[0-9]/.test(normalized) || !/[+\-*/]/.test(normalized)) return null;

  try {
    const val = Function(`"use strict"; return (${normalized});`)();
    if (typeof val === 'number' && Number.isFinite(val)) {
      return Math.round(val * 100000) / 100000;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Returns an instant reply ONLY for pure math, exact standalone greetings, or current time/date.
 * Returns `null` for ALL real questions, problems, coding queries, or general requests
 * so they always go straight to Gemini / Live AI Solver.
 */
export function tryInstantDirectReply(
  rawQuery: string,
  options?: {
    userName?: string;
    lang?: string;
    voiceMode?: boolean;
  }
): string | null {
  const query = cleanQuery(rawQuery);
  if (!query) return null;

  const normalizedLang = (options?.lang || '').toLowerCase();
  const isUrdu = normalizedLang === 'ur' || normalizedLang === 'ur-roman' || normalizedLang === 'urdu';

  // 1. Instant exact arithmetic
  const mathAns = tryEvaluateMathExpression(query);
  if (mathAns !== null) {
    return isUrdu ? `Jawab hai: ${mathAns}` : `The answer is ${mathAns}.`;
  }

  // 2. Strictly standalone greetings ONLY (never intercept "hello how do I fix...")
  if (/^(how are you|how are u|how are you doing|how is it going|how do you do|whats up|what's up|wassup)$/i.test(query)) {
    return isUrdu
      ? 'Main bilkul theek aur zabardast hoon! Aap sunayein, kya haal chaal hain?'
      : "I'm doing great, thank you! Ask me any question or describe any problem and I'll help solve it right away.";
  }

  if (/^(kese ho|kya hal|kya hal hai|sab theek|sab theek hai|kya chal raha hai)$/i.test(query)) {
    return isUrdu
      ? 'Main bilkul theek aur fresh hoon! Aap batayein, kis cheez me madad chahiye?'
      : "I'm doing great, thank you! What question or problem can I help you solve today?";
  }

  if (/^(hello|hi|hey|hola|hello bexus|hi bexus|hey bexus)$/i.test(query)) {
    return isUrdu
      ? 'Hello! Main Bexus AI hoon. Batayein aaj kis cheez me madad chahiye?'
      : 'Hello! I am Bexus AI. Ask me anything—from coding and troubleshooting to science, writing, or daily problems.';
  }

  if (/^(salam|assalam|assalam o alaikum|assalamualaikum|aoa)$/i.test(query)) {
    return isUrdu
      ? 'Walaikum Assalam! Bexus AI hazir hai, batayein aaj kya discuss ya solve karein?'
      : 'Hello! Bexus AI is ready. What question or problem can I help you with today?';
  }

  if (/^(thank you|thanks|thank u|shukriya|bohat shukriya|dhanyawad)$/i.test(query)) {
    return isUrdu ? 'Bohat shukriya! Mujhe aapki madad karke hamesha khushi hoti hai.' : "You're very welcome! Happy to help anytime.";
  }

  if (/^(ok|okay|theek hai|thek ha|good|great|nice|cool|zabardast|sahi|achha|acha)$/i.test(query)) {
    return isUrdu ? 'Theek hai! Aage batayein kya karna hai?' : 'Got it! What would you like me to help you with next?';
  }

  // 3. Exact time / date queries only (avoid matching "time complexity", "date of independence")
  if (/^(what is the time|what time is it|current time|time please|time|waqt|kya time hai)$/i.test(query)) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isUrdu ? `Is waqt time ${timeStr} hai.` : `It is currently ${timeStr}.`;
  }

  if (/^(what is the date|what is todays date|what is today's date|todays date|today's date|date today|date|aaj ki date|aaj ki tarikh)$/i.test(query)) {
    const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return isUrdu ? `Aaj ki date ${dateStr} hai.` : `Today is ${dateStr}.`;
  }

  return null;
}

export function generateNaturalConversationalReply(
  rawQuery: string,
  options?: {
    userName?: string;
    lang?: string;
    voiceMode?: boolean;
  }
): string {
  const direct = tryInstantDirectReply(rawQuery, options);
  if (direct) return direct;

  const original = (rawQuery || '').trim();
  const normalizedLang = (options?.lang || '').toLowerCase();
  const isUrdu = normalizedLang === 'ur' || normalizedLang === 'ur-roman' || normalizedLang === 'urdu';

  if (isUrdu) {
    return `Sorry, "${original}" par live AI connection abhi busy hai. Thori der mein dobara try karein ya sawal thora clear likhein.`;
  }
  return `I couldn't reach the live AI reasoning server just now for "${original}". Please try sending your question again in a moment.`;
}
