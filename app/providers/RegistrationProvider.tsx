import React, { createContext, useContext, useMemo, useReducer } from 'react';

type RegistrationState = {
  name: string;
};

type RegistrationAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'RESET' };

type RegistrationContextData = {
  state: RegistrationState;
  setName: (name: string) => void;
  resetRegistration: () => void;
};

const initialState: RegistrationState = {
  name: '',
};

function registrationReducer(state: RegistrationState, action: RegistrationAction): RegistrationState {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const RegistrationContext = createContext<RegistrationContextData | null>(null);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  const value = useMemo<RegistrationContextData>(
    () => ({
      state,
      setName: (name: string) => {
        dispatch({ type: 'SET_NAME', payload: name });
      },
      resetRegistration: () => {
        dispatch({ type: 'RESET' });
      },
    }),
    [state],
  );

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error('useRegistration deve ser usado dentro de RegistrationProvider');
  }

  return context;
}
