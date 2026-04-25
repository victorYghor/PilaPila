/**
 * app/(protected)/profile/index.tsx
 *
 * Profile screen — shows the user's name and provides sign out + delete account.
 * Matches the designs: avatar icon, full name, "Excluir conta" and "Sair" rows.
 */

import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/metrics';

// Replace these with your actual SVG icon components once you add them to assets/
import { useAuth } from '@/app/providers/Authcontext';
import { ConfirmDeleteModal } from '@/components/feedback/ConfirmDeleteModal';
import DeleteIcon from '@/components/icons/DeleteIcon';
import LogoutIcon from '@/components/icons/LogoutIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';

export default function ProfileScreen() {
  const { user, signOut, removeAccount, isSubmitting } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleSignOut() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            // onAuthStateChanged fires → user becomes null → route guard redirects to login
          },
        },
      ],
    );
  }

  async function handleDeleteAccount(password: string) {
    try {
      await removeAccount(password);
      // After deletion Firebase signs the user out automatically,
      // triggering the route guard to redirect to login.
      setShowDeleteModal(false);
    } catch {
      // AuthContext already set error — ConfirmDeleteModal reads it via useAuth()
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.pageTitle}>Perfil</Text>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <ProfileIcon width={64} height={64} color={Colors.textPrimary} />
        </View>

        <Text style={styles.name}>{user?.displayName ?? 'Usuário'}</Text>

        {/* Actions */}
        <View style={styles.actionList}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setShowDeleteModal(true)}
            activeOpacity={0.7}
          >
            <DeleteIcon width={20} height={20} color={Colors.expenseRed} />
            <Text style={[styles.actionLabel, styles.dangerText]}>Excluir conta</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <LogoutIcon width={20} height={20} color={Colors.textPrimary} />
            <Text style={styles.actionLabel}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm delete modal — asks for password before deleting */}
      <ConfirmDeleteModal
        visible={showDeleteModal}
        isLoading={isSubmitting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.backgroundPrimary },
  container:  { flex: 1, alignItems: 'center', paddingTop: Spacing.xl, gap: Spacing.lg },
  pageTitle:  { color: Colors.textPrimary, fontSize: FontSize.xl, fontWeight: '600' },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary700,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  name: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '500' },
  actionList: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  actionLabel: { color: Colors.textPrimary, fontSize: FontSize.md },
  dangerText:  { color: Colors.expenseRed },
  divider: {
    height: 1,
    backgroundColor: Colors.primary700,
    opacity: 0.4,
  },
});