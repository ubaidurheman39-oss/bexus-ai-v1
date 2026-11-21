/**
 * Bexus AI Instant Direct & Offline Helper Engine
 * Handles instant <2ms exact math, time/date queries, and dynamic multilingual/Roman-Urdu detection
 * so every real question or problem routes cleanly in the user's exact language and script.
 */

export interface DetectedLanguageInfo {
  code: 'ur-roman' | 'ur' | 'hi' | 'ar' | 'es' | 'fr' | 'tr' | 'zh' | 'ru' | 'en';
  label: string;
  isRomanUrdu: boolean;
  isUrduLike: boolean;
}

const STRONG_ROMAN_URDU_WORDS = new Set([
  'nahi', 'nahin', 'nhi', 'nai', 'nahe',
  'kardo', 'krdo', 'karo', 'krna', 'karna', 'karen', 'karien', 'karna', 'karti', 'karta', 'karte',
  'kese', 'kaise', 'kesy', 'kaisa', 'kaisi', 'kahan', 'kaha', 'kyun', 'kyu', 'kyunki', 'kyunke', 'kyuke',
  'samjh', 'samajh', 'samjha', 'samjhao', 'samjho', 'smjh',
  'batao', 'btao', 'batado', 'bata', 'batayein', 'bataiye',
  'chahiye', 'chaiye', 'chahie', 'chahye',
  'shukriya', 'shukria', 'meherbani', 'assalam', 'salam', 'alaikum', 'aoa', 'walikum',
  'bohot', 'bohat', 'bahut', 'bahot', 'bilkul', 'zaroor', 'zaroori', 'intezar',
  'masla', 'malsa', 'mashwara', 'jawab', 'sawal', 'madad', 'faida', 'nuqsan',
  'theek', 'thik', 'sahi', 'accha', 'achha', 'acha', 'bura', 'mushkil', 'aasan',
  'yaar', 'yar', 'bhai', 'bhaijaan', 'janab', 'dost', 'chotu', 'chotoo',
  'tumhara', 'tumhari', 'tumhare', 'hamara', 'hamari', 'hamare', 'aapka', 'aapki', 'aapke', 'apka', 'apki',
  'mera', 'meri', 'mere', 'tera', 'teri', 'tere', 'apna', 'apni', 'apne',
  'isko', 'usko', 'unko', 'inko', 'osko', 'mujhe', 'mjhe', 'tujhe', 'humein', 'hume', 'tumhe', 'tumko', 'apko', 'kisko', 'jisko',
  'banao', 'banado', 'bana', 'dikhao', 'dikhado', 'bhejo', 'sunao', 'pooch', 'pucho', 'likho', 'parho', 'bolo', 'bolna',
  'hogaya', 'hogayi', 'hogaye', 'rahe', 'raha', 'rahi', 'gaya', 'gayi', 'gaye', 'aaya', 'aayi', 'ayi', 'aaye',
  'waise', 'wasa', 'abhi', 'aaj', 'ajj', 'subah', 'raat', 'waqt', 'matlab', 'lekin', 'magar', 'phir', 'shayad',
  'kya', 'hai', 'hain', 'hoon', 'hun', 'tum', 'aap', 'pata', 'pta', 'lagta', 'lagti', 'chalta', 'chalti', 'jao', 'aao'
]);

const SECONDARY_ROMAN_URDU_WORDS = new Set([
  'ha', 'han', 'haan', 'ho', 'hu', 'ma', 'mein', 'main', 'hum', 'ham', 'ap', 'woh', 'wo', 'os', 'ye', 'yeh',
  'aur', 'bhi', 'toh', 'par', 'pe', 'se', 'sa', 'ko', 'ka', 'ki', 'ke', 'koi', 'kuch', 'sab', 'sara', 'sari', 'sare',
  'thora', 'thoda', 'zada', 'zyada', 'zyada', 'kam', 'kaam', 'mat', 'na', 'ji', 'aik', 'ek', 'do', 'kar', 'de', 'lo',
  'wala', 'wali', 'wale', 'liye', 'liya', 'diya', 'kis', 'jis', 'jab', 'tab', 'tak', 'agar', 'kal', 'kahan', 'rah'
]);

/**
 * Detects the language and script of a user message accurately.
 * Specifically recognizes Roman Urdu / Hinglish even with casual spellings and typos.
 */
export function detectMessageLanguage(rawText: string): DetectedLanguageInfo {
  const text = (rawText || '').trim();
  if (!text) {
    return { code: 'en', label: 'English', isRomanUrdu: false, isUrduLike: false };
  }

  // 1. Arabic / Urdu / Pashto / Persian script
  if (/[\u0600-\u06FF]/.test(text)) {
    const hasUrduSpecificChars = /[ٹڈڑںہھےیگچپژک]/.test(text);
    if (hasUrduSpecificChars) {
      return { code: 'ur', label: 'Urdu', isRomanUrdu: false, isUrduLike: true };
    }
    return { code: 'ar', label: 'Arabic', isRomanUrdu: false, isUrduLike: false };
  }

  // 2. Devanagari (Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return { code: 'hi', label: 'Hindi', isRomanUrdu: false, isUrduLike: false };
  }

  // 3. CJK (Chinese)
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return { code: 'zh', label: 'Chinese', isRomanUrdu: false, isUrduLike: false };
  }

  // 4. Cyrillic (Russian)
  if (/[\u0400-\u04FF]/.test(text)) {
    return { code: 'ru', label: 'Russian', isRomanUrdu: false, isUrduLike: false };
  }

  // 5. Roman Urdu / Hinglish check on tokenized words
  const tokens = text
    .toLowerCase()
    .replace(/['’`]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  let strongHits = 0;
  let secondaryHits = 0;

  for (const tok of tokens) {
    if (STRONG_ROMAN_URDU_WORDS.has(tok)) {
      strongHits++;
    } else if (SECONDARY_ROMAN_URDU_WORDS.has(tok)) {
      secondaryHits++;
    }
  }

  // Also catch common multi-word Roman Urdu phrases or suffix patterns
  const hasRomanUrduPhrase = /\b(kar\s+do|kar\s+de|bana\s+do|bana\s+de|bata\s+do|samjh\s+nahi|samajh\s+nahi|kya\s+hal|kya\s+haal|kya\s+ho|ho\s+gaya|ho\s+rahi|ho\s+raha|ja\s+raha|aa\s+gaya|baat\s+kar|baat\s+kari|nahi\s+a|nahi\s+ho|os\s+ko|is\s+ko|us\s+ko)\b/i.test(text);

  if (hasRomanUrduPhrase || strongHits >= 1 || secondaryHits >= 2) {
    return { code: 'ur-roman', label: 'Roman Urdu', isRomanUrdu: true, isUrduLike: true };
  }

  // 6. Common European & Turkish markers
  if (/[¿¡ñáéíóúü]/i.test(text) || /\b(hola|gracias|buenos dias|como estas|por favor|necesito|quiero|ayuda)\b/i.test(text)) {
    return { code: 'es', label: 'Spanish', isRomanUrdu: false, isUrduLike: false };
  }
  if (/[çéèêëàâîïôùûüœ]/i.test(text) || /\b(bonjour|merci|comment allez|s'il vous|je veux|besoin d'aide)\b/i.test(text)) {
    return { code: 'fr', label: 'French', isRomanUrdu: false, isUrduLike: false };
  }
  if (/[ğüşöçıİĞÜŞÖÇ]/.test(text) || /\b(merhaba|nasılsın|teşekkür|yardım|lütfen)\b/i.test(text)) {
    return { code: 'tr', label: 'Turkish', isRomanUrdu: false, isUrduLike: false };
  }

  return { code: 'en', label: 'English', isRomanUrdu: false, isUrduLike: false };
}

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
    .replace(/\s+(equals to|equal to|equals|is what|please|batao|btao|karo|kardo|kar do)$/i, '')
    .trim();

  const pct = clean.match(/^([0-9.]+)\s*%\s*(?:of|ka)?\s*([0-9.]+)$/);
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
    .replace(/\b(minus|subtract|less|manfi|ghata)\b/gi, '-')
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
 * so arithmetic is 100% mathematically exact while EVERY conversational message routes to live AI
 * in the exact language the user spoke.
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

  const detected = detectMessageLanguage(rawQuery);
  const normalizedLang = (options?.lang || '').toLowerCase();
  const isUrdu =
    detected.isUrduLike ||
    normalizedLang === 'ur' ||
    normalizedLang === 'ur-roman' ||
    normalizedLang === 'urdu' ||
    normalizedLang === 'roman urdu';

  // 1. Instant 100% exact deterministic arithmetic
  const mathAns = tryEvaluateMathExpression(query);
  if (mathAns !== null) {
    return isUrdu ? `Jawab hai: **${mathAns}**` : `The answer is **${mathAns}**.`;
  }

  // 2. Exact time / date queries only
  if (/^(what is the time|what time is it|current time|time please|time|waqt|kya time hai|time kya hai|time kya hua hai|kitne baje hain)$/i.test(query)) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isUrdu ? `Is waqt time ${timeStr} hai.` : `It is currently ${timeStr}.`;
  }

  if (/^(what is the date|what is todays date|what is today's date|todays date|today's date|date today|date|aaj ki date|aaj ki tarikh|aaj kya date hai|aaj kya tarikh hai)$/i.test(query)) {
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
  const detected = detectMessageLanguage(rawQuery);
  const normalizedLang = (options?.lang || '').toLowerCase();
  const isUrdu =
    detected.isUrduLike ||
    normalizedLang === 'ur' ||
    normalizedLang === 'ur-roman' ||
    normalizedLang === 'urdu' ||
    normalizedLang === 'roman urdu';

  if (/^(how are you|how are you doing|how is it going|how do you do|whats up|what's up|wassup|kese ho|kya hal|kya hal hai|kya haal hai|aur sunao|kese hain|kaise ho|kaise hain)(?:\s+(?:bhai|bro|yar|yaar|bexus|ai|janab|dost))*$/i.test(query)) {
    return isUrdu
      ? 'Main bilkul theek hoon, shukriya! Aap kaise hain aur aaj kis cheez mein madad chahiye?'
      : "I'm doing well, thanks for asking! How are you doing, and what would you like to work on today?";
  }

  if (/^(hello|hi|hey|hola|salam|assalam|assalam o alaikum|aoa)(?:\s+(?:bexus(?:\s+ai)?|bhai|bro|yar|yaar|janab|dost))*$/i.test(query)) {
    return isUrdu
      ? 'Salam! Main Bexus AI hoon. Batayein aaj kis cheez mein madad chahiye?'
      : 'Hi there! I am Bexus AI. What can I help you with today?';
  }

  if (
    !/\?/.test(original) &&
    !/\b(how|what|why|when|where|which|who|solve|write|fix|create|make|can you|could you|please|explain|tell me|batao|karo|kardo)\b/i.test(query) &&
    /^(?:(?:many |so )?(?:thank you|thanks|thank u|thx|ty|shukriya|bohat shukriya|bohot shukriya|dhanyawad|appreciate(?: it)?)(?:\s+(?:so much|very much|a lot|bhai|bro|yar|yaar|bexus|ai|for|your|the|advice|help|support|answer|reply|guidance|time))*)$/i.test(query)
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
