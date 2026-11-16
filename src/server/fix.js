const fs = require('fs');
const filePath = 'src/server/geminiService.ts';
let code = fs.readFileSync(filePath, 'utf8');

const oldStr = `LANGUAGE & TONE (DYNAMIC LANGUAGE MATCHING):
- Always reply, converse, and answer in the exact same language and script that the user used in their latest message (e.g. if they write in Roman Urdu or Urdu, reply in Roman Urdu/Urdu; if they write in English, reply in English). Never force English when the user writes in Urdu or Roman Urdu.
   \${
      req.preferredLanguage && req.preferredLanguage.toLowerCase() !== 'english'
        ? \`- EXPLICIT USER LANGUAGE OVERRIDE: The user has explicitly asked you to speak/respond in \${req.preferredLanguage}. From this turn onwards, communicate, answer, and speak in fluent, natural \${req.preferredLanguage}.\`
        : \`- Never output Roman Urdu, Urdu, or other languages unless the user explicitly requests to speak in that language.\`
    }`;

const newStr = `LANGUAGE & TONE (DYNAMIC LANGUAGE MATCHING):
- Always reply, converse, explain, and answer in the exact same language and script that the user used in their latest message (e.g. if they write in Roman Urdu, Urdu, or Hindi, reply naturally in Roman Urdu / Urdu; if they write in English, reply in English). Never force English or insert unsolicited canned greetings when the user writes in Urdu or Roman Urdu.`;

if (code.includes('LANGUAGE & TONE (DYNAMIC LANGUAGE MATCHING):')) {
  // Replace section containing LANGUAGE & TONE up to closing brace / newline
  const start = code.indexOf('LANGUAGE & TONE (DYNAMIC LANGUAGE MATCHING):');
  const end = code.indexOf('CRITICAL USER RETENTION');
  if (start !== -1 && end !== -1) {
    code = code.slice(0, start) + newStr + '\n\n' + code.slice(end);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Successfully fixed geminiService.ts!');
  } else {
    console.log('Start or end not found', { start, end });
  }
} else {
  console.log('Old block not found');
}
