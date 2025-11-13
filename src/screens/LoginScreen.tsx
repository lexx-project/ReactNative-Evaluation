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

type LoginNavigation = NavigationProp<RootAuthStackParamList>;

export default function LoginScreen() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<LoginNavigation>();

  const handleLogin = async () => {
    setIsSubmitting(true);
    setStatusMessage('');
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      if (response.data?.token) {
        console.log('Token diterima:', response.data.token);
        setStatusMessage('Login berhasil! Mengalihkan ke Home...');
      } else {
        setStatusMessage('Login berhasil tanpa token. Mengalihkan ke Home...');
      }

      navigation.navigate('MainApp');
    } catch (error: any) {
      console.warn('Login gagal', error);
      const serverMessage = error?.response?.data?.message;
      setStatusMessage(
        serverMessage
          ? `Login gagal: ${serverMessage}`
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
