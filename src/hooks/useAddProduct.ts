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
    const product: Product = {
      id: Date.now(),
      name: name.trim() || 'Produk Baru',
      img:
        imageUrl.trim() ||
        'https://upload.lexxganz.my.id/uploads/ProductNotAvailable.png',
      price: price.trim() || '0',
      rating: 0,
      categories: ['Populer', 'Terbaru'],
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
