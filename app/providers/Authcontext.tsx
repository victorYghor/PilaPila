/**
 * context/AuthContext.tsx
 *
 * This is the heart of the authentication system. It creates a React Context
 * that wraps the whole app and makes the current user, loading state, and
 * auth operations available anywhere via the useAuth() hook.
 *
 * The key insight here is onAuthStateChanged: instead of us manually tracking
 * whether a user is logged in, Firebase fires this listener every time the
 * auth state changes — on login, logout, token refresh, app startup, etc.
 * We simply store whatever Firebase tells us and the rest of the app reacts.
 */

import { auth } from '@/config/firebase';
import { deleteAccount, login, LoginPayload, logout, mapFirebaseError, register, RegisterPayload } from '@/service/AuthService';

import { onAuthStateChanged, type User } from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** The currently authenticated Firebase user, or null if not logged in. */
  user: User | null;

  /**
   * True while we are waiting for Firebase to tell us the initial auth state.
   * During this window we show a splash/loading screen instead of redirecting,
   * because we don't yet know if the user is logged in or not.
   */
  isLoading: boolean;

  /** True while an async auth operation (login, register, etc.) is in progress. */
  isSubmitting: boolean;

  /** The last auth error message, or null if there is none. */
  error: string | null;

  /** Clears the current error — useful when the user starts typing again. */
  clearError: () => void;

  /** Signs in with email + password. */
  signIn: (payload: LoginPayload) => Promise<void>;

  /** Creates an account, then signs in automatically. */
  signUp: (payload: RegisterPayload) => Promise<void>;

  /** Signs out and navigates away from protected screens. */
  signOut: () => Promise<void>;

  /**
   * Permanently deletes the account.
   * @param currentPassword - required for Firebase re-authentication.
   */
  removeAccount: (currentPassword: string) => Promise<void>;
}

// ─── Context creation ─────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]             = useState<User | null>(null);
  const [isLoading, setIsLoading]   = useState(true);  // true until first Firebase response
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // Subscribe to Firebase auth state changes when the provider mounts.
  // The unsubscribe function returned by onAuthStateChanged is called on
  // unmount to prevent memory leaks.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false); // Firebase has responded — we know the auth state
    });

    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Generic wrapper that handles loading state and error mapping for any
  // async auth operation. This avoids repeating the same try/catch pattern
  // in every individual method below.
  const run = useCallback(async (operation: () => Promise<void>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await operation();
    } catch (err: any) {
      const mapped = mapFirebaseError(err?.code ?? '');
      setError(mapped.message);
      throw err; // re-throw so the caller (screen) can react if needed
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signIn = useCallback(
    (payload: LoginPayload) => run(() => login(payload).then(() => {})),
    [run],
  );

  const signUp = useCallback(
    (payload: RegisterPayload) => run(() => register(payload).then(() => {})),
    [run],
  );

  const handleSignOut = useCallback(
    () => run(logout),
    [run],
  );

  const removeAccount = useCallback(
    (currentPassword: string) => run(() => deleteAccount(currentPassword)),
    [run],
  );

  const value: AuthContextValue = {
    user,
    isLoading,
    isSubmitting,
    error,
    clearError,
    signIn,
    signUp,
    signOut: handleSignOut,
    removeAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuth() gives any component direct access to the auth state and methods.
 *
 * Usage:
 *   const { user, signIn, isLoading } = useAuth();
 *
 * The hook throws if called outside <AuthProvider> — this is intentional,
 * since it catches misconfigured component trees during development.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}