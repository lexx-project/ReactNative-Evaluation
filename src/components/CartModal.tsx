import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Product } from '../data/product';

type CartModalProps = {
  items: Product[];
  isVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export default function CartModal({
  items,
  isVisible,
  openModal,
  closeModal,
}: CartModalProps) {
  const hasItems = items.length > 0;

  return (
    <>
      <Modal
        visible={isVisible}
        transparent
        onRequestClose={closeModal}
        animationType="slide"
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Keranjang</Text>
                <Text style={styles.subtitle}>
                  {hasItems
                    ? `${items.length} produk masuk keranjang`
                    : 'Keranjang masih kosong'}
                </Text>
              </View>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.listWrapper}>
              {hasItems ? (
                <ScrollView
                  contentContainerStyle={styles.itemsContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {items.map((item, index) => (
                    <View key={`${item.id}-${index}`}>
                      <View style={styles.itemRow}>
                        <Image
                          source={{ uri: item.img }}
                          style={styles.thumbnail}
                        />
                        <View style={styles.itemContent}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemPrice}>Rp {item.price}</Text>
                          <Text style={styles.itemRating}>
                            Rating: {item.rating} / 5
                          </Text>
                        </View>
                      </View>
                      {index !== items.length - 1 && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🛒</Text>
                  <Text style={styles.emptyTitle}>Belum ada produk</Text>
                  <Text style={styles.emptyDesc}>
                    Yuk tambah barang favoritmu dari katalog.
                  </Text>
                </View>
              )}
            </View>

            <Pressable style={styles.actionButton} onPress={closeModal}>
              <Text style={styles.actionText}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    bottom: 110,
    right: 30,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  triggerText: {
    color: '#1e90ff',
    fontWeight: '600',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 17, 31, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101426',
  },
  subtitle: {
    color: '#6c7693',
    marginTop: 6,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f3f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#101426',
    fontWeight: '600',
    lineHeight: 24,
  },
  listWrapper: {
    flex: 1,
  },
  itemsContainer: {
    paddingBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#edf1f7',
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f1f3f7',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101426',
  },
  itemPrice: {
    color: '#6c7693',
    marginTop: 4,
  },
  itemRating: {
    color: '#9aa3b5',
    marginTop: 2,
    fontSize: 12,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 6,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101426',
  },
  emptyDesc: {
    color: '#6c7693',
  },
  actionButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
