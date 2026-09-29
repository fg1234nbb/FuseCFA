import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'fuse-onboarding-seen';

export async function hasSeenOnboarding() {
  try {
    return (await AsyncStorage.getItem(KEY)) === 'true';
  } catch (e) {
    return false;
  }
}

export async function markOnboardingSeen() {
  try {
    await AsyncStorage.setItem(KEY, 'true');
  } catch (e) {
    console.warn('markOnboardingSeen failed', e);
  }
}
