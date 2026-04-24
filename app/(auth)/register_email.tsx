import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRegistration } from '@/app/providers/RegistrationProvider';
import { Button } from '@/components/Buttons/Button';
import { HyperLink } from '@/components/Hyperlinks/HyperLink';
import { SubTitle } from '@/components/Texts/SubTitle';
import { Title } from '@/components/Texts/Title';
import { EmailInput } from '@/components/TextsInputs/EmailInput';
import { BackIcon } from '@/components/icons/BackIcon';
import { ProgressBar } from '@/components/icons/ProgressBar';
import { Colors } from '@/constants/colors';
import { BorderRadius, CardPadding, FontSize, Spacing } from '@/constants/metrics';

export default function RegisterEmailScreen() {
  const {
    state: { email },
    setEmail,
  } = useRegistration();

  function handleContinue() {
    setEmail(email.trim());
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>

        <View style={styles.header}>
          <Title text="Crie sua conta" />
          <SubTitle text="Qual o seu e-mail?" />

          <View style={styles.progressWrapper}>
            <ProgressBar progress={2 / 3} />
          </View>
        </View>

        <View style={styles.card}>
          <EmailInput value={email} onChangeText={setEmail} placeholder="E-mail" />

          <Button label="Criar conta" onPress={handleContinue} disabled={!email.trim()} />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <HyperLink label="Faça login" onPress={() => router.replace('/')} />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -Spacing.xs,
    marginTop: -Spacing.xs,
    padding: 0,
  },
  progressWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: CardPadding,
    gap: Spacing.lg,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  loginText: {
    color: Colors.textGray,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
  },
});
