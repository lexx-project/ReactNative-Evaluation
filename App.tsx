import React, { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import AppDrawer from './src/navigation/AppDrawer';
import { CartProvider } from './src/hooks/useCart';
import { AuthProvider } from './src/context/AuthContext';
import { RootAuthStackParamList } from './src/navigation/types';
import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';
import { ConnectivityProvider } from './src/context/ConnectivityContext';
import ConnectivityBanner from './src/components/ConnectivityBanner';
import { useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator<RootAuthStackParamList>();

const AppContent = () => {
  const { status, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'authenticated' ? (
        <Stack.Screen name="MainApp" component={AppDrawer} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
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
