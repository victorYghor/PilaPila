import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthContextData = {
  isAuthenticated: boolean;
  userName: string;
  signIn: (name?: string) => void;
  signOut: () => void;
  deleteAccount: () => void;
};

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Victor');

  const value = useMemo<AuthContextData>(
    () => ({
      isAuthenticated,
      userName,
      signIn: (name) => {
        if (name?.trim()) {
          setUserName(name.trim());
        }

        setIsAuthenticated(true);
      },
      signOut: () => {
        setIsAuthenticated(false);
      },
      deleteAccount: () => {
        setIsAuthenticated(false);
        setUserName('');
      },
    }),
    [isAuthenticated, userName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
