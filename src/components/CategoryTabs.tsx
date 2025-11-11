import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import ProductList from './ProductList';
import { Product, ProductCategory } from '../data/product';

const Tab = createMaterialTopTabNavigator();

type CategoryKey = ProductCategory | 'All';

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'All', label: 'Semua' },
  { key: 'Populer', label: 'Populer' },
  { key: 'Terbaru', label: 'Terbaru' },
  { key: 'Diskon', label: 'Diskon' },
  { key: 'Elektronik', label: 'Elektronik' },
  { key: 'Pakaian', label: 'Pakaian' },
  { key: 'Makanan', label: 'Makanan' },
  { key: 'Otomotif', label: 'Otomotif' },
  { key: 'PerlengkapanBayi', label: 'Perlengkapan Bayi' },
];

type CategoryTabsProps = {
  products: Product[];
  onAddToCart: (product: Product) => void;
  searchTerm?: string;
  onProductPress: (product: Product) => void;
};

export default function CategoryTabs({
  products,
  onAddToCart,
  searchTerm = '',
  onProductPress,
}: CategoryTabsProps) {
  return (
    <Tab.Navigator
      initialRouteName="All"
      screenOptions={{
        lazy: true,
        lazyPreloadDistance: 1,
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarIndicatorStyle: {
          backgroundColor: '#2563eb',
          height: 3,
          borderRadius: 999,
        },
        tabBarLabelStyle: {
          textTransform: 'none',
          fontWeight: '600',
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: 'auto' },
        swipeEnabled: true,
      }}
    >
      {CATEGORIES.map(category => (
        <Tab.Screen
          key={category.key}
          name={category.key}
          options={{ title: category.label }}
        >
          {() => (
            <CategoryPane
              category={category.key}
              label={category.label}
              products={products}
              onAddToCart={onAddToCart}
              searchTerm={searchTerm}
              onProductPress={onProductPress}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

type CategoryPaneProps = {
  category: CategoryKey;
  label: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  searchTerm: string;
  onProductPress: (product: Product) => void;
};

function CategoryPane({
  category,
  label,
  products,
  onAddToCart,
  searchTerm,
  onProductPress,
}: CategoryPaneProps) {
  useFocusEffect(
    useCallback(() => {
      if (category !== 'Diskon') {
        return undefined;
      }

      console.log('Tab Diskon aktif');
      return () => console.log('Tab Diskon dinonaktifkan');
    }, [category]),
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      category === 'All' ? true : product.categories.includes(category);
    const matchesSearch = normalizedSearch
      ? product.name.toLowerCase().includes(normalizedSearch)
      : true;
    return matchesCategory && matchesSearch;
  });

  if (!filteredProducts.length) {
    return (
      <View style={styles.emptyPane}>
        <Text style={styles.emptyText}>
          Belum ada produk untuk kategori {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.pane}>
      <ProductList
        productsData={filteredProducts}
        onAddToCart={onAddToCart}
        searchTerm=""
        onProductPress={onProductPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pane: {
    flex: 1,
  },
  emptyPane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
  },
  emptyText: {
    color: '#475569',
  },
});
