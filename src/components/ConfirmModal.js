import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, MONO, SANS } from '../theme';

export default function ConfirmModal({ visible, title, lines, confirmLabel, cancelLabel = 'Cancel', onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {lines.map((line, i) => (
            <Text key={i} style={styles.line}>
              {line}
            </Text>
          ))}
          <Pressable style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(11,14,17,0.88)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    padding: 22,
    width: '100%',
    maxWidth: 340,
  },
  title: { fontFamily: MONO, fontWeight: '800', fontSize: 16, color: COLORS.amber, marginBottom: 14, textAlign: 'center' },
  line: { fontSize: 14, color: COLORS.text, textAlign: 'center', marginBottom: 6, fontFamily: SANS, lineHeight: 20 },
  confirmBtn: { backgroundColor: COLORS.amber, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 12 },
  confirmBtnText: { fontFamily: MONO, fontWeight: '800', fontSize: 13, color: '#1A1200' },
  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontFamily: MONO, fontSize: 12, color: COLORS.textDim },
});
