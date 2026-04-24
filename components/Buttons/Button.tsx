import { Colors } from '@/constants/colors';
import { ButtonHeight, FontSize } from '@/constants/metrics';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textWhite} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: ButtonHeight,
    width: '100%',
    backgroundColor: Colors.primary700,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: '500',
    lineHeight: FontSize.md * 1.5,
  },
  disabled: {
    opacity: 0.6,
  },
});
