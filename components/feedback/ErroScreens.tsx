/**
 * components/feedback/ErrorScreens.tsx
 *
 * Three reusable full-screen feedback components matching the Figma designs:
 *
 *  - TokenExpiredScreen  → "Sessão Expirada" — shown when Firebase detects an
 *                          expired or revoked ID token (auth/id-token-expired).
 *
 *  - ServerErrorScreen   → "Erro" with a red X — shown for 5xx/network errors
 *                          from your own backend or Firestore unavailability.
 *
 *  - RetryScreen         → "Tente novamente" with a yellow warning triangle —
 *                          shown for validation / client-side request failures.
 *
 * Each component is self-contained: it receives an optional onAction callback
 * that the parent screen uses to implement the button behaviour (navigate to
 * login, retry the request, etc.).
 */

import { router } from 'expo-router';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/metrics';
import React from 'react';

// ─── Shared primitives ────────────────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
}

function ActionButton({ label, onPress, loading, icon }: ActionButtonProps) {
  return (
    <TouchableOpacity style={btn.base} onPress={onPress} activeOpacity={0.8} disabled={loading}>
      {loading ? (
        <ActivityIndicator color={Colors.textPrimary} />
      ) : (
        <View style={btn.row}>
          {icon}
          <Text style={btn.label}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: Spacing.xl,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.primary400,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 180,
  },
  row:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  label: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '500' },
});

// ─── Inline SVG icons (matching the Figma designs) ────────────────────────────
// Replace these with your actual SVG components from assets/ when ready.

function LoginArrowIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      {/* Arrow pointing into a rectangle — matches the "re-login" icon */}
      <Path d="M13 8H7a2 2 0 00-2 2v12a2 2 0 002 2h6" stroke={Colors.primary400} strokeWidth={2} strokeLinecap="round"/>
      <Path d="M21 20l4-4-4-4M25 16H13" stroke={Colors.primary400} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function ErrorXIcon() {
  return (
    <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
      <Circle cx={28} cy={28} r={27} stroke="#8B0000" strokeWidth={2}/>
      <Line x1={18} y1={18} x2={38} y2={38} stroke="#8B0000" strokeWidth={3} strokeLinecap="round"/>
      <Line x1={38} y1={18} x2={18} y2={38} stroke="#8B0000" strokeWidth={3} strokeLinecap="round"/>
    </Svg>
  );
}

function WarningIcon() {
  return (
    <Svg width={64} height={56} viewBox="0 0 64 56" fill="none">
      <Polygon points="32,4 60,52 4,52" stroke="#F5A623" strokeWidth={2.5} fill="none" strokeLinejoin="round"/>
      <Line x1={32} y1={22} x2={32} y2={36} stroke="#F5A623" strokeWidth={3} strokeLinecap="round"/>
      <Circle cx={32} cy={44} r={2} fill="#F5A623"/>
    </Svg>
  );
}

function RefreshIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14 8A6 6 0 112 8"
        stroke={Colors.primary400}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path d="M14 4v4h-4" stroke={Colors.primary400} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

// ─── Shared screen shell ──────────────────────────────────────────────────────

interface ShellProps {
  pageTitle: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  children: React.ReactNode;
}

function Shell({ pageTitle, icon, title, body, children }: ShellProps) {
  return (
    <SafeAreaView style={shell.safe}>
      <Text style={shell.pageTitle}>{pageTitle}</Text>
      <View style={shell.content}>
        <View style={shell.iconWrapper}>{icon}</View>
        <Text style={shell.title}>{title}</Text>
        <Text style={shell.body}>{body}</Text>
        {children}
      </View>
    </SafeAreaView>
  );
}

const shell = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.primary700 },
  pageTitle:   { color: Colors.textPrimary, fontSize: FontSize.sm, textAlign: 'center', paddingTop: Spacing.lg, opacity: 0.6 },
  content:     { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.xl, paddingHorizontal: Spacing.xl },
  iconWrapper: { marginBottom: Spacing.md },
  title:       { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: '700', textAlign: 'center' },
  body:        { color: Colors.textSecondary, fontSize: FontSize.sm, textAlign: 'center', lineHeight: FontSize.sm * 1.6 },
});

// ─── Token Expired ────────────────────────────────────────────────────────────

/**
 * Shown when the Firebase ID token has expired or been revoked.
 * The only sensible action here is to navigate back to login.
 *
 * Usage:
 *   if (error?.code === 'auth/id-token-expired') return <TokenExpiredScreen />;
 */
export function TokenExpiredScreen() {
  return (
    <Shell
      pageTitle="Token Expirado"
      icon={<LoginArrowIcon />}
      title="Sessão Expirada"
      body="Sua sessão expirou por segurança. Faça login novamente para continuar."
    >
      <ActionButton
        label="Fazer Login"
        onPress={() => router.replace('/(auth)/login')}
        icon={<LoginArrowIcon />}
      />
    </Shell>
  );
}

// ─── Server Error ─────────────────────────────────────────────────────────────

/**
 * Shown for unrecoverable server-side errors (5xx, Firestore unavailable, etc.).
 * The retry button calls back to the parent so it can re-run the failed request.
 *
 * Usage:
 *   if (hasServerError) return <ServerErrorScreen onRetry={fetchData} />;
 */
interface RetryProps {
  onRetry?: () => void;
  loading?: boolean;
}

export function ServerErrorScreen({ onRetry, loading }: RetryProps) {
  return (
    <Shell
      pageTitle="Erro and Re-login Screens"
      icon={<ErrorXIcon />}
      title="Erro"
      body="Nossos servidores estão com problemas no momento. Tente novamente em alguns instantes."
    >
      <ActionButton
        label="Tentar Novamente"
        onPress={onRetry ?? (() => {})}
        loading={loading}
        icon={<RefreshIcon />}
      />
      <Text style={extra.support}>
        Se o problema persistir, entre em contato com o suporte
      </Text>
    </Shell>
  );
}

// ─── Retry (validation / bad request) ────────────────────────────────────────

/**
 * Shown when a request couldn't be processed due to bad data, so the user
 * should verify their input and try again.
 *
 * Usage:
 *   if (validationFailed) return <RetryScreen onRetry={goBack} />;
 */
export function RetryScreen({ onRetry, loading }: RetryProps) {
  return (
    <Shell
      pageTitle="Tente novamente"
      icon={<WarningIcon />}
      title="Tente novamente"
      body="Não foi possível processar sua solicitação. Verifique os dados e tente novamente."
    >
      <ActionButton
        label="Tentar Novamente"
        onPress={onRetry ?? (() => {})}
        loading={loading}
        icon={<RefreshIcon />}
      />
    </Shell>
  );
}

const extra = StyleSheet.create({
  support: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: -Spacing.sm,
  },
});