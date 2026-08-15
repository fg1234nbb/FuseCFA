import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

import { CONFIG } from '../config';
import { QUICKSHEETS } from '../data/questions';
import { getProgress, setProgress } from '../utils/storage';
import { COLORS, MONO, SANS } from '../theme';

export default function ResultsScreen({ level, result, onBackToHub }) {
  const total = result.total;
  const qs = QUICKSHEETS[level];
  const p = CONFIG.pricing[level];
  const isTopicRun = !!result.topic;

  useEffect(() => {
    // Only persist to overall level progress for full, mixed-topic
    // runs — that schema assumes a run of the whole level's question
    // set, so a single-topic quiz shouldn't feed into (or skew) it.
    if (isTopicRun) return;
    (async () => {
      const existing = (await getProgress(level)) || { attempts: 0, bestScore: 0, bestStreak: 0 };
      await setProgress(level, {
        attempts: existing.attempts + 1,
        bestScore: Math.max(existing.bestScore, result.score),
        bestStreak: Math.max(existing.bestStreak, result.bestStreak),
        lastPlayed: Date.now(),
      });
    })();
    // Runs once when the results screen mounts for this round.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.stage}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {p.name}{isTopicRun ? ` · ${result.topic}` : ''} · COMPLETE
          </Text>
        </View>
        <Text style={[styles.score, result.score >= total * 0.7 ? { color: COLORS.success } : { color: COLORS.amber }]}>
          {result.score}/{total}
        </Text>
        <Text style={styles.scoreLabel}>BEST STREAK: {result.bestStreak}</Text>

        <View style={styles.flipcard}>
          <Text style={styles.fcLabel}>{qs.label}</Text>
          <Text style={styles.fcFormula}>{qs.formula}</Text>
          <Text style={styles.fcNote}>{qs.note}</Text>
        </View>

        <Pressable style={styles.replayBtn} onPress={onBackToHub}>
          <Text style={styles.replayBtnText}>BACK TO HUB</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COLORS.bg, flexGrow: 1 },
  stage: {
    backgroundColor: COLORS.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 20,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: 'rgba(255,176,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.25)',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 10,
  },
  tagText: { fontFamily: MONO, fontSize: 10.5, letterSpacing: 1, color: COLORS.amber },
  score: { fontFamily: MONO, fontSize: 46, fontWeight: '800' },
  scoreLabel: { fontFamily: MONO, fontSize: 11, color: COLORS.textDim, letterSpacing: 1, marginBottom: 18 },
  flipcard: {
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.amberDim,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 18,
  },
  fcLabel: { fontFamily: MONO, fontSize: 10, color: COLORS.amber, letterSpacing: 1, marginBottom: 8 },
  fcFormula: { fontFamily: MONO, fontSize: 15, color: COLORS.text, fontWeight: '600', marginBottom: 8 },
  fcNote: { fontSize: 12.5, color: COLORS.textDim, lineHeight: 19, fontFamily: SANS },
  replayBtn: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, padding: 12, width: '100%', alignItems: 'center' },
  replayBtnText: { fontFamily: MONO, fontSize: 12, color: COLORS.textDim, letterSpacing: 1 },
});
