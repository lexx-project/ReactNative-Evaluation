import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {
  BiometricStrength,
  isSensorAvailable,
  simplePrompt,
} from '@sbaiahmed1/react-native-biometrics';
import apiClient from '../api/client';
import { RootAuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { loadProductDetailWithCache } from '../utils/productDetail';
import { loadToken, resetSecureToken } from '../utils/storage';

type LoginNavigation = NavigationProp<RootAuthStackParamList>;

export default function LoginScreen() {
  const [username, setUsername] = useState('bahlil');
  const [password, setPassword] = useState('bahlilGegeSekali');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<LoginNavigation>();
  const { login, consumePendingLink } = useAuth();
  const { addToCart } = useCart();
  const buildPromptMessage = (type?: string) =>
    type === 'FaceID'
      ? 'Pindai Wajah untuk Masuk'
      : 'Tempelkan Jari atau Pindai Wajah untuk Masuk';

  const detectNotEnrolled = (message?: string) => {
    const normalized = (message ?? '').toLowerCase();
    return (
      normalized.includes('not enrolled') ||
      normalized.includes('not_enrolled') ||
      normalized.includes('no biometrics enrolled')
    );
  };

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

  const handleBiometricLogin = async () => {
    setStatusMessage('');
    try {
      const info = await isSensorAvailable();
      if (!info.available) {
        if (detectNotEnrolled(info.error)) {
          Alert.alert(
            'Butuh Setup',
            'Biometrik (sidik jari/Face ID) belum diatur di HP ini.',
          );
        } else {
          Alert.alert(
            'Biometrik tidak tersedia',
            info.error || 'Sensor tidak tersedia.',
          );
          console.log('Biometric unavailable:', info.error);
        }
        return;
      }

      const { success, error } = await simplePrompt(
        buildPromptMessage(info.biometryType),
        {
          biometricStrength: BiometricStrength.Weak,
        },
      );

      if (success) {
        const token = await loadToken();
        if (token) {
          await login(token);
          setStatusMessage('Login Cepat berhasil.');
          navigation.navigate('MainApp');
        } else {
          Alert.alert('Info', 'Token belum tersedia. Login manual dulu.');
        }
        return;
      }

      const errorText = (error ?? '').toLowerCase();
      const isLockout =
        errorText.includes('lockout') || errorText.includes('locked');
      if (isLockout) {
        await resetSecureToken();
        setStatusMessage(
          'Sensor terkunci. Token dihapus, silakan login manual.',
        );
        return;
      }

      setStatusMessage('Autentikasi dibatalkan.');
    } catch (err) {
      const message = (err as Error)?.message?.toLowerCase?.() ?? '';
      if (message.includes('lockout') || message.includes('locked')) {
        await resetSecureToken();
        setStatusMessage(
          'Sensor terkunci. Token dihapus, silakan login manual.',
        );
        return;
      }
      Alert.alert('Error', 'Terjadi kesalahan pada sensor');
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

        <Pressable
          style={styles.secondaryButton}
          onPress={handleBiometricLogin}
        >
          <Text style={styles.secondaryButtonText}>
            Login Cepat (Biometrik)
          </Text>
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
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
