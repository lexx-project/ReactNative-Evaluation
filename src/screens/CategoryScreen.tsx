import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import ProductList from '../components/ProductList';
import { Product } from '../data/product';
import { useCart } from '../hooks/useCart';

type CategoryScreenProps = {
  category: string;
  products: Product[];
};

export default function CategoryScreen({
  category,
  products,
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

      <ProductList productsData={products} onAddToCart={addToCart} />
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
});
