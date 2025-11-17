import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  clearSensitiveData,
  loadToken,
  multiLoadBasics,
  saveToken,
} from '../utils/storage';

type AuthContextType = {
  status: 'authenticated' | 'guest';
  logout: (onFinish: () => void) => void;
  login: (token: string) => Promise<void>;
  hydrated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'authenticated' | 'guest'>('guest');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const bootData = await multiLoadBasics();
      const token = bootData['@miniapp:auth-token'] ?? (await loadToken());
      if (token) {
        setStatus('authenticated');
      }
      setHydrated(true);
    };
    hydrate();
  }, []);

  const logout = async (onFinish: () => void) => {
    await clearSensitiveData();
    setStatus('guest');
    onFinish();
  };

  const login = async (token: string) => {
    await saveToken(token);
    setStatus('authenticated');
  };

  const value = {
    status,
    logout,
    login,
    hydrated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}
