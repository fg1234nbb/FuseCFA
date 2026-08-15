// Assigns stable IDs (L{level}-{n}) to any question object in
// questions.js that doesn't already have one. Safe to re-run any
// time you paste in freshly-generated questions — existing IDs are
// left completely untouched, so nobody's saved progress (which is
// keyed by these IDs) gets scrambled by a re-run.

const fs = require('fs');
const path = 'src/data/questions.js';
let src = fs.readFileSync(path, 'utf8');

const startMarker = 'export const QUESTIONS_BY_LEVEL = {\n';
const endMarker = '\n};\n\nexport const QUICKSHEETS';

const startIdx = src.indexOf(startMarker) + startMarker.length;
const endIdx = src.indexOf(endMarker);
if (startIdx < 0 || endIdx < 0) throw new Error('markers not found');

const before = src.slice(0, startIdx);
let body = '\n' + src.slice(startIdx, endIdx); // synthetic leading \n, see below
const after = src.slice(endIdx);

const levelMarkerRe = /\n {2}(\d): \[\n/g;
const matches = [...body.matchAll(levelMarkerRe)];

let rebuilt = '';
let cursor = 0;

matches.forEach((m, i) => {
  const segStart = m.index + m[0].length;
  const segEnd = i + 1 < matches.length ? matches[i + 1].index : body.length;
  const level = m[1];

  rebuilt += body.slice(cursor, segStart);
  const segment = body.slice(segStart, segEnd);

  // Split into individual question-object chunks on the opening brace.
  const chunks = segment.split(/(?=^ {4}\{\n)/m).filter(Boolean);

  let maxExisting = 0;
  chunks.forEach((c) => {
    const m2 = c.match(/^ {6}id: 'L\d+-(\d+)',\n/m);
    if (m2) maxExisting = Math.max(maxExisting, parseInt(m2[1], 10));
  });

  let next = maxExisting + 1;
  let added = 0;
  const newChunks = chunks.map((c) => {
    if (/^ {6}id: 'L\d+-\d+',\n/m.test(c)) return c; // already has one — leave it alone
    const id = `L${level}-${String(next).padStart(2, '0')}`;
    next += 1;
    added += 1;
    return c.replace(/^( {4}\{\n)( {6}topic:)/m, `$1      id: '${id}',\n$2`);
  });

  console.log(`Level ${level}: ${chunks.length} questions total, ${added} new ID${added === 1 ? '' : 's'} assigned (kept ${chunks.length - added} existing)`);
  rebuilt += newChunks.join('');
  cursor = segEnd;
});

rebuilt += body.slice(cursor);
rebuilt = rebuilt.slice(1); // strip the synthetic leading newline

fs.writeFileSync(path, before + rebuilt + after);
console.log('Done.');
