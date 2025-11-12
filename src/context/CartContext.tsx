// src/context/CartContext.tsx

import React, { createContext, useState, useMemo, useContext } from 'react';
import { Product } from '../data/product'; // Impor tipe Product

// 1. Tentukan tipe untuk nilai Konteks
type CartContextType = {
  items: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  count: number;
  // Ini untuk modal, kita pindah juga ke sini
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
};

// 2. Buat Konteksnya
// Kita beri nilai 'undefined' agar TypeScript memaksa kita pakai Provider
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Buat Provider (Komponen Pembungkus)
// Ini yang akan memegang 'useState'
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

  // 4. Sediakan semua nilai dan fungsi ke 'children'
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

// 5. Buat Hook kustom (ini akan menggantikan file useCart.ts lama)
// Ini cara mudah bagi komponen untuk memakai konteks
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
}
