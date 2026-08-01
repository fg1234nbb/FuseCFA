import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, MONO } from '../theme';

// Radius (px) of each level's orbit, its full-loop duration, spin
// direction, and starting angle (degrees). Durations are slow on
// purpose — this should feel alive, not busy.
const RADII = [60, 90, 120];
const DURATIONS = [46000, 70000, 100000];
const DIRECTIONS = [1, -1, 1]; // 1 = clockwise, -1 = counter-clockwise
const START_ANGLES = [-90, 30, 150];

const NODE_R = 21;
const NODE_CIRC = 2 * Math.PI * NODE_R;
const ROMANS = { 1: 'I', 2: 'II', 3: 'III' };

function OrbitNode({ radius, duration, direction, startAngle, progressFrac, selected, onPress, roman }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
    // duration is fixed per node for the component's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sweep = direction === 1 ? 360 : -360;
  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${startAngle}deg`, `${startAngle + sweep}deg`],
  });
  // Counter-rotation cancels the parent's spin so node content stays upright.
  const counterRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${-startAngle}deg`, `${-startAngle - sweep}deg`],
  });

  const size = radius * 2;
  const started = progressFrac != null;
  const dashOffset = NODE_CIRC * (1 - (progressFrac || 0));

  return (
    <Animated.View
      style={[
        styles.orbitSpin,
        { width: size, height: size, marginLeft: -radius, marginTop: -radius, transform: [{ rotate }] },
      ]}
    >
      <View style={styles.nodeAnchor}>
        <Animated.View style={[styles.nodeWrap, { transform: [{ rotate: counterRotate }] }]}>
          <Pressable onPress={onPress} style={styles.node} hitSlop={8}>
            <Svg width={50} height={50} style={styles.nodeSvg}>
              <Circle cx={25} cy={25} r={NODE_R} stroke={COLORS.line} strokeWidth={4} fill="none" />
              <Circle
                cx={25}
                cy={25}
                r={NODE_R}
                stroke={started ? (selected ? COLORS.success : COLORS.amber) : COLORS.line}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${NODE_CIRC}`}
                strokeDashoffset={dashOffset}
              />
            </Svg>
            <Text style={[styles.nodeNum, started && { color: COLORS.success }]}>{roman}</Text>
            <Text style={styles.nodeScore}>{started ? `${Math.round(progressFrac * 10)}/10` : 'new'}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export default function NodeOrbit({ progressByLevel, selectedLevel, onSelect }) {
  return (
    <View style={styles.field}>
      {RADII.map((r, i) => (
        <Svg
          key={i}
          width={r * 2}
          height={r * 2}
          style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -r, marginTop: -r }}
        >
          <Circle cx={r} cy={r} r={r - 1} stroke={COLORS.line} strokeWidth={1} strokeDasharray="4,6" fill="none" />
        </Svg>
      ))}

      {[1, 2, 3].map((lvl, i) => {
        const p = progressByLevel[lvl];
        const frac = p ? p.bestScore / 10 : null;
        return (
          <OrbitNode
            key={lvl}
            radius={RADII[i]}
            duration={DURATIONS[i]}
            direction={DIRECTIONS[i]}
            startAngle={START_ANGLES[i]}
            progressFrac={frac}
            selected={selectedLevel === lvl}
            onPress={() => onSelect(lvl)}
            roman={ROMANS[lvl]}
          />
        );
      })}

      <View style={styles.core}>
        <Text style={styles.coreName}>FUSE</Text>
        <Text style={styles.coreSub}>{'CFA SPEED\nDRILL'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { width: 300, height: 300, alignSelf: 'center', marginVertical: 10 },
  orbitSpin: { position: 'absolute', top: '50%', left: '50%' },
  nodeAnchor: { position: 'absolute', top: 0, left: '50%', width: 0, height: 0 },
  nodeWrap: { marginLeft: -25, marginTop: -25, width: 50, height: 50 },
  node: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
  nodeSvg: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  nodeNum: { fontFamily: MONO, fontWeight: '800', fontSize: 15, color: COLORS.text },
  nodeScore: { fontFamily: MONO, fontSize: 7.5, color: COLORS.textDim, marginTop: 1 },
  core: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 76,
    height: 76,
    marginLeft: -38,
    marginTop: -38,
    borderRadius: 38,
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.amberDim,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  coreName: { fontFamily: MONO, fontWeight: '800', fontSize: 12.5, color: COLORS.amber, letterSpacing: 1 },
  coreSub: { fontFamily: MONO, fontSize: 6.5, color: COLORS.textDim, marginTop: 3, textAlign: 'center', lineHeight: 9 },
});
