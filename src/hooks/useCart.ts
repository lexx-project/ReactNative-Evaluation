import { useMemo, useState } from 'react';
import { Product } from '../data/product';

export default function useCart() {
  const [items, setItems] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const addToCart = (product: Product) => {
    setItems(prev => [...prev, product]);
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setItems([]);

  const count = useMemo(() => items.length, [items]);

  return {
    items,
    count,
    addToCart,
    removeFromCart,
    clearCart,
    isModalVisible,
    openModal,
    closeModal,
  };
}
