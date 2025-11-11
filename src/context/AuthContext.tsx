import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AuthStatus = 'unauthenticated' | 'authenticated' | 'skipped';

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  login: (username: string, password: string) => boolean;
  skipLogin: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('unauthenticated');
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback((username: string, password: string) => {
    if (username.trim() === 'admin' && password === 'admin123') {
      setStatus('authenticated');
      setToken('mock-token');
      return true;
    }
    return false;
  }, []);

  const skipLogin = useCallback(() => {
    setStatus('skipped');
    setToken(null);
  }, []);

  const logout = useCallback(() => {
    setStatus('unauthenticated');
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      status,
      token,
      login,
      skipLogin,
      logout,
    }),
    [login, logout, skipLogin, status, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
