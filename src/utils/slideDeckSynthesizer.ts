import type { SlideDeck, SlideItem } from '../types/index.ts';

interface SynthesizerOptions {
  topic: string;
  slideCount?: number;
  theme?: 'cyberpunk' | 'corporate-emerald' | 'minimal-dark' | 'sunset-glow' | 'royal-violet' | 'midnight-gold';
  presentationStyle?: 'keynote' | 'academic' | 'pitch' | 'technical' | 'minimal';
}

function cleanString(str: string): string {
  return str.replace(/[#*`_~]/g, '').trim();
}

// Normalizes prompt directives (e.g. "make bmw slides" -> "BMW")
function extractCleanSubject(input: string): string {
  let s = cleanString(input);
  s = s.replace(/^(please\s+|can you\s+|kindly\s+|hey\s+|bexus\s+)/i, '');
  s = s.replace(/^(make|create|build|generate|design|prepare|banao|tayyar karo|dikhao|give me|bana kar do|bana do)\s+(a\s+|an\s+|the\s+)?/i, '');
  s = s.replace(/^(presentation\s+(on|about|for|of)?|slides\s+(on|about|for|of)?|pitch deck\s+(for|about|on)?|keynote\s+(for|on|about)?)\s*/i, '');
  s = s.replace(/\s+(slides|slide deck|presentation|keynote|pitch deck)$/i, '');
  s = s.replace(/\s+(par|pe|ke|ki|par)\s+(slides|presentation|deck|banao|tayyar karo|bana do|bana kar do).*$/i, '');
  s = s.replace(/\s+(ki\s+slides\s+bana\s+do|ki\s+slides\s+banao|ki\s+slides|bana\s+kar\s+do|bana\s+do|tayyar\s+karo)$/i, '');
  s = s.replace(/[?.!:]+$/, '').trim();
  return s || input;
}

// Checks if text contains Arabic/Urdu script
function isUrduScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

// Checks if text is Roman Urdu
function isRomanUrdu(text: string): boolean {
  const ruWords = [
    'kya', 'tareekh', 'pakistan', 'jinnah', 'iqbal', 'kese', 'kaise', 'banao', 'karo', 'baray', 
    'mein', 'hoga', 'hota', 'parhai', 'ilm', 'shairi', 'mughal', 'zameen', 'aasmaan', 'duniya',
    'fawaid', 'nuqsan', 'behtareen', 'zindagi', 'taraqqi', 'insan', 'roshni', 'quaid'
  ];
  const lower = text.toLowerCase();
  return ruWords.some(w => lower.includes(w));
}

export function synthesizeIntelligentSlideDeck(options: SynthesizerOptions): SlideDeck {
  const rawTopic = (options.topic || 'Strategic Roadmap & Execution').trim();
  const slideCount = Math.min(12, Math.max(4, options.slideCount || 6));
  const theme = options.theme || 'corporate-emerald';
  const lower = rawTopic.toLowerCase();

  const isUrdu = isUrduScript(rawTopic);
  const isRU = !isUrdu && isRomanUrdu(rawTopic);

  // Categorize Topic
  const isHistory = /babbage|quaid|jinnah|iqbal|history|tareekh|mughal|empire|war|greece|rome|ottoman|civilization|1947|independence/i.test(lower);
  const isAIorTech = /ai|artificial intelligence|machine learning|deep learning|software|code|python|react|cloud|database|blockchain|cyber|algorithm|devops|neural|agent|bexus/i.test(lower);
  const isScience = /photosynthesis|biology|cell|physics|quantum|space|brain|medicine|dna|genetics|solar|energy|chemistry|planet|astronomy|ecosystem|atom/i.test(lower);
  const isBusiness = /startup|pitch|deck|saas|revenue|market|finance|invest|growth|sales|customer|ecommerce|real estate|business plan|crypto|trading/i.test(lower);
  const isEducation = /study|exam|lecture|learn|education|school|student|teaching|university|psychology|leadership/i.test(lower);
  const isAutomotive = /bmw|mercedes|benz|audi|tesla|porsche|ferrari|lamborghini|toyota|honda|ford|car|automobile|automotive|supercar|motorsport|motor|vehicle|m-power|m3|m5/i.test(lower);

  const cleanSubject = extractCleanSubject(rawTopic);
  const cleanTitle = cleanString(cleanSubject.length > 2 ? cleanSubject : rawTopic);

  let slides: SlideItem[] = [];

  // ==========================================
  // 1. URDU SCRIPT ENGINE (اردو سلائیڈز)
  // ==========================================
  if (isUrdu) {
    const urduSlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: cleanTitle,
        subtitle: 'جامع تجزیہ، تاریخی و عملی پس منظر اور مستقبل کے اہم نکات',
        speakerNotes: `معزز سامعین، آج کی اس اہم پریزنٹیشن میں ہم "${cleanTitle}" کا تفصیلی اور تحقیقی جائزہ پیش کریں گے۔`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: 'بنیادی مقاصد اور پس منظر',
        subtitle: 'اس موضوع کی دور حاضر میں عملی اہمیت اور تقاضے',
        bullets: [
          'بنیادی فریم ورک اور فکری بنیادوں کی تشکیل',
          'موجودہ دور کے مسائل، چیلنجز اور رکاوٹوں کا حل',
          'دیرپا اور پائیدار نتائج کے حصول کے لیے منظم حکمت عملی',
          'شعبہ جاتی ترقی اور معیاری اہداف کا تعین'
        ],
        speakerNotes: 'اس سلائیڈ پر حاضرین کو موضوع کی بنیاد اور اس کے درپیش مقاصد پر روشنی ڈالیں۔'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'metrics',
        title: 'اہم ترین اشاریے اور تحقیقی حقائق',
        subtitle: 'ٹھوس شواہد اور کامیابی کے بنیادی پیمانے',
        metrics: [
          { label: 'شرح نمو و ترقی', value: '88%+', detail: 'مسلسل بہتری کا رجحان' },
          { label: 'عملی نفاذ', value: '4.5x', detail: 'روایتی طریقوں کے مقابلے میں تیزی' },
          { label: 'کامیابی کی شرح', value: '96.4%', detail: 'تحقیقی و تصدیق شدہ نتائج' }
        ],
        speakerNotes: 'اعداد و شمار پر اعتماد کے ساتھ گفتگو کریں اور حقائق کا تجزیہ پیش کریں۔'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'timeline',
        title: 'مرحلہ وار لائحہ عمل اور خاکہ',
        subtitle: 'منصوبہ بندی سے مکمل تکمیل تک کا سفر',
        timeline: [
          { step: 'پہلا مرحلہ', title: 'بنیادی تحقیق و جائزہ', desc: 'معلومات کا تفصیلی تجزیہ اور خاکہ سازی۔' },
          { step: 'دوسرا مرحلہ', title: 'عملی اطلاق و نفاذ', desc: 'حکمت عملی کو عملی میدان میں اتارنا۔' },
          { step: 'تیسرا مرحلہ', title: 'توسیع و مستقبل کا ارتقاء', desc: 'نتائج کی جانچ اور مستقل بنیادوں پر نگرانی۔' }
        ],
        speakerNotes: 'تینوں مراحل کی ترتیب اور ان کے باہمی ربط کو واضح کریں۔'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'table',
        title: 'جامع موازنہ و تقابلی جائزہ',
        subtitle: 'روایتی سوچ بمقابلہ جدید موثر طریقہ کار',
        table: {
          headers: ['پہلو', 'روایتی طریقہ', 'جدید و موثر حکمت عملی'],
          rows: [
            ['کارکردگی', 'سست رفتار اور محدود', 'تیز رفتار، خودکار اور با اثر'],
            ['درستگی', 'انسانی غلطی کے امکانات', 'تحقیقی اصولوں پر مبنی اعلیٰ معیار'],
            ['مستقبل کا دائرہ', 'عارضی فائدے تک محدود', 'طویل مدتی اور پائیدار ترقی']
          ]
        },
        speakerNotes: 'جدید اور روایتی طریقوں کے فرق کو مدلل انداز میں بیان کریں۔'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'quote',
        title: 'حکمت و بصیرت کا سنہری قول',
        quote: {
          text: 'منزل انہی کو ملتی ہے جو مقصد کے تعین کے بعد مسلسل جدوجہد اور استقامت کو اپنا شعار بناتے ہیں۔',
          author: 'مفکرانہ بصیرت',
          role: 'رہنما اصول'
        },
        speakerNotes: 'پوری تاثیر کے ساتھ یہ قول بیان کریں تاکہ سامعین میں نیا جذبہ پیدا ہو۔'
      },
      {
        id: 's_7',
        slideNumber: 7,
        layout: 'bullets',
        title: 'کلیدی ستون اور عملی رہنمائی',
        subtitle: 'کامیابی کے لیے ناگزیر بنیادی امور',
        bullets: [
          'صحیح وقت پر درست فیصلے کرنے کی صلاحیت',
          'جدید ٹیکنالوجی اور سائنسی بصیرت سے بھرپور استفادہ',
          'اہل علم اور ماہرین کے باہمی تعاون کو فروغ دینا',
          'مسائل کو مواقع میں تبدیل کرنے کی انقلابی سوچ'
        ],
        speakerNotes: 'ہر ستون پر اختصار مگر جامعیت سے روشنی ڈالیں۔'
      },
      {
        id: 's_8',
        slideNumber: 8,
        layout: 'cta',
        title: 'اختتامی خلاصہ اور آئندہ کے اقدامات',
        subtitle: 'عملی پیش رفت اور فوری لائحہ عمل',
        bullets: [
          'منصوبے پر بلا تاخیر کام کا آغاز',
          'تمام وسائل اور ٹیم کو متحرک کرنا',
          'ہفتہ وار جائزہ اور کارکردگی کی جانچ'
        ],
        speakerNotes: 'حاضرین کا شکریہ ادا کریں اور سوال و جواب کے لیے نشست کھولیں۔'
      }
    ];

    slides = urduSlides.slice(0, slideCount);
  }
  // ==========================================
  // 2. ROMAN URDU ENGINE
  // ==========================================
  else if (isRU) {
    const ruSlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: cleanTitle,
        subtitle: 'Mukammal Tareekhi, Ilmi aur Amli Jaiza — Comprehensive Keynote Series',
        speakerNotes: `Slam aur welcome sab ko. Aaj hum "${cleanTitle}" ke ahem tareen pehluon aur amli nataij par baat karenge.`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: 'Bunyadi Maqasid aur Pehlo',
        subtitle: 'Is mauzu ki zaroorat aur ahem tareen wajuhaat',
        bullets: [
          'Bunyadi concept aur framework ka asaan aur wazeh jaiza',
          'Mojooda door ke mushkilaat aur unka behtareen hal',
          'Kamyabi hasil karne ke liye practical aur proven tareeqay',
          'Mustaqbil ki taraf paidaar peshraft aur tawanai'
        ],
        speakerNotes: 'Is slide mein context set karein aur audience ko topic ki gehrai samjhayein.'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'metrics',
        title: 'Key Facts, Numbers & Validated Metrics',
        subtitle: 'Kamyabi aur taraqqi ke numaya benchmarks',
        metrics: [
          { label: 'Efficiency Gain', value: '3.8x', detail: 'Purani approach se behtar' },
          { label: 'Precision & Quality', value: '98.5%', detail: 'Aala tareen standard' },
          { label: 'Impact Score', value: '10/10', detail: 'Mustaqbil ki kamyabi' }
        ],
        speakerNotes: 'In numbers ko confidence ke sath present karein aur explain karein.'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'timeline',
        title: 'Marhala-Waar Roadmap (Phased Execution)',
        subtitle: 'Pehlay qadam se aakhri kamyabi tak ka rasta',
        timeline: [
          { step: 'Phase 1', title: 'Tehqeeq & Planning', desc: 'Bunyadi asool aur structural framework tayyar karna.' },
          { step: 'Phase 2', title: 'Amli Nifaz & Testing', desc: 'Tajarbaat aur strategies ko implement karna.' },
          { step: 'Phase 3', title: 'Full Scale Taraqqi', desc: 'Ecosystem ko barhana aur paidaar nateeja hasil karna.' }
        ],
        speakerNotes: 'Roadmap ke teenon marhalon ko asaan alfaz mein bayan karein.'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'quote',
        title: 'Basiarat & Rahnuma Usool',
        quote: {
          text: 'Kamyabi ka raaz mustaqil mizaji, wazeh maqsad aur sahi waqt par amal karne mein posheeda hai.',
          author: 'Qadeem Hikmat',
          role: 'Golden Rule'
        },
        speakerNotes: 'Is quote ko jazbay ke sath ada karein.'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'cta',
        title: 'Khulasa & Aglay Iqdamaat',
        subtitle: 'Ab aage kya karna hai? Action plan & execution',
        bullets: [
          'Agla marhala foran shuru karein',
          'Zaroori resources aur tools tayyar rakhein',
          'Regular feedback aur review cycle maintain karein'
        ],
        speakerNotes: 'Audience ka shukriya ada karein aur sawal jawab ke liye invite karein.'
      }
    ];

    slides = ruSlides.slice(0, slideCount);
  }
  // ==========================================
  // 3. HISTORY / BIOGRAPHY ENGINE (e.g. Babbage, Jinnah, Rome, Empires)
  // ==========================================
  else if (isHistory) {
    const isBabbage = lower.includes('babbage') || lower.includes('analytical engine') || lower.includes('difference engine');
    const isJinnah = lower.includes('jinnah') || lower.includes('quaid');

    const historySlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: cleanTitle,
        subtitle: isBabbage 
          ? 'The Dawn of Computation: From the Difference Engine to the Turing Paradigm'
          : isJinnah
          ? 'Statesmanship, Constitutional Struggle & The Creation of Pakistan'
          : 'Historical Foundations, Pivotal Turning Points & Enduring Legacy',
        speakerNotes: `Welcome everyone. Today we examine the profound historical arc, critical turning points, and lasting implications of ${cleanTitle}.`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: 'Historical Context & The Catalyst for Change',
        subtitle: 'The sociopolitical and technical landscape preceding the breakthrough',
        bullets: [
          isBabbage 
            ? 'Pervasive mathematical table errors in nautical navigation endangering British shipping'
            : isJinnah
            ? 'The struggle for constitutional safeguards and minority rights in British India'
            : 'Prevailing orthodoxies and institutional inertia of the era',
          isBabbage
            ? 'The ambition to substitute human "computers" with infallible mechanical clockwork'
            : isJinnah
            ? 'The Lucknow Pact (1916), Fourteen Points (1929), and the Lahore Resolution (1940)'
            : 'Emergence of unprecedented philosophical and strategic paradigms',
          'The convergence of visionary leadership and pressing structural crises'
        ],
        speakerNotes: 'Set the historical stage vividly so the audience grasps the immense obstacles of the period.'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'timeline',
        title: 'Chronological Milestones & Key Epochs',
        subtitle: 'Documented phases of development and strategic breakthroughs',
        timeline: isBabbage ? [
          { step: '1822', title: 'Difference Engine No. 1', desc: 'Design of the method-of-finite-differences calculator to automate polynomial tables.' },
          { step: '1837', title: 'The Analytical Engine', desc: 'Conceptualization of the Mill (ALU), Store (RAM), and Jacquard punched-card control.' },
          { step: '1843', title: 'Ada Lovelace’s Note G', desc: 'First computer algorithm computing Bernoulli numbers with loops and branches.' }
        ] : isJinnah ? [
          { step: '1906–1913', title: 'Ambassador of Hindu-Muslim Unity', desc: 'Champion of constitutional reform within the Imperial Legislative Council.' },
          { step: '1929–1940', title: 'The 14 Points & Lahore Resolution', desc: 'Clarifying distinct national identity and articulating self-determination.' },
          { step: '1947', title: 'Birth of Pakistan & First Governor General', desc: 'Establishing state institutions, rule of law, and religious freedom.' }
        ] : [
          { step: 'Genesis', title: 'Origins & Initial Movement', desc: 'Initial formation of ideas, collective mobilization, and thesis.' },
          { step: 'Ascent', title: 'Climax & Institutional Victory', desc: 'Major treaties, structural shifts, and decisive historical moments.' },
          { step: 'Legacy', title: 'Long-Term Modern Influence', desc: 'Institutional inheritance, enduring constitutional or scientific precedents.' }
        ],
        speakerNotes: 'Walk chronologically through the pivotal events that altered history.'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'metrics',
        title: 'Documented Historical Impact & Records',
        subtitle: 'Quantifiable achievements and scholarly consensus',
        metrics: isBabbage ? [
          { label: 'Store Capacity', value: '1,000', detail: '50-digit mechanical decimal registers' },
          { label: 'Mill Architecture', value: '25,000', detail: 'Gears, cams & mechanical levers' },
          { label: 'London Vindication', value: '1991', detail: 'Science Museum built functioning Engine' }
        ] : isJinnah ? [
          { label: 'Statehood Created', value: '1947', detail: 'World’s first ideological Muslim state' },
          { label: 'Legal Legacy', value: '30+ Yrs', detail: 'Bar-at-Law and legislative mastery' },
          { label: 'Historical Impact', value: '#1', detail: 'Changed map of South Asia' }
        ] : [
          { label: 'Historical Span', value: 'Centuries', detail: 'Profound generational resonance' },
          { label: 'Direct Influence', value: 'Global', detail: 'Transnational impact across borders' },
          { label: 'Scholarly Treatises', value: '10,000+', detail: 'Peer-reviewed historical literature' }
        ],
        speakerNotes: 'Emphasize the factual magnitude and enduring institutional footprint.'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'quote',
        title: 'Enduring Primary Source Quotation',
        quote: isBabbage ? {
          text: 'The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.',
          author: 'Ada Lovelace',
          role: 'Mathematician & First Programmer (1843)'
        } : isJinnah ? {
          text: 'With faith, discipline and selfless devotion to duty, there is nothing worthwhile that you cannot achieve.',
          author: 'Quaid-e-Azam Muhammad Ali Jinnah',
          role: 'Father of the Nation'
        } : {
          text: 'History does not repeat itself, but it often rhymes. Those who master its principles command the future.',
          author: 'Historian Laureate',
          role: 'Constitutional Archive'
        },
        speakerNotes: 'Read this quote with gravitas and highlight why it remains iconic.'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'table',
        title: 'Comparative Historical Analysis',
        subtitle: 'Core principles vs modern counterparts',
        table: {
          headers: ['Historical Dimension', 'Original State', 'Modern Parallel'],
          rows: [
            ['Core Philosophy', 'Radical innovation against prevailing status quo', 'Fundamental baseline of modern practice'],
            ['Resistance Faced', 'Institutional skepticism and resource constraints', 'Vindicated by historical validation'],
            ['Enduring Lesson', 'Visionary perseverance shapes centuries', 'Foundational principle taught in academia worldwide']
          ]
        },
        speakerNotes: 'Draw the explicit thread between the historical record and contemporary relevance.'
      },
      {
        id: 's_7',
        slideNumber: 7,
        layout: 'cta',
        title: 'Key Historical Takeaways & Synthesis',
        subtitle: 'Lessons for leadership, research, and future generations',
        bullets: [
          'Historical foresight requires unwavering moral and intellectual conviction',
          'Rigorous documentation preserves vision beyond an individual life span',
          'Foundational principles outlast transient political and technological tides'
        ],
        speakerNotes: 'Summarize the overarching lessons and open the floor for audience dialogue.'
      }
    ];

    slides = historySlides.slice(0, slideCount);
  }
  // ==========================================
  // 4. SCIENCE / BIOLOGY / MEDICINE / PHYSICS
  // ==========================================
  else if (isScience) {
    const isPhoto = /photosynthesis/i.test(lower);
    const scienceSlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: cleanTitle,
        subtitle: isPhoto 
          ? 'Biochemical Pathways: Light Reactions, Calvin Cycle & Global Energy Flux'
          : 'Scientific Principles, Experimental Mechanisms & Empirical Discoveries',
        speakerNotes: `Welcome colleagues and students. Today we explore the empirical mechanics and biochemical beauty of ${cleanTitle}.`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: 'Fundamental Principles & Hypothesis',
        subtitle: 'The molecular, biological or physical foundation',
        bullets: [
          isPhoto
            ? 'Photolysis of water in Photosystem II (PSII) yielding molecular oxygen and protons'
            : 'Primary law governing molecular interactions and equilibrium states',
          isPhoto
            ? 'Electron Transport Chain (ETC) generating proton gradients across the thylakoid membrane'
            : 'Energetics, kinetic rate laws, and thermodynamic boundary conditions',
          isPhoto
            ? 'ATP Synthase rotational catalysis and NADPH generation in the stroma'
            : 'Empirical verification across controlled experimental cohorts'
        ],
        speakerNotes: 'Outline the precise scientific mechanism driving the system.'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'metrics',
        title: 'Empirical Quantifications & Constants',
        subtitle: 'Key laboratory measurements and physiological constants',
        metrics: isPhoto ? [
          { label: 'Quantum Efficiency', value: '95%+', detail: 'Photon charge separation efficiency' },
          { label: 'CO₂ Fixed Annually', value: '115B', detail: 'Tons of global biomass synthesized' },
          { label: 'Wavelength Bands', value: '430/680nm', detail: 'Chlorophyll-a absorption peaks' }
        ] : [
          { label: 'Statistical p-value', value: '<0.001', detail: 'High empirical significance' },
          { label: 'System Precision', value: '99.4%', detail: 'Repeatable lab baseline' },
          { label: 'Thermodynamic Eff.', value: '84.2%', detail: 'Gibbs free energy yield' }
        ],
        speakerNotes: 'Focus on the quantitative rigor of the empirical measurements.'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'timeline',
        title: 'Sequential Reaction Cascade / Experimental Flow',
        subtitle: 'Step-by-step pathway from input to catalytic output',
        timeline: isPhoto ? [
          { step: 'Stage 1', title: 'Photon Absorption (Light Rxn)', desc: 'Photons excite P680 chlorophyll electrons in the thylakoid.' },
          { step: 'Stage 2', title: 'Chemiosmotic Phosphorylation', desc: 'H+ gradient drives ATP synthase to produce chemical energy.' },
          { step: 'Stage 3', title: 'Carbon Fixation (Calvin Cycle)', desc: 'RuBisCO fixes atmospheric CO₂ into 3-PGA and G3P hexose sugars.' }
        ] : [
          { step: 'Initiation', title: 'State Activation & Excitation', desc: 'Baseline reactant state receives requisite activation energy.' },
          { step: 'Catalysis', title: 'Intermediate Complex Formation', desc: 'Enzymatic or physical transition state with minimal barrier.' },
          { step: 'Termination', title: 'Stable Product Equilibrium', desc: 'Thermodynamically favored yield synthesized.' }
        ],
        speakerNotes: 'Guide the audience through the sequential chain of causation.'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'table',
        title: 'Biochemical / Physical Comparison Matrix',
        subtitle: 'Comparative breakdown of internal phases',
        table: isPhoto ? {
          headers: ['Parameter', 'Light-Dependent Reactions', 'Calvin-Benson Cycle'],
          rows: [
            ['Location', 'Thylakoid Membrane', 'Stroma of Chloroplast'],
            ['Inputs', 'H₂O, Light Photons, NADP+, ADP', 'CO₂, ATP, NADPH'],
            ['Outputs', 'O₂, ATP, NADPH', 'G3P Glucose Precursor, ADP, NADP+'],
            ['Light Dependency', 'Directly dependent', 'Light-independent (chemical)']
          ]
        } : {
          headers: ['Variable', 'Control Group', 'Experimental Target'],
          rows: [
            ['Equilibrium Rate', 'Baseline steady-state', 'Accelerated 4.2x with catalytic promoter'],
            ['Thermodynamic Stability', 'Standard ambient decay', 'Stabilized across wide thermal spectrum']
          ]
        },
        speakerNotes: 'Point out the critical contrast between inputs, outputs, and locations.'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'quote',
        title: 'Scientific Insight & Scholarly Quote',
        quote: {
          text: 'Nature does not act by complex, chaotic accidents; it operates on mathematically elegant physical symmetries.',
          author: 'Distinguished Fellow',
          role: 'Royal Society of Science'
        },
        speakerNotes: 'Highlight the innate elegance of natural systems.'
      },
      {
        id: 's_7',
        slideNumber: 7,
        layout: 'cta',
        title: 'Key Scientific Takeaways & Future Research',
        subtitle: 'Modern implications for bio-engineering and sustainability',
        bullets: [
          'Mastery of these pathways unlocks artificial photosynthesis and clean energy',
          'Bio-mimetic solar storage matches natural enzymatic yields',
          'Continued research expands pharmaceutical and ecological preservation'
        ],
        speakerNotes: 'Wrap up with high-impact implications and invite scholarly inquiries.'
      }
    ];

    slides = scienceSlides.slice(0, slideCount);
  }
  // ==========================================
  // 5. TECH / AI / SOFTWARE / CODE
  // ==========================================
  else if (isAIorTech) {
    const techSlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: cleanTitle,
        subtitle: 'Architectural Blueprint, High-Throughput Pipelines & Production Scale',
        speakerNotes: `Welcome engineering leads and architects. Today we break down the production-grade architecture of ${cleanTitle}.`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: 'System Architecture & Core Pipeline',
        subtitle: 'Decoupled, event-driven infrastructure for maximum resilience',
        bullets: [
          'Multi-region low-latency orchestration with zero single-point-of-failure',
          'Distributed memory state synchronization and cached query pipelines',
          'Automated circuit breakers, graceful degradation, and neural fallbacks',
          'Strict zero-trust cryptographic verification across all payload ingress'
        ],
        speakerNotes: 'Emphasize architectural resilience and engineering defensibility.'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'metrics',
        title: 'Production Benchmarks & Performance SLAs',
        subtitle: 'Validated p99 latency, throughput, and reliability telemetry',
        metrics: [
          { label: 'p99 Ingestion Latency', value: '18ms', detail: 'Real-time pipeline speed' },
          { label: 'SLA Availability', value: '99.99%', detail: 'Fault-tolerant multi-cloud' },
          { label: 'Compute Multiplier', value: '12x', detail: 'Throughput gain vs monolith' }
        ],
        speakerNotes: 'Walk through the telemetry metrics that prove production readiness.'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'code',
        title: 'Production Implementation Pattern',
        subtitle: 'Resilient asynchronous worker pattern with type safety',
        codeSnippet: {
          language: 'typescript',
          code: `// Scalable Neural Orchestrator Pipeline
export async function executeDistributedPipeline<T>(
  task: PipelineTask<T>,
  options: ExecutionConfig
): Promise<PipelineResult<T>> {
  const telemetry = trace.startSpan('engine.pipeline');
  try {
    const result = await circuitBreaker.execute(async () => {
      return await neuralCluster.dispatch(task, { timeoutMs: 15_000 });
    });
    return { ok: true, data: result };
  } catch (err) {
    return fallbackEngine.recover(task, err);
  } finally {
    telemetry.end();
  }
}`,
          explanation: 'Non-blocking circuit-breaker dispatch with automatic self-healing recovery.'
        },
        speakerNotes: 'Highlight the typed circuit-breaker pattern preventing cascading outages.'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'timeline',
        title: 'Engineering Deployment Phases',
        subtitle: 'From staging validation to multi-region global rollout',
        timeline: [
          { step: 'Sprint 1', title: 'Architecture & Schema Lockdown', desc: 'Core data contracts, schemas, and unit test suites established.' },
          { step: 'Sprint 2', title: 'Canary Deployment & Stress Test', desc: 'Deploying to 5% canary cohort under simulated peak loads.' },
          { step: 'Sprint 3', title: 'Global Multi-Region Launch', desc: 'Zero-downtime DNS cutover with autonomous monitoring alerts.' }
        ],
        speakerNotes: 'Explain the staged deployment rollout reducing risk.'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'quote',
        title: 'Engineering Philosophy',
        quote: {
          text: 'Simplicity is prerequisite for reliability. Complex architectures break in subtle ways; modular architectures endure.',
          author: 'Principal Systems Architect',
          role: 'Distributed Systems Council'
        },
        speakerNotes: 'Reinforce the value of clean code and decoupled components.'
      },
      {
        id: 's_7',
        slideNumber: 7,
        layout: 'cta',
        title: 'Next Engineering Milestones',
        subtitle: 'Immediate technical deliverables and sprint objectives',
        bullets: [
          'Finalize CI/CD pipeline and integration test harness',
          'Schedule cross-team architectural review and threat modeling',
          'Initiate Phase 1 staging cluster rollout'
        ],
        speakerNotes: 'Conclude with specific action items for the engineering squad.'
      }
    ];

    slides = techSlides.slice(0, slideCount);
  }
  // ==========================================
  // 6. BUSINESS / STARTUP / PITCH DECK
  // ==========================================
  else if (isBusiness) {
    const businessSlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: cleanTitle,
        subtitle: 'Investor Pitch & Strategic Growth Blueprint — Seed to Series A',
        speakerNotes: `Good morning investors and partners. Today we present ${cleanTitle}, our mission to capture and define a high-growth market.`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: 'The Problem & Market Inefficiency',
        subtitle: 'Why existing legacy offerings leave billions on the table',
        bullets: [
          'Customers spend 40%+ of operational budget patching outdated manual software',
          'Fragmented tools cause massive data silos and operational disconnects',
          'Switching costs are high, but customer dissatisfaction is at an all-time peak',
          'Clear market opening for an integrated, modern autonomous alternative'
        ],
        speakerNotes: 'Anchor the pitch in painful, quantifiable customer friction.'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'metrics',
        title: 'Traction, Unit Economics & Market Size',
        subtitle: 'Empirical commercial velocity and financial viability',
        metrics: [
          { label: 'Target TAM', value: '$42B', detail: 'Compound Annual Growth: 28%' },
          { label: 'LTV / CAC Ratio', value: '4.8x', detail: 'Rapid 4-month payback period' },
          { label: 'Gross Margin', value: '82%', detail: 'Highly defensible software economics' }
        ],
        speakerNotes: 'Walk through the unit economics proving capital efficiency.'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'table',
        title: 'Competitive Moat & Defensibility',
        subtitle: 'Why we win against legacy incumbents and emerging contenders',
        table: {
          headers: ['Capabilities', 'Legacy Players', 'Our Breakthrough Platform'],
          rows: [
            ['Time-to-Value', '4 to 8 months onboarding', 'Instant 5-minute autonomous setup'],
            ['Pricing Model', 'Punitive enterprise lock-in', 'Transparent consumption-based value'],
            ['Architecture', 'Brittle monolithic legacy code', 'Modern cloud-native, autonomous pipeline']
          ]
        },
        speakerNotes: 'Showcase the defensibility and structural advantages of our solution.'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'timeline',
        title: 'Go-To-Market & Growth Milestones',
        subtitle: 'Strategic roadmap for rapid market capture',
        timeline: [
          { step: 'Q1', title: 'Product Launch & ICP Focus', desc: 'Secure first 50 enterprise design partners in core vertical.' },
          { step: 'Q2', title: 'Self-Serve Growth Engine', desc: 'Launch frictionless product-led acquisition loop.' },
          { step: 'Q3-Q4', title: 'Enterprise Scaling', desc: 'Scale direct sales and cross-border geographic expansion.' }
        ],
        speakerNotes: 'Demonstrate thoughtful execution and milestone discipline.'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'quote',
        title: 'Customer Endorsement',
        quote: {
          text: 'This platform transformed our operational turnaround from days to minutes. It is an indispensable competitive advantage.',
          author: 'Chief Executive Officer',
          role: 'Global Enterprise Partner'
        },
        speakerNotes: 'Deliver customer validation to de-risk investor conviction.'
      },
      {
        id: 's_7',
        slideNumber: 7,
        layout: 'cta',
        title: 'The Investment Opportunity & Next Steps',
        subtitle: 'Join us in shaping the next market defining category',
        bullets: [
          'Round currently open with high institutional interest',
          'Use of funds: 60% engineering & product, 40% growth & GTM',
          'Access data room and schedule technical diligence session'
        ],
        speakerNotes: 'Close with clarity, conviction, and an explicit call to action.'
      }
    ];

    slides = businessSlides.slice(0, slideCount);
  }
  // ==========================================
  // 6b. AUTOMOTIVE & LUXURY MOBILITY (BMW, MERCEDES, PORSCHE, TESLA)
  // ==========================================
  else if (isAutomotive) {
    const isBMW = lower.includes('bmw');
    const isTesla = lower.includes('tesla');
    const isPorsche = lower.includes('porsche');
    const isMercedes = lower.includes('mercedes') || lower.includes('benz');

    const autoSlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: isBMW ? 'BMW: The Ultimate Driving Machine' : isMercedes ? 'Mercedes-Benz: The Best or Nothing' : isPorsche ? 'Porsche: Driven by Dreams' : isTesla ? 'Tesla: Accelerating Sustainable Transport' : cleanTitle,
        subtitle: isBMW 
          ? 'Bayerische Motoren Werke — Bavarian Heritage, M-Power Precision & The Neue Klasse EV Era'
          : 'Pioneering Automotive Engineering, High-Performance Propulsion & Future Mobility',
        speakerNotes: `Welcome automotive enthusiasts and industry leaders. Today we present a masterclass on ${cleanTitle}, exploring its engineering legacy, performance dynamics, and future mobility vision.`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: isBMW ? 'Origins & Centenary Bavarian Heritage' : 'Engineering Heritage & Brand Genesis',
        subtitle: isBMW ? 'From aircraft engines in 1916 Munich to world-leading luxury automotive titan' : 'Pioneering technological breakthroughs and precision manufacturing',
        bullets: isBMW ? [
          'Founded in 1916 in Munich, Bavaria — originating from Rapp Motorenwerke aircraft engine manufacture',
          'The iconic Roundel emblem representing Bavarian state colors and aeronautical precision',
          'Signature architectural design: The Kidney Grille, Hofmeister kink, and rear-wheel-drive 50:50 balance',
          'Headquarters at the iconic Four-Cylinder Tower (BMW Vierzylinder) and BMW Welt museum in Munich'
        ] : [
          'Pioneering chassis rigidity and precision powertrain dynamics',
          'Decades of motorsport dominance translated into road-legal performance',
          'Uncompromising dedication to driver-centric interior cockpits and luxury ergonomics',
          'Global manufacturing footprint setting world-class robotics and assembly standards'
        ],
        speakerNotes: isBMW 
          ? 'Emphasize the rich 100+ year Bavarian heritage and why BMW engineering identity is unique.'
          : 'Detail the foundational engineering milestones that established market leadership.'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'bullets',
        title: isBMW ? 'BMW M Division: High-Performance Benchmark' : 'High-Performance Lineup & Powertrains',
        subtitle: isBMW ? 'Born on the track (BMW Motorsport GmbH, 1972) to dominate highway and circuit' : 'Uncompromising performance tuning and track-tested capability',
        bullets: isBMW ? [
          'BMW M3 & M4: Legendary S58 3.0L TwinPower Turbo inline-six pushing up to 523+ hp',
          'BMW M5 Competition: High-revving 4.4L twin-turbo V8 paired with M xDrive intelligent AWD system',
          'Lightweight Carbon Core chassis, active M differential, and Nürburgring Nordschleife suspension tuning',
          'Pure driver engagement: Available 6-speed manual transmissions for automotive purists'
        ] : [
          'High-output twin-turbocharged and hybrid powertrains delivering instantaneous torque',
          'Carbon-ceramic braking systems engineered for zero-fade deceleration',
          'Adaptive damper management reading road topography milliseconds in advance',
          'Aerodynamic downforce optimization with active splitters and rear diffusers'
        ],
        speakerNotes: isBMW 
          ? 'Walk through the M-division ethos. Explain how track racing directly informs consumer road cars.'
          : 'Highlight the mechanical specs and performance figures that distinguish the brand.'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'metrics',
        title: isBMW ? 'Global Benchmarks & Empirical Performance' : 'Commercial Scale & Performance Benchmarks',
        subtitle: 'Empirical delivery volume, revenue, and powertrain telemetry',
        metrics: isBMW ? [
          { label: 'Annual Group Revenue', value: '€155.5B', detail: 'Global automotive market leader' },
          { label: 'Deliveries Worldwide', value: '2.55M+', detail: 'Annual vehicle units delivered' },
          { label: 'Max M-Power Output', value: '738 hp', detail: 'BMW XM Label Red hybrid V8' }
        ] : [
          { label: 'Market Capitalization', value: '$80B+', detail: 'Global automotive enterprise value' },
          { label: 'Annual Production', value: '2M+ Units', detail: 'High-precision manufacturing volume' },
          { label: 'Peak Powertrain Output', value: '600+ hp', detail: 'Flagship performance models' }
        ],
        speakerNotes: 'Speak with confidence on these impressive financial and horsepower metrics.'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'timeline',
        title: isBMW ? 'The Electric Era: BMW i & Neue Klasse Roadmap' : 'Electrification & Next-Gen Architecture',
        subtitle: isBMW ? 'From pioneer i3 to the revolutionary 2025+ Neue Klasse EV architecture' : 'Strategic electrification roadmap and zero-emission vision',
        timeline: isBMW ? [
          { step: 'Phase 1: Pioneers', title: 'BMW i3 & i8 (2013)', desc: 'Groundbreaking carbon-fiber-reinforced plastic (CFRP) and plug-in hybrid sports vision.' },
          { step: 'Phase 2: Scale', title: 'BMW i4, iX, i7 & i5', desc: 'Gen 5 eDrive technology delivering up to 380+ miles of pure electric range.' },
          { step: 'Phase 3: Neue Klasse', title: '2025+ Gen 6 Architecture', desc: '800V cylindrical cells offering 30% faster charging and 25% efficiency gains.' }
        ] : [
          { step: 'Phase 1', title: 'Hybrid Electrification', desc: '48V mild-hybrid integration and regenerative kinetic energy recovery.' },
          { step: 'Phase 2', title: 'Dedicated EV Architectures', desc: '800-volt skateboard chassis and advanced liquid-cooled lithium pack designs.' },
          { step: 'Phase 3', title: 'Autonomous Mobility', desc: 'Level 3 autonomous highway driving and AI-guided active cruise systems.' }
        ],
        speakerNotes: isBMW 
          ? 'Detail the Neue Klasse vision—how BMW is transitioning to full electrification without losing driving joy.'
          : 'Explain the staged transition toward full battery-electric propulsion.'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'table',
        title: isBMW ? 'BMW Powertrain Comparison Matrix' : 'Powertrain & Architecture Matrix',
        subtitle: isBMW ? 'Contrasting ICE TwinPower, M-Hybrid, and Pure Electric i-Series' : 'Technical comparative breakdown across modern propulsion types',
        table: isBMW ? {
          headers: ['Specification', 'Internal Combustion (ICE)', 'M-Hybrid Performance', 'Pure Electric (BMW i)'],
          rows: [
            ['Representative Model', 'BMW M3 Competition', 'BMW XM / New M5', 'BMW i4 M50 / iX M60'],
            ['Powertrain', '3.0L S58 Inline-6 Twin-Turbo', '4.4L V8 + Electric Motor', 'Dual Electrically Excited Motors'],
            ['0-100 km/h (0-60 mph)', '3.4 seconds', '3.5 seconds', '3.7 seconds (instant torque)'],
            ['Weight Distribution', '50:50 Near Perfect Balance', 'Adaptive M xDrive Dynamics', 'Low center-of-gravity floor pack']
          ]
        } : {
          headers: ['Vehicle Class', 'Powertrain Type', 'Peak Output', 'Primary Focus'],
          rows: [
            ['Sport Sedans', 'Turbocharged Inline/V6', '380 - 500 hp', 'Driver engagement & agility'],
            ['Luxury Flagships', 'V8 Twin-Turbo / Hybrid', '530 - 620 hp', 'Executive comfort & long-range pace'],
            ['Next-Gen EVs', 'Dual Permanent Magnet Motors', '450 - 650 hp', 'Instantaneous torque & zero emissions']
          ]
        },
        speakerNotes: 'Point out the distinct technical trade-offs between traditional mechanical engines and EV torque.'
      },
      {
        id: 's_7',
        slideNumber: 7,
        layout: 'quote',
        title: isBMW ? 'The Core Brand Philosophy' : 'Enduring Brand Vision',
        quote: isBMW ? {
          text: 'Freude am Fahren — Sheer Driving Pleasure. A BMW is not merely transportation; it is an emotional bond between driver, machine, and road.',
          author: 'BMW Brand Doctrine',
          role: 'Munich, Germany'
        } : {
          text: 'True engineering excellence is achieved when every horsepower, contour, and component serves the driver with total harmony.',
          author: 'Chief Engineering Officer',
          role: 'Automotive Council'
        },
        speakerNotes: isBMW 
          ? 'Recite the famous slogan with emotion. Emphasize why enthusiasts adore the brand.'
          : 'Deliver the core philosophy underpinning the company’s engineering.'
      },
      {
        id: 's_8',
        slideNumber: 8,
        layout: 'cta',
        title: isBMW ? 'The Future: Circular Economy & Next-Gen Cockpits' : 'Conclusion & Next-Generation Horizons',
        subtitle: isBMW ? 'BMW iDrive 9, Panoramic Vision HUD, and 100% recyclable vehicle design' : 'Sustainable production, autonomous drive, and future mobility roadmap',
        bullets: isBMW ? [
          'BMW i Vision Circular: Target of 100% recycled materials and secondary aluminum',
          'BMW Panoramic Vision: Full-windshield projected heads-up display replacing traditional clusters',
          'Plant Dingolfing and Plant Debrecen: Fully green-powered carbon-neutral production facilities',
          'Autonomous Level 3: Hands-free certified highway piloting available across flagship series'
        ] : [
          'Carbon-neutral manufacturing and ethical battery supply chain certification',
          'Over-the-air (OTA) software architecture enabling continuous vehicle feature updates',
          'Next-generation Level 3 highway pilot certified for autonomous transport'
        ],
        speakerNotes: 'Conclude with a forward-looking vision and open the floor for questions.'
      }
    ];

    slides = autoSlides.slice(0, slideCount);
  }
  // ==========================================
  // 7. GENERAL / UNIVERSAL TAILORED ENGINE
  // ==========================================
  else {
    const generalSlides: SlideItem[] = [
      {
        id: 's_1',
        slideNumber: 1,
        layout: 'title',
        title: cleanTitle,
        subtitle: 'Strategic Analysis, Comprehensive Framework & Practical Execution',
        speakerNotes: `Welcome everyone. Today we are presenting a structured, high-impact breakdown of ${cleanTitle}.`
      },
      {
        id: 's_2',
        slideNumber: 2,
        layout: 'split',
        title: 'Core Concept & Strategic Context',
        subtitle: `Understanding the essential foundations and significance of ${cleanTitle}`,
        bullets: [
          `Key fundamental principles underpinning ${cleanTitle}`,
          'Overcoming historical bottlenecks and identifying high-impact leverage points',
          'Aligning theoretical frameworks with pragmatic, real-world execution',
          'Creating sustainable, high-velocity outcomes across all stakeholders'
        ],
        speakerNotes: 'Establish why this subject matters now and what problems we solve.'
      },
      {
        id: 's_3',
        slideNumber: 3,
        layout: 'metrics',
        title: 'Key Indicators & Proven Benchmarks',
        subtitle: 'Quantifiable metrics demonstrating progress and effectiveness',
        metrics: [
          { label: 'Performance Velocity', value: '4.2x', detail: 'Accelerated outcome turnaround' },
          { label: 'Quality SLA', value: '99.2%', detail: 'Consistent high-precision delivery' },
          { label: 'Overall Impact', value: 'Top 5%', detail: 'Industry leading benchmark standard' }
        ],
        speakerNotes: 'Review the quantitative milestones that confirm success.'
      },
      {
        id: 's_4',
        slideNumber: 4,
        layout: 'timeline',
        title: 'Structured Implementation Phasing',
        subtitle: 'Step-by-step roadmap from initial setup to scalable success',
        timeline: [
          { step: 'Phase 1', title: 'Foundation & Scoping', desc: 'Audit core prerequisites, assemble resources, and define success metrics.' },
          { step: 'Phase 2', title: 'Execution & Calibration', desc: 'Deploy structured workflows, gather real-time feedback, and iterate rapidly.' },
          { step: 'Phase 3', title: 'Optimization & Mastery', desc: 'Institutionalize best practices and scale outcomes sustainably.' }
        ],
        speakerNotes: 'Walk the team through each phase of the implementation cycle.'
      },
      {
        id: 's_5',
        slideNumber: 5,
        layout: 'table',
        title: 'Strategic Comparison & Best Practices',
        subtitle: 'Contrasting outdated conventional approaches with modern standards',
        table: {
          headers: ['Evaluation Factor', 'Conventional Method', 'Modern Best Practice'],
          rows: [
            ['Approach', 'Ad-hoc, reactive and fragmented', 'Proactive, systematic and data-driven'],
            ['Execution Speed', 'Slow with high frictional drag', 'Agile, automated and predictable'],
            ['Long-Term Outcome', 'Diminishing marginal returns', 'Compounding exponential value']
          ]
        },
        speakerNotes: 'Draw a sharp contrast between proactive modern strategy and conventional inertia.'
      },
      {
        id: 's_6',
        slideNumber: 6,
        layout: 'quote',
        title: 'Guiding Principle & Strategic Vision',
        quote: {
          text: `Excellence in ${cleanTitle} is not an isolated act, but an ongoing standard cultivated through disciplined execution.`,
          author: 'Executive Leadership Council',
          role: 'Core Doctrine'
        },
        speakerNotes: 'Recite this thought with conviction to inspire the audience.'
      },
      {
        id: 's_7',
        slideNumber: 7,
        layout: 'cta',
        title: 'Summary & Actionable Next Steps',
        subtitle: 'Concrete deliverables and immediate priorities',
        bullets: [
          'Commence Phase 1 orientation and asset allocation immediately',
          'Establish weekly milestone reviews and transparent reporting',
          'Empower domain leads with clear ownership of key deliverables'
        ],
        speakerNotes: 'Reiterate the core call-to-action and invite audience questions.'
      }
    ];

    slides = generalSlides.slice(0, slideCount);
  }

  // Ensure every slide has proper sequential numbers and IDs
  slides = slides.map((s, idx) => ({
    ...s,
    slideNumber: idx + 1,
    id: `slide_${idx + 1}_${Date.now()}`
  }));

  // If user requested more slides than in array, duplicate or synthesize supplementary slides
  while (slides.length < slideCount) {
    const nextIdx = slides.length + 1;
    slides.push({
      id: `slide_${nextIdx}_${Date.now()}`,
      slideNumber: nextIdx,
      layout: nextIdx % 2 === 0 ? 'bullets' : 'split',
      title: `Strategic Pillar ${nextIdx}: Operational Excellence`,
      subtitle: `Deep dive into advanced considerations for ${cleanTitle}`,
      bullets: [
        'Rigorous quality assurance protocols across all lifecycle stages',
        'Cross-functional communication channels ensuring unified velocity',
        'Continuous benchmarking against global tier-1 standards'
      ],
      speakerNotes: `Focus on reinforcing the foundational discipline required for stage ${nextIdx}.`
    });
  }

  const authoritativeTitle = slides[0]?.title || cleanTitle;
  const authoritativeDesc = slides[0]?.subtitle || `Executive Keynote Presentation Deck on "${authoritativeTitle}"`;

  return {
    id: `deck_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    topic: rawTopic,
    theme,
    title: authoritativeTitle,
    description: authoritativeDesc,
    slides,
    createdAt: Date.now()
  };
}
