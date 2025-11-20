import React, { useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import AppDrawer from './src/navigation/AppDrawer';
import { CartProvider, useCart } from './src/hooks/useCart';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { RootAuthStackParamList } from './src/navigation/types';
import GlobalErrorBoundary from './src/components/GlobalErrorBoundary';
import { ConnectivityProvider } from './src/context/ConnectivityContext';
import ConnectivityBanner from './src/components/ConnectivityBanner';
import AppSplash from './src/components/AppSplash';
import { WishlistProvider, useWishlist } from './src/context/WishlistContext';
import DeepLinkHandler from './src/components/DeepLinkHandler';
import { navigationRef } from './src/navigation/navigationRef';

const Stack = createNativeStackNavigator<RootAuthStackParamList>();

const linking: LinkingOptions<RootAuthStackParamList> = {
  prefixes: ['miniecom://', 'https://miniecom.app'],
  config: {
    screens: {
      Login: 'login',
      MainApp: {
        screens: {
          Beranda: {
            screens: {
              MainBottomTabs: {
                screens: {
                  Home: 'home',
                  Products: 'products',
                  About: 'about',
                },
              },
              ProductDetail: 'product/:productId',
              Checkout: 'checkout',
              Cart: 'cart',
              Profile: 'profile/:userId',
            },
          },
        },
      },
    },
  },
  // Navigasi deep link ditangani manual untuk validasi & auth.
  subscribe: () => () => {},
  getInitialURL: async () => null,
};

const AppContent = () => {
  const { status, hydrated } = useAuth();
  const { hydrated: cartHydrated } = useCart();
  const { hydrated: wishlistHydrated } = useWishlist();

  if (!hydrated || !cartHydrated || !wishlistHydrated) {
    return <AppSplash />;
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
  const [navigationReady, setNavigationReady] = useState(false);
  const handleReset = useCallback(() => {
    setResetKey(prev => prev + 1);
    setNavigationReady(false);
  }, []);

  return (
    <SafeAreaProvider>
      <ConnectivityProvider>
        <GlobalErrorBoundary onReset={handleReset}>
          <>
            <ConnectivityBanner />
            <AuthProvider>
              <WishlistProvider>
                <CartProvider key={`cart-${resetKey}`}>
                  <NavigationContainer
                    key={`nav-${resetKey}`}
                    ref={navigationRef}
                    onReady={() => setNavigationReady(true)}
                    linking={linking}
                  >
                    <DeepLinkHandler navigationReady={navigationReady} />
                    <AppContent />
                  </NavigationContainer>
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </>
        </GlobalErrorBoundary>
      </ConnectivityProvider>
    </SafeAreaProvider>
  );
};

export default App;
