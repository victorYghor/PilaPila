import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { FinanceProvider } from './providers/FinanceProvider';

export const unstable_settings = {
  anchor: '(auth)',
};

function AuthGate() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <FinanceProvider>
          <AuthGate />
          <StatusBar style="auto" />
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}