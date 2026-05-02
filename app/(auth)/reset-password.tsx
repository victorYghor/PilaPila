import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Buttons/Button';
import { EmailInput } from '@/components/TextsInputs/EmailInput';
import { Colors } from '@/constants/colors';
import { BorderRadius, CardPadding, FontSize, Spacing } from '@/constants/metrics';
import { resetPassword } from '@/service/AuthService';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function handleEmailBlur() {
    if (email && !EMAIL_REGEX.test(email.trim())) setEmailError('Digite um e-mail válido.');
    else setEmailError(null);
  }

  async function handleSend() {
    setMessage(null);
    const err = !EMAIL_REGEX.test(email.trim()) ? 'Digite um e-mail válido.' : null;
    if (err) { setEmailError(err); return; }

    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Se existir uma conta com esse e-mail, você receberá um link para redefinir a senha.');
    } catch (e: any) {
      const msg = e?.message ? `: ${e.message}` : '';
      setMessage(`Erro ao enviar o código. Tente novamente${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={{ fontSize: FontSize.xxl, fontWeight: '700' }}>Redefinir senha</Text>
            <Text style={{ textAlign: 'center', color: Colors.textGray }}>Digite seu e-mail e enviaremos instruções para redefinir sua senha.</Text>
          </View>

          <View style={styles.card}>
            <EmailInput
              value={email}
              onChangeText={v => { setEmail(v); setEmailError(null); setMessage(null); }}
              placeholder="seu@email.com"
              onBlur={handleEmailBlur}
            />
            {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

            {message ? <Text style={{ marginTop: Spacing.sm, textAlign: 'center' }}>{message}</Text> : null}

            <Button label="Enviar" onPress={handleSend} loading={loading} disabled={!email.trim()} />
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
  fieldError: { color: Colors.expenseRed, fontSize: FontSize.xs, marginTop: Spacing.xs },
});
