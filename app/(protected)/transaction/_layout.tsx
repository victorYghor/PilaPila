/**
 * app/(protected)/(more)/index.tsx
 *
 * Tela "Mais opções" — fiel ao Figma:
 * lista com ícone de perfil e link para a tela de Perfil.
 */

import { router } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/metrics';

function PersonIcon() {
  return <Text style={{ fontSize: 22, color: Colors.textPrimary }}>👤</Text>;
}

export default function MoreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.pageTitle}>Mais opções</Text>

      <View style={styles.list}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(protected)/(more)/profile' as never)}
          activeOpacity={0.7}
        >
          <PersonIcon />
          <Text style={styles.rowLabel}>Perfil</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  list: {
    paddingHorizontal: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  rowLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.primary700,
    opacity: 0.5,
  },
});