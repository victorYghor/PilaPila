import { Colors } from '@/constants/colors';
import { FontSize } from '@/constants/metrics';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text } from 'react-native';

interface InlineLinkProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  accessibilityLabel?: string;
  style?: any;
}

/**
 * InlineLink: a Text-based link that can be nested inside another <Text>
 * Keeps typography consistent and lays out inline with surrounding text.
 */
export const InlineLink: React.FC<InlineLinkProps> = ({ children, onPress, accessibilityLabel, style }) => {
  return (
    <Text
      onPress={onPress}
      accessibilityRole="link"
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.link, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  link: {
    color: Colors.primary700,
    textDecorationLine: 'underline',
    fontSize: FontSize.lg,
  },
});

export default InlineLink;
