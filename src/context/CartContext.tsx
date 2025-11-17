import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { Product } from '../data/product';
import { loadCart, persistCart } from '../utils/storage';
type CartContextType = {
  items: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  count: number;
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  storageWarning: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      const cachedCart = await loadCart<Product[]>();
      setItems(cachedCart);
    };
    hydrate();
  }, []);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const updated = [...prev, product];
      persistCart(updated).catch(err => {
        setStorageWarning(
          err?.message?.toLowerCase().includes('quota')
            ? 'Penyimpanan penuh, cart hanya di memori.'
            : null,
        );
      });
      return updated;
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== productId);
      persistCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    persistCart([]);
  };

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
    storageWarning,
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
