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
    .replace(/\b(what|how|where|who|when|which)\s+si\b/g, '$1 is')
    .replace(/\bwat\s+(is|si)\b/g, 'what is')
    .replace(/\bwht\s+(is|si)\b/g, 'what is')
    .replace(/\bwhats\b|\bwhat's\b/g, 'what is')
    .replace(/\bhoy\b/g, 'how')
    .replace(/\bhw\b/g, 'how')
    .replace(/\br\b/g, 'are')
    .replace(/\bu\b/g, 'you')
    .replace(/\bur\b/g, 'your')
    .replace(/\bkesy\b/g, 'kese')
    .replace(/\bkaise\b/g, 'kese')
    .replace(/\bhaal\b/g, 'hal')
    .replace(/\bha\b/g, 'hai')
    .replace(/\s+/g, ' ')
    .trim();
}

function tryEvaluateMathExpression(query: string): number | null {
  let clean = query
    .replace(/^(hello|hi|hey|bexus|ai|please|pls|can you|tell me|find|solve|calculate|eval|evaluate)\s+/gi, '')
    .replace(/^(hello|hi|hey|bexus|ai)\s+/gi, '')
    .replace(/^(what is|how much is|calculate|solve|eval|evaluate)\s+/i, '')
    .replace(/\s+(equals to|equal to|equals|is what|please|batao|karo)$/i, '')
    .trim();

  const pct = clean.match(/^([0-9.]+)\s*%\s*(?:of)?\s*([0-9.]+)$/);
  if (pct) {
    return Number((((parseFloat(pct[1]) / 100) * parseFloat(pct[2]))).toFixed(8));
  }

  const sqrtMatch = clean.match(/^(?:square root of|under root of|under root|sqrt)\s*\(?\s*([0-9.]+)\s*\)?$/i);
  if (sqrtMatch) {
    const n = parseFloat(sqrtMatch[1]);
    if (Number.isFinite(n) && n >= 0) {
      return Number(Math.sqrt(n).toFixed(8));
    }
  }

  const normalized = clean
    .replace(/\b(plus|added to|add|jama)\b/gi, '+')
    .replace(/\b(minus|subtract|less|manfi)\b/gi, '-')
    .replace(/\b(times|multiplied by|multiply by|multiply|into|zarb)\b/gi, '*')
    .replace(/\b(divided by|divide by|divided|divide|taqseem|over)\b/gi, '/')
    .replace(/\b(?:to the )?power(?: of)?\b/gi, '**')
    .replace(/\^/g, '**')
    .replace(/(\d(?:\.\d+)?)\s*[x×]\s*(\d(?:\.\d+)?)/gi, '$1 * $2')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .trim();

  // Safe arithmetic evaluator: only digits, whitespace, parentheses, decimal points, and + - * / **
  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) return null;
  if (!/[0-9]/.test(normalized) || !/[+\-*/]/.test(normalized)) return null;

  try {
    const val = Function(`"use strict"; return (${normalized});`)();
    if (typeof val === 'number' && Number.isFinite(val)) {
      return Number(val.toFixed(8));
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Returns an instant deterministic reply ONLY for pure math expressions or current time/date queries
 * so arithmetic is 100% mathematically exact while EVERY conversational message ("how are you", greetings,
 * gratitude, questions, coding, etc.) is answered naturally by real live AI with conversation context.
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

  // 1. Instant 100% exact deterministic arithmetic
  const mathAns = tryEvaluateMathExpression(query);
  if (mathAns !== null) {
    return isUrdu ? `Jawab hai: ${mathAns}` : `The answer is **${mathAns}**.`;
  }

  // 2. Exact time / date queries only
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

/**
 * Extreme last-resort offline fallback used ONLY when all live AI models are unreachable.
 */
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

  const query = cleanQuery(rawQuery);
  const original = (rawQuery || '').trim();
  const normalizedLang = (options?.lang || '').toLowerCase();
  const isUrdu = normalizedLang === 'ur' || normalizedLang === 'ur-roman' || normalizedLang === 'urdu';

  if (/^(how are you|how are you doing|how is it going|how do you do|whats up|what's up|wassup|kese ho|kya hal|kya hal hai)$/i.test(query)) {
    return isUrdu
      ? 'Main bilkul theek hoon, shukriya! Aap kaise hain aur kis cheez me madad chahiye?'
      : "I'm doing well, thanks for asking! How are you doing, and what would you like to work on today?";
  }

  if (/^(hello|hi|hey|hola|salam|assalam|assalam o alaikum|aoa)(?:\s+bexus(?:\s+ai)?)?$/i.test(query)) {
    return isUrdu
      ? 'Salam! Main Bexus AI hoon. Batayein aaj kis cheez me madad chahiye?'
      : 'Hi there! I am Bexus AI. What can I help you with today?';
  }

  if (
    !/\?/.test(original) &&
    !/\b(how|what|why|when|where|which|who|solve|write|fix|create|make|can you|could you|please|explain|tell me)\b/i.test(query) &&
    /^(?:(?:many |so )?(?:thank you|thanks|thank u|thx|ty|shukriya|bohat shukriya|dhanyawad|appreciate(?: it)?)(?:\s+(?:so much|very much|a lot|bhai|bro|yar|yaar|bexus|ai|for|your|the|advice|help|support|answer|reply|guidance|time))*)$/i.test(query)
  ) {
    return isUrdu
      ? 'Bohat shukriya! Kabhi bhi koi madad chahiye ho to zaroor poochiye.'
      : "You're very welcome! Let me know anytime you need anything else.";
  }

  if (isUrdu) {
    return `Sorry, "${original}" par live AI connection abhi busy hai. Thori der mein dobara try karein ya sawal thora clear likhein.`;
  }
  return `I couldn't reach the live AI reasoning server just now for "${original}". Please try sending your question again in a moment.`;
}
