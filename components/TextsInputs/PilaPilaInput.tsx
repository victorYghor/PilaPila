import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, InputHeight, Spacing } from '@/constants/metrics';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface PilaPilaInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
}

export const PilaPilaInput: React.FC<PilaPilaInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  ...rest
}) => {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textGray}
        {...rest}
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

export default PilaPilaInput;
