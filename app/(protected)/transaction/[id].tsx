import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { TransactionType, useFinance } from '@/app/providers/FinanceProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TransactionDetailsScreen() {
  const params = useLocalSearchParams<{ id: string; type?: TransactionType }>();
  const { createTransaction, deleteTransaction, getTransactionById, updateTransaction } = useFinance();

  const isNew = params.id === 'new';

  const existingTransaction = useMemo(() => {
    if (!params.id || isNew) {
      return undefined;
    }

    return getTransactionById(params.id);
  }, [getTransactionById, isNew, params.id]);

  const [type, setType] = useState<TransactionType>(params.type ?? existingTransaction?.type ?? 'expense');
  const [title, setTitle] = useState(existingTransaction?.title ?? '');
  const [amount, setAmount] = useState(existingTransaction ? String(existingTransaction.amount) : '');
  const [date, setDate] = useState(existingTransaction?.date ?? new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(existingTransaction?.notes ?? '');

  useEffect(() => {
    if (!existingTransaction || isNew) {
      return;
    }

    setType(existingTransaction.type);
    setTitle(existingTransaction.title);
    setAmount(String(existingTransaction.amount));
    setDate(existingTransaction.date);
    setNotes(existingTransaction.notes ?? '');
  }, [existingTransaction, isNew]);

  function handleSave() {
    const parsedAmount = Number(amount.replace(',', '.'));

    if (!title.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Dados inválidos', 'Preencha título e valor maior que zero.');
      return;
    }

    const payload = {
      type,
      title: title.trim(),
      amount: parsedAmount,
      date,
      notes: notes.trim() || undefined,
    };

    if (isNew) {
      createTransaction(payload);
    } else if (params.id) {
      updateTransaction(params.id, payload);
    }

    router.back();
  }

  function handleDelete() {
    if (isNew || !params.id) {
      router.back();
      return;
    }

    Alert.alert('Excluir transação', 'Deseja realmente excluir esta transação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteTransaction(params.id);
          router.back();
        },
      },
    ]);
  }

  if (!isNew && !existingTransaction) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Transação não encontrada.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">{isNew ? 'Nova transação' : 'Editar transação'}</ThemedText>

      {isNew && (
        <ThemedView style={styles.row}>
          <Pressable
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => setType('expense')}>
            <ThemedText style={type === 'expense' ? styles.typeButtonLabelActive : undefined}>
              Despesa
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
            onPress={() => setType('income')}>
            <ThemedText style={type === 'income' ? styles.typeButtonLabelActive : undefined}>
              Receita
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}

      {!isNew && (
        <ThemedText>
          Tipo: <ThemedText type="defaultSemiBold">{type === 'expense' ? 'Despesa' : 'Receita'}</ThemedText>
        </ThemedText>
      )}

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
        placeholderTextColor="#9BA1A6"
      />

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Valor"
        placeholderTextColor="#9BA1A6"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Data (AAAA-MM-DD)"
        placeholderTextColor="#9BA1A6"
      />

      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Observações"
        placeholderTextColor="#9BA1A6"
        multiline
      />

      <Pressable style={styles.primaryButton} onPress={handleSave}>
        <ThemedText style={styles.primaryButtonLabel}>Salvar</ThemedText>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <ThemedText style={styles.deleteButtonLabel}>{isNew ? 'Cancelar' : 'Excluir'}</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#687076',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  typeButtonLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#687076',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ECEDEE',
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  deleteButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d9534f',
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonLabel: {
    color: '#d9534f',
    fontWeight: '700',
  },
});
