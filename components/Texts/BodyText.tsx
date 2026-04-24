import { Colors } from '@/constants/colors';
import { FontSize } from '@/constants/metrics';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface BodyTextProps {
  text: string;
}

export const BodyText: React.FC<BodyTextProps> = ({ text }) => {
  return <Text style={styles.text}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '400',
    lineHeight: FontSize.lg * 1.4,
    textAlign: 'center',
  },
});
