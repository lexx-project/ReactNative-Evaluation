import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import apiClient from '../api/client';
import { RootAuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { loadProductDetailWithCache } from '../utils/productDetail';

type LoginNavigation = NavigationProp<RootAuthStackParamList>;

export default function LoginScreen() {
  const [username, setUsername] = useState('bahlil');
  const [password, setPassword] = useState('bahlilGegeSekali');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<LoginNavigation>();
  const { login, consumePendingLink } = useAuth();
  const { addToCart } = useCart();

  const fallbackLocalLogin = async (reason: string) => {
    const localToken = `custom-${username || 'user'}-${Date.now()}`;
    await login(localToken);
    setStatusMessage(reason);
    navigation.navigate('MainApp');
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    setStatusMessage('');
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const token = response.data?.token ?? 'dummy-token';
      await login(token);
      const queued = consumePendingLink();
      if (queued) {
        if (queued.type === 'product') {
          navigation.navigate('MainApp', {
            screen: 'Beranda',
            params: {
              screen: 'ProductDetail',
              params: { productId: queued.productId },
            },
          });
          return;
        }
        if (queued.type === 'cart') {
          navigation.navigate('MainApp', {
            screen: 'Beranda',
            params: { screen: 'Cart' },
          });
          return;
        }
        if (queued.type === 'checkout') {
          navigation.navigate('MainApp', {
            screen: 'Beranda',
            params: { screen: 'Checkout' },
          });
          return;
        }
        if (queued.type === 'add-to-cart') {
          const { product } = await loadProductDetailWithCache(
            queued.productId,
          );
          addToCart(product);
          navigation.navigate('MainApp');
          return;
        }
      }
      setStatusMessage('Login berhasil! Mengalihkan ke Home...');

      navigation.navigate('MainApp');
    } catch (error: any) {
      console.warn('Login gagal', error);
      const serverMessage = error?.response?.data?.message;
      const isUnauthorized = error?.response?.status === 401;
      const message =
        serverMessage || (isUnauthorized ? 'Invalid credentials' : null);

      if (username && password) {
        await fallbackLocalLogin(
          message
            ? `Login offline: ${message}. Token lokal dibuat.`
            : 'Login offline: menggunakan token lokal.',
        );
        return;
      }

      setStatusMessage(
        message
          ? `Login gagal: ${message}`
          : 'Login gagal. Silakan cek kembali kredensial Anda.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Masuk ke Akun</Text>
        <Text style={styles.subtitle}>
          Gunakan kredensial simulasi dari DummyJSON.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>

        {statusMessage ? (
          <Text style={styles.status}>{statusMessage}</Text>
        ) : null}
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
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e2530',
  },
  subtitle: {
    color: '#7a7f87',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d7dce5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e2530',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    textAlign: 'center',
    color: '#4c566a',
  },
});
