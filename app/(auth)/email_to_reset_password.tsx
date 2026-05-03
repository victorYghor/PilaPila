import React, { useEffect, useState } from 'react';

import { PilaPilaButton } from '@/components/Buttons/Button';
import { EmailInput } from '@/components/TextsInputs/EmailInput';
import { EMAIL_REGEX } from '@/constants/regex';
import { resetPassword } from '@/service/AuthService';
import { AuthTemplate } from '@/templates/AuthTemplate';
import { router } from 'expo-router';
import { useAuth } from '../providers/Authcontext';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const {setEmailOfReset} = useAuth();

  useEffect(() => {
    if (EMAIL_REGEX.test(email.trim())) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email]);

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
      setEmailOfReset(email);
      await resetPassword(email);
      setMessage('Se existir uma conta com esse e-mail, você receberá um link para redefinir a senha.');
      router.push("/(auth)/verify_code");
    } catch (e: any) {
      const msg = e?.message ? `: ${e.message}` : '';
      setMessage(`Erro ao enviar o código. Tente novamente${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthTemplate
      title={'Esqueceu a senha?'}
      subtitle={'Não se preocupe! Digite seu e-mail e enviaremos um código de redifinição de senha.'}
      boxContent={() =>
        <>
          <EmailInput value={email} onChangeText={setEmail} onBlur={handleEmailBlur} />
        </>
      }
      submitError={emailError || message}
      loading={loading}
      ConfirmButton={
        <PilaPilaButton label="Enviar código" onPress={handleSend} loading={loading} disabled={disabled} />}
    />
  );
}
