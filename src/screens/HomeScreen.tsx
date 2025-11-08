import { useNavigation } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import ProductList from '../components/ProductList';
import AddProduct from '../components/AddProduct';
import CartModal from '../components/CartModal';
import { useMemo, useState } from 'react';
import useCart from '../hooks/useCart';
import productsData, { Product as ProductType } from '../data/product';

type RootStackParamList = {
  home: undefined;
  profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'home'>;

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

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
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
}
