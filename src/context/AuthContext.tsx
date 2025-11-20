import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  clearAuthSession,
  clearSensitiveData,
  enforceExpiry,
  multiLoadBasics,
  resetSecureToken,
  saveAuthSession,
  STORAGE_KEYS,
} from '../utils/storage';

type AuthContextType = {
  status: 'authenticated' | 'guest';
  logout: (onFinish?: () => void) => Promise<void>;
  login: (token: string, ttlMs?: number) => Promise<void>;
  hydrated: boolean;
  pendingLink: PendingLink | null;
  setPendingLink: (link: PendingLink | null) => void;
  consumePendingLink: () => PendingLink | null;
};

export type PendingLink =
  | { type: 'product'; productId: number }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'add-to-cart'; productId: number };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'authenticated' | 'guest'>('guest');
  const [hydrated, setHydrated] = useState(false);
  const [pendingLink, setPendingLink] = useState<PendingLink | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const bootData = await multiLoadBasics();
        const token =
          bootData?.[STORAGE_KEYS.token] ?? bootData?.['@miniapp:auth-token'];
        const expiry =
          bootData?.[STORAGE_KEYS.expiredAt] ??
          bootData?.['@miniapp:expired-at'];

        let resolvedStatus: 'authenticated' | 'guest' = 'guest';

        if (token) {
          if (typeof expiry === 'string' && expiry) {
            const parsed = Number(expiry);
            if (!Number.isFinite(parsed)) {
              await clearAuthSession();
            }
          }
          const expiryState = await enforceExpiry();
          if (expiryState === 'expired') {
            Alert.alert(
              'Sesi berakhir',
              'Silakan login kembali untuk melanjutkan.',
            );
          } else if (expiryState === 'valid') {
            resolvedStatus = 'authenticated';
          }
        }

        setStatus(resolvedStatus);
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

  const logout = async (onFinish?: () => void) => {
    await clearSensitiveData();
    setStatus('guest');
    setPendingLink(null);
    onFinish?.();
  };

  const login = async (token: string, ttlMs: number = 60 * 60 * 1000) => {
    const expiredAt = Date.now() + ttlMs;
    await saveAuthSession(token, expiredAt);
    setStatus('authenticated');
  };

  const consumePendingLink = () => {
    const current = pendingLink;
    setPendingLink(null);
    return current;
  };

  const value = {
    status,
    logout,
    login,
    hydrated,
    pendingLink,
    setPendingLink,
    consumePendingLink,
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
