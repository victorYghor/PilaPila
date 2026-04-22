import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { useAuth } from '@/app/providers/AuthProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [name, setName] = useState('');

  function handleLogin() {
    signIn(name || 'Usuário PilaPila');
    router.replace('/');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        PilaPila
      </ThemedText>
      <ThemedText style={styles.subtitle}>Controle financeiro simples e rápido.</ThemedText>

      <TextInput
        placeholder="Seu nome"
        placeholderTextColor="#9BA1A6"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <ThemedText type="defaultSemiBold" style={styles.buttonLabel}>
          Entrar
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#687076',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ECEDEE',
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
  },
});
