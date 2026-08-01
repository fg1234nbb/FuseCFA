import React, { useState, useCallback } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import HubScreen from './src/screens/HubScreen';
import ReadyScreen from './src/screens/ReadyScreen';
import DrillScreen from './src/screens/DrillScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { COLORS } from './src/theme';

// ============================================================
// This app deliberately has NO navigation library. Screens are
// just swapped based on a single `screen` string in state. For
// an app this size that's simpler and lighter than pulling in
// React Navigation — add it later if the app grows real depth.
// ============================================================

export default function App() {
  const [screen, setScreen] = useState('hub'); // 'hub' | 'ready' | 'drill' | 'results'
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedTimeIdx, setSelectedTimeIdx] = useState(1);
  const [hubKey, setHubKey] = useState(0);
  const [lastResult, setLastResult] = useState({ score: 0, bestStreak: 0 });

  // Bumping hubKey forces HubScreen to remount, which re-reads
  // saved progress from storage — so the orbit rings are always
  // fresh when you land back on the hub.
  const goToHub = useCallback(() => {
    setScreen('hub');
    setHubKey((k) => k + 1);
  }, []);

  const goToReady = useCallback((level) => {
    setCurrentLevel(level);
    setScreen('ready');
  }, []);

  const goToDrill = useCallback(() => {
    setScreen('drill');
  }, []);

  const goToResults = useCallback((result) => {
    setLastResult(result);
    setScreen('results');
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {screen === 'hub' && <HubScreen key={hubKey} onSelectLevel={goToReady} />}

      {screen === 'ready' && (
        <ReadyScreen
          level={currentLevel}
          selectedTimeIdx={selectedTimeIdx}
          onChangeTimeIdx={setSelectedTimeIdx}
          onBack={goToHub}
          onStart={goToDrill}
        />
      )}

      {screen === 'drill' && (
        <DrillScreen
          level={currentLevel}
          timeIdx={selectedTimeIdx}
          onFinish={goToResults}
          onQuit={goToHub}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen level={currentLevel} result={lastResult} onBackToHub={goToHub} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
});
