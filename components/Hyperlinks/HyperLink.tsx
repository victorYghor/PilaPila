import { Colors } from '@/constants/colors';
import { FontSize } from '@/constants/metrics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface HyperLinkProps {
  label: string;
  onPress: () => void;
}

export const HyperLink: React.FC<HyperLinkProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.link}>{label}</Text>
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
