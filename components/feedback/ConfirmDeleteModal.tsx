/**
 * components/feedback/ConfirmDeleteModal.tsx
 *
 * Safety modal shown before permanently deleting the account.
 * Requires the user to type their current password to confirm the action.
 * This is necessary because Firebase's deleteUser() requires a recent login,
 * and it also serves as a friction layer so accidental taps don't destroy data.
 */

import { PasswordInput } from '@/components/TextsInputs/PasswordInput';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/metrics';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Props {
  visible: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (password: string) => Promise<void>;
}

export function ConfirmDeleteModal({ visible, isLoading, onCancel, onConfirm }: Props) {
  const [password, setPassword] = useState('');
  const { error } = useAuth();

  async function handleConfirm() {
    if (!password.trim()) return;
    await onConfirm(password);
    setPassword('');
  }

  function handleCancel() {
    setPassword('');
    onCancel();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Excluir conta</Text>
          <Text style={styles.body}>
            Esta ação é permanente e não pode ser desfeita. Para confirmar, digite sua senha atual.
          </Text>

          <PasswordInput
            value={password}
            onChangeText={setPassword}
            label="Senha atual"
            placeholder="Digite sua senha"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteBtn, !password.trim() && styles.disabled]}
              onPress={handleConfirm}
              disabled={!password.trim() || isLoading}
              activeOpacity={0.8}
            >
              {isLoading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.deleteText}>Excluir</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.expenseRed, textAlign: 'center' },
  body:  { fontSize: FontSize.sm, color: Colors.textGray, textAlign: 'center', lineHeight: FontSize.sm * 1.5 },
  error: { fontSize: FontSize.xs, color: Colors.expenseRed, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: Spacing.md },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: BorderRadius.md, borderWidth: 1.5,
    borderColor: Colors.primary700, justifyContent: 'center', alignItems: 'center',
  },
  cancelText: { color: Colors.primary700, fontWeight: '600', fontSize: FontSize.md },
  deleteBtn: {
    flex: 1, height: 48, borderRadius: BorderRadius.md,
    backgroundColor: Colors.expenseRed, justifyContent: 'center', alignItems: 'center',
  },
  deleteText: { color: Colors.white, fontWeight: '600', fontSize: FontSize.md },
  disabled: { opacity: 0.5 },
});