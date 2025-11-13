import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useMemo } from 'react';
import { Product } from '../data/product';
import CategoryScreen from '../screens/CategoryScreen';
import { useProducts } from '../hooks/useProducts';

const Tab = createMaterialTopTabNavigator();

type ProductListCategoryWrapperProps = {
  category: string;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

function ProductListCategoryWrapper({
  category,
  products,
  isLoading,
  error,
  onRetry,
}: ProductListCategoryWrapperProps) {
  const filteredProducts =
    category === 'Semua'
      ? products
      : products.filter(product => product.category === category);

  return (
    <CategoryScreen
      category={category}
      products={filteredProducts}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
    />
  );
}

export default function ProductTopTabs() {
  const { products, isLoading, error, refetch } = useProducts();

  const categories = useMemo(() => {
    const categorySet = new Set<string>(['Semua']);
    products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    return Array.from(categorySet);
  }, [products]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: { backgroundColor: '#1e90ff' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        tabBarGap: 16,
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: '#555',
      }}
    >
      {categories.map(category => (
        <Tab.Screen key={category} name={category}>
          {() => (
            <ProductListCategoryWrapper
              category={category}
              products={products}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}
