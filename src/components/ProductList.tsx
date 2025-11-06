import { FlatList, StyleSheet, Text, View } from 'react-native';
import ProductCard from './ProductCard';
import { Product } from '../data/product';

type ProductListProps = {
  onAddToCart: (product: Product) => void;
  searchTerm?: string;
  productsData: Product[];
};

export default function ProductList({
  onAddToCart,
  searchTerm = '',
  productsData,
}: ProductListProps) {
  const filteredProducts = searchTerm
    ? productsData.filter(product =>
        product.name.toLowerCase().includes(searchTerm),
      )
    : productsData;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item} onAddToCart={onAddToCart} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Produk tidak ditemukan</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#7a7f87',
  },
});
