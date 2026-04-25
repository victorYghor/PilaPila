/**
 * app/(protected)/_layout.tsx
 *
 * This is the ROUTE GUARD — the most important file for protecting the
 * authenticated part of the app. Every screen nested under (protected)/
 * is automatically covered by this guard.
 *
 * How it works:
 *  1. useAuth() gives us the current user and loading state.
 *  2. If the user is null (not logged in), we immediately redirect to /auth/login.
 *  3. If the user is authenticated, we render the Stack and allow navigation.
 *
 * The parentheses in the folder name "(protected)" are a Expo Router convention
 * that creates a route group — the folder name itself does NOT appear in the URL.
 * So /app/(protected)/home/index.tsx is accessed at the route /home.
 */

import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../providers/Authcontext';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  // isLoading is handled in the root layout — by the time we get here
  // Firebase has already resolved, so if user is null the session is
  // genuinely absent and we should redirect.
  if (!isLoading && !user) {
    // Redirect pushes to the login screen and replaces the current history
    // entry, so pressing the back button from login won't return the user
    // to a protected screen.
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen
        name="transaction"
        options={{
          // Transaction modal slides up from the bottom — matching the designs.
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}