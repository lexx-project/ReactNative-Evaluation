import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  clearSensitiveData,
  multiLoadBasics,
  resetSecureToken,
  saveToken,
  STORAGE_KEYS,
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
      try {
        const bootData = await multiLoadBasics();
        const token = bootData?.[STORAGE_KEYS.token];
        if (token) {
          setStatus('authenticated');
        }
      } catch (err) {
        const message = (err as Error)?.message?.toLowerCase?.() ?? '';
        const isAccessDenied = message.includes('access denied');
        if (isAccessDenied) {
          await resetSecureToken();
          Alert.alert(
            'Login diperlukan',
            'Keamanan perangkat diubah, mohon login ulang.',
          );
        } else {
          console.error('Gagal hydrate auth:', err);
        }
        setStatus('guest');
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
