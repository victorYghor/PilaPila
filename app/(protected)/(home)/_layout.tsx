/**
 * app/(protected)/(home)/_layout.tsx
 *
 * Por que um Stack dentro de uma aba?
 *
 * O Expo Router permite que cada aba tenha seu próprio Stack interno.
 * Isso é necessário porque quando o usuário toca em uma transação na home,
 * queremos que a tela de detalhes apareça "em cima" da home — mas a tab bar
 * deve continuar visível ou sumir dependendo do design.
 *
 * Aqui usamos Stack com headerShown: false para que a tela de transação
 * que fica em /(protected)/transaction/[id] seja empilhada sobre a home
 * sem mostrar um header padrão do React Navigation.
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tela inicial da aba */}
      <Stack.Screen name="index" />
    </Stack>
  );
}