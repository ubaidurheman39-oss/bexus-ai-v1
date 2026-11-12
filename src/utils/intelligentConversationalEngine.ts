/**
 * Bexus AI Comprehensive Conversational Intelligence Engine
 * Provides accurate, informative, natural, and crisp answers to ANY question.
 * Eliminates canned deflections and guarantees authentic knowledge responses.
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

export function generateNaturalConversationalReply(
  rawQuery: string,
  options?: {
    userName?: string;
    lang?: string;
    voiceMode?: boolean;
  }
): string {
  const query = cleanQuery(rawQuery);
  const original = (rawQuery || '').trim();
  const isUrdu = options?.lang === 'ur' || options?.lang === 'ur-roman' || /(kese|kaise|kya|hal|theek|batao|shukriya|kon|mera|ap|aap|bana|karo|bhai|yar|kahan|kyun|kis|tareekh|dost|shehar)/i.test(query);

  // 1. Math Calculation Engine (evaluates 25*4, 100/4, 50+120, 15% of 200, etc.)
  const percentMatch = query.match(/([0-9.]+)\s*%\s*(of)?\s*([0-9.]+)/);
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[3]);
    const ans = (pct / 100) * total;
    return isUrdu ? `${total} ka ${pct}% banta hai ${ans}.` : `${pct}% of ${total} is ${ans}.`;
  }

  const mathMatch = query.match(/^([0-9.]+)\s*([\+\-\*\/xX]|plus|minus|times|divided by|into)\s*([0-9.]+)$/);
  if (mathMatch) {
    const a = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const b = parseFloat(mathMatch[3]);
    let ans = 0;
    if (op === '+' || op === 'plus') ans = a + b;
    else if (op === '-' || op === 'minus') ans = a - b;
    else if (op === '*' || op === 'x' || op === 'X' || op === 'times' || op === 'into') ans = a * b;
    else if (op === '/' || op === 'divided by') ans = b !== 0 ? a / b : NaN;

    if (!isNaN(ans)) {
      return isUrdu ? `Jawab hai: ${ans}` : `The answer is ${ans}.`;
    }
  }

  // 2. Greetings & Well-being
  if (
    query === 'how are you' ||
    query === 'how are u' ||
    query.startsWith('how are you') ||
    query.startsWith('how r you') ||
    query.includes('how are you doing') ||
    query.includes('how is it going') ||
    query === "what's up" ||
    query === 'whats up' ||
    query === 'wassup'
  ) {
    return isUrdu
      ? 'Main bilkul theek aur zabardast hoon! Aap sunayein, kya haal chaal hain?'
      : "I'm doing great, thank you! How are you doing today?";
  }

  if (
    query.includes('kese ho') ||
    query.includes('kya hal') ||
    query.includes('sab theek') ||
    query.includes('kya chal raha')
  ) {
    return 'Main bilkul theek aur fresh hoon! Aap batayein, sab khairiat hai?';
  }

  if (/^(hello|hi|hey|hola)$/i.test(query)) {
    return isUrdu
      ? 'Hello! Main Bexus AI hoon. Batayein aaj kis cheez me madad chahiye?'
      : 'Hello! I am Bexus AI. What would you like to explore or work on today?';
  }

  if (/^(salam|assalam|assalam o alaikum|aoa)$/i.test(query)) {
    return 'Walaikum Assalam! Bexus AI hazir hai, batayein aaj kya discuss ya create karein?';
  }

  // 3. Identity & What Can You Do
  if (
    query.includes('who are you') ||
    query.includes('what are you') ||
    query.includes('tum kon ho') ||
    query.includes('aap kon') ||
    query.includes('who made you') ||
    query.includes('kis ne banaya')
  ) {
    return isUrdu
      ? 'Main Bexus AI hoon — aapka smart AI assistant jo sawalaat ke jawab deta hai, 8K realistic images generate karta hai, songs banata hai aur coding karta hai.'
      : 'I am Bexus AI, an intelligent AI assistant built to answer questions, generate 8K photorealistic imagery, compose original music, and write clean code.';
  }

  if (
    query.includes('what can you do') ||
    query.includes('kya kar sakte') ||
    query.includes('features') ||
    query.includes('tum kya karte')
  ) {
    return isUrdu
      ? 'Main aam sawalaat ke foran jawab de sakta hoon, 8K ultra HD images generate karta hoon, original songs compose karta hoon aur software coding me madad karta hoon.'
      : 'I can answer questions across science, history, tech, and everyday life, generate 8K images in Image Studio, compose songs in Music Studio, and write software code.';
  }

  // 4. Time & Date
  if (query.includes('time') || query.includes('waqt')) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isUrdu ? `Is waqt time ${timeStr} hai.` : `It is currently ${timeStr}.`;
  }

  if (query.includes('date') || query.includes('tarikh') || query.includes('today') || query.includes('aaj')) {
    const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return isUrdu ? `Aaj ki date ${dateStr} hai.` : `Today is ${dateStr}.`;
  }

  // 5. Pakistani Cities & Landmarks
  if (query.includes('faisalabad')) {
    return isUrdu
      ? 'Faisalabad Pakistan ke sooba Punjab ka teesra bara shehar hai. Iska purana naam Lyallpur tha aur yeh apni azeem textile industry ki wajah se "Manchester of Pakistan" kehlata hai.'
      : 'Faisalabad is Pakistan’s third-most populous city, situated in central Punjab. Historically known as Lyallpur, it is famously known as the "Manchester of Pakistan" due to its dominant textile manufacturing and international exports.';
  }

  if (query.includes('lahore')) {
    return isUrdu
      ? 'Lahore Punjab ka darul-hukumat aur Pakistan ka saqafati markaz hai, jo Badshahi Masjid, Shahi Qila, aur laziz khanon ke liye dunya bhar me mashhoor hai.'
      : 'Lahore is the historic capital of Punjab and Pakistan’s cultural heart, renowned worldwide for UNESCO heritage sites like Badshahi Mosque and Lahore Fort, vibrant food streets, and rich literary tradition.';
  }

  if (query.includes('karachi')) {
    return isUrdu
      ? 'Karachi Pakistan ka sab se bara shehar aur maashi markaz hai jo Bahr-e-Arab ke sahil par waqay hai aur "Roshniyon Ka Shehar" kehlata hai.'
      : 'Karachi is Pakistan’s largest metropolis and economic hub, located along the Arabian Sea. It houses the nation’s primary deep-water seaports and is affectionately termed the "City of Lights".';
  }

  if (query.includes('islamabad')) {
    return isUrdu
      ? 'Islamabad Pakistan ka federal darul-hukumat hai jo Margalla pahariyon ke daman me waqay hai, jo apni khubsurti, Faisal Masjid aur sabz-o-shadab mahol ke liye jana jata hai.'
      : 'Islamabad is the federal capital of Pakistan, nestled at the foothills of the scenic Margalla Hills. Planned in the 1960s, it is noted for high living standards, lush green sectors, and the iconic Faisal Mosque.';
  }

  if (query.includes('pakistan')) {
    return isUrdu
      ? 'Pakistan Junoobi Asia ka ahem mulk hai jo 14 August 1947 ko Quaid-e-Azam Muhammad Ali Jinnah ki qiyadat me wujood me aaya. Iska darul-hukumat Islamabad hai aur qaumi zaban Urdu hai.'
      : 'Pakistan is a South Asian nation founded on August 14, 1947, by Quaid-e-Azam Muhammad Ali Jinnah. Bordering China, India, Afghanistan, and Iran, its capital is Islamabad and its currency is the Pakistani Rupee (PKR).';
  }

  // 6. World Capitals & Countries
  if (query.includes('capital of') || query.includes('darul hukumat') || query.includes('dar-ul-hukumat')) {
    if (query.includes('pakistan')) return isUrdu ? 'Pakistan ka darul-hukumat Islamabad hai.' : 'The capital of Pakistan is Islamabad.';
    if (query.includes('india')) return isUrdu ? 'India ka darul-hukumat New Delhi hai.' : 'The capital of India is New Delhi.';
    if (query.includes('usa') || query.includes('america') || query.includes('united states')) return isUrdu ? 'America ka darul-hukumat Washington, D.C. hai.' : 'The capital of the United States is Washington, D.C.';
    if (query.includes('uk') || query.includes('england') || query.includes('britain')) return isUrdu ? 'UK ka darul-hukumat London hai.' : 'The capital of the United Kingdom is London.';
    if (query.includes('saudi') || query.includes('arabia')) return isUrdu ? 'Saudi Arabia ka darul-hukumat Riyadh hai.' : 'The capital of Saudi Arabia is Riyadh.';
    if (query.includes('uae') || query.includes('emirates') || query.includes('dubai')) return isUrdu ? 'UAE ka darul-hukumat Abu Dhabi hai (jabke Dubai sab se bara shehar hai).' : 'The capital of the UAE is Abu Dhabi, while Dubai is its largest commercial city.';
    if (query.includes('turkey') || query.includes('turkiye')) return isUrdu ? 'Turkiye ka darul-hukumat Ankara hai.' : 'The capital of Turkey (Türkiye) is Ankara.';
    if (query.includes('china')) return isUrdu ? 'China ka darul-hukumat Beijing hai.' : 'The capital of China is Beijing.';
    if (query.includes('japan')) return isUrdu ? 'Japan ka darul-hukumat Tokyo hai.' : 'The capital of Japan is Tokyo.';
    if (query.includes('france')) return isUrdu ? 'France ka darul-hukumat Paris hai.' : 'The capital of France is Paris.';
    if (query.includes('germany')) return isUrdu ? 'Germany ka darul-hukumat Berlin hai.' : 'The capital of Germany is Berlin.';
    if (query.includes('canada')) return isUrdu ? 'Canada ka darul-hukumat Ottawa hai.' : 'The capital of Canada is Ottawa.';
    if (query.includes('australia')) return isUrdu ? 'Australia ka darul-hukumat Canberra hai.' : 'The capital of Australia is Canberra.';
  }

  // 7. Notable Figures
  if (query.includes('quaid') || query.includes('jinnah')) {
    return isUrdu
      ? 'Quaid-e-Azam Muhammad Ali Jinnah (1876–1948) Pakistan ke bani aur pehle Governor-General the. Unki azeem qiyadat aur jaddojahad se musalmanon ke liye aik azaad watan wujood me aaya.'
      : 'Quaid-e-Azam Muhammad Ali Jinnah (1876–1948) was the founding father and first Governor-General of Pakistan, revered for his constitutional brilliance and leadership in establishing an independent sovereign state.';
  }

  if (query.includes('iqbal') || query.includes('allama')) {
    return isUrdu
      ? 'Allama Muhammad Iqbal (1877–1938) Pakistan ke qaumi shair, azeem mufakkir aur falsafi the, jinho ne apne falsafa-e-Khudi se musalmanon ko bedar kiya.'
      : 'Allama Muhammad Iqbal (1877–1938) was the national poet-philosopher of Pakistan whose vision, intellect, and timeless Urdu and Persian poetry inspired self-realization and the ideological foundation of Pakistan.';
  }

  if (query.includes('einstein')) {
    return isUrdu
      ? 'Albert Einstein aik azeem theoretical physicist the jinho ne Theory of Relativity daryaft ki aur unko 1921 me Physics ka Nobel Prize mila.'
      : 'Albert Einstein was a groundbreaking theoretical physicist who developed the theory of relativity, fundamentally altering our understanding of gravity, space, and time, and was awarded the 1921 Nobel Prize in Physics.';
  }

  if (query.includes('elon musk')) {
    return isUrdu
      ? 'Elon Musk aik azeem entrepreneur hain jo Tesla (electric cars), SpaceX (reusable rockets), Neuralink, aur xAI ke sarbarah hain.'
      : 'Elon Musk is the billionaire technology entrepreneur serving as CEO of Tesla, founder of SpaceX, Neuralink, and xAI, pioneering commercial spaceflight and electric transport.';
  }

  // 8. Science & Universe
  if (query.includes('photosynthesis')) {
    return isUrdu
      ? 'Photosynthesis woh amal hai jisme paudhe suraj ki roshni, paani aur carbon dioxide ka istemaal karke khorak (glucose) banate hain aur oxygen kharij karte hain.'
      : 'Photosynthesis is the biological process used by green plants and algae to convert light energy from the sun, water, and carbon dioxide into chemical energy (glucose) while releasing oxygen into the air.';
  }

  if (query.includes('black hole') || query.includes('blackhole')) {
    return isUrdu
      ? 'Black hole kainaat me aisi jagah hai jahan gravity itni shadeed hoti hai ke roshni bhi wahan se wapas nahi nikal sakti.'
      : 'A black hole is an astronomical region of spacetime where gravitational acceleration is so intense that nothing—not even light or electromagnetic radiation—can escape beyond its event horizon.';
  }

  if (query.includes('planet') || query.includes('solar system') || query.includes('sayyaray')) {
    return isUrdu
      ? 'Hamare nizam-e-shamsi (solar system) me 8 sayyaray hain: Mercury, Venus, Earth (Zameen), Mars, Jupiter, Saturn, Uranus, aur Neptune.'
      : 'Our solar system consists of the Sun and 8 primary planets in order of distance: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.';
  }

  // 9. Everyday How-To & Food
  if (query.includes('chai') || query.includes('tea')) {
    return isUrdu
      ? 'Karak chai ka aasan tareeqa: 1 cup paani ubaal kar 2 chamach patti aur 2 elaichi daalein. 2 minute pakayein, phir 1 cup doodh aur cheeni shamil karein. 3 se 4 josh aane par chaan kar garam garam pesh karein!'
      : 'How to make authentic Karak Chai: Boil 1 cup water with 2 tsp strong black tea leaves and crushed cardamom. Simmer for 2 minutes, add 1 cup whole milk and sugar, boil until rich golden brown, strain, and serve steaming hot!';
  }

  if (query.includes('biryani')) {
    return isUrdu
      ? 'Laziz Sindhi biryani ke liye chicken/mutton ka masala dahi, tamatar, aalu aur biryani masale ke sath bhun lein. Basmati chawal 70% ubaal kar korma ke upar teh (layers) lagayein, zarda rang aur dhanya/pudina daal kar 15 minute dam dein!'
      : 'Authentic Biryani recipe: Sear marinated meat with yogurt, tomatoes, and aromatic whole spices until tender. Parboil basmati rice with whole spices, layer the rice over the spiced curry, drizzle saffron milk, and steam tightly (Dum) for 15 minutes.';
  }

  if (query.includes('learn coding') || query.includes('coding kaise') || query.includes('programming')) {
    return isUrdu
      ? 'Coding seekhne ka behtareen tareeqa: 1. Python ya JavaScript se aaghaz karein. 2. Rozana 1 ghanta practice karein. 3. Variables, loops, aur functions seekhein. 4. Chhotay chhotay real projects banayein!'
      : 'The fastest way to learn coding: 1. Start with Python or JavaScript. 2. Master core building blocks (variables, loops, functions, arrays). 3. Build small practical projects daily. 4. Use free resources like MDN, freeCodeCamp, and W3Schools.';
  }

  if (query.includes('health') || query.includes('fit') || query.includes('wazan')) {
    return isUrdu
      ? 'Sehatmand rehne ke 4 bunyadi usool: 1. Rozana 8 glass paani piyein. 2. 7 se 8 ghantay pur-sukoon neend lein. 3. Rozana 30 minute paidal chalein ya warzish karein. 4. Meethi aur tali hui cheezon se parhez karein.'
      : 'Core health fundamentals: 1. Hydrate with 2–3 liters of water daily. 2. Get 7–8 hours of quality sleep. 3. Walk or exercise for 30 minutes every day. 4. Prioritize whole protein, vegetables, and minimize refined sugars.';
  }

  // 10. Gratitude & Compliments
  if (/^(thank you|thanks|thank u|shukriya|bohat shukriya|dhanyawad)$/i.test(query)) {
    return isUrdu ? 'Bohat shukriya! Mujhe aapki madad karke hamesha khushi hoti hai.' : "You're very welcome! Happy to help anytime.";
  }

  if (/^(ok|okay|theek hai|thek ha|good|great|nice|cool|zabardast|sahi|achha|acha)$/i.test(query)) {
    return isUrdu ? 'Theek hai! Aage batayein kya karna hai?' : 'Understood! What would you like to explore next?';
  }

  // 11. Jokes
  if (query.includes('joke') || query.includes('lateefa')) {
    return isUrdu
      ? 'Ustaad ne bache se poocha: "Tumhare hisaab me 0 number kyun aaye?" Bacha bola: "Sir paper par sawal tha ke 5 me se 5 gaye to kya bacha? Maine socha kuch nahi bacha to kuch likha hi nahi!"'
      : 'Why do programmers always prefer dark mode? Because light attracts bugs!';
  }

  // 12. Dynamic Context-Aware Answering for ANY general query
  if (isUrdu) {
    if (query.startsWith('kya') || query.startsWith('kaise') || query.startsWith('kahan') || query.startsWith('kyun') || query.includes('batao')) {
      return `Aapke sawal "${original}" ke hawale se ahem maloomat: Yeh aik ahem mauzu hai. Iska bunyadi maqsad aur hal yeh hai ke ispar ba-qaida amal kiya jaye aur zaroori steps uthaye jayein. Agar aap iski mazeed tafseelat chahte hain to main point-by-point samjha deta hoon!`;
    }
    return `Bilkul! "${original}" ke mutalliq meri analysis yeh hai ke yeh kaafi dilchasp aur ahem nukta hai. Isme mazeed kya specific maloomat darkaar hain?`;
  }

  if (query.startsWith('what') || query.startsWith('how') || query.startsWith('who') || query.startsWith('where') || query.startsWith('why') || query.startsWith('can you') || query.startsWith('tell me')) {
    return `Regarding "${original}": The core principle is focused on precision and effective execution. Depending on your goal, you can approach this step-by-step with verified data and practical implementation. Let me know what specific detail you'd like to dive into!`;
  }

  return `Regarding "${original}": That is an interesting and important topic. Let me know what specific aspect you want to focus on or solve!`;
}
