import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProductList from '../components/ProductList';
import productsData, { Product } from '../data/product';
import { useCart } from '../hooks/useCart';

const Tab = createMaterialTopTabNavigator();

function ProductListCategory({ category }: { category: string }) {
  const { addToCart } = useCart();
  const products =
    category === 'Semua'
      ? productsData
      : productsData.filter(p => p.category === category);

  return <ProductList productsData={products} onAddToCart={addToCart} />;
}

const getCategories = () => {
  const categories = productsData.map(p => p.category);
  return ['Semua', ...new Set(categories)];
};

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
          {() => <ProductListCategory category={category} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}
