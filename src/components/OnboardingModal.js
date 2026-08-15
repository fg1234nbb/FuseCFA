import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, MONO, SANS, rem } from '../theme';

// A looping "tap here" ripple — a ring that expands and fades, over
// whatever mock UI element each step is pointing at.
function TapRipple() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 1100, easing: Easing.out(Easing.ease), useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.6] });
  const opacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.9, 0.4, 0] });
  return <Animated.View style={[styles.ripple, { transform: [{ scale }], opacity }]} pointerEvents="none" />;
}

const STEPS = [
  {
    caption: 'Tap one of the orbiting nodes to pick a level.',
    mock: (
      <View style={styles.mockOrbitWrap}>
        <View style={styles.mockRing} />
        <View style={styles.mockNode}>
          <Text style={styles.mockNodeText}>II</Text>
          <TapRipple />
        </View>
      </View>
    ),
  },
  {
    caption: 'Tap "Start trial" for 10 free questions on that level.',
    mock: (
      <View style={styles.mockCenter}>
        <View style={styles.mockBtn}>
          <Text style={styles.mockBtnText}>Start trial →</Text>
          <TapRipple />
        </View>
      </View>
    ),
  },
  {
    caption: 'Tap any topic afterward to unlock more questions, any time.',
    mock: (
      <View style={styles.mockCenter}>
        <View style={styles.mockTopicRow}>
          <Text style={styles.mockTopicName}>FSA</Text>
          <View style={styles.mockPricePill}>
            <Text style={styles.mockPriceText}>£2.99</Text>
          </View>
          <TapRipple />
        </View>
      </View>
    ),
  },
];

export default function OnboardingModal({ visible, onDone }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  }

  function skip() {
    onDone();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Pressable style={styles.skipBtn} onPress={skip} hitSlop={8}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>

          <Text style={styles.heading}>How Fuse works</Text>

          <View style={styles.mockStage}>{STEPS[step].mock}</View>

          <Text style={styles.caption}>{STEPS[step].caption}</Text>

          <View style={styles.dots}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>

          <Pressable style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextBtnText}>{isLast ? "Got it — let's go" : 'Next →'}</Text>
          </Pressable>

          <Pressable style={styles.dontShowBtn} onPress={skip}>
            <Text style={styles.dontShowText}>Don't show this again</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(11,14,17,0.92)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 22,
    width: '100%',
    maxWidth: 360,
  },
  skipBtn: { position: 'absolute', top: 14, right: 16, zIndex: 2 },
  skipText: { fontFamily: MONO, fontSize: rem(11), color: COLORS.textDim },
  heading: {
    fontFamily: MONO,
    fontWeight: '800',
    fontSize: rem(16),
    color: COLORS.amber,
    textAlign: 'center',
    marginBottom: 18,
  },
  mockStage: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mockCenter: { alignItems: 'center', justifyContent: 'center' },

  mockOrbitWrap: { width: 130, height: 130, alignItems: 'center', justifyContent: 'center' },
  mockRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderStyle: 'dashed',
  },
  mockNode: {
    position: 'absolute',
    top: 6,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panelRaised,
  },
  mockNodeText: { fontFamily: MONO, fontWeight: '800', fontSize: rem(14), color: COLORS.text },

  mockBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 22,
  },
  mockBtnText: { fontFamily: MONO, fontWeight: '700', fontSize: rem(13), color: '#1A1200', letterSpacing: 1 },

  mockTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  mockTopicName: { fontSize: rem(13), color: COLORS.text, fontFamily: SANS },
  mockPricePill: {
    backgroundColor: 'rgba(255,176,32,0.1)',
    borderWidth: 1,
    borderColor: COLORS.amberDim,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mockPriceText: { fontFamily: MONO, fontSize: rem(11.5), fontWeight: '700', color: COLORS.amber },

  ripple: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.success,
  },

  caption: { fontSize: rem(13.5), color: COLORS.textDim, textAlign: 'center', lineHeight: rem(20), marginBottom: 18, fontFamily: SANS },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.line },
  dotActive: { backgroundColor: COLORS.amber },
  nextBtn: { backgroundColor: COLORS.amber, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginBottom: 12 },
  nextBtnText: { fontFamily: MONO, fontWeight: '800', fontSize: rem(13), color: '#1A1200' },
  dontShowBtn: { alignItems: 'center', paddingVertical: 4 },
  dontShowText: { fontFamily: MONO, fontSize: rem(11), color: COLORS.textDim, textDecorationLine: 'underline' },
});
