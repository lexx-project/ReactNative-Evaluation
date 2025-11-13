import React from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import ProductList from '../components/ProductList';
import { Product } from '../data/product';
import { useCart } from '../hooks/useCart';

type CategoryScreenProps = {
  category: string;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
};

export default function CategoryScreen({
  category,
  products,
  isLoading,
  error,
  onRetry,
}: CategoryScreenProps) {
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const handleToggleDrawer = () => {
    navigation.getParent()?.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.container}>
      {category === 'Alat Tulis' && (
        <View style={styles.drawerToggleContainer}>
          <Button
            title="Buka Drawer"
            onPress={handleToggleDrawer}
            color="#ff4757"
          />
        </View>
      )}

      {isLoading && (
        <View style={styles.stateWrapper}>
          <ActivityIndicator size="large" color="#1e90ff" />
          <Text style={styles.stateText}>Memuat produk...</Text>
        </View>
      )}

      {!isLoading && error && (
        <View style={styles.stateWrapper}>
          <Text style={styles.stateText}>{error}</Text>
          {onRetry && (
            <Button title="Coba Lagi" onPress={onRetry} color="#ff4757" />
          )}
        </View>
      )}

      {!isLoading && !error && (
        <ProductList productsData={products} onAddToCart={addToCart} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerToggleContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  stateWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  stateText: {
    color: '#555',
    textAlign: 'center',
  },
});
