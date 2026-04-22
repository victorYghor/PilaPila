import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { useFinance } from '@/app/providers/FinanceProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

function formatMonth(date: Date) {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export default function HomeScreen() {
  const { transactions } = useFinance();
  const [monthCursor, setMonthCursor] = useState(new Date());

  const monthTransactions = useMemo(() => {
    const targetMonth = monthCursor.getMonth();
    const targetYear = monthCursor.getFullYear();

    return transactions.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === targetMonth && itemDate.getFullYear() === targetYear;
    });
  }, [monthCursor, transactions]);

  const expenses = monthTransactions.filter((item) => item.type === 'expense');
  const incomes = monthTransactions.filter((item) => item.type === 'income');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">PilaPila</ThemedText>

      <ThemedView style={styles.monthRow}>
        <Pressable
          onPress={() =>
            setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
          }>
          <ThemedText type="defaultSemiBold">◀</ThemedText>
        </Pressable>

        <ThemedText type="subtitle" style={styles.monthText}>
          {formatMonth(monthCursor)}
        </ThemedText>

        <Pressable
          onPress={() =>
            setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
          }>
          <ThemedText type="defaultSemiBold">▶</ThemedText>
        </Pressable>
      </ThemedView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="subtitle">Despesas</ThemedText>
        {expenses.length === 0 ? (
          <ThemedText>Nenhuma despesa neste mês.</ThemedText>
        ) : (
          expenses.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => router.push(`/(tabs)/transaction/${item.id}` as never)}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText>R$ {item.amount.toFixed(2)}</ThemedText>
            </Pressable>
          ))
        )}

        <ThemedText type="subtitle" style={styles.sectionGap}>
          Receitas
        </ThemedText>
        {incomes.length === 0 ? (
          <ThemedText>Nenhuma receita neste mês.</ThemedText>
        ) : (
          incomes.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => router.push(`/(tabs)/transaction/${item.id}` as never)}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText>R$ {item.amount.toFixed(2)}</ThemedText>
            </Pressable>
          ))
        )}
      </ScrollView>

      <ThemedView style={styles.fabContainer}>
        <Pressable
          style={styles.secondaryFab}
          onPress={() => router.push('/(tabs)/transaction/new?type=income' as never)}>
          <ThemedText style={styles.fabText}>+ Receita</ThemedText>
        </Pressable>
        <Pressable
          style={styles.secondaryFab}
          onPress={() => router.push('/(tabs)/transaction/new?type=expense' as never)}>
          <ThemedText style={styles.fabText}>+ Despesa</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  monthText: {
    textTransform: 'capitalize',
  },
  scrollContent: {
    paddingBottom: 140,
    gap: 10,
  },
  sectionGap: {
    marginTop: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#687076',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    gap: 8,
    backgroundColor: 'transparent',
  },
  secondaryFab: {
    backgroundColor: '#0a7ea4',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
  },
});
