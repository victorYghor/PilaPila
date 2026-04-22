import React, { createContext, useContext, useMemo, useState } from 'react';

export type TransactionType = 'expense' | 'income';

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  notes?: string;
};

type TransactionInput = {
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  notes?: string;
};

type FinanceContextData = {
  transactions: Transaction[];
  createTransaction: (input: TransactionInput) => Transaction;
  updateTransaction: (id: string, input: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
};

const initialTransactions: Transaction[] = [
  {
    id: 'txn-1',
    type: 'expense',
    title: 'Mercado',
    amount: 230.9,
    date: new Date().toISOString().slice(0, 10),
    notes: 'Compra mensal de supermercado',
  },
  {
    id: 'txn-2',
    type: 'income',
    title: 'Freelance',
    amount: 1800,
    date: new Date().toISOString().slice(0, 10),
    notes: 'Pagamento projeto app',
  },
  {
    id: 'txn-3',
    type: 'expense',
    title: 'Internet',
    amount: 120,
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10),
  },
];

const FinanceContext = createContext<FinanceContextData | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const value = useMemo<FinanceContextData>(
    () => ({
      transactions,
      createTransaction: (input) => {
        const newTransaction: Transaction = {
          id: `txn-${Date.now()}`,
          ...input,
        };

        setTransactions((prev) => [newTransaction, ...prev]);
        return newTransaction;
      },
      updateTransaction: (id, input) => {
        setTransactions((prev) => prev.map((item) => (item.id === id ? { id, ...input } : item)));
      },
      deleteTransaction: (id) => {
        setTransactions((prev) => prev.filter((item) => item.id !== id));
      },
      getTransactionById: (id) => transactions.find((item) => item.id === id),
    }),
    [transactions],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  }

  return context;
}
