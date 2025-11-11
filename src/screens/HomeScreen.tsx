import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Header from '../components/Header';
import AddProduct from '../components/AddProduct';
import CartModal from '../components/CartModal';
import useCart from '../hooks/useCart';
import productsData, { Product as ProductType } from '../data/product';
import CategoryTabs from '../components/CategoryTabs';
import { MainStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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

  const handleProductPress = (product: ProductType) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      product,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        count={count}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onCartPress={openModal}
      />

      <View style={styles.body}>
        <CategoryTabs
          products={products}
          onAddToCart={addToCart}
          searchTerm={normalizedSearch}
          onProductPress={handleProductPress}
        />
      </View>

      <AddProduct onAdd={handleAddProduct} />
      <CartModal
        items={items}
        isVisible={isModalVisible}
        openModal={openModal}
        closeModal={closeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf1fb',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
