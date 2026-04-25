/**
 * app/auth/_layout.tsx
 *
 * Stack navigator for all public (unauthenticated) screens.
 * If the user is already logged in we redirect directly to /home so they
 * never see the login screen again after a successful session.
 */

import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../providers/Authcontext';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  // If Firebase already has a valid session, skip the auth flow entirely.
  if (!isLoading && user) {
    return <Redirect href="/(protected)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}