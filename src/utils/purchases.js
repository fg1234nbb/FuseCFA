// ============================================================
// PURCHASES — thin wrapper around RevenueCat (react-native-purchases).
//
// Why RevenueCat: it validates App Store / Play Store receipts on
// its own servers and tells you what a user owns, so you never
// write or host a backend of your own for payments. Free up to
// $2,500/month in tracked revenue, then a percentage of revenue
// above that — check RevenueCat's pricing page for the current
// rate before you rely on this number for planning.
//
// IMPORTANT — react-native-purchases is a native module. It will
// NOT work inside plain Expo Go. To test real purchases you need a
// development build (`npx expo run:ios` / `run:android`, or an EAS
// Build). Everything else in this app — the quiz, hub, pause,
// progress — works fine in Expo Go without any of this.
//
// This module is NOT installed by default (see README). Until you
// install react-native-purchases and flip PURCHASES.DEMO_MODE to
// false in config.js, every call below just returns a demo message
// and nothing real happens.
// ============================================================

import { Platform } from 'react-native';
import { PURCHASES } from '../config';

let Purchases = null;
let initialized = false;

async function ensureInit() {
  if (PURCHASES.DEMO_MODE) return false;
  if (initialized) return true;
  try {
    // Lazy require so the app doesn't crash if the package isn't
    // installed yet (e.g. you're still in Expo Go / demo mode).
    // eslint-disable-next-line global-require
    Purchases = require('react-native-purchases').default;
    const apiKey =
      Platform.OS === 'ios' ? PURCHASES.REVENUECAT_API_KEY_IOS : PURCHASES.REVENUECAT_API_KEY_ANDROID;
    await Purchases.configure({ apiKey });
    initialized = true;
    return true;
  } catch (e) {
    console.warn('RevenueCat not available — staying in demo mode', e.message);
    return false;
  }
}

export async function purchaseProduct(productId, label) {
  const ready = await ensureInit();
  if (!ready) {
    return { demo: true, message: `Demo only — would purchase "${label}"` };
  }
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.find(
      (p) => p.product.identifier === productId
    );
    if (!pkg) {
      return { demo: false, error: true, message: `Product "${productId}" not found in RevenueCat offerings` };
    }
    await Purchases.purchasePackage(pkg);
    return { demo: false, success: true, message: `Unlocked "${label}"!` };
  } catch (e) {
    if (e.userCancelled) return { demo: false, cancelled: true, message: 'Purchase cancelled' };
    console.warn('Purchase failed', e);
    return { demo: false, error: true, message: e.message || 'Purchase failed' };
  }
}

export async function restorePurchases() {
  const ready = await ensureInit();
  if (!ready) return { demo: true, message: 'Demo only — nothing to restore yet' };
  try {
    await Purchases.restorePurchases();
    return { demo: false, success: true, message: 'Purchases restored' };
  } catch (e) {
    return { demo: false, error: true, message: e.message || 'Restore failed' };
  }
}
