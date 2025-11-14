import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

type ConnectivityContextValue = {
  isInternetReachable: boolean;
  isOffline: boolean;
  connectionType: NetInfoStateType;
};

const ConnectivityContext = createContext<ConnectivityContextValue | undefined>(
  undefined,
);

export function ConnectivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ConnectivityContextValue>({
    isInternetReachable: true,
    isOffline: false,
    connectionType: 'unknown',
  });

  useEffect(() => {
    let previousReachability = true;

    const updateState = (isReachable: boolean, type: NetInfoStateType) => {
      setState(current => {
        if (previousReachability === false && isReachable) {
          console.log('Koneksi pulih. Melanjutkan operasi.');
        }
        if (previousReachability !== isReachable && !isReachable) {
          console.warn('Koneksi terputus. Menggunakan mode offline.');
        }
        previousReachability = isReachable;
        return {
          isInternetReachable: isReachable,
          isOffline: !isReachable,
          connectionType: type,
        };
      });
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      const reachable = state.isInternetReachable !== false;
      updateState(reachable, state.type);
    });

    NetInfo.fetch().then(initialState => {
      const reachable = initialState.isInternetReachable !== false;
      previousReachability = reachable;
      setState({
        isInternetReachable: reachable,
        isOffline: !reachable,
        connectionType: initialState.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <ConnectivityContext.Provider value={value}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error(
      'useConnectivity harus digunakan di dalam ConnectivityProvider',
    );
  }
  return context;
}
