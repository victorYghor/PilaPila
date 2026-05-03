import React from 'react';
import { PilaPilaInput } from './PilaPilaInput';

interface NameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
}

export const NameInput: React.FC<NameInputProps> = ({
  value,
  onChangeText,
  label = 'Nome',
  placeholder = 'Seu nome',
}) => {
  return (
    <PilaPilaInput
      value={value}
      onChangeText={onChangeText}
      label={label}
      placeholder={placeholder}
      keyboardType="default"
      autoCapitalize="words"
      autoCorrect={false}
    />
  );
};
