import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CONFIG } from '../config';
import { QUESTIONS_BY_LEVEL } from '../data/questions';
import { COLORS, MONO, SANS, rem } from '../theme';

export default function ReadyScreen({ level, topic, selectedTimeIdx, onChangeTimeIdx, onBack, onStart }) {
  const questionCount = topic
    ? QUESTIONS_BY_LEVEL[level].filter((q) => q.topic === topic).length
    : QUESTIONS_BY_LEVEL[level].length;

  return (
    <View style={styles.container}>
      <View style={styles.stage}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>← back</Text>
        </Pressable>
        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {CONFIG.pricing[level].name} {topic ? `· ${topic}` : '· FREE SAMPLE'}
          </Text>
        </View>
        <Text style={styles.title}>Quick reminder before you start</Text>

        <View style={styles.rules}>
          <Text style={styles.rule}>→ {questionCount} question{questionCount === 1 ? '' : 's'}, one at a time — no going back.</Text>
          <Text style={styles.rule}>→ Each has 3 options. Pick one before the ring runs out.</Text>
          <Text style={styles.rule}>→ Wrong answer or timeout = fuse blows, streak resets.</Text>
          <Text style={styles.rule}>→ Need a break? Tap pause anytime during the drill.</Text>
        </View>

        <Text style={styles.pickerLabel}>SECONDS PER QUESTION</Text>
        <View style={styles.picker}>
          {CONFIG.timeOptions.map((t, i) => (
            <Pressable
              key={t}
              onPress={() => onChangeTimeIdx(i)}
              style={[styles.timeOpt, i === selectedTimeIdx && styles.timeOptSelected]}
            >
              <Text style={[styles.timeNum, i === selectedTimeIdx && { color: COLORS.amber }]}>{t}</Text>
              <Text style={styles.timeUnit}>sec</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.startBtn} onPress={onStart}>
          <Text style={styles.startBtnText}>I'm ready — start →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bg },
  stage: { backgroundColor: COLORS.panel, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 20 },
  back: { fontFamily: MONO, fontSize: rem(11.5), color: COLORS.textDim, marginBottom: 14 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,176,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.25)',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 14,
  },
  tagText: { fontFamily: MONO, fontSize: rem(10.5), letterSpacing: 1, color: COLORS.amber },
  title: { fontFamily: MONO, fontSize: rem(19), color: COLORS.text, marginBottom: 16 },
  rules: { marginBottom: 20, gap: 8 },
  rule: { fontSize: rem(13), color: COLORS.textDim, fontFamily: SANS, lineHeight: 19 },
  pickerLabel: { fontFamily: MONO, fontSize: rem(10.5), letterSpacing: 1, color: COLORS.textDim, marginBottom: 9 },
  picker: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  timeOpt: {
    flex: 1,
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timeOptSelected: { borderColor: COLORS.amber, backgroundColor: 'rgba(255,176,32,0.08)' },
  timeNum: { fontFamily: MONO, fontSize: rem(19), color: COLORS.text, fontWeight: '700' },
  timeUnit: { fontFamily: MONO, fontSize: rem(10), color: COLORS.textDim, textTransform: 'uppercase' },
  startBtn: { backgroundColor: COLORS.amber, borderRadius: 10, padding: 13, alignItems: 'center' },
  startBtnText: { fontFamily: MONO, fontWeight: '700', fontSize: rem(13), color: '#1A1200', letterSpacing: 1 },
});
