import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, MONO, rem } from '../theme';

const R = 60;
const CIRC = 2 * Math.PI * R;

export default function FuseRing({ timeLeft, totalTime, danger }) {
  const pct = Math.max(0, Math.min(1, timeLeft / totalTime));
  const offset = CIRC * (1 - pct);
  const color = danger ? COLORS.danger : COLORS.amber;

  return (
    <View style={styles.wrap}>
      <Svg width={140} height={140} style={styles.svg}>
        <Circle cx={70} cy={70} r={R} stroke={COLORS.line} strokeWidth={8} fill="none" />
        <Circle
          cx={70}
          cy={70}
          r={R}
          stroke={color}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${CIRC}`}
          strokeDashoffset={offset}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.num, { color }]}>{Math.ceil(timeLeft)}</Text>
        <Text style={styles.label}>SECONDS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 140, height: 140, alignSelf: 'center', marginVertical: 12 },
  svg: { transform: [{ rotate: '-90deg' }] },
  center: { position: 'absolute', width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  num: { fontFamily: MONO, fontWeight: '800', fontSize: rem(44) },
  label: { fontFamily: MONO, fontSize: rem(9.5), letterSpacing: 1.5, color: COLORS.textDim, marginTop: 4 },
});
