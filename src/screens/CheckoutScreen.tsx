import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useEffect, useMemo, useState } from 'react';

import { useCart } from '../hooks/useCart';
import { Product } from '../data/product';
import apiClient, { ApiValidationError } from '../api/client';
import { useConnectivity } from '../context/ConnectivityContext';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const OrderItem = ({ item }: { item: Product }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemIcon}>
      <FontAwesome name="shopping-basket" size={18} color="#1e90ff" />
    </View>
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.title}</Text>
      <Text style={styles.itemPrice}>{usdFormatter.format(item.price)}</Text>
    </View>
  </View>
);

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { items } = useCart();
  const { connectionType, isOffline } = useConnectivity();
  const pollingPaused = connectionType === 'cellular';
  const [syncedSubtotal, setSyncedSubtotal] = useState(0);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);
  const [submissionInfo, setSubmissionInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items],
  );

  useEffect(() => {
    setSyncedSubtotal(subtotal);
  }, [subtotal]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    const fetchCartTotal = async () => {
      try {
        const response = await apiClient.get('/carts/1');
        if (!isMounted) {
          return;
        }
        if (typeof response.data?.total === 'number') {
          setSyncedSubtotal(response.data.total);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : // axios error object might have message prop
                (err as { message?: string })?.message ?? 'Unknown error';
          console.warn('Gagal memperbarui total keranjang:', message);
        }
      }
    };

    if (connectionType !== 'cellular') {
      fetchCartTotal();
      intervalId = setInterval(fetchCartTotal, 15000);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [connectionType]);

  const biayaLayanan = 2000;
  const effectiveSubtotal = syncedSubtotal || subtotal;
  const totalPembayaran = effectiveSubtotal + biayaLayanan;

  const handleBayar = async () => {
    setIsSubmitting(true);
    setAddressError(null);
    setSubmissionInfo(null);

    const shouldSimulateValidationFailure = address.trim().length === 0;
    const endpoint = shouldSimulateValidationFailure ? '/http/400' : '/carts/add';

    try {
      await apiClient.post(endpoint, {
        address,
        items: items.map(item => item.id),
        total: totalPembayaran,
      });
      setSubmissionInfo('Pesanan berhasil dikirim ke server.');
    } catch (err) {
      const apiError = err as ApiValidationError;
      if (apiError.validationErrors?.address) {
        setAddressError(apiError.validationErrors.address);
      } else {
        setSubmissionInfo(
          apiError.message || 'Terjadi kesalahan saat memproses pesanan.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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

          <FlatList
            data={items}
            renderItem={({ item }) => <OrderItem item={item} />}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            scrollEnabled={false}
          />

          <View style={styles.separator} />

          <View style={styles.feeRow}>
            <Text style={styles.feeText}>Biaya Layanan</Text>
            <Text style={styles.feePrice}>
              {usdFormatter.format(biayaLayanan)}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Pembayaran</Text>
            <Text style={styles.totalPrice}>
              {usdFormatter.format(totalPembayaran)}
            </Text>
          </View>

          <Text style={styles.syncNote}>
            Total tersinkron: {usdFormatter.format(effectiveSubtotal)}
          </Text>
          <Text style={styles.syncNote}>
            Koneksi saat ini: {connectionType}
          </Text>
          {pollingPaused && (
            <Text style={styles.syncWarning}>
              Polling dimatikan sementara pada jaringan seluler untuk hemat
              kuota.
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Metode Pembayaran</Text>
          <Pressable style={styles.paymentMethod}>
            <FontAwesome name="credit-card" size={20} color="#1e90ff" />
            <Text style={styles.paymentText}>Pilih Metode Pembayaran</Text>
            <FontAwesome name="chevron-right" size={14} color="#888" />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alamat Pengiriman</Text>
          <TextInput
            style={[
              styles.input,
              addressError ? styles.inputError : undefined,
            ]}
            placeholder="Nama jalan, nomor rumah, kota"
            onChangeText={setAddress}
            value={address}
            multiline
            textAlignVertical="top"
          />
          {addressError ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}
          {submissionInfo ? (
            <Text style={styles.infoText}>{submissionInfo}</Text>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.payButton,
            (isSubmitting || isOffline) && styles.payButtonDisabled,
          ]}
          onPress={handleBayar}
          disabled={isSubmitting || isOffline}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              Bayar Sekarang ({usdFormatter.format(totalPembayaran)})
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  itemSeparator: {
    height: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#e4e7ec',
    marginVertical: 16,
  },

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

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e2530',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  syncNote: {
    marginTop: 8,
    color: '#5a6270',
  },
  syncWarning: {
    marginTop: 6,
    color: '#ff4757',
    fontWeight: '600',
  },
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
  input: {
    borderWidth: 1,
    borderColor: '#d0d7e3',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    backgroundColor: '#f8fafc',
  },
  inputError: {
    borderColor: '#d9534f',
  },
  errorText: {
    color: '#d9534f',
    marginTop: 8,
  },
  infoText: {
    marginTop: 8,
    color: '#4b5563',
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
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
