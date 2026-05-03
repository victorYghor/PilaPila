import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/metrics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  onResendOTP?: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 5,
  disabled = false,
  onResendOTP,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);

  // init animated values
  useEffect(() => {
    animatedValues.current = Array(length)
      .fill(0)
      .map(() => new Animated.Value(0));
    // ensure value array has correct length
    if (value.length !== length) {
      const normalized = Array.from({ length }).map((_, i) => value[i] ?? '');
      onChange(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  useEffect(() => {
    let timer: number | undefined;
    if (countdown > 0 && !isResendActive) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else if (countdown === 0) {
      setIsResendActive(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, isResendActive]);

  const focusInput = (index: number) => {
    const ref = inputRefs.current[index];
    if (ref) {
      ref.focus();
      // animate
      const anim = animatedValues.current[index];
      if (anim) {
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 120, useNativeDriver: true }),
        ]).start();
      }
    }
  };

  const handleChange = (text: string, index: number) => {
    const char = text ? text.slice(-1) : '';
    const newValue = [...value];
    newValue[index] = char;
    onChange(newValue);
    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    const key = e.nativeEvent?.key;
    if (key === 'Backspace' && !value[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handleResend = () => {
    if (!isResendActive) return;
    onResendOTP?.();
    setCountdown(60);
    setIsResendActive(false);
    // focus first input after resend
    setTimeout(() => focusInput(0), 100);
  };

  // box dimensions
  const boxSize = 56;

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => {
          const anim = animatedValues.current[i];
          const scale = anim
            ? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] })
            : 1;

          return (
            <Animated.View
              key={i}
              style={[styles.box, { width: boxSize, height: boxSize, transform: [{ scale }] }]}
            >
              <TextInput
                ref={(ref) => { inputRefs.current[i] = ref; }}
                value={value[i] ?? ''}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                maxLength={1}
                editable={!disabled}
                style={styles.input}
                placeholder="•"
                placeholderTextColor={Colors.textGray}
                selectionColor={Colors.primary700}
                textContentType="oneTimeCode"
              />
            </Animated.View>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={handleResend}
        disabled={!isResendActive}
        style={[styles.resend, !isResendActive && styles.resendDisabled]}
      >
        <Text style={[styles.resendText, !isResendActive && styles.resendTextDisabled]}>
          {isResendActive ? 'Reenviar código' : `Reenviar em ${countdown}s`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%', alignItems: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    width: '100%',
  },
  box: {
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: FontSize.xxl ?? 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resend: {
    marginTop: Spacing.sm,
  },
  resendDisabled: { opacity: 0.6 },
  resendText: { color: Colors.primary700, fontSize: FontSize.sm, fontWeight: '600' },
  resendTextDisabled: { color: Colors.textGray },
});

export default OTPInput;
