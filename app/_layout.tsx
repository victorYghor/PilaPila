/**
 * app/_layout.tsx
 *
 * This is the root layout of the Expo Router app. It wraps every screen in
 * <AuthProvider> so that useAuth() is available everywhere, and it handles
 * the brief "loading" window while Firebase resolves the persisted session.
 */

import { Colors } from '@/constants/colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './providers/Authcontext';

// Exported as the default Expo Router entry point.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

/**
 * Separated from RootLayout so it can call useAuth() — hooks can only be
 * called inside a component that is already wrapped by their provider.
 */
function RootNavigator() {
  const { isLoading } = useAuth();

  // While Firebase is resolving the persisted session we show a full-screen
  // spinner. Without this guard the route guard inside (protected)/_layout.tsx
  // would see user === null and redirect to login even for an already
  // authenticated user — causing a flash of the login screen on every app open.
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary400} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public auth screens */}
      <Stack.Screen name="(auth)" />
      {/* Protected screens — route guard lives inside (protected)/_layout.tsx */}
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundPrimary,
  },
});