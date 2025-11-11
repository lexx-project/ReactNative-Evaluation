import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function ProfileScreen() {
  const { status, token, logout } = useAuth();
  const isAuthenticated = status === 'authenticated';

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Harap Login untuk mengakses
          </Text>
          <Pressable style={styles.loginButton} onPress={logout}>
            <Text style={styles.loginButtonText}>Pergi ke Halaman Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Profil Pengguna</Text>
        <Text>Ini adalah ProfileScreen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#0f172a',
  },
  description: {
    fontSize: 14,
    color: '#475569',
  },
});
