import { Colors } from '@/constants/colors';
import { FontSize } from '@/constants/metrics';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';

interface HyperLinkProps {
  label: string;
  onPress: () => void;
  style?: TextStyle;
}

export const HyperLink: React.FC<HyperLinkProps> = ({ label, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.link, style]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    color: Colors.primary700,
    fontSize: FontSize.lg,
    fontWeight: '500',
    lineHeight: FontSize.lg * 1.4,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
