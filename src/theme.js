import { Platform } from 'react-native';

// Deliberately using system fonts (no @expo-google-fonts/* packages,
// no font-loading splash delay) to keep install friction low, per
// the "no fancy packages" brief. Swap MONO/SANS for a Google Font
// later if you want the exact JetBrains Mono / Inter look from the
// web prototype — it's a drop-in change, just two more packages.

export const COLORS = {
  bg: '#0B0E11',
  panel: '#151A20',
  panelRaised: '#1C222A',
  line: '#262E38',
  text: '#E8EAED',
  textDim: '#8B96A3',
  amber: '#FFB020',
  amberDim: '#7A5A1E',
  danger: '#FF3B30',
  success: '#2ED573',
};

export const MONO = Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' });
export const SANS = Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' });

// ============================================================
// FONT_SCALE — the ONE number to change to resize all text in
// the app. Every StyleSheet's `fontSize` is written as rem(14)
// instead of a bare 14 — bump this multiplier and every screen
// scales together, no hunting through individual files needed.
// 1.15 = current "a bit larger" pass; 1.0 = the original sizes.
// ============================================================
export const FONT_SCALE = 1.15;

export function rem(px) {
  return Math.round(px * FONT_SCALE * 10) / 10;
}
