import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/metrics';
import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface TitleProps {
  text: string;
  style?: TextStyle;
}

export const Title: React.FC<TitleProps> = ({ text, style }) => {
  return <Text style={[styles.title, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    color: Colors.black,
    fontSize: FontSize.xxl,
    fontWeight: '400',
    lineHeight: FontSize.xxl * 1.5,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
