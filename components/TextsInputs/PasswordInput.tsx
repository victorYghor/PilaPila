import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, InputHeight, Spacing } from '@/constants/metrics';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
}

const EyeOpenIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M1.71608 10.2765C1.64672 10.0897 1.64672 9.88415 1.71608 9.69729C2.39163 8.05928 3.53833 6.65875 5.0108 5.67324C6.48328 4.68773 8.21522 4.16162 9.98707 4.16162C11.7589 4.16162 13.4909 4.68773 14.9633 5.67324C16.4358 6.65875 17.5825 8.05928 18.258 9.69729C18.3274 9.88415 18.3274 10.0897 18.258 10.2765C17.5825 11.9145 16.4358 13.3151 14.9633 14.3006C13.4909 15.2861 11.7589 15.8122 9.98707 15.8122C8.21522 15.8122 6.48328 15.2861 5.0108 14.3006C3.53833 13.3151 2.39163 11.9145 1.71608 10.2765Z"
      stroke={Colors.iconMuted}
      strokeWidth={1.66452}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.98701 12.4838C11.3659 12.4838 12.4838 11.3659 12.4838 9.98701C12.4838 8.60808 11.3659 7.49023 9.98701 7.49023C8.60808 7.49023 7.49023 8.60808 7.49023 9.98701C7.49023 11.3659 8.60808 12.4838 9.98701 12.4838Z"
      stroke={Colors.iconMuted}
      strokeWidth={1.66452}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EyeClosedIcon = () => (
  <Svg width={22} height={20} viewBox="0 0 22 20" fill="none">
    <Path
      d="M15.1 10.5L13.65 9.05C13.8 8.26667 13.575 7.53333 12.975 6.85C12.375 6.16667 11.6 5.9 10.65 6.05L9.2 4.6C9.48333 4.46667 9.77083 4.36667 10.0625 4.3C10.3542 4.23333 10.6667 4.2 11 4.2C12.25 4.2 13.3125 4.6375 14.1875 5.5125C15.0625 6.3875 15.5 7.45 15.5 8.7C15.5 9.03333 15.4667 9.34583 15.4 9.6375C15.3333 9.92917 15.2333 10.2167 15.1 10.5ZM18.3 13.65L16.85 12.25C17.4833 11.7667 18.0458 11.2375 18.5375 10.6625C19.0292 10.0875 19.45 9.43333 19.8 8.7C18.9667 7.01667 17.7708 5.67917 16.2125 4.6875C14.6542 3.69583 12.9167 3.2 11 3.2C10.5167 3.2 10.0417 3.23333 9.575 3.3C9.10833 3.36667 8.65 3.46667 8.2 3.6L6.65 2.05C7.33333 1.76667 8.03333 1.55417 8.75 1.4125C9.46667 1.27083 10.2167 1.2 11 1.2C13.5167 1.2 15.7583 1.89583 17.725 3.2875C19.6917 4.67917 21.1167 6.48333 22 8.7C21.6167 9.68333 21.1125 10.5958 20.4875 11.4375C19.8625 12.2792 19.1333 13.0167 18.3 13.65ZM18.8 19.8L14.6 15.65C14.0167 15.8333 13.4292 15.9708 12.8375 16.0625C12.2458 16.1542 11.6333 16.2 11 16.2C8.48333 16.2 6.24167 15.5042 4.275 14.1125C2.30833 12.7208 0.883333 10.9167 0 8.7C0.35 7.81667 0.791667 6.99583 1.325 6.2375C1.85833 5.47917 2.46667 4.8 3.15 4.2L0.4 1.4L1.8 0L20.2 18.4L18.8 19.8ZM4.55 5.6C4.06667 6.03333 3.625 6.50833 3.225 7.025C2.825 7.54167 2.48333 8.1 2.2 8.7C3.03333 10.3833 4.22917 11.7208 5.7875 12.7125C7.34583 13.7042 9.08333 14.2 11 14.2C11.3333 14.2 11.6583 14.1792 11.975 14.1375C12.2917 14.0958 12.6167 14.05 12.95 14L12.05 13.05C11.8667 13.1 11.6917 13.1375 11.525 13.1625C11.3583 13.1875 11.1833 13.2 11 13.2C9.75 13.2 8.6875 12.7625 7.8125 11.8875C6.9375 11.0125 6.5 9.95 6.5 8.7C6.5 8.51667 6.5125 8.34167 6.5375 8.175C6.5625 8.00833 6.6 7.83333 6.65 7.65L4.55 5.6Z"
      fill={Colors.iconMuted}
    />
  </Svg>
);

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChangeText,
  label = 'Senha',
  placeholder = 'Digite sua senha',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textGray}
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setIsVisible(prev => !prev)}
          activeOpacity={0.7}
        >
          {isVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </TouchableOpacity>
      </View>
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
  inputRow: {
    height: InputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.84,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '400',
    color: Colors.black,
  },
  eyeButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
