import React, { createContext, useState, useMemo, useContext } from 'react';
import { Product } from '../data/product';
type CartContextType = {
  items: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  count: number;
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
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

  const value = {
    items,
    count,
    addToCart,
    removeFromCart,
    clearCart,
    isModalVisible,
    openModal,
    closeModal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
}
