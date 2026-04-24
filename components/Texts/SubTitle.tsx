import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/metrics';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface SubTitleProps {
  text: string;
  style?: TextStyle;
}

export const SubTitle: React.FC<SubTitleProps> = ({ text, style }) => {
  return <Text style={[styles.subtitle, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  subtitle: {
    color: Colors.black,
    fontSize: FontSize.md,
    fontWeight: '400',
    lineHeight: FontSize.md * 1.5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
