import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================
// ENTITLEMENTS — tracks what's actually unlocked, separate from
// quiz progress (score/streak). Deliberately NOT touched by
// "Reset progress" — wiping quiz stats should never revoke
// something someone paid for.
//
// In demo mode (PURCHASES.DEMO_MODE = true in config.js), a
// "purchase" still marks the entitlement locally so you can test
// the full unlock -> practice flow before RevenueCat is wired up
// for real. Once real payments are live, this same local record
// acts as a cache; for a production app you'd also want to
// reconcile it against RevenueCat's actual customerInfo on launch
// (see README) so a restored purchase on a new device is
// reflected here too — this file only covers the local/demo half.
// ============================================================

const KEY = 'fuse-entitlements';

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { topics: {}, fullLevels: {} };
  } catch (e) {
    return { topics: {}, fullLevels: {} };
  }
}

async function writeAll(data) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('writeAll entitlements failed', e);
  }
}

export async function isTopicUnlocked(level, topic) {
  const all = await readAll();
  return !!(all.fullLevels[level] || all.topics[`${level}:${topic}`]);
}

export async function getUnlockedTopicsForLevel(level) {
  const all = await readAll();
  if (all.fullLevels[level]) return 'ALL';
  const prefix = `${level}:`;
  return Object.keys(all.topics)
    .filter((k) => k.startsWith(prefix) && all.topics[k])
    .map((k) => k.slice(prefix.length));
}

export async function unlockTopic(level, topic) {
  const all = await readAll();
  all.topics[`${level}:${topic}`] = true;
  await writeAll(all);
}

export async function unlockFullLevel(level) {
  const all = await readAll();
  all.fullLevels[level] = true;
  await writeAll(all);
}
