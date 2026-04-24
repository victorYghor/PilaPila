import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/Buttons/Button';
import { HyperLink } from '@/components/Hyperlinks/HyperLink';
import { SubTitle } from '@/components/Texts/SubTitle';
import { Title } from '@/components/Texts/Title';
import { EmailInput } from '@/components/TextsInputs/EmailInput';
import { PasswordInput } from '@/components/TextsInputs/PasswordInput';
import { Colors } from '@/constants/colors';
import { BorderRadius, CardPadding, FontSize, Spacing } from '@/constants/metrics';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    const userName = email.trim().split('@')[0] || 'Usuário PilaPila';
    signIn(userName);
    router.replace('/');
  }

  return (
    <SafeAreaView  style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, { justifyContent: 'center' }]}>
        <View style={styles.header}>
          <Title text="Bem-vindo de volta" />
          <SubTitle text="Entre para continuar" />
        </View>

        <View style={styles.card}>
          <EmailInput value={email} onChangeText={setEmail} />
          <PasswordInput value={password} onChangeText={setPassword} />

          <View style={styles.forgotPasswordContainer}>
          </View>

          <Button label="Entrar" onPress={handleLogin} disabled={!email || !password} />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Ainda não tem conta?</Text>
            <HyperLink label="Cadastre-se" onPress={() => router.push('/register')} />
          </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary400,
  },
  container: {
  flexGrow: 1,
  backgroundColor: Colors.primary400,
  paddingHorizontal: Spacing.xl,
  paddingVertical: Spacing.xl,
  gap: Spacing.xxxl,
},
  header: {
    gap: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: CardPadding,
    gap: Spacing.md,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -Spacing.xs,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  registerText: {
    color: Colors.textGray,
    fontSize: 18,
    lineHeight: FontSize.sm * 1.4,
  },
  inlineLink: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
  },
});
