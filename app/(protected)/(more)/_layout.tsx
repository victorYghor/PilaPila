/**
 * app/(protected)/(more)/_layout.tsx
 *
 * Stack simples para a aba "Mais". Usamos Stack (não apenas um index direto)
 * para poder empilhar a tela de Perfil sobre a tela de Mais opções
 * sem sair das abas — assim a tab bar continua visível.
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function MoreStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}