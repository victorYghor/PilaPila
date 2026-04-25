/**
 * hooks/useFirebaseError.ts
 *
 * A small utility hook that classifies any caught error from Firestore or
 * Firebase Auth into one of three display states: token-expired, server-error,
 * or retry. This lets screens decide which ErrorScreen component to render
 * without duplicating the error-classification logic everywhere.
 *
 * Usage example inside a screen:
 *
 *   const { errorType, setError, clearError } = useFirebaseError();
 *
 *   async function loadData() {
 *     try {
 *       const data = await fetchTransactions();
 *       setTransactions(data);
 *     } catch (err) {
 *       setError(err);  // hook classifies it automatically
 *     }
 *   }
 *
 *   if (errorType === 'token-expired') return <TokenExpiredScreen />;
 *   if (errorType === 'server-error')  return <ServerErrorScreen onRetry={loadData} />;
 *   if (errorType === 'retry')         return <RetryScreen onRetry={loadData} />;
 */

import { useCallback, useState } from 'react';

export type FirebaseErrorType = 'token-expired' | 'server-error' | 'retry' | null;

interface UseFirebaseErrorReturn {
  errorType: FirebaseErrorType;
  setError: (err: unknown) => void;
  clearError: () => void;
}

/** Firebase error codes that mean the session is no longer valid */
const TOKEN_CODES = new Set([
  'auth/id-token-expired',
  'auth/id-token-revoked',
  'auth/session-cookie-expired',
  'auth/user-token-expired',
  'auth/requires-recent-login',
]);

/**
 * Firebase / network error codes that represent a server-side problem.
 * These are not the user's fault and warrant a "server error" screen.
 */
const SERVER_CODES = new Set([
  'auth/network-request-failed',
  'unavailable',            // Firestore: service temporarily unavailable
  'internal',               // Firestore: internal server error
  'resource-exhausted',     // Firestore: quota exceeded
  'deadline-exceeded',      // Firestore: request timed out server-side
]);

export function useFirebaseError(): UseFirebaseErrorReturn {
  const [errorType, setErrorType] = useState<FirebaseErrorType>(null);

  const setError = useCallback((err: unknown) => {
    const code: string = (err as any)?.code ?? '';

    if (TOKEN_CODES.has(code)) {
      setErrorType('token-expired');
    } else if (SERVER_CODES.has(code)) {
      setErrorType('server-error');
    } else {
      // Covers validation errors, bad-argument, permission-denied, etc.
      setErrorType('retry');
    }
  }, []);

  const clearError = useCallback(() => setErrorType(null), []);

  return { errorType, setError, clearError };
}