import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { RootAuthStackParamList } from '../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootAuthStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    if (username.trim() === 'admin' && password.trim() === 'admin123') {
      navigation.replace('MainApp');
    } else {
      console.log('Login Gagal');
      Alert.alert(
        'Login Gagal',
        'Email atau password yang Anda masukkan salah.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{
            uri: 'https://upload.lexxganz.my.id/uploads/logoecomerce%20(1).png',
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>Selamat Datang Kembali!</Text>
        <Text style={styles.subtitle}>
          Masuk untuk melanjutkan belanja Anda.
        </Text>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={18} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text>Login</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [pressed && styles.pressedState]}>
          <Text style={styles.forgotPassword}>Lupa Password?</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    gap: 20,
  },
  logo: {
    width: 150,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e1f2a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    width: '100%',
    gap: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 52,
    backgroundColor: '#f7f8fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  inputIcon: {
    color: '#5f6368',
    marginHorizontal: 15,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingRight: 15,
    fontSize: 16,
    color: '#1e1f2a',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 10,
    color: '#1e90ff',
    fontSize: 15,
    fontWeight: '500',
  },
  pressedState: {
    opacity: 0.8,
  },
});
