import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, InputHeight, Spacing } from '@/constants/metrics';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

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
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textGray}
        keyboardType="default"
        autoCapitalize="words"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: Spacing.sm,
  },
  label: {
    color: Colors.primary700,
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.5,
  },
  input: {
    height: InputHeight,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.84,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    fontWeight: '400',
    color: Colors.black,
  },
});
