import React, { createContext, useContext, useState } from 'react';

type DrawerLockContextValue = {
  isSwipeEnabled: boolean;
  setSwipeEnabled: (enabled: boolean) => void;
};

const DrawerLockContext = createContext<DrawerLockContextValue | undefined>(
  undefined,
);

export function DrawerLockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSwipeEnabled, setSwipeEnabled] = useState(false);

  return (
    <DrawerLockContext.Provider value={{ isSwipeEnabled, setSwipeEnabled }}>
      {children}
    </DrawerLockContext.Provider>
  );
}

export function useDrawerLock() {
  const context = useContext(DrawerLockContext);

  if (!context) {
    throw new Error('useDrawerLock must be used within DrawerLockProvider');
  }

  return context;
}
