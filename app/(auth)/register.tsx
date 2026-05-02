import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/app/providers/Authcontext';
import { Button } from '@/components/Buttons/Button';
import { HyperLink } from '@/components/Hyperlinks/HyperLink';
import { InlineLink } from '@/components/Hyperlinks/InlineLink';
import { PasswordRules } from '@/components/Texts/PasswordRules';
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
  ConfirmTermsAndConditions = 4,
}

interface StepState {
  subtitle: string;
  onNext: () => void | Promise<void>;
  isButtonDisabled: boolean;
}

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
  const { signUp } = useAuth();
  const [step, setStep] = useState<RegisterStep>(RegisterStep.Name);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Inline error messages shown below each field
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const getSteps = (): Record<RegisterStep, StepState> => ({
    [RegisterStep.Name]: {
      subtitle: 'Qual o seu nome?',
      onNext: () => {
        // Just advance to next step; validation happens on create
        setStep(prev => (prev + 1) as RegisterStep);
      },
      isButtonDisabled: !fullName.trim(),
    },
    [RegisterStep.Email]: {
      subtitle: 'Qual o seu e-mail?',
      onNext: () => {
        // validate email inline before moving on
        const err = validateEmail(email);
        if (err) {
          setEmailError(err);
          return;
        }
        setEmail(prev => prev.trim());
        setStep(prev => (prev + 1) as RegisterStep);
      },
      isButtonDisabled: !email.trim(),
    },
    [RegisterStep.Password]: {
      subtitle: 'Crie e confirme sua senha',
      onNext: async () => {
        const pwErr = validatePassword(password);
        if (pwErr) { setPasswordError(pwErr); return; }
        if (password.trim() !== confirmPassword.trim()) {
          setConfirmError('As senhas precisam ser iguais.');
          return;
        }
        // Move to confirm step and create account
        setStep(prev => (prev + 1) as RegisterStep);
      },
      isButtonDisabled: (
        !password.trim() ||
        !confirmPassword.trim() ||
        password.trim() !== confirmPassword.trim() ||
        !!validatePassword(password)
      ),
    },
    [RegisterStep.ConfirmTermsAndConditions]: {
      subtitle: "Quase lá! Aceite os termos para finalizar seu cadastro.",
      onNext: async () => {
            await handleCreateAccount();
      },
      isButtonDisabled: false,
    },
  });

  const stepsMap = getSteps();
  const stepsQuantity = Object.keys(stepsMap).length;
  const progress = step / stepsQuantity;
  const subtitle = stepsMap[step].subtitle;
  const isPasswordStep = step === RegisterStep.Password;

  const isButtonDisabled = stepsMap[step].isButtonDisabled;

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

  async function handleCreateAccount() {
    
    setLoading(true);
    try {
      // Passando o objeto corretamente para a função de cadastro
      await signUp({
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim() // Passe o nome se o seu RegisterPayload aceitar
      });

      // router.replace('/'); // Se o seu AuthContext já redireciona no onAuthStateChanged, talvez nem precise dessa linha
    } catch (error: any) {
      // include a short debug hint when available
      const msg = (error && error.message) ? `: ${error.message}` : '';
      setSubmitError(`Erro ao finalizar cadastro. Tente novamente${msg}`);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────
  function BoxContent(step: RegisterStep): React.ReactElement | undefined {
    switch (step) {
      case RegisterStep.Name: return (<NameInput value={fullName} onChangeText={setFullName} />);
      case RegisterStep.Email: return (
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
      );
      case RegisterStep.Password: return (<>
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

        <PasswordRules password={password} minPasswordLength={MIN_PASSWORD_LENGTH} />
      </>);
      case RegisterStep.ConfirmTermsAndConditions: return (
        <Text style={styles.text}>
          Ao criar sua conta, você concorda com nossos {' '}
          <InlineLink onPress={() => { /* abrir termos */ }} accessibilityLabel="Termos de Serviço">
            Termos de Serviço
          </InlineLink>
          {' '}e{' '}
          <InlineLink onPress={() => { /* abrir política */ }} accessibilityLabel="Política de Privacidade">
            Política de Privacidade
          </InlineLink>
        </Text>
      );
  }
  }
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
          {BoxContent(step)}
          
          {/* Submit-level error */}
          {submitError ? (
            <Text style={styles.submitError}>{submitError}</Text>
          ) : null}

          <Button
            label={isPasswordStep ? 'Criar conta' : 'Continuar'}
            onPress={() => {
              // call the current step's onNext which handles validation and navigation
              const cur = stepsMap[step];
              void cur.onNext();
            }}
            disabled={isButtonDisabled}
            loading={loading}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <HyperLink onPress={() => router.replace('/login')}> {"Faça login"}</HyperLink>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.lg  },
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
});