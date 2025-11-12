import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  status: 'authenticated' | 'guest';
  logout: (onFinish: () => void) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'authenticated' | 'guest'>('guest');

  const logout = (onFinish: () => void) => {
    setStatus('guest');
    onFinish();
  };
  const login = () => {
    setStatus('authenticated');
  };
  const value = {
    status,
    logout,
    login,
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
