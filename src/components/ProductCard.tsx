import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../data/product';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useWishlist } from '../context/WishlistContext';

type ProductCardSize = {
  width: number;
};

type AnyStackNavigationProp = NativeStackNavigationProp<any>;

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  size?: ProductCardSize;
};

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductCard({
  product,
  onAddToCart,
  size,
}: ProductCardProps) {
  const navigation = useNavigation<AnyStackNavigationProp>();
  const { isInWishlist, toggle } = useWishlist();
  const wished = isInWishlist(product.id);

  const handleCartPress = () => {
    navigation.navigate('ProductDetail', { product: product });
  };

  return (
    <Pressable
      style={[styles.card, size && { width: size.width }]}
      onPress={handleCartPress}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{usdFormatter.format(product.price)}</Text>
        <Text style={styles.rating} numberOfLines={1}>
          Rating {product.rating.rate.toFixed(1)} · {product.rating.count}{' '}
          reviews
        </Text>
      </View>

      <Pressable
        style={styles.addToCartButton}
        onPress={() => onAddToCart(product)}
        hitSlop={8}
      >
        <Text style={styles.addToCartText}>+</Text>
      </Pressable>

      <Pressable
        style={[
          styles.wishlistButton,
          wished ? styles.wishlistButtonActive : undefined,
        ]}
        onPress={() => toggle(product.id)}
        hitSlop={6}
      >
        <FontAwesome
          name={wished ? 'heart' : 'heart-o'}
          color={wished ? '#ef4444' : '#111827'}
          size={16}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#4c5761',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 0,
    marginBottom: 14,
  },
  imageWrapper: {
    height: 140,
    borderRadius: 10,
    backgroundColor: '#f3f6fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    gap: 6,
    paddingRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e2530',
  },
  price: {
    fontSize: 14,
    color: '#1e90ff',
    fontWeight: '600',
  },
  rating: {
    fontSize: 12,
    color: '#6c7693',
  },
  addToCartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButtonActive: {
    backgroundColor: '#fee2e2',
  },
});
