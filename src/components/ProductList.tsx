import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const filteredProducts = normalizedSearch
    ? productsData.filter(product =>
        product.name.toLowerCase().includes(normalizedSearch),
      )
    : productsData;

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const isTablet = width > 600;
  const numColumns = isLandscape || isTablet ? 4 : 2;

  const cardWidth = Math.max(
    (width - 24 - (numColumns - 1) * 16) / numColumns,
    140,
  );
  const listPaddingBottom = Math.max(insets.bottom + 20);

  return (
    <View style={styles.container}>
      <FlatList
        key={`product-grid-${numColumns}`}
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={onAddToCart}
            size={{ width: cardWidth }}
          />
        )}
        numColumns={numColumns}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: listPaddingBottom },
        ]}
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
    paddingBottom: 0,
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
