// ============================================================
// CONFIG — the file to touch for tuning numbers. Everything
// else in the app reads from here automatically.
// ============================================================

export const CONFIG = {
  // Seconds-per-question choices offered on the "Ready" screen.
  // Add or remove numbers here to change what's offered — the
  // picker UI on ReadyScreen builds itself from this array.
  timeOptions: [5, 10, 15],
  defaultTimeIndex: 1, // index into timeOptions above — 1 = "10"

  // Pricing + RevenueCat product identifiers, per level.
  // productIdTopic / productIdFull must exactly match the product
  // IDs you create in App Store Connect / Google Play Console and
  // attach to RevenueCat "packages" — see README, section "Adding
  // real payments".
  pricing: {
    1: {
      name: 'Level I',
      topicPrice: 2.99,
      fullPrice: 6.99,
      productIdTopic: 'fuse_l1_topic',
      productIdFull: 'fuse_l1_full',
    },
    2: {
      name: 'Level II',
      topicPrice: 3.99,
      fullPrice: 9.99,
      productIdTopic: 'fuse_l2_topic',
      productIdFull: 'fuse_l2_full',
    },
    3: {
      name: 'Level III',
      topicPrice: 4.99,
      fullPrice: 12.99,
      productIdTopic: 'fuse_l3_topic',
      productIdFull: 'fuse_l3_full',
    },
  },
};

// ============================================================
// PURCHASES — leave DEMO_MODE true until you've set up a real
// RevenueCat project. The whole app (quiz, hub, pause, progress)
// works fine in demo mode; only the "Unlock" buttons are fake
// (they show a toast instead of charging anyone).
// ============================================================
export const PURCHASES = {
  DEMO_MODE: true,
  REVENUECAT_API_KEY_IOS: 'appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  REVENUECAT_API_KEY_ANDROID: 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
};
