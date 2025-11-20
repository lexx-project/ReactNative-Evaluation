import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

import { useCart } from '../hooks/useCart';
import ProtectedRoute from '../components/ProtectedRoute';
import { Product } from '../data/product';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const CartItem = ({
  item,
  onRemove,
}: {
  item: Product;
  onRemove: (id: number) => void;
}) => (
  <View style={styles.itemRow}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.itemPrice}>{usdFormatter.format(item.price)}</Text>
    </View>
    <Pressable onPress={() => onRemove(item.id)} style={styles.removeButton}>
      <FontAwesome name="trash" size={16} color="#ef4444" />
    </Pressable>
  </View>
);

export default function CartScreen() {
  const { items, removeFromCart, clearCart, storageWarning } = useCart();
  const navigation = useNavigation();
  const hasItems = items.length > 0;

  return (
    <ProtectedRoute targetLink={{ type: 'cart' }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <FontAwesome name="arrow-left" size={18} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>Keranjang</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        {hasItems ? (
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <CartItem item={item} onRemove={removeFromCart} />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Keranjang masih kosong</Text>
            <Text style={styles.emptySub}>
              Jelajahi katalog dan tambahkan produk favoritmu.
            </Text>
          </View>
        )}
        {storageWarning ? (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>{storageWarning}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Pressable
            style={[styles.footerBtn, styles.secondaryBtn]}
            onPress={clearCart}
            disabled={!hasItems}
          >
            <Text style={styles.secondaryText}>Bersihkan</Text>
          </Pressable>
          <Pressable
            style={[
              styles.footerBtn,
              styles.primaryBtn,
              !hasItems && styles.footerBtnDisabled,
            ]}
            onPress={() => navigation.navigate('Checkout' as never)}
            disabled={!hasItems}
          >
            <Text style={styles.primaryText}>Checkout</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemPrice: {
    color: '#4b5563',
  },
  removeButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySub: {
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  warningBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  warningText: {
    color: '#92400e',
    fontWeight: '600',
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerBtnDisabled: {
    opacity: 0.5,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  primaryBtn: {
    backgroundColor: '#1e90ff',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '600',
  },
});
