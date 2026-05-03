/**
 * app/auth/login/index.tsx
 *
 * Login screen. All Firebase interaction goes through useAuth() — this screen
 * knows nothing about Firebase directly, which keeps it focused purely on UI.
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PilaPilaButton } from '@/components/Buttons/Button';
import { HyperLink } from '@/components/Hyperlinks/HyperLink';
import { SubTitle } from '@/components/Texts/SubTitle';
import { Title } from '@/components/Texts/Title';
import { EmailInput } from '@/components/TextsInputs/EmailInput';
import { PasswordInput } from '@/components/TextsInputs/PasswordInput';
import { Colors } from '@/constants/colors';
import { BorderRadius, CardPadding, FontSize, Spacing } from '@/constants/metrics';
import { EMAIL_REGEX } from '@/constants/regex';
import { useAuth } from '../providers/Authcontext';


export default function LoginScreen() {
  const { signIn, isSubmitting, error, clearError } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  function handleEmailBlur() {
    if (email && !EMAIL_REGEX.test(email.trim())) {
      setEmailError('Digite um e-mail válido.');
    } else {
      setEmailError(null);
    }
  }

  async function handleLogin() {
    const emailErr = !EMAIL_REGEX.test(email.trim()) ? 'Digite um e-mail válido.' : null;
    if (emailErr) { setEmailError(emailErr); return; }

    await signIn({ email, password });
    // If signIn throws, AuthContext catches it and sets error — no redirect.
    // If it succeeds, onAuthStateChanged fires, user is set to non-null, and
    // the auth layout's <Redirect href="/home" /> takes over automatically.
  }

  const isDisabled = !email.trim() || !password.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Title text="Bem-vindo de volta" />
            <SubTitle text="Entre para continuar" />
          </View>

          <View style={styles.card}>
            <View style={styles.fields}>
              <View>
                <EmailInput
                  value={email}
                  onChangeText={(v) => { setEmail(v); clearError(); setEmailError(null); }}
                  placeholder="seu@email.com"
                  onBlur={handleEmailBlur}
                />
                {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
              </View>

              <PasswordInput
                value={password}
                onChangeText={(v) => { setPassword(v); clearError(); }}
                label="Senha"
                placeholder="Sua senha"
              />
            </View>

              {/* Firebase-level error (wrong password, user not found, etc.) */}
            {error ? <Text style={styles.globalError}>{error}</Text> : null}

              <View style={{ alignItems: 'flex-end', marginTop: -Spacing.sm }}>
                <HyperLink onPress={() => router.push({ pathname: '/(auth)/email_to_reset_password' } as any)}>Esqueceu a senha?</HyperLink>
              </View>

            <PilaPilaButton
              label="Entrar"
              onPress={handleLogin}
              disabled={isDisabled}
              loading={isSubmitting}
            />

            <View style={styles.row}>
              <Text style={styles.rowText}>Ainda não tem conta?</Text>
              <HyperLink onPress={() => router.push('/register')}> {"Cadastre-se"}</HyperLink>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.primary400 },
  flex:  { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.xxl,
    backgroundColor: Colors.primary400,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', gap: Spacing.xs },
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
  fields:     { gap: Spacing.lg },
  fieldError: { color: Colors.expenseRed, fontSize: FontSize.xs, marginTop: Spacing.xs },
  globalError: {
    color: Colors.expenseRed,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: -Spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.xs },
  rowText: { color: Colors.textGray, fontSize: FontSize.sm },
});