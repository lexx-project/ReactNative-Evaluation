import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  ToastAndroid,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { MainStackParamList } from '../navigation/MainStack';
import apiClient from '../api/client';
import { Product } from '../data/product';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ProductDetailRouteProp = RouteProp<MainStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height; // Untuk orientasi layar
  const { addToCart, count } = useCart();
  const [remoteProduct, setRemoteProduct] = useState<Product>(product);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inlineToast, setInlineToast] = useState<string | null>(null);

  const showToastMessage = useCallback((message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      setInlineToast(message);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/products/${product.id}`);
        if (!isMounted) {
          return;
        }
        const payload = response.data;
        const normalized: Product = {
          id: payload.id ?? product.id,
          title: payload.title ?? product.title,
          description: payload.description ?? product.description,
          price: payload.price ?? product.price,
          category: payload.category ?? product.category,
          image:
            payload.thumbnail ??
            payload.images?.[0] ??
            product.image ??
            'https://placehold.co/600x400?text=Produk',
          rating: {
            rate:
              typeof payload.rating === 'object'
                ? payload.rating.rate ?? product.rating.rate
                : payload.rating ?? product.rating.rate,
            count:
              typeof payload.rating === 'object'
                ? payload.rating.count ?? product.rating.count
                : product.rating.count,
          },
        };
        setRemoteProduct(normalized);
        setIsFallbackData(false);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        const status =
          (err as { response?: { status?: number } }).response?.status;
        if (status === 404 || status === 500) {
          console.error(
            `Gagal memuat data produk dengan status ${status}`,
            (err as Error).message,
          );
          setIsFallbackData(true);
          const fallbackProduct: Product = {
            ...product,
            title: 'Produk Arsip',
            description:
              'Kami menampilkan data arsip karena produk terbaru tidak dapat dimuat.',
            image: 'https://placehold.co/600x400?text=Arsip',
            rating: {
              rate: product.rating.rate || 4.2,
              count: product.rating.count,
            },
          };
          setRemoteProduct(fallbackProduct);
          showToastMessage('Gagal memuat data terbaru. Menampilkan versi arsip.');
        } else {
          console.error('Kesalahan tidak terduga pada detail produk', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [product, showToastMessage]);

  useEffect(() => {
    if (!inlineToast) {
      return;
    }
    const timer = setTimeout(() => setInlineToast(null), 4000);
    return () => clearTimeout(timer);
  }, [inlineToast]);

  const containerStyle = isLandscape
    ? styles.containerLandscape
    : styles.containerPortrait;

  const imageStyle = isLandscape ? styles.imageLandscape : styles.imagePortrait;

  const contentStyle = isLandscape
    ? styles.contentLandscape
    : styles.contentPortrait;

  const navigateToCheckout = () => {
    navigation.navigate('Checkout');
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <Header count={count} onCartPress={navigateToCheckout} />
      <ScrollView>
        <Pressable style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={20} color="#007bff" />
          <Text style={styles.backButtonText}>Kembali</Text>
        </Pressable>
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#1e90ff" />
            <Text style={styles.loadingText}>Memuat detail produk...</Text>
          </View>
        ) : null}
        <View style={[styles.container, containerStyle]}>
          <Image
            source={{ uri: remoteProduct.image }}
            style={[styles.image, imageStyle]}
          />

          <View style={[styles.content, contentStyle]}>
            <Text style={styles.name}>{remoteProduct.title}</Text>
            <Text style={styles.price}>
              {usdFormatter.format(remoteProduct.price)}
            </Text>
            <Text style={styles.rating}>
              Rating: {remoteProduct.rating.rate} / 5 (
              {remoteProduct.rating.count} ulasan)
            </Text>
            {isFallbackData ? (
              <Text style={styles.fallbackNotice}>
                Menampilkan data arsip untuk menjaga pengalaman belanja.
              </Text>
            ) : null}
            <Text style={styles.description}>{remoteProduct.description}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: 10,
              padding: 16,
              justifyContent: 'center',
            }}
          >
            <Pressable
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutButtonText}>Beli Sekarang</Text>
            </Pressable>
            <Pressable
              style={styles.checkoutButton}
              onPress={() => addToCart(remoteProduct)}
            >
              <Text style={styles.checkoutButtonText}>Tambah Ke Keranjang</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {inlineToast ? (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{inlineToast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  containerPortrait: {
    flexDirection: 'column',
  },
  containerLandscape: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
  },
  imagePortrait: {
    width: '100%',
    height: 300,
  },
  imageLandscape: {
    width: '40%',
    height: 300,
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  contentPortrait: {
    flex: 1,
  },
  contentLandscape: {
    flex: 1,
    paddingLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#1e90ff',
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    padding: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
  fallbackNotice: {
    paddingVertical: 8,
    color: '#d35400',
    fontWeight: '600',
  },
  loadingState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#4c566a',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#1f2937',
    padding: 14,
    borderRadius: 10,
  },
  toastText: {
    color: '#fff',
    textAlign: 'center',
  },
});
