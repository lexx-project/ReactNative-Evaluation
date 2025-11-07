import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../data/product';

type ProductCardSize = {
  width: number;
};

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  size?: ProductCardSize;
};

export default function ProductCard({
  product,
  onAddToCart,
  size,
}: ProductCardProps) {
  return (
    <View style={[styles.container, size && { width: size.width }]}>
      <Image source={{ uri: product.img }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>Rp {product.price}</Text>
      <Text style={styles.rating}>Rating: {product.rating} / 5</Text>
      <Pressable
        style={styles.addToCartButton}
        onPress={() => onAddToCart(product)}
      >
        <Text style={styles.addToCartText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 230,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: '#555',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 4,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 20,
  },
});
