/**
 * services/authService.ts
 *
 * This file is the single source of truth for every Firebase Auth operation.
 * Screens and hooks should NEVER import firebase/auth directly — they always
 * go through here. This makes it easy to swap out the auth provider later,
 * add logging, or mock the service in tests.
 */

import { auth } from '@/config/firebase';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  verifyPasswordResetCode,
  type User,
} from 'firebase/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * A normalised error shape so the UI layer doesn't have to know about
 * Firebase error codes.
 */
export interface AuthError {
  code: string;
  message: string;
}

// ─── Error mapper ─────────────────────────────────────────────────────────────

/**
 * Translates Firebase error codes into Portuguese user-facing messages.
 * All unknown codes fall back to a generic message so the UI is always safe.
 */
export function mapFirebaseError(code: string): AuthError {
  const messages: Record<string, string> = {
    'auth/email-already-in-use':    'Este e-mail já está cadastrado.',
    'auth/invalid-email':           'O e-mail informado não é válido.',
    'auth/weak-password':           'Escolha uma senha mais forte (mínimo 8 caracteres).',
    'auth/user-not-found':          'E-mail ou senha incorretos.',
    'auth/wrong-password':          'E-mail ou senha incorretos.',
    'auth/invalid-credential':      'E-mail ou senha incorretos.',
    'auth/too-many-requests':       'Muitas tentativas. Aguarde alguns minutos.',
    'auth/network-request-failed':  'Sem conexão. Verifique sua internet.',
    'auth/user-disabled':           'Esta conta foi desativada.',
    'auth/requires-recent-login':   'Por segurança, faça login novamente para continuar.',
    'auth/id-token-expired':        'Sua sessão expirou. Faça login novamente.',
  };

  return {
    code,
    message: messages[code] ?? 'Erro inesperado. Tente novamente.',
  };
}

// ─── Auth operations ──────────────────────────────────────────────────────────

/**
 * Creates a new Firebase Auth user and immediately saves the display name.
 * Returns the newly created User on success.
 */
export async function register({ fullName, email, password }: RegisterPayload): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
  // Persist the display name right away so other screens can read it
  // without a separate Firestore query.
  await updateProfile(credential.user, { displayName: fullName.trim() });
  return credential.user;
}

/**
 * Signs in with email/password.
 * Returns the authenticated User on success.
 */
export async function login({ email, password }: LoginPayload): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
  return credential.user;
}

/**
 * Signs out the current user and clears the persisted session.
 * After this call the AuthContext will set user to null, which triggers
 * the route guard to redirect to the login screen.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Sends a password-reset e-mail using Firebase's built-in flow.
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function setNewPassowrd(code: string, newPassword: string): Promise<void> {
  await confirmPasswordReset(auth, code, newPassword.trim());
}

export async function verifycode(code: string): Promise<string> {
  return await verifyPasswordResetCode(auth, code);
}

/**
 * Permanently deletes the current user's account.
 *
 * Firebase requires a "recent login" to perform sensitive operations like
 * account deletion. If the user logged in a while ago Firebase will throw
 * 'auth/requires-recent-login'. In that case we re-authenticate with their
 * current password before retrying the deletion.
 *
 * @param currentPassword - the user's current password, needed for re-auth.
 */
export async function deleteAccount(currentPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Nenhum usuário autenticado.');

  try {
    await deleteUser(user);
  } catch (err: any) {
    // If the session is too old Firebase blocks the deletion — re-auth then retry.
    if (err?.code === 'auth/requires-recent-login') {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
    } else {
      throw err;
    }
  }
}