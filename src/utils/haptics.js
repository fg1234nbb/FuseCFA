import * as Haptics from 'expo-haptics';

// The web prototype used tiny synthesized beeps (Web Audio has no
// equivalent in React Native without extra native audio packages).
// Haptics achieve the same "felt urgency" goal with zero extra
// assets and one small, standard Expo package.

export function tickFeedback(urgent) {
  Haptics.impactAsync(
    urgent ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
  ).catch(() => {});
}

export function successFeedback() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function failFeedback() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
