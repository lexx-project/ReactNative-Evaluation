import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import FontAwesome from '@react-native-vector-icons/fontawesome';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height; // Untuk orientasi layar
  const { addToCart } = useCart();

  const containerStyle = isLandscape
    ? styles.containerLandscape
    : styles.containerPortrait;

  const imageStyle = isLandscape ? styles.imageLandscape : styles.imagePortrait;

  const contentStyle = isLandscape
    ? styles.contentLandscape
    : styles.contentPortrait;

  const { count, openModal } = useCart();

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
        <View style={[styles.container, containerStyle]}>
          <Image
            source={{ uri: product.img }}
            style={[styles.image, imageStyle]}
          />

          <View style={[styles.content, contentStyle]}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>Rp {product.price}</Text>
            <Text style={styles.rating}>Rating: {product.rating} / 5</Text>
            <Text style={styles.description}>{product.description}</Text>
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
              onPress={() => addToCart(product)}
            >
              <Text style={styles.checkoutButtonText}>Tambah Ke Keranjang</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
});
