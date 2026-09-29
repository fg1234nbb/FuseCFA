import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (level) => `fuse-progress-level-${level}`;

// Shape stored per level: { attempts, bestScore, bestStreak, lastPlayed }

export async function getProgress(level) {
  try {
    const raw = await AsyncStorage.getItem(key(level));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('getProgress failed', e);
    return null;
  }
}

export async function setProgress(level, data) {
  try {
    await AsyncStorage.setItem(key(level), JSON.stringify(data));
  } catch (e) {
    console.warn('setProgress failed', e);
  }
}

export async function deleteProgress(level) {
  try {
    await AsyncStorage.removeItem(key(level));
  } catch (e) {
    console.warn('deleteProgress failed', e);
  }
}

export async function resetAllProgress() {
  await Promise.all([1, 2, 3].map((lvl) => deleteProgress(lvl)));
}
