/**
 * app/providers/FinanceProvider.tsx
 *
 * Substitui o provider original adicionando os campos que o Figma exige:
 *  - category: categoria da transação (ex. "Alimentação", "Moradia")
 *  - isEssential: flag de gasto essencial (apenas despesas)
 *  - isRecurring: flag de gasto recorrente (apenas despesas)
 *
 * O restante da API (createTransaction, updateTransaction, etc.) permanece
 * idêntico para não quebrar nenhuma tela existente.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type TransactionType = 'expense' | 'income';

/** Categorias disponíveis para despesas */
export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Moradia',
  'Serviços',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Outros',
] as const;

/** Categorias disponíveis para receitas */
export const INCOME_CATEGORIES = [
  'Salário',
  'Outros',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory  = typeof INCOME_CATEGORIES[number];
export type TransactionCategory = ExpenseCategory | IncomeCategory;

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  category?: TransactionCategory;
  isEssential?: boolean;   // somente despesas
  isRecurring?: boolean;   // somente despesas
  notes?: string;
};

export type TransactionInput = Omit<Transaction, 'id'>;

type FinanceContextData = {
  transactions: Transaction[];
  createTransaction: (input: TransactionInput) => Transaction;
  updateTransaction: (id: string, input: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
};

// ─── Initial data ──────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);
const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
  .toISOString()
  .slice(0, 10);

const initialTransactions: Transaction[] = [
  {
    id: 'txn-1',
    type: 'expense',
    title: 'Reforma na casa',
    amount: 300,
    date: today,
    category: 'Moradia',
    isEssential: true,
    isRecurring: false,
  },
  {
    id: 'txn-2',
    type: 'income',
    title: 'TransferenciaMae',
    amount: 300,
    date: today,
    category: 'Outros',
  },
  {
    id: 'txn-3',
    type: 'expense',
    title: 'Carteira de estudante',
    amount: 30,
    date: lastMonth,
    category: 'Educação',
    isEssential: false,
    isRecurring: true,
    notes: 'Nu bank',
  },
];

// ─── Context ───────────────────────────────────────────────────────────────────

const FinanceContext = createContext<FinanceContextData | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const createTransaction = useCallback((input: TransactionInput): Transaction => {
    const newTransaction: Transaction = { id: `txn-${Date.now()}`, ...input };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id: string, input: TransactionInput) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === id ? { id, ...input } : item)),
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getTransactionById = useCallback(
    (id: string) => transactions.find((item) => item.id === id),
    [transactions],
  );

  const value = useMemo<FinanceContextData>(
    () => ({ transactions, createTransaction, updateTransaction, deleteTransaction, getTransactionById }),
    [transactions, createTransaction, updateTransaction, deleteTransaction, getTransactionById],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  return context;
}