import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

type RemoteProduct = {
  id: number;
  title: string;
  price: number;
  brand: string;
  thumbnail: string;
};

export default function ProductListScreen() {
  const [products, setProducts] = useState<RemoteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [connectionType, setConnectionType] =
    useState<NetInfoStateType>('unknown');
  const [refreshIndex, setRefreshIndex] = useState(0);

  const handleConnectionChange = useCallback(() => {
    NetInfo.fetch().then(state => {
      setConnectionType(state.type);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnectionType(state.type);
      if (state.isInternetReachable === false) {
        setIsOffline(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let controller: AbortController | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      const netState = await NetInfo.fetch();
      setConnectionType(netState.type);
      if (netState.isInternetReachable === false) {
        setIsOffline(true);
        setIsLoading(false);
        return;
      }
      setIsOffline(false);

      controller = new AbortController();
      timeoutId = setTimeout(() => controller?.abort(), 7000);

      try {
        const response = await fetch('https://dummyjson.com/products', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Gagal memuat produk');
        }

        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        setProducts(payload.products ?? []);
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }
        if ((err as Error).name === 'AbortError') {
          setError(
            'Permintaan dibatalkan karena timeout atau layar sudah ditutup.',
          );
        } else {
          setError('Terjadi kesalahan saat memuat data produk.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
        clearTimeout(timeoutId);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
      controller?.abort();
      clearTimeout(timeoutId);
    };
  }, [refreshIndex]);

  const handleRefresh = useCallback(() => {
    setRefreshIndex(prev => prev + 1);
  }, []);

  const renderProduct = useCallback(
    ({ item }: { item: RemoteProduct }) => (
      <View style={styles.card}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.subtitle}>{item.brand}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    ),
    [],
  );

  const listContent = useMemo(() => {
    if (isOffline) {
      return (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>
            Anda sedang Offline. Cek koneksi Anda.
          </Text>
          <Pressable style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </Pressable>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color="#1e90ff" />
          <Text style={styles.placeholderTitle}>Memuat produk...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Muat Ulang</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      />
    );
  }, [error, handleRefresh, isLoading, isOffline, products, renderProduct]);

  return (
    <View style={styles.container}>
      {listContent}
      <View style={styles.connectionBanner}>
        <Text style={styles.connectionText}>
          Jenis koneksi: {connectionType}
        </Text>
        <Pressable onPress={handleConnectionChange}>
          <Text style={styles.connectionRefresh}>Perbarui Status</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e2530',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c7693',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: '#1e90ff',
    fontWeight: '700',
    marginTop: 8,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  placeholderTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4c566a',
  },
  retryButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  connectionBanner: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d0d7e3',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionText: {
    color: '#4c566a',
  },
  connectionRefresh: {
    color: '#1e90ff',
    fontWeight: '600',
  },
});
