// src/screens/CheckoutScreen.tsx

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList, // 1. Impor FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@react-native-vector-icons/fontawesome';

// 2. Impor 'useCart'
import { useCart } from '../hooks/useCart';
import { Product } from '../data/product'; // Impor tipe Product

// (Komponen OrderItem tidak berubah)
const OrderItem = ({ item }: { item: Product }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemIcon}>
      <FontAwesome name="shopping-basket" size={18} color="#1e90ff" />
    </View>
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>Rp {item.price}</Text>
    </View>
  </View>
);

export default function CheckoutScreen() {
  const navigation = useNavigation();

  const { items, clearCart } = useCart();

  const calculateTotal = () => {
    const total = items.reduce((sum, item) => {
      const priceAsNumber = parseFloat(item.price.replace(/\./g, ''));
      return sum + priceAsNumber;
    }, 0);
    return total.toLocaleString('id-ID');
  };

  const totalHarga = calculateTotal();
  const biayaLayanan = 2000;
  const totalPembayaran = (
    parseFloat(totalHarga.replace(/\./g, '')) + biayaLayanan
  ).toLocaleString('id-ID');

  const handleBayar = () => {};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ... (Header Kustom Modal tidak berubah) ... */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Konfirmasi Pesanan</Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="close" size={20} color="#5a6270" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Ringkasan Pesanan ({items.length} produk)
          </Text>

          {/* 5. Tampilkan data asli pakai FlatList */}
          <FlatList
            data={items}
            renderItem={({ item }) => <OrderItem item={item} />}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            scrollEnabled={false} // Biar tidak double scroll
          />

          <View style={styles.separator} />

          {/* Biaya Layanan */}
          <View style={styles.feeRow}>
            <Text style={styles.feeText}>Biaya Layanan</Text>
            <Text style={styles.feePrice}>
              Rp {biayaLayanan.toLocaleString('id-ID')}
            </Text>
          </View>

          {/* Total Pembayaran */}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Pembayaran</Text>
            <Text style={styles.totalPrice}>Rp {totalPembayaran}</Text>
          </View>
        </View>

        {/* ... (Metode Pembayaran tidak berubah) ... */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Metode Pembayaran</Text>
          <Pressable style={styles.paymentMethod}>
            <FontAwesome name="credit-card" size={20} color="#1e90ff" />
            <Text style={styles.paymentText}>Pilih Metode Pembayaran</Text>
            <FontAwesome name="chevron-right" size={14} color="#888" />
          </Pressable>
        </View>
      </ScrollView>

      {/* 6. Arahkan tombol 'Bayar' ke 'handleBayar' */}
      <View style={styles.footer}>
        <Pressable style={styles.payButton} onPress={handleBayar}>
          <Text style={styles.payButtonText}>
            Bayar Sekarang (Rp {totalPembayaran})
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (container, header, closeButton, scrollContainer, card, cardTitle)
  // ... (Tidak berubah)
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e7ec',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e2530',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e2530',
    marginBottom: 16,
  },

  // (Style OrderItem tidak berubah)
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e7f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  // (Style baru untuk pemisah item)
  itemSeparator: {
    height: 12,
  },

  // (Separator utama)
  separator: {
    height: 1,
    backgroundColor: '#e4e7ec',
    marginVertical: 16, // Ubah dari 12
  },

  // (Style baru untuk rincian biaya)
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeText: {
    fontSize: 16,
    color: '#555',
  },
  feePrice: {
    fontSize: 16,
    color: '#555',
  },

  // (Style total)
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold', // Ubah dari 500
    color: '#1e2530', // Ubah dari #333
  },
  totalPrice: {
    fontSize: 20, // Ubah dari 18
    fontWeight: 'bold',
    color: '#1e90ff',
  },

  // ... (paymentMethod, paymentText, footer, payButton, payButtonText)
  // ... (Tidak berubah)
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fb',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e4e7ec',
  },
  payButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
