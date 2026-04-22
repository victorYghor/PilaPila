import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function MoreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Mais</ThemedText>
      <ThemedText>Acesse as opções da sua conta.</ThemedText>

      <Pressable style={styles.button} onPress={() => router.push('/(tabs)/profile' as never)}>
        <ThemedText type="defaultSemiBold" style={styles.buttonLabel}>
          Perfil
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  button: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#687076',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  buttonLabel: {
    textAlign: 'center',
  },
});
