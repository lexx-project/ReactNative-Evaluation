import React, { useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStack';

type ProfileRouteProp = RouteProp<MainStackParamList, 'Profile'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function ProfileScreen() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const userId = route.params?.userId ?? '';

  useEffect(() => {
    const isValid = /^[A-Za-z0-9_-]+$/.test(userId);
    if (!isValid) {
      Alert.alert(
        'Tautan profil tidak valid',
        'ID pengguna tidak dikenal, kembali ke halaman utama.',
      );
      navigation.navigate('MainBottomTabs');
    }
  }, [navigation, userId]);

  const goHome = () => navigation.navigate('MainBottomTabs');
  const openCart = () => navigation.navigate('Checkout');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profil Pengguna</Text>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{userId}</Text>
        <Text style={styles.notation}>
          Halaman ini bisa dibuka lewat deep link seperti
          {' '}
          ecommerceapp://profil/{'{userId}'}
          . Jika ID tidak valid akan diarahkan ke Home.
        </Text>
        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={goHome}>
            <Text style={styles.buttonText}>Ke Home</Text>
          </Pressable>
          <Pressable style={styles.buttonAlt} onPress={openCart}>
            <Text style={styles.buttonTextAlt}>Buka Keranjang</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e2530',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  notation: {
    fontSize: 13,
    color: '#4b5563',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonAlt: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextAlt: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
