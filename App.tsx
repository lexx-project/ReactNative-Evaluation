import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import Header from './src/components/Header';
import ProductList from './src/components/ProductList';
import AddProduct from './src/components/AddProduct';
import CartModal from './src/components/CartModal';
import productsData, { Product as ProductType } from './src/data/product';
import useCart from './src/hooks/useCart';

const App = () => {
  const { count, items, addToCart, isModalVisible, openModal, closeModal } =
    useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductType[]>(productsData);

  const handleAddProduct = (product: ProductType) => {
    setProducts(prev => [product, ...prev]);
    setSearchTerm('');
  };

  const normalizedSearch = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        count={count}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onCartPress={openModal}
      />
      <ProductList
        onAddToCart={addToCart}
        searchTerm={normalizedSearch}
        productsData={products}
      />
      <AddProduct onAdd={handleAddProduct} />
      <CartModal
        items={items}
        isVisible={isModalVisible}
        openModal={openModal}
        closeModal={closeModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
