// ============================================================
// merge-batches.js
//
// Reads every file in new-batches/level-<N>/ (one file per topic,
// each containing the raw JS array Claude generated -- markdown
// fences are stripped automatically if present), validates them,
// flags likely duplicates (against existing questions.js content
// AND within the new file itself, in case multiple sub-batches got
// concatenated), and merges only the non-flagged ones into
// questions.js. Flagged items are written to a report instead of
// silently kept or dropped -- you decide what to do with those.
//
// This does NOT call an LLM at all for the merge itself -- the
// duplicate check is a plain text-similarity heuristic (Jaccard
// overlap on normalized words), checked two ways: on the combined
// vignette+stem text, AND on the stem alone. The stem-alone check
// matters because two questions can have very different cover-story
// vignettes (different numbers, different scenario) while asking
// the exact same underlying question -- that's the case a
// combined-text-only comparison can miss.
//
// This WILL occasionally flag two genuinely different questions that
// happen to share a lot of wording (false positive -- just glance and
// keep both), and it WILL occasionally miss a duplicate that's been
// completely reworded with different words for the same idea (false
// negative -- a heuristic, not true semantic understanding). It's a
// safety net, not a guarantee -- worth a skim of the report either
// way, especially for a large topic like Ethics.
//
// USAGE:
//   1. Save each topic's generated output as its own file in
//      new-batches/level-1/<anything>.txt -- filename doesn't
//      matter, the `topic` field inside each question is what's
//      actually used. Change LEVEL below to merge level 2 or 3.
//   2. node scripts/merge-batches.js
//   3. Read merge-report.txt for anything flagged.
//   4. node scripts/add-question-ids.js  (assigns IDs to what was merged)
// ============================================================

const fs = require('fs');
const path = require('path');

const LEVEL = 1; // change this to merge into a different level's batch folder
const SIMILARITY_THRESHOLD = 0.55; // combined vignette+stem, 0-1, higher = stricter
const STEM_SIMILARITY_THRESHOLD = 0.6; // stem alone -- catches same-question-different-vignette cases

const VALID_TOPICS = {
  1: ['FSA', 'QUANT', 'FIXED INCOME', 'DERIVATIVES', 'PORTFOLIO MGMT', 'ECONOMICS', 'CORPORATE ISSUERS', 'ETHICS', 'EQUITY INVESTMENTS', 'ALTERNATIVE INVESTMENTS'],
  2: ['FSA', 'EQUITY INVESTMENTS', 'FIXED INCOME', 'DERIVATIVES', 'QUANT', 'ALTERNATIVE INVESTMENTS', 'CORPORATE ISSUERS', 'ECONOMICS', 'PORTFOLIO MANAGEMENT', 'ETHICS'],
  3: ['ASSET ALLOCATION', 'PRIVATE WEALTH (PATHWAY)', 'PERFORMANCE MEASUREMENT', 'PORTFOLIO CONSTRUCTION', 'DERIVATIVES & RISK MGMT', 'ETHICS', 'PORTFOLIO MGMT (PATHWAY)', 'PRIVATE MARKETS (PATHWAY)'],
};

const STOPWORDS = new Set(['a', 'an', 'the', 'is', 'are', 'of', 'to', 'in', 'for', 'on', 'at', 'and', 'or', 'this', 'that', 'be', 'as', 'by', 'with', 'its', 'it', 'was', 'will', 'has', 'have', 'what', 'which']);

function tokenize(text) {
  return new Set(
    (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function jaccard(setA, setB) {
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function questionText(q) {
  return `${q.vignette || ''} ${q.stem || ''}`;
}

function compareQuestions(tokensA, stemTokensA, tokensB, stemTokensB) {
  const combinedSim = jaccard(tokensA, tokensB);
  const stemSim = jaccard(stemTokensA, stemTokensB);
  const flagged = combinedSim >= SIMILARITY_THRESHOLD || stemSim >= STEM_SIMILARITY_THRESHOLD;
  return { flagged, combinedSim, stemSim };
}

function stripFences(raw) {
  return raw.replace(/^\s*```(?:javascript|js|json)?\s*/i, '').replace(/\s*```\s*$/i, '');
}

function parseArray(raw, filename) {
  const cleaned = stripFences(raw);
  try {
    // eslint-disable-next-line no-new-func
    const arr = new Function(`return (${cleaned});`)();
    if (!Array.isArray(arr)) throw new Error('not an array');
    return arr;
  } catch (e) {
    console.error(`!! Could not parse ${filename}: ${e.message}`);
    return [];
  }
}

function loadExistingQuestions() {
  const questionsPath = path.join(__dirname, '..', 'src', 'data', 'questions.js');
  let src = fs.readFileSync(questionsPath, 'utf8');
  const jsSrc = src.replace(/export const/g, 'const') + '\nmodule.exports = { QUESTIONS_BY_LEVEL };';
  const tmpPath = path.join(__dirname, '_tmp_questions_eval.cjs');
  fs.writeFileSync(tmpPath, jsSrc);
  delete require.cache[require.resolve(tmpPath)];
  const { QUESTIONS_BY_LEVEL } = require(tmpPath);
  fs.unlinkSync(tmpPath);
  return { QUESTIONS_BY_LEVEL, rawSrc: src, questionsPath };
}

function main() {
  const batchDir = path.join(__dirname, '..', 'new-batches', `level-${LEVEL}`);
  if (!fs.existsSync(batchDir)) {
    console.error(`No folder found at ${batchDir}. Create it and add your topic files first.`);
    return;
  }
  const files = fs.readdirSync(batchDir).filter((f) => !f.startsWith('.') && f !== 'README.md');
  if (files.length === 0) {
    console.error(`${batchDir} has no batch files yet -- nothing to merge.`);
    return;
  }

  const { QUESTIONS_BY_LEVEL, rawSrc, questionsPath } = loadExistingQuestions();
  const existing = QUESTIONS_BY_LEVEL[LEVEL] || [];

  const toMerge = [];
  const report = [];
  let totalParsed = 0;

  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(batchDir, file), 'utf8');
    const arr = parseArray(raw, file);
    totalParsed += arr.length;

    // Internal (within-file) duplicate check first.
    const survivorsAfterInternalCheck = [];
    arr.forEach((q, i) => {
      const problems = [];
      if (!q.topic || !VALID_TOPICS[LEVEL].includes(q.topic)) problems.push(`unrecognized topic "${q.topic}"`);
      if (!q.vignette) problems.push('missing vignette');
      if (!q.stem) problems.push('missing stem');
      if (!Array.isArray(q.options) || q.options.length !== 3) problems.push('options is not length 3');
      if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 2) problems.push('bad correct index');
      if (!q.explain) problems.push('missing explain');
      if (q.id) delete q.id;

      if (problems.length) {
        report.push(`STRUCTURAL ISSUE in ${file} [index ${i}]: ${problems.join('; ')}`);
        return;
      }

      const tokens = tokenize(questionText(q));
      const stemTokens = tokenize(q.stem);
      let isDup = false;
      for (const prev of survivorsAfterInternalCheck) {
        const { flagged, combinedSim, stemSim } = compareQuestions(tokens, stemTokens, prev._tokens, prev._stemTokens);
        if (flagged) {
          report.push(`POSSIBLE INTERNAL DUPLICATE in ${file}: index ${i} vs index ${prev._idx} (combined ${combinedSim.toFixed(2)}, stem ${stemSim.toFixed(2)})\n  New: "${q.stem}"\n  Existing in same file: "${prev.stem}"`);
          isDup = true;
          break;
        }
      }
      if (!isDup) survivorsAfterInternalCheck.push({ ...q, _tokens: tokens, _stemTokens: stemTokens, _idx: i });
    });

    // Against-existing duplicate check (same topic only).
    survivorsAfterInternalCheck.forEach((q) => {
      const sameTopicExisting = existing.filter((e) => e.topic === q.topic);
      let isDup = false;
      for (const e of sameTopicExisting) {
        const eTokens = tokenize(questionText(e));
        const eStemTokens = tokenize(e.stem);
        const { flagged, combinedSim, stemSim } = compareQuestions(q._tokens, q._stemTokens, eTokens, eStemTokens);
        if (flagged) {
          report.push(`POSSIBLE DUPLICATE vs EXISTING (${e.id || 'no id yet'}): "${q.stem}"\n  Resembles existing: "${e.stem}" (combined ${combinedSim.toFixed(2)}, stem ${stemSim.toFixed(2)})`);
          isDup = true;
          break;
        }
      }
      if (!isDup) {
        delete q._tokens;
        delete q._stemTokens;
        delete q._idx;
        toMerge.push(q);
      }
    });
  });

  // Build the merged questions.js source: insert toMerge before the level's closing `],`.
  const levelMarker = new RegExp(`\\n  ${LEVEL}: \\[`);
  const startIdx = rawSrc.search(levelMarker);
  if (startIdx === -1) {
    console.error(`Could not find level ${LEVEL}'s array in questions.js -- aborting, nothing written.`);
    return;
  }
  const openIdx = rawSrc.indexOf('[', startIdx);
  let depth = 0;
  let closeIdx = -1;
  for (let i = openIdx; i < rawSrc.length; i++) {
    if (rawSrc[i] === '[') depth++;
    if (rawSrc[i] === ']') { depth--; if (depth === 0) { closeIdx = i; break; } }
  }
  if (closeIdx === -1) {
    console.error("Could not find the end of this level's array -- aborting, nothing written.");
    return;
  }

  const insertion = toMerge
    .map((q) => {
      const optsStr = JSON.stringify(q.options);
      return `    {\n      topic: ${JSON.stringify(q.topic)},\n      vignette: ${JSON.stringify(q.vignette)},\n      stem: ${JSON.stringify(q.stem)},\n      options: ${optsStr},\n      correct: ${q.correct},\n      explain: ${JSON.stringify(q.explain)},\n    },`;
    })
    .join('\n');

  const newRawSrc = rawSrc.slice(0, closeIdx) + insertion + '\n  ' + rawSrc.slice(closeIdx);
  fs.writeFileSync(questionsPath, newRawSrc);

  const reportPath = path.join(__dirname, '..', 'merge-report.txt');
  fs.writeFileSync(
    reportPath,
    `Merge report -- Level ${LEVEL}\n` +
      `Parsed ${totalParsed} questions across ${files.length} files.\n` +
      `Merged ${toMerge.length} into questions.js.\n` +
      `Flagged ${report.length} for manual review (NOT merged):\n\n` +
      report.join('\n\n')
  );

  console.log(`Parsed ${totalParsed} questions across ${files.length} files.`);
  console.log(`Merged ${toMerge.length} into questions.js.`);
  console.log(`Flagged ${report.length} items for review -- see merge-report.txt (none of these were added).`);
  console.log(`Next: node scripts/add-question-ids.js`);
}

main();
