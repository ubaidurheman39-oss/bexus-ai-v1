const fs = require('fs');
let code = fs.readFileSync('src/server/geminiService.ts', 'utf8');

const newBlock = `LANGUAGE & TONE (DYNAMIC LANGUAGE MATCHING & AUTO-DETECTION):
- DYNAMIC LANGUAGE MATCHING: Always reply, converse, explain, and answer in the exact same language and script that the user used in their latest question or message.
- If the user writes in Roman Urdu or Urdu (e.g. 'mujhe aik dukan kholni ha', 'kaise ho', 'kya haal hai'), reply naturally and fluently in Roman Urdu / Urdu.
- If the user writes in English, reply in fluent English.
- Never force English or insert unsolicited canned greetings like 'Hello I am great' — match the user's language and tone directly.`;

const idx = code.indexOf('LANGUAGE & TONE');
const endIdx = code.indexOf('CRITICAL USER RETENTION');
if (idx !== -1 && endIdx !== -1) {
  code = code.slice(0, idx) + newBlock + '\n\n' + code.slice(endIdx);
  fs.writeFileSync('src/server/geminiService.ts', code, 'utf8');
  console.log('Successfully updated system instruction language policy!');
} else {
  console.log('Could not find indices', { idx, endIdx });
}
