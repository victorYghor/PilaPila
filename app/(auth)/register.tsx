import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/app/providers/Authcontext';
import { Button } from '@/components/Buttons/Button';
import { HyperLink } from '@/components/Hyperlinks/HyperLink';
import { SubTitle } from '@/components/Texts/SubTitle';
import { Title } from '@/components/Texts/Title';
import { EmailInput } from '@/components/TextsInputs/EmailInput';
import { NameInput } from '@/components/TextsInputs/NameInput';
import { PasswordInput } from '@/components/TextsInputs/PasswordInput';
import { BackIcon } from '@/components/icons/BackIcon';
import { ProgressBar } from '@/components/icons/ProgressBar';
import { Colors } from '@/constants/colors';
import { BorderRadius, CardPadding, FontSize, Spacing } from '@/constants/metrics';

// ─── Steps ───────────────────────────────────────────────────────────────────

enum RegisterStep {
  Name = 1,
  Email = 2,
  Password = 3,
}

const STEP_SUBTITLES: Record<RegisterStep, string> = {
  [RegisterStep.Name]:     'Qual o seu nome?',
  [RegisterStep.Email]:    'Qual o seu e-mail?',
  [RegisterStep.Password]: 'Crie e confirme sua senha',
};

// ─── Validation helpers ───────────────────────────────────────────────────────

const MIN_PASSWORD_LENGTH = 8;

/** RFC-5322 simplified — catches the vast majority of invalid addresses */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateEmail(value: string): string | null {
  if (!value.trim()) return 'O e-mail é obrigatório.';
  if (!EMAIL_REGEX.test(value.trim())) return 'Digite um e-mail válido.';
  return null;
}

function validatePassword(value: string): string | null {
  if (!value.trim()) return 'A senha é obrigatória.';
  if (value.trim().length < MIN_PASSWORD_LENGTH)
    return `A senha precisa ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
  if (!/[A-Z]/.test(value)) return 'A senha precisa ter ao menos uma letra maiúscula.';
  if (!/[0-9]/.test(value)) return 'A senha precisa ter ao menos um número.';
  return null;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const [step, setStep] = useState<RegisterStep>(RegisterStep.Name);

  const [fullName, setFullName]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Inline error messages shown below each field
  const [emailError, setEmailError]       = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError]   = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // ── Derived state ────────────────────────────────────────────

  const progress       = step / 3;
  const subtitle       = STEP_SUBTITLES[step];
  const isNameStep     = step === RegisterStep.Name;
  const isEmailStep    = step === RegisterStep.Email;
  const isPasswordStep = step === RegisterStep.Password;

  const isButtonDisabled = useMemo(() => {
    if (isNameStep)     return !fullName.trim();
    if (isEmailStep)    return !email.trim();
    return (
      !password.trim() ||
      !confirmPassword.trim() ||
      password.trim() !== confirmPassword.trim() ||
      !!validatePassword(password)
    );
  }, [step, fullName, email, password, confirmPassword, isNameStep, isEmailStep]);

  // ── Handlers ─────────────────────────────────────────────────

  function handleBack() {
    setSubmitError(null);
    if (step > RegisterStep.Name) {
      setStep(prev => (prev - 1) as RegisterStep);
    } else {
      router.back();
    }
  }

  function handleEmailBlur() {
    setEmailError(validateEmail(email));
  }

  function handlePasswordBlur() {
    setPasswordError(validatePassword(password));
  }

  function handleConfirmBlur() {
    if (password.trim() !== confirmPassword.trim()) {
      setConfirmError('As senhas precisam ser iguais.');
    } else {
      setConfirmError(null);
    }
  }

  async function handleNext() {
    setSubmitError(null);

    // Step 1 → 2
    if (isNameStep) {
      setFullName(prev => prev.trim());
      setStep(RegisterStep.Email);
      return;
    }

    // Step 2 → 3 (validate e-mail before advancing)
    if (isEmailStep) {
      const err = validateEmail(email);
      if (err) { setEmailError(err); return; }
      setEmail(prev => prev.trim());
      setStep(RegisterStep.Password);
      return;
    }

    // Step 3 → create account
    const pwErr = validatePassword(password);
    if (pwErr) { setPasswordError(pwErr); return; }
    if (password.trim() !== confirmPassword.trim()) {
      setConfirmError('As senhas precisam ser iguais.');
      return;
    }

    await handleCreateAccount();
  }

  async function handleCreateAccount() {
    if (!fullName.trim()) {
      setStep(RegisterStep.Name);
      setSubmitError('Informe seu nome para continuar.');
      return;
    }

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      setStep(RegisterStep.Email);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      setStep(RegisterStep.Password);
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      setConfirmError('As senhas precisam ser iguais.');
      setStep(RegisterStep.Password);
      return;
    }

    setLoading(true);
    try {
      signIn(fullName.trim());
      router.replace('/');
    } catch {
      setSubmitError('Erro ao finalizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>

        <View style={styles.header}>
          <Title text="Crie sua conta" />
          <SubTitle text={subtitle} />
          <View style={styles.progressWrapper}>
            <ProgressBar progress={progress} />
          </View>
        </View>

        <View style={styles.card}>
          {/* ── Step 1: Name ── */}
          {isNameStep && (
            <NameInput value={fullName} onChangeText={setFullName} />
          )}

          {/* ── Step 2: Email ── */}
          {isEmailStep && (
            <View>
              <EmailInput
                value={email}
                onChangeText={v => { setEmail(v); setEmailError(null); }}
                placeholder="E-mail"
                onBlur={handleEmailBlur}
              />
              {emailError ? (
                <Text style={styles.fieldError}>{emailError}</Text>
              ) : null}
            </View>
          )}

          {/* ── Step 3: Password ── */}
          {isPasswordStep && (
            <>
              <View>
                <PasswordInput
                  value={password}
                  onChangeText={v => { setPassword(v); setPasswordError(null); }}
                  label="Senha"
                  placeholder="Mínimo 8 caracteres"
                  onBlur={handlePasswordBlur}
                />
                {passwordError ? (
                  <Text style={styles.fieldError}>{passwordError}</Text>
                ) : null}
              </View>

              <View>
                <PasswordInput
                  value={confirmPassword}
                  onChangeText={v => { setConfirmPassword(v); setConfirmError(null); }}
                  label="Confirme sua senha"
                  placeholder="Repita a senha"
                  onBlur={handleConfirmBlur}
                />
                {confirmError ? (
                  <Text style={styles.fieldError}>{confirmError}</Text>
                ) : null}
              </View>

              <PasswordRules password={password} />
            </>
          )}

          {/* Submit-level error */}
          {submitError ? (
            <Text style={styles.submitError}>{submitError}</Text>
          ) : null}

          <Button
            label={isPasswordStep ? 'Criar conta' : 'Continuar'}
            onPress={handleNext}
            disabled={isButtonDisabled}
            loading={loading}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <HyperLink label="Faça login" onPress={() => router.replace('/')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Password strength hint ───────────────────────────────────────────────────

function PasswordRules({ password }: { password: string }) {
  const rules: { label: string; ok: boolean }[] = [
    { label: 'Mínimo 8 caracteres',     ok: password.length >= MIN_PASSWORD_LENGTH },
    { label: 'Uma letra maiúscula',      ok: /[A-Z]/.test(password) },
    { label: 'Um número',               ok: /[0-9]/.test(password) },
  ];

  return (
    <View style={styles.rulesWrapper}>
      {rules.map(r => (
        <Text
          key={r.label}
          style={[styles.ruleText, r.ok ? styles.ruleOk : styles.rulePending]}
        >
          {r.ok ? '✓' : '○'} {r.label}
        </Text>
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  fieldError: {
    color: Colors.expenseRed,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  submitError: {
    color: Colors.expenseRed,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  rulesWrapper: {
    gap: 4,
    marginTop: -Spacing.xs,
  },
  ruleText: {
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * 1.6,
  },
  ruleOk: {
    color: Colors.incomeGreen,
  },
  rulePending: {
    color: Colors.textGray,
  },
});