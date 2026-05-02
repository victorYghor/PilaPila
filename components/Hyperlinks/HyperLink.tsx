import { Colors } from '@/constants/colors';
import { FontSize } from '@/constants/metrics';
import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';

interface HyperLinkProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  // optional style override
  style?: any;
}

/**
 * HyperLink
 * - Blue color, underlined
 * - Uses accessibilityRole='link' so screen readers announce it as a link
 * - Pressable so it supports touch, keyboard and accessibility activation
 */
export const HyperLink: React.FC<HyperLinkProps> = ({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
      testID={testID}
      style={({ pressed }) => [style, styles.container, pressed && styles.pressed]}
    >
      <Text style={styles.link}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  link: {
    color: Colors.primary700,
    fontSize: FontSize.md,
    fontWeight: '500',
    lineHeight: FontSize.md,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  container: {
    height: FontSize.md,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  pressed: {
    opacity: 0.75,
  },
});
