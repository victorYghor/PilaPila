/**
 * app/(protected)/_layout.tsx
 *
 * RAIZ DA ÁREA AUTENTICADA — usa <Tabs> como navigator principal.
 *
 * Por que Tabs aqui e não Stack?
 * O Expo Router monta o layout do grupo como o "container" de todas as
 * telas filhas. Se usarmos Stack aqui, as abas nunca aparecem porque o
 * Stack só empilha telas — ele não sabe renderizar uma barra de tabs.
 * Ao colocar <Tabs> aqui, cada aba vira uma rota-filha e a tab bar fica
 * sempre visível nas telas home e more.
 *
 * Estrutura de rotas resultante:
 *   /(protected)/(home)   → tab "Início"   (home/_layout wraps com Stack
 *                                            para permitir push de transação)
 *   /(protected)/(more)   → tab "Mais"
 *   O botão "+" no centro NÃO é uma aba real — é um botão customizado
 *   que abre o modal de escolha Despesa/Receita.
 *
 * GUARD DE AUTENTICAÇÃO:
 * Se Firebase ainda não resolveu (isLoading) não fazemos nada — o
 * RootNavigator no _layout raiz já mostra o spinner. Quando isLoading=false
 * e user=null, redirecionamos para login.
 */

import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/metrics';
import { Redirect, Tabs } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../providers/Authcontext';

// ─── Ícones inline (SVG via Text/View até você adicionar seus assets) ─────────
// Substitua por <HomeIcon />, <MoreIcon /> etc. quando tiver os SVGs prontos.

function HomeIcon({ color }: { color: string }) {
  return (
    <Text style={{ fontSize: 22, color, lineHeight: 26 }}>⌂</Text>
  );
}

function MoreDotsIcon({ color }: { color: string }) {
  return (
    <Text style={{ fontSize: 18, color, letterSpacing: 2, lineHeight: 26 }}>•••</Text>
  );
}

function ExpenseArrowIcon() {
  return <Text style={{ fontSize: 28, color: Colors.expenseRed }}>↘</Text>;
}

function IncomeArrowIcon() {
  return <Text style={{ fontSize: 28, color: Colors.incomeGreen }}>↗</Text>;
}

// ─── Botão "+" central customizado ───────────────────────────────────────────

/**
 * PlusButton é o botão branco circular do meio da tab bar.
 * Ele NÃO navega diretamente — abre um mini-menu flutuante acima da tab bar
 * onde o usuário escolhe entre "Despesa" e "Receita", como no Figma.
 */
function PlusButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  // Quando o menu está aberto, mostra um overlay escuro atrás
  return (
    <>
      {/* Overlay que fecha o menu ao tocar fora */}
      {menuOpen && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setMenuOpen(false)}
        />
      )}

      {/* Menu flutuante de Despesa / Receita */}
      {menuOpen && (
        <View style={[styles.fabMenu, { bottom: 80 + insets.bottom }]}>
          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setMenuOpen(false);
              // A navegação usa o path absoluto para o modal de transação
              // passando o tipo como query param
              const { router } = require('expo-router');
              router.push('/(protected)/transaction/new?type=expense');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.fabOptionIcon}>
              <ExpenseArrowIcon />
            </View>
            <Text style={styles.fabOptionLabel}>Despesa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setMenuOpen(false);
              const { router } = require('expo-router');
              router.push('/(protected)/transaction/new?type=income');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.fabOptionIcon}>
              <IncomeArrowIcon />
            </View>
            <Text style={styles.fabOptionLabel}>Receita</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* O botão + em si */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setMenuOpen((v) => !v)}
        activeOpacity={0.85}
      >
        <Text style={styles.plusButtonLabel}>{menuOpen ? '✕' : '+'}</Text>
      </TouchableOpacity>
    </>
  );
}

// ─── Tab bar customizada ──────────────────────────────────────────────────────

/**
 * CustomTabBar substitui a tab bar padrão do React Navigation para que
 * possamos colocar o botão "+" elevado no centro, exatamente como no Figma.
 *
 * O truque: renderizamos a tab bar como um View com borderRadius no topo,
 * posicionamos o PlusButton absolutamente acima do centro, e deixamos os
 * dois itens de tab (Início e Mais) nas extremidades.
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      {/* Botão "+" flutuante centralizado */}
      <PlusButton />

      <View style={styles.tabBarInner}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconColor = isFocused ? Colors.primary700 : Colors.textGray;
          const bgColor   = isFocused ? Colors.primary200 : 'transparent';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={[styles.tabItem, { backgroundColor: bgColor }]}
            >
              {/* Ícone da aba */}
              {route.name === '(home)' && <HomeIcon color={iconColor} />}
              {route.name === '(more)' && <MoreDotsIcon color={iconColor} />}

              {/* Label da aba */}
              <Text style={[styles.tabLabel, { color: iconColor }]}>
                {route.name === '(home)' ? 'Início' : 'Mais'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Layout principal ─────────────────────────────────────────────────────────

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Tab 1 — Home (tem Stack interno para navegar para transação) */}
      <Tabs.Screen name="(home)" options={{ title: 'Início' }} />

      {/* Tab 2 — Mais opções */}
      <Tabs.Screen name="(more)" options={{ title: 'Mais' }} />

      {/* Rota de transação — NÃO aparece na tab bar */}
      <Tabs.Screen
        name="transaction"
        options={{ href: null }} // href: null = oculta da tab bar
      />
    </Tabs>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const TAB_BAR_HEIGHT = 72;
const PLUS_BUTTON_SIZE = 56;

const styles = StyleSheet.create({
  // Tab bar container externo (inclui safe area bottom)
  tabBarWrapper: {
    backgroundColor: Colors.primary400,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    // Sombra sutil para separar do conteúdo
    shadowColor: Colors.black ?? '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },

  // Row interna com as duas abas
  tabBarInner: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  // Cada item de aba ocupa metade da largura — o espaço central é
  // reservado para o botão "+" que flutua acima
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    gap: 2,
  },

  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },

  // Botão "+" — posicionado absolutamente acima do centro da tab bar
  plusButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: -(PLUS_BUTTON_SIZE / 2),
    left: '50%',
    marginLeft: -(PLUS_BUTTON_SIZE / 2),
    width: PLUS_BUTTON_SIZE,
    height: PLUS_BUTTON_SIZE,
    borderRadius: PLUS_BUTTON_SIZE / 2,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para o botão "flutuar"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10,
  },

  plusButtonLabel: {
    fontSize: 28,
    color: Colors.backgroundPrimary,
    lineHeight: 32,
    fontWeight: '300',
  },

  // Menu flutuante com as opções Despesa / Receita
  fabMenu: {
    position: 'absolute',
    flexDirection: 'row',
    gap: Spacing.xxl,
    alignSelf: 'center',
    left: '50%',
    transform: [{ translateX: -90 }],
    zIndex: 20,
  },

  fabOption: {
    alignItems: 'center',
    gap: Spacing.xs,
  },

  fabOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  fabOptionLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});