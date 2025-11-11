import {
  RouteProp,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import products from '../data/product';
import type { MainStackParamList } from '../navigation/types';

type ProductDetailScreenRouteProp = RouteProp<
  MainStackParamList,
  'ProductDetail'
>;

export default function ProductDetailScreen({
  route,
}: {
  route: ProductDetailScreenRouteProp;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { productId, product: productFromParams } = route.params;
  const product =
    productFromParams ?? products.find(item => item.id === productId);

  const findDrawerParent = () => {
    let parent: any = navigation;
    while (parent) {
      const state = parent.getState?.();
      if (state?.type === 'drawer') {
        return parent;
      }
      parent = parent.getParent?.();
    }
    return undefined;
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleMenuPress = () => {
    const drawerParent = findDrawerParent();
    drawerParent?.dispatch(DrawerActions.openDrawer());
  };

  const handleResetToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });

    const drawerParent = findDrawerParent();
    drawerParent?.dispatch(DrawerActions.closeDrawer());
  };

  const handleDrawerGoBack = () => {
    let parent = navigation.getParent?.();
    while (parent) {
      const state = parent.getState?.();
      if (state?.type === 'drawer') {
        if (parent.canGoBack?.()) {
          parent.goBack?.();
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
          parent.navigate?.('MainTabs', {
            screen: 'HomeStack',
            params: { screen: 'Home' },
          } as never);
        }
        return;
      }
      parent = parent.getParent?.();
    }
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={handleGoBack}>
            <Text style={styles.headerButtonText}>Kembali</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Detail Produk</Text>
          <Pressable style={styles.headerButton} onPress={handleMenuPress}>
            <Text style={styles.headerButtonText}>Menu</Text>
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
          <Pressable style={styles.primaryButton} onPress={handleGoBack}>
            <Text style={styles.primaryButtonText}>Kembali</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleGoBack}>
          <Text style={styles.headerButtonText}>Kembali</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detail Produk</Text>
        <Pressable style={styles.headerButton} onPress={handleMenuPress}>
          <Text style={styles.headerButtonText}>Menu</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.img }} style={styles.image} />
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>Rp {product.price}</Text>
        <Text style={styles.rating}>Rating: {product.rating} / 5</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <View style={styles.categoryList}>
            {product.categories.map(category => (
              <View style={styles.categoryChip} key={category}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>
            Produk {product.name} merupakan pilihan terbaik di kategori{' '}
            {product.categories[0]} kami. Dapatkan sekarang untuk melengkapi
            kebutuhan harian Anda.
          </Text>
        </View>

        <Pressable style={styles.resetButton} onPress={handleResetToHome}>
          <Text style={styles.resetButtonText}>
            Reset ke Beranda & Tutup Drawer
          </Text>
        </Pressable>
        <Pressable style={styles.drawerBackButton} onPress={handleDrawerGoBack}>
          <Text style={styles.drawerBackButtonText}>
            Kembali ke Drawer Home
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e90ff',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  price: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: '600',
  },
  rating: {
    fontSize: 16,
    color: '#475569',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
  },
  categoryText: {
    color: '#0369a1',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '600',
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#1e293b',
  },
  resetButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  drawerBackButton: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#0ea5e9',
  },
  drawerBackButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
