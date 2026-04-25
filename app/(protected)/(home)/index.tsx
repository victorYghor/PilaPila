/**
 * app/(protected)/(home)/index.tsx
 *
 * Tela principal do app — fiel ao Figma:
 *  • Header azul arredondado com mês, saldo, receitas e despesas
 *  • Lista de transações agrupadas por data
 *  • Cada transação navegável para edição
 */

import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Transaction, useFinance } from '@/app/providers/FinanceProvider';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/metrics';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatMonthName(date: Date): string {
  return capitalizeFirst(
    date.toLocaleDateString('pt-BR', { month: 'long' }),
  );
}

/** Formata "Terça-feira, 20" a partir de uma string YYYY-MM-DD */
function formatDayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  // Cria a data no fuso local para evitar off-by-one do UTC
  const date = new Date(y, m - 1, d);
  return capitalizeFirst(
    date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' }),
  );
}

/** Agrupa transações por data (YYYY-MM-DD) mantendo a ordem cronológica inversa */
function groupByDate(transactions: Transaction[]): { date: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (!map.has(t.date)) map.set(t.date, []);
    map.get(t.date)!.push(t);
  }
  // Mais recentes primeiro
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }));
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SummaryHeader({
  monthName,
  balance,
  totalIncome,
  totalExpense,
  onPrev,
  onNext,
}: {
  monthName: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.summaryCard}>
      {/* Navegação de mês */}
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={onPrev} hitSlop={12}>
          <Text style={styles.monthArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthName}>{monthName}</Text>
        <TouchableOpacity onPress={onNext} hitSlop={12}>
          <Text style={styles.monthArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Saldo */}
      <Text style={styles.balanceLabel}>Saldo atual em contas</Text>
      <Text style={styles.balanceValue}>
        R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </Text>

      {/* Receitas e Despesas lado a lado */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconCircle, { backgroundColor: Colors.incomeGreen }]}>
            <Text style={styles.summaryIconText}>↓</Text>
          </View>
          <View>
            <Text style={styles.summaryItemLabel}>Receitas</Text>
            <Text style={styles.summaryItemValue}>
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
            </Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconCircle, { backgroundColor: Colors.expenseRed }]}>
            <Text style={styles.summaryIconText}>↑</Text>
          </View>
          <View>
            <Text style={styles.summaryItemLabel}>Despesas</Text>
            <Text style={styles.summaryItemValue}>
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isExpense = transaction.type === 'expense';
  const amountColor = isExpense ? Colors.expenseRed : Colors.incomeGreen;
  const amountPrefix = isExpense ? 'R$ - ' : 'R$ +';

  return (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => router.push(`/(protected)/transaction/${transaction.id}` as never)}
      activeOpacity={0.7}
    >
      {/* Avatar / ícone da categoria */}
      <View style={styles.transactionIcon} />

      {/* Título e categoria */}
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={styles.transactionSub} numberOfLines={1}>
          {transaction.notes ?? transaction.category ?? ''}
        </Text>
      </View>

      {/* Valor */}
      <Text style={[styles.transactionAmount, { color: amountColor }]}>
        {amountPrefix}
        {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Tela principal ────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { transactions } = useFinance();
  const [monthCursor, setMonthCursor] = useState(new Date());

  // Filtra transações do mês selecionado
  const monthTransactions = useMemo(() => {
    const tm = monthCursor.getMonth();
    const ty = monthCursor.getFullYear();
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === tm && d.getFullYear() === ty;
    });
  }, [monthCursor, transactions]);

  const totalIncome  = useMemo(
    () => monthTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [monthTransactions],
  );
  const totalExpense = useMemo(
    () => monthTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [monthTransactions],
  );
  const balance = totalIncome - totalExpense;

  const groups = useMemo(() => groupByDate(monthTransactions), [monthTransactions]);

  function prevMonth() {
    setMonthCursor((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  }
  function nextMonth() {
    setMonthCursor((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com resumo financeiro */}
        <SummaryHeader
          monthName={formatMonthName(monthCursor)}
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          onPrev={prevMonth}
          onNext={nextMonth}
        />

        {/* Lista de transações agrupadas por dia */}
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhuma transação em {formatMonthName(monthCursor).toLowerCase()}.
            </Text>
          </View>
        ) : (
          groups.map(({ date, items }) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateLabel}>{formatDayLabel(date)}</Text>
              <View style={styles.dateGroupCard}>
                {items.map((t) => (
                  <TransactionItem key={t.id} transaction={t} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },

  scrollContent: {
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },

  // ── Summary header ──────────────────────────────────────────────
  summaryCard: {
    backgroundColor: Colors.primary400,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xs,
  },

  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  monthArrow: {
    fontSize: 24,
    color: Colors.backgroundPrimary,
    fontWeight: '300',
  },
  monthName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.backgroundPrimary,
  },

  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.backgroundPrimary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  balanceValue: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.backgroundPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryIconText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
  summaryItemLabel: {
    fontSize: FontSize.sm,
    color: Colors.backgroundPrimary,
  },
  summaryItemValue: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.backgroundPrimary,
  },

  // ── Grupos de data ──────────────────────────────────────────────
  dateGroup: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  dateLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dateGroupCard: {
    backgroundColor: Colors.primary200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },

  // ── Cada transação ──────────────────────────────────────────────
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundPrimary,
    opacity: 0.7,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.backgroundPrimary,
  },
  transactionSub: {
    fontSize: FontSize.xs,
    color: Colors.primary700,
  },
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },

  // ── Empty state ─────────────────────────────────────────────────
  emptyState: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.textGray,
    fontSize: FontSize.sm,
  },
});