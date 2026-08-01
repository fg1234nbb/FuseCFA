import React from 'react';
import { Modal, View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { COLORS, MONO, SANS } from '../theme';

export default function LegalModal({ visible, title, text, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.body}>{text}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(11,14,17,0.9)', justifyContent: 'flex-end' },
  card: {
    backgroundColor: COLORS.panel,
    borderTopWidth: 1,
    borderColor: COLORS.line,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '80%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  title: { fontFamily: MONO, fontSize: 14, fontWeight: '700', color: COLORS.amber, letterSpacing: 0.5 },
  close: { fontSize: 18, color: COLORS.textDim, paddingHorizontal: 6 },
  scroll: { paddingHorizontal: 20 },
  scrollContent: { paddingVertical: 16, paddingBottom: 30 },
  body: { fontSize: 13, lineHeight: 21, color: COLORS.textDim, fontFamily: SANS },
});
