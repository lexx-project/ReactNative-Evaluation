import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProductList from '../components/ProductList';
import productsData, { Product } from '../data/product';
import { useCart } from '../hooks/useCart';

import CategoryScreen from '../screens/CategoryScreen';

const Tab = createMaterialTopTabNavigator();

function ProductListCategoryWrapper({ category }: { category: string }) {
  const products =
    category === 'Semua'
      ? productsData
      : productsData.filter(p => p.category === category);

  return <CategoryScreen category={category} products={products} />;
}

function getCategories(): string[] {
  const categories = new Set<string>(['Semua']);
  productsData.forEach(product => {
    categories.add(product.category);
  });
  return Array.from(categories);
}

export default function ProductTopTabs() {
  const categories = getCategories();

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
          {() => <ProductListCategoryWrapper category={category} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}
