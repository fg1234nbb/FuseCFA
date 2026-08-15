import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// QUESTION STATS — tracks which individual questions (by stable
// `id`, see questions.js) have been answered at least once, plus
// whether the most recent answer was correct. This is what powers
// the "X/Y questions done" stats on the hub — it works the same
// whether a topic has 3 questions or 300, since it's just counting
// how many of the pool's IDs show up here.
//
// Folded into the same "Reset progress" action as scores/streaks
// (unlike entitlements, which are deliberately never touched by
// that button) — question completion is progress, not a purchase.
// ============================================================

const KEY = 'fuse-seen-questions'; // { [questionId]: { correct: boolean, lastSeen: number } }

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

async function writeAll(data) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('writeAll question stats failed', e);
  }
}

export async function recordAnswer(questionId, wasCorrect) {
  if (!questionId) return; // defensive — shouldn't happen once every question has an id
  const all = await readAll();
  all[questionId] = { correct: wasCorrect, lastSeen: Date.now() };
  await writeAll(all);
}

export async function getSeenMap() {
  return readAll();
}

export async function resetSeenQuestions() {
  await writeAll({});
}

// Given a pool of questions (already filtered to a level or topic)
// and the seen map, returns { done, total, correctCount }.
export function computeStats(pool, seenMap) {
  let done = 0;
  let correctCount = 0;
  pool.forEach((q) => {
    const entry = seenMap[q.id];
    if (entry) {
      done += 1;
      if (entry.correct) correctCount += 1;
    }
  });
  return { done, total: pool.length, correctCount };
}
