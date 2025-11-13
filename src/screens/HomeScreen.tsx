import { SafeAreaView } from 'react-native-safe-area-context';
import ProductTopTabs from '../navigation/ProductTopTabs';
import { useCart } from '../hooks/useCart';
import CartModal from '../components/CartModal';

export default function HomeScreen() {
  const { items, isModalVisible, closeModal } = useCart();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <ProductTopTabs />
      <CartModal
        items={items}
        isVisible={isModalVisible}
        closeModal={closeModal}
      />
    </SafeAreaView>
  );
}
