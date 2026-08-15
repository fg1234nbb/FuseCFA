import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Linking, Modal } from 'react-native';

import NodeOrbit from '../components/NodeOrbit';
import LegalModal from '../components/LegalModal';
import ConfirmModal from '../components/ConfirmModal';
import { CONFIG } from '../config';
import { LEVEL_INFO, QUESTIONS_BY_LEVEL } from '../data/questions';
import { CONTACT_EMAIL, TERMS_TEXT, PRIVACY_TEXT } from '../data/legal';
import { getProgress, resetAllProgress } from '../utils/storage';
import { purchaseProduct, restorePurchases } from '../utils/purchases';
import { unlockTopic, unlockFullLevel, getUnlockedTopicsForLevel } from '../utils/entitlements';
import { COLORS, MONO, SANS } from '../theme';

export default function HubScreen({ onSelectLevel }) {
  const [progressByLevel, setProgressByLevel] = useState({ 1: null, 2: null, 3: null });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [unlockedTopics, setUnlockedTopics] = useState([]); // [] | 'ALL' | string[]
  const [toast, setToast] = useState(null);
  const [legalModal, setLegalModal] = useState(null); // null | 'terms' | 'privacy'
  const [pendingPurchase, setPendingPurchase] = useState(null); // null | { type: 'topic'|'full', level, topic? }

  useEffect(() => {
    (async () => {
      const entries = await Promise.all([1, 2, 3].map(async (lvl) => [lvl, await getProgress(lvl)]));
      setProgressByLevel(Object.fromEntries(entries));
    })();
  }, []);

  useEffect(() => {
    if (selectedLevel == null) return;
    (async () => {
      setUnlockedTopics(await getUnlockedTopicsForLevel(selectedLevel));
    })();
  }, [selectedLevel]);

  function isUnlocked(topic) {
    return unlockedTopics === 'ALL' || unlockedTopics.includes(topic);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function handleContact() {
    const subject = encodeURIComponent('Fuse — CFA Speed Drill: Question');
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}`).catch(() =>
      showToast(`Email us at ${CONTACT_EMAIL}`)
    );
  }

  function handleReset() {
    Alert.alert("Reset all progress?", "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await resetAllProgress();
          setProgressByLevel({ 1: null, 2: null, 3: null });
          showToast('Progress reset');
        },
      },
    ]);
  }

  async function handleUnlockTopic(level, topic) {
    const p = CONFIG.pricing[level];
    const res = await purchaseProduct(p.productIdTopic, `${topic} (${p.name})`);
    // Demo mode and a genuine success both fall through here — see
    // entitlements.js for why demo purchases still unlock locally.
    if (!res.error && !res.cancelled) {
      await unlockTopic(level, topic);
      setUnlockedTopics(await getUnlockedTopicsForLevel(level));
    }
    showToast(res.message);
  }

  async function handleUnlockAll(level) {
    const p = CONFIG.pricing[level];
    const res = await purchaseProduct(p.productIdFull, `all of ${p.name}`);
    if (!res.error && !res.cancelled) {
      await unlockFullLevel(level);
      setUnlockedTopics(await getUnlockedTopicsForLevel(level));
    }
    showToast(res.message);
  }

  function handleTopicPress(level, topic) {
    if (isUnlocked(topic)) {
      onSelectLevel(level, topic);
    } else {
      setPendingPurchase({ type: 'topic', level, topic });
    }
  }

  function handleUnlockAllPress(level) {
    setPendingPurchase({ type: 'full', level });
  }

  function cancelPurchase() {
    setPendingPurchase(null);
  }

  async function confirmPurchase() {
    if (!pendingPurchase) return;
    const { type, level, topic } = pendingPurchase;
    setPendingPurchase(null);
    if (type === 'topic') {
      await handleUnlockTopic(level, topic);
    } else {
      await handleUnlockAll(level);
    }
  }

  async function handleRestore() {
    const res = await restorePurchases();
    showToast(res.message);
  }

  const detail = selectedLevel ? CONFIG.pricing[selectedLevel] : null;
  const detailProgress = selectedLevel ? progressByLevel[selectedLevel] : null;
  const topics = selectedLevel ? [...new Set(QUESTIONS_BY_LEVEL[selectedLevel].map((q) => q.topic))] : [];

  // Real, truthful counts for the pre-purchase confirmation — never
  // a marketing-round number, since this is a literal statement of
  // what the person is about to pay for.
  let confirmModalProps = null;
  if (pendingPurchase) {
    const p = CONFIG.pricing[pendingPurchase.level];
    if (pendingPurchase.type === 'topic') {
      const count = QUESTIONS_BY_LEVEL[pendingPurchase.level].filter((q) => q.topic === pendingPurchase.topic).length;
      confirmModalProps = {
        title: `Unlock ${pendingPurchase.topic}`,
        lines: [
          `You'll get ${count} question${count === 1 ? '' : 's'} for ${p.name} · ${pendingPurchase.topic}.`,
          'One-time payment, no subscription.',
        ],
        confirmLabel: `Unlock for £${p.topicPrice.toFixed(2)}`,
      };
    } else {
      const count = QUESTIONS_BY_LEVEL[pendingPurchase.level].length;
      const topicCount = new Set(QUESTIONS_BY_LEVEL[pendingPurchase.level].map((q) => q.topic)).size;
      confirmModalProps = {
        title: `Unlock all of ${p.name}`,
        lines: [
          `You'll get all ${count} questions across ${topicCount} topics in ${p.name}.`,
          'One-time payment, no subscription.',
        ],
        confirmLabel: `Unlock for £${p.fullPrice.toFixed(2)}`,
      };
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.stage}>
        <View style={styles.hubTop}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>SELECT A CHARGE</Text>
          </View>
          <Pressable onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>⟳ Reset progress</Text>
          </Pressable>
        </View>

        <NodeOrbit progressByLevel={progressByLevel} selectedLevel={selectedLevel} onSelect={setSelectedLevel} />

        <View style={styles.priceStrip}>
          {[1, 2, 3].map((lvl) => (
            <View key={lvl} style={styles.priceChip}>
              <Text style={styles.pcName}>{CONFIG.pricing[lvl].name}</Text>
              <Text style={styles.pcPrice}>from £{CONFIG.pricing[lvl].topicPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.hint}>Tap a charge to see pricing, your progress, and start the trial.</Text>

        {selectedLevel != null && (
          <View style={styles.detailPanel}>
            <Text style={styles.detailTitle}>{detail.name}</Text>
            <Text style={styles.detailTagline}>{LEVEL_INFO[selectedLevel]}</Text>

            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {detailProgress
                  ? `Best: ${detailProgress.bestScore}/10 · played ${detailProgress.attempts}×`
                  : 'Not started yet — 10 free questions waiting'}
              </Text>
              {detailProgress ? <Text style={styles.progressExtra}>streak {detailProgress.bestStreak}</Text> : null}
            </View>

            <Pressable style={styles.primaryBtn} onPress={() => onSelectLevel(selectedLevel)}>
              <Text style={styles.primaryBtnText}>{detailProgress ? 'Retake trial →' : 'Start trial →'}</Text>
            </Pressable>

            <Text style={styles.unlockHeading}>UNLOCK TOPICS IN THIS LEVEL</Text>
            {topics.map((t) => {
              const unlocked = isUnlocked(t);
              return (
                <Pressable key={t} style={styles.topicRow} onPress={() => handleTopicPress(selectedLevel, t)}>
                  <View style={styles.trNameRow}>
                    {unlocked && <Text style={styles.trCheck}>✓</Text>}
                    <Text style={styles.topicName}>{t}</Text>
                  </View>
                  {unlocked ? (
                    <Text style={styles.trPracticeText}>Practice →</Text>
                  ) : (
                    <View style={styles.trBtn}>
                      <Text style={styles.trBtnText}>£{detail.topicPrice.toFixed(2)}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}

            <View style={styles.paywall}>
              <Text style={styles.pwEyebrow}>BEST VALUE</Text>
              <Text style={styles.pwTitle}>Unlock all of {detail.name}</Text>
              <Text style={styles.pwSub}>One-time payment. No subscription.</Text>
              <Pressable style={styles.pwBtn} onPress={() => handleUnlockAllPress(selectedLevel)}>
                <Text style={styles.pwBtnText}>Unlock everything · £{detail.fullPrice.toFixed(2)}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={handleContact}>
          <Text style={styles.footerLink}>Contact us</Text>
        </Pressable>
        <Text style={styles.footerDot}>·</Text>
        <Pressable onPress={handleRestore}>
          <Text style={styles.footerLink}>Restore purchases</Text>
        </Pressable>
        <Text style={styles.footerDot}>·</Text>
        <Pressable onPress={() => setLegalModal('terms')}>
          <Text style={styles.footerLink}>Terms</Text>
        </Pressable>
        <Text style={styles.footerDot}>·</Text>
        <Pressable onPress={() => setLegalModal('privacy')}>
          <Text style={styles.footerLink}>Privacy</Text>
        </Pressable>
      </View>

      {toast && (
        <Modal visible transparent animationType="fade">
          <View style={styles.toastOverlay} pointerEvents="box-none">
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          </View>
        </Modal>
      )}

      <LegalModal
        visible={legalModal === 'terms'}
        title="TERMS & CONDITIONS"
        text={TERMS_TEXT}
        onClose={() => setLegalModal(null)}
      />
      <LegalModal
        visible={legalModal === 'privacy'}
        title="PRIVACY POLICY"
        text={PRIVACY_TEXT}
        onClose={() => setLegalModal(null)}
      />

      {confirmModalProps && (
        <ConfirmModal
          visible={!!pendingPurchase}
          title={confirmModalProps.title}
          lines={confirmModalProps.lines}
          confirmLabel={confirmModalProps.confirmLabel}
          onConfirm={confirmPurchase}
          onCancel={cancelPurchase}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 60, backgroundColor: COLORS.bg, flexGrow: 1 },
  stage: { backgroundColor: COLORS.panel, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 20 },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 },
  footerLink: { fontFamily: MONO, fontSize: 11, color: COLORS.textDim, textDecorationLine: 'underline' },
  footerDot: { color: COLORS.line, fontSize: 11 },
  hubTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tag: {
    backgroundColor: 'rgba(255,176,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.25)',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagText: { fontFamily: MONO, fontSize: 10.5, letterSpacing: 1, color: COLORS.amber },
  resetBtn: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 5 },
  resetBtnText: { fontFamily: MONO, fontSize: 10.5, color: COLORS.textDim },
  priceStrip: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  priceChip: {
    flex: 1,
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    padding: 9,
    alignItems: 'center',
  },
  pcName: { fontFamily: MONO, fontSize: 9.5, color: COLORS.textDim, marginBottom: 3 },
  pcPrice: { fontFamily: MONO, fontSize: 12.5, color: COLORS.amber, fontWeight: '700' },
  hint: { textAlign: 'center', fontSize: 12, color: COLORS.textDim, marginBottom: 4, fontFamily: SANS },
  detailPanel: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.line },
  detailTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4, fontFamily: SANS },
  detailTagline: { fontSize: 12.5, color: COLORS.textDim, marginBottom: 12, lineHeight: 18, fontFamily: SANS },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    padding: 11,
    marginBottom: 12,
  },
  progressText: { fontSize: 12.5, color: COLORS.textDim, fontFamily: SANS, flexShrink: 1 },
  progressExtra: { fontFamily: MONO, fontSize: 11, color: COLORS.text },
  primaryBtn: { backgroundColor: COLORS.amber, borderRadius: 10, padding: 13, alignItems: 'center', marginBottom: 18 },
  primaryBtnText: { fontFamily: MONO, fontWeight: '700', fontSize: 13, color: '#1A1200', letterSpacing: 1 },
  unlockHeading: { fontFamily: MONO, fontSize: 10.5, letterSpacing: 1, color: COLORS.textDim, marginBottom: 10 },
  topicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    padding: 11,
    marginBottom: 8,
  },
  topicName: { fontSize: 13, color: COLORS.text, fontFamily: SANS },
  trNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  trCheck: { color: COLORS.success, fontFamily: MONO, fontWeight: '800', fontSize: 13 },
  trPracticeText: { fontFamily: MONO, fontSize: 11.5, fontWeight: '700', color: COLORS.success },
  trBtn: {
    backgroundColor: 'rgba(255,176,32,0.1)',
    borderWidth: 1,
    borderColor: COLORS.amberDim,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  trBtnText: { fontFamily: MONO, fontSize: 11.5, fontWeight: '700', color: COLORS.amber },
  paywall: {
    backgroundColor: '#20160A',
    borderWidth: 1,
    borderColor: COLORS.amberDim,
    borderRadius: 14,
    padding: 16,
    marginTop: 6,
  },
  pwEyebrow: { fontFamily: MONO, fontSize: 10, color: COLORS.amber, letterSpacing: 1, marginBottom: 6 },
  pwTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 6, fontFamily: SANS },
  pwSub: { fontSize: 12.5, color: COLORS.textDim, marginBottom: 14, fontFamily: SANS },
  pwBtn: { backgroundColor: COLORS.amber, borderRadius: 10, padding: 13, alignItems: 'center' },
  pwBtnText: { fontFamily: MONO, fontWeight: '800', fontSize: 13, color: '#1A1200' },
  toastOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11,14,17,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  toast: {
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.amberDim,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxWidth: 320,
  },
  toastText: { fontFamily: MONO, fontSize: 13, color: COLORS.text, textAlign: 'center', lineHeight: 19 },
});
