import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { useAuth } from '@/app/providers/AuthProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  const { userName, deleteAccount, signOut } = useAuth();

  function handleDeleteAccount() {
    Alert.alert('Excluir conta', 'Tem certeza que deseja excluir sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteAccount();
          router.replace('/');
        },
      },
    ]);
  }

  function handleSignOut() {
    signOut();
    router.replace('/');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Perfil</ThemedText>
      <ThemedText type="defaultSemiBold">Nome: {userName || 'Usuário removido'}</ThemedText>

      <Pressable style={styles.button} onPress={handleSignOut}>
        <ThemedText style={styles.buttonLabel}>Sair</ThemedText>
      </Pressable>

      <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
        <ThemedText style={styles.deleteLabel}>Excluir conta</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#687076',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  buttonLabel: {
    textAlign: 'center',
  },
  deleteButton: {
    borderColor: '#d9534f',
  },
  deleteLabel: {
    textAlign: 'center',
    color: '#d9534f',
    fontWeight: '700',
  },
});
