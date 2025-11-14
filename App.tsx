import React, { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import AppDrawer from './src/navigation/AppDrawer';
import { CartProvider } from './src/hooks/useCart';
import { AuthProvider } from './src/context/AuthContext';
import { RootAuthStackParamList } from './src/navigation/types';
import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';
import { ConnectivityProvider } from './src/context/ConnectivityContext';
import ConnectivityBanner from './src/components/ConnectivityBanner';

const Stack = createNativeStackNavigator<RootAuthStackParamList>();

const AppContent = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainApp" component={AppDrawer} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [resetKey, setResetKey] = useState(0);
  const handleReset = useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);

  return (
    <SafeAreaProvider>
      <ConnectivityProvider>
        <GlobalErrorBoundary onReset={handleReset}>
          <>
            <ConnectivityBanner />
            <CartProvider key={`cart-${resetKey}`}>
              <NavigationContainer key={`nav-${resetKey}`}>
                <AuthProvider>
                  <AppContent />
                </AuthProvider>
              </NavigationContainer>
            </CartProvider>
          </>
        </GlobalErrorBoundary>
      </ConnectivityProvider>
    </SafeAreaProvider>
  );
};

export default App;
