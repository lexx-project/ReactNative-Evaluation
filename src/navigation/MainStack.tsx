import React, { useState } from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import BottomTabNavigator from './BottomTabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import Header from '../components/Header';
import AddProduct from '../components/AddProduct';

import { useCart } from '../hooks/useCart';
import { Product } from '../data/product';

export type MainStackParamList = {
  MainBottomTabs: undefined;
  ProductDetail: { product: Product };
  Checkout: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

type DrawerNavProp = DrawerNavigationProp<{}>;

function CustomHeader() {
  const navigation = useNavigation<DrawerNavProp>();
  const cart = useCart();

  return (
    <Header
      count={cart.count}
      onCartPress={cart.openModal}
      onMenuPress={() => navigation.toggleDrawer()}
    />
  );
}

export default function MainStack() {
  const handleAddProduct = (product: Product) => {
    console.log('Produk baru ditambah:', product.name);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{
            header: () => <CustomHeader />,
          }}
        >
          <Stack.Screen name="MainBottomTabs" component={BottomTabNavigator} />
        </Stack.Group>

        <Stack.Group>
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={({ route }) => ({
              title: route.params.product.name,
              headerShown: false,
            })}
          />
        </Stack.Group>

        <Stack.Group
          screenOptions={{ presentation: 'modal', headerShown: false }}
        >
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
        </Stack.Group>
      </Stack.Navigator>
      <AddProduct onAdd={handleAddProduct} />
    </View>
  );
}
