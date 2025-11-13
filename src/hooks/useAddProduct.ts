import { useState } from 'react';
import { Product } from '../data/product';

export default function useAddProduct(onAdd: (product: Product) => void) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const resetForm = () => {
    setName('');
    setPrice('');
    setImageUrl('');
  };

  const openModal = () => setIsModalVisible(true);

  const closeModal = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const handleSubmit = () => {
    const normalizedPrice = price
      .replace(/\./g, '')
      .replace(',', '.')
      .trim();
    const numericPrice = Number(normalizedPrice) || 0;

    const product: Product = {
      id: Date.now(),
      title: name.trim() || 'Produk Baru',
      image:
        imageUrl.trim() ||
        'https://upload.lexxganz.my.id/uploads/ProductNotAvailable.png',
      price: numericPrice,
      description: '',
      category: 'Lain-lain',
      rating: {
        rate: 0,
        count: 0,
      },
    };

    onAdd(product);
    closeModal();
  };

  return {
    isModalVisible,
    openModal,
    closeModal,
    name,
    setName,
    price,
    setPrice,
    imageUrl,
    setImageUrl,
    handleSubmit,
  };
}
