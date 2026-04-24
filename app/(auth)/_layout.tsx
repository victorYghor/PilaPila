import { Stack } from 'expo-router';
import React from 'react';

import { RegistrationProvider } from '@/app/providers/RegistrationProvider';

export default function AuthLayout() {
  return (
    <RegistrationProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register_name" options={{ headerShown: false }} />
      </Stack>
    </RegistrationProvider>
  );
}
