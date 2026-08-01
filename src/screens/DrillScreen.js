import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';

import FuseRing from '../components/FuseRing';
import { CONFIG } from '../config';
import { QUESTIONS_BY_LEVEL } from '../data/questions';
import { tickFeedback, successFeedback, failFeedback } from '../utils/haptics';
import { COLORS, MONO, SANS } from '../theme';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// The web prototype used <em> tags for emphasis inside a stem.
// React Native can't render raw HTML, so this splits on <em>...</em>
// and renders the emphasized part as a differently-styled Text span.
function renderStem(stem, style, emphasisStyle) {
  const parts = stem.split(/<\/?em>/);
  return (
    <Text style={style}>
      {parts.map((part, i) => (i % 2 === 1 ? <Text key={i} style={emphasisStyle}>{part}</Text> : part))}
    </Text>
  );
}

export default function DrillScreen({ level, timeIdx, onFinish, onQuit }) {
  const TOTAL_TIME = CONFIG.timeOptions[timeIdx];
  const pool = QUESTIONS_BY_LEVEL[level];
  const [order] = useState(() => shuffle(pool.map((_, i) => i)));

  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [paused, setPaused] = useState(false);
  const [flash, setFlash] = useState(null); // 'ok' | 'bad' | null

  const timerRef = useRef(null);
  const answeredRef = useRef(false); // guards against double-answer from the interval tick

  const q = pool[order[idx]];
  const dangerThreshold = Math.min(2, TOTAL_TIME * 0.3);
  const danger = timeLeft <= dangerThreshold;

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAnswer = useCallback(
    (i) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      setAnswered(true);
      setSelectedIdx(i);
      clearTimer();

      const correct = i === q.correct;
      if (correct) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const ns = s + 1;
          setBestStreak((b) => Math.max(b, ns));
          return ns;
        });
        setFlash('ok');
        successFeedback();
      } else {
        setStreak(0);
        setFlash('bad');
        failFeedback();
      }
      setTimeout(() => setFlash(null), 650);
    },
    [q]
  );

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = Math.max(0, t - 0.1);
        if (Math.abs((next * 10) % 10) < 0.05 && next > 0) {
          tickFeedback(next <= dangerThreshold);
        }
        if (next <= 0 && !answeredRef.current) {
          clearTimer();
          handleAnswer(-1);
        }
        return next;
      });
    }, 100);
  }, [dangerThreshold, handleAnswer]);

  // (Re)start fresh whenever a new question loads.
  useEffect(() => {
    setTimeLeft(TOTAL_TIME);
    setAnswered(false);
    answeredRef.current = false;
    setSelectedIdx(null);
    startTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function handlePauseToggle() {
    if (paused) {
      setPaused(false);
      startTimer(); // resumes from current timeLeft — no time is lost or double-counted
    } else {
      setPaused(true);
      clearTimer();
    }
  }

  function handleContinue() {
    if (idx + 1 >= order.length) {
      onFinish({ score, bestStreak });
    } else {
      setIdx((i) => i + 1);
    }
  }

  function handleQuit() {
    clearTimer();
    onQuit();
  }

  return (
    <View style={styles.container}>
      <View style={[styles.stage, danger && styles.stageDanger]}>
        <View style={styles.topRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{q.topic}</Text>
          </View>
          <Pressable onPress={handlePauseToggle} style={styles.pauseBtn} hitSlop={8}>
            <Text style={styles.pauseBtnText}>{paused ? '▶' : '❚❚'}</Text>
          </Pressable>
        </View>

        <FuseRing timeLeft={timeLeft} totalTime={TOTAL_TIME} danger={danger} />

        <Text style={styles.vignette}>{q.vignette}</Text>
        {renderStem(q.stem, styles.stem, styles.stemEmphasis)}

        <View style={styles.options}>
          {q.options.map((opt, i) => {
            const optStyles = [styles.opt];
            if (answered) {
              if (i === q.correct) optStyles.push(styles.optCorrect);
              else if (i === selectedIdx) optStyles.push(styles.optWrong);
              else optStyles.push(styles.optDim);
            }
            return (
              <Pressable key={i} disabled={answered || paused} onPress={() => handleAnswer(i)} style={optStyles}>
                <Text style={styles.optLetter}>{['A', 'B', 'C'][i]}</Text>
                <Text style={styles.optText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {answered && (
          <View style={styles.explain}>
            <Text style={styles.explainText}>
              <Text style={styles.explainWhy}>Why: </Text>
              {q.explain}
            </Text>
          </View>
        )}

        {answered && (
          <Pressable style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>{idx + 1 === order.length ? 'See results →' : 'Continue →'}</Text>
          </Pressable>
        )}

        <View style={styles.dots}>
          {order.map((_, i) => (
            <View key={i} style={[styles.dot, i === idx && styles.dotActive, i < idx && styles.dotDone]} />
          ))}
        </View>
      </View>

      <Modal visible={flash !== null} transparent animationType="fade">
        <View style={styles.flashOverlay}>
          <Text style={[styles.flashTitle, flash === 'ok' ? styles.flashOk : styles.flashBad]}>
            {flash === 'ok' ? 'DEFUSED' : 'DETONATED'}
          </Text>
          <Text style={styles.flashSub}>{flash === 'ok' ? `streak ${streak}` : 'fuse ran out'}</Text>
        </View>
      </Modal>

      <Modal visible={paused} transparent animationType="fade">
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseTitle}>PAUSED</Text>
            <Text style={styles.pauseSub}>Take your time. The fuse is frozen — nothing is counting down.</Text>
            <Pressable style={styles.resumeBtn} onPress={handlePauseToggle}>
              <Text style={styles.resumeBtnText}>Resume →</Text>
            </Pressable>
            <Pressable style={styles.quitBtn} onPress={handleQuit}>
              <Text style={styles.quitBtnText}>Quit to hub</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.bg },
  stage: { backgroundColor: COLORS.panel, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 20 },
  stageDanger: { shadowColor: COLORS.danger, shadowOpacity: 0.3, shadowRadius: 30, shadowOffset: { width: 0, height: 0 } },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tag: {
    backgroundColor: 'rgba(255,176,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.25)',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagText: { fontFamily: MONO, fontSize: 10.5, letterSpacing: 1, color: COLORS.amber },
  pauseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBtnText: { color: COLORS.text, fontSize: 13 },
  vignette: { fontSize: 13.5, lineHeight: 20, color: COLORS.textDim, marginBottom: 10, fontFamily: SANS },
  stem: { fontSize: 16, lineHeight: 23, fontWeight: '600', color: COLORS.text, marginBottom: 18, fontFamily: SANS },
  stemEmphasis: { color: COLORS.amber },
  options: { gap: 9 },
  opt: {
    flexDirection: 'row',
    gap: 11,
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 11,
    padding: 13,
  },
  optCorrect: { borderColor: COLORS.success, backgroundColor: 'rgba(46,213,115,0.08)' },
  optWrong: { borderColor: COLORS.danger, backgroundColor: 'rgba(255,59,48,0.08)' },
  optDim: { opacity: 0.55 },
  optLetter: { fontFamily: MONO, fontWeight: '700', color: COLORS.amber, width: 18 },
  optText: { flex: 1, fontSize: 14, lineHeight: 20, color: COLORS.text, fontFamily: SANS },
  explain: {
    marginTop: 14,
    padding: 13,
    backgroundColor: '#10151A',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.amber,
    borderRadius: 8,
  },
  explainText: { fontSize: 13, lineHeight: 19, color: COLORS.textDim, fontFamily: SANS },
  explainWhy: { fontWeight: '700', color: COLORS.text },
  continueBtn: { marginTop: 16, backgroundColor: COLORS.amber, borderRadius: 10, padding: 13, alignItems: 'center' },
  continueBtnText: { fontFamily: MONO, fontWeight: '700', fontSize: 13, color: '#1A1200', letterSpacing: 1 },
  dots: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginTop: 18 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.line },
  dotActive: { backgroundColor: COLORS.amber },
  dotDone: { backgroundColor: COLORS.success },
  flashOverlay: { flex: 1, backgroundColor: 'rgba(11,14,17,0.92)', alignItems: 'center', justifyContent: 'center', gap: 6 },
  flashTitle: { fontFamily: MONO, fontWeight: '800', fontSize: 26, letterSpacing: 1 },
  flashOk: { color: COLORS.success },
  flashBad: { color: COLORS.danger },
  flashSub: { fontFamily: MONO, fontSize: 13, color: COLORS.textDim },
  pauseOverlay: { flex: 1, backgroundColor: 'rgba(11,14,17,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  pauseCard: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  pauseTitle: { fontFamily: MONO, fontWeight: '800', fontSize: 18, color: COLORS.amber, letterSpacing: 2, marginBottom: 10 },
  pauseSub: { fontSize: 13, color: COLORS.textDim, textAlign: 'center', lineHeight: 19, marginBottom: 18, fontFamily: SANS },
  resumeBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 10,
  },
  resumeBtnText: { fontFamily: MONO, fontWeight: '700', fontSize: 13, color: '#1A1200' },
  quitBtn: { paddingVertical: 8 },
  quitBtnText: { fontFamily: MONO, fontSize: 12, color: COLORS.textDim, textDecorationLine: 'underline' },
});
