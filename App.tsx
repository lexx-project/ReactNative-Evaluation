import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import AppDrawer from './src/navigation/AppDrawer';
import { CartProvider } from './src/hooks/useCart';
import { AuthProvider } from './src/context/AuthContext';

export type RootAuthStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

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
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
};

export default App;
