import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRegistration } from '@/app/providers/RegistrationProvider';
import { Button } from '@/components/Buttons/Button';
import { HyperLink } from '@/components/Hyperlinks/HyperLink';
import { SubTitle } from '@/components/Texts/SubTitle';
import { Title } from '@/components/Texts/Title';
import { NameInput } from '@/components/TextsInputs/NameInput';
import { ProgressBar } from '@/components/icons/ProgressBar';
import { Colors } from '@/constants/colors';
import { BorderRadius, CardPadding, FontSize, Spacing } from '@/constants/metrics';

export default function RegisterNameScreen() {
  const {
    state: { name },
    setName,
  } = useRegistration();

  function handleCreateAccount() {
    setName(name.trim());
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, { justifyContent: 'center' }]}>
        <View style={styles.header}>
          <Title text="Crie sua conta" />
          <SubTitle text="Como você se chama?" />

          <View style={styles.progressWrapper}>
            <ProgressBar progress={1 / 3} />
          </View>
        </View>

        <View style={styles.card}>
          <NameInput value={name} onChangeText={setName} />

          <Button label="Criar conta" onPress={handleCreateAccount} disabled={!name.trim()} />

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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    gap: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.xs,
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
