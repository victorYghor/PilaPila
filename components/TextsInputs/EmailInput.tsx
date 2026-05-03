import React from 'react';
import { PilaPilaInput } from './PilaPilaInput';

interface EmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  onBlur?: () => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChangeText,
  label = 'E-mail',
  placeholder = 'Digite seu e-mail',
  onBlur,
}) => {
  return (
    <PilaPilaInput
      value={value}
      onChangeText={onChangeText}
      label={label}
      placeholder={placeholder}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      onBlur={onBlur}
    />
  );
};
