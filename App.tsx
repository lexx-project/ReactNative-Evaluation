import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Product as ProductType } from './src/data/product';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import { CartProvider } from './src/context/CartContext';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  MainTabs: { screen: string; params: { userID: string } };
  ProductDetail: { product: ProductType };
  Checkout: undefined;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group>
              {/* <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              /> */}
              <Stack.Screen
                name="MainTabs"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={({ route }) => ({
                  title:
                    (route.params as { product: ProductType })?.product.name ||
                    'Detail Produk',
                  headerShown: false,
                })}
              />
            </Stack.Group>
            <Stack.Group
              screenOptions={{
                presentation: 'modal',
                headerShown: false,
              }}
            >
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
