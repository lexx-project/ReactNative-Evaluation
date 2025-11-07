import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { Product } from '../data/product';
import useAddProduct from '../hooks/useAddProduct';

type AddProductProps = {
  onAdd: (product: Product) => void;
};

export default function AddProduct({ onAdd }: AddProductProps) {
  const {
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
  } = useAddProduct(onAdd);

  const handleFormSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Peringatan!', 'Nama produk tidak boleh kosong.');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert(
        'Peringatan!',
        'Harga harus berupa angka dan tidak boleh kosong.',
      );
      return;
    }
    handleSubmit();
  };

  return (
    <>
      <Pressable style={styles.fab} onPress={openModal}>
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Produk</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Produk</Text>
              <TextInput
                style={styles.input}
                placeholder="Misal: Sepatu Sneakers"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Harga</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 250.000"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>URL Gambar (opsional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                value={imageUrl}
                onChangeText={setImageUrl}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.actions}>
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleFormSubmit}
              >
                <Text style={styles.saveText}>Simpan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#1e90ff',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e2530',
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#5a6270',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4d7dc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e2530',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#e8ebf0',
  },
  cancelText: {
    color: '#1e2530',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1e90ff',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
