import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  ActivityIndicator,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BiometricStrength,
  isSensorAvailable,
  simplePrompt,
} from '@sbaiahmed1/react-native-biometrics';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { MainStackParamList } from '../navigation/MainStack';
import { useAuth } from '../context/AuthContext';
import { resetToLogin } from '../navigation/navigationRef';
import { loadToken, resetSecureToken, STORAGE_KEYS } from '../utils/storage';

type ProfileRouteProp = RouteProp<MainStackParamList, 'Profile'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type StoredProductAsset = { uri?: string; fileName?: string | null };
type SensorState = {
  available: boolean;
  biometryType?: string;
  error?: string;
};

const PRODUCT_ASSET_KEY = STORAGE_KEYS.newProductAssets;
const OFFLINE_PREVIEW_KEY = STORAGE_KEYS.profileOfflinePreview;

export default function ProfileScreen() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { login, logout } = useAuth();
  const userId = route.params?.userId ?? '';
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [productImages, setProductImages] = useState<StoredProductAsset[]>([]);
  const [offlinePreview, setOfflinePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sensorState, setSensorState] = useState<SensorState>({
    available: false,
  });
  const [securityStatus, setSecurityStatus] = useState('');
  const [pinFallbackNote, setPinFallbackNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const initials = useMemo(() => {
    if (!userId) {
      return 'Foto';
    }
    const cleaned = userId.replace(/[^A-Za-z0-9]/g, '');
    return cleaned.substring(0, 2).toUpperCase() || 'GU';
  }, [userId]);

  const sizeLabel = useMemo(() => {
    if (!photo?.fileSize) {
      return '';
    }
    const sizeKb = Math.max(1, Math.round(photo.fileSize / 1024));
    return ` • ${sizeKb} KB`;
  }, [photo]);

  useEffect(() => {
    const isValid = /^[A-Za-z0-9_-]+$/.test(userId);
    if (!isValid) {
      navigation.navigate('MainBottomTabs');
    }
  }, [navigation, userId]);

  useEffect(() => {
    const loadStoredMedia = async () => {
      try {
        const rawAssets = await AsyncStorage.getItem(PRODUCT_ASSET_KEY);
        if (rawAssets) {
          const parsed = JSON.parse(rawAssets) as StoredProductAsset[];
          if (Array.isArray(parsed)) {
            const sanitized = parsed.filter(item => item?.uri);
            setProductImages(sanitized);
          }
        }
      } catch (err) {
        console.error('Gagal memuat foto produk tersimpan:', err);
      }

      try {
        const savedPreview = await AsyncStorage.getItem(OFFLINE_PREVIEW_KEY);
        if (savedPreview) {
          setOfflinePreview(savedPreview);
        }
      } catch (err) {
        console.error('Gagal memuat preview offline:', err);
      }
    };

    loadStoredMedia();
  }, []);

  const resetPhoto = () => setPhoto(null);

  const savePhoto = () => {
    Alert.alert(
      photo ? 'Foto profil diperbarui' : 'Belum ada foto',
      photo
        ? 'Foto yang baru telah dipakai sebagai avatar profil.'
        : 'Ambil foto terlebih dahulu.',
    );
  };

  const ensureCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
    const granted = await PermissionsAndroid.check(permission);
    if (granted) {
      return true;
    }

    const result = await PermissionsAndroid.request(permission);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openGalleryFallback = () => {
    const galleryOptions: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.7,
    };

    launchImageLibrary(galleryOptions, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert(
          'Error',
          response.errorMessage || 'Gagal membuka galeri untuk fallback.',
        );
        return;
      }
      const firstAsset = response.assets?.[0];
      if (firstAsset?.uri) {
        setPhoto(firstAsset);
      }
    });
  };

  const handleCameraUnavailable = () => {
    Alert.alert(
      'Kamera tidak bisa dibuka',
      'Kamera tidak bisa dibuka. Gunakan Galeri?',
      [
        { text: 'Buka Galeri', onPress: openGalleryFallback },
        { text: 'Tutup', style: 'cancel' },
      ],
    );
  };

  const uploadCapturedPhoto = async (asset: Asset) => {
    if (!asset?.uri) {
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: asset.uri,
      type: asset.type ?? 'image/jpeg',
      name: asset.fileName ?? 'upload.jpg',
    } as any);

    try {
      await fetch('https://dummyjson.com/http/200', {
        method: 'POST',
        body: formData,
      });
      Alert.alert('Sukses', 'Foto berhasil diupload.');
    } catch (err) {
      Alert.alert('Upload gagal', 'Tidak bisa mengunggah foto. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const takePhoto = async () => {
    const allowed = await ensureCameraPermission();
    if (!allowed) {
      Alert.alert(
        'Izin kamera dibutuhkan',
        'Silakan izinkan akses kamera untuk mengambil foto.',
      );
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User membatalkan kamera');
        return;
      }
      if (response.errorCode === 'camera_unavailable') {
        handleCameraUnavailable();
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Gagal membuka kamera');
        return;
      }

      const firstAsset = response.assets?.[0];
      if (firstAsset) {
        setPhoto(firstAsset);
        uploadCapturedPhoto(firstAsset);
      }
    });
  };

  const captureKtp = (saveToPhotos: boolean) => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.7,
      saveToPhotos,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode === 'camera_unavailable') {
        handleCameraUnavailable();
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Gagal membuka kamera');
        return;
      }

      const firstAsset = response.assets?.[0];
      if (firstAsset) {
        Alert.alert(
          'Foto KTP diambil',
          saveToPhotos
            ? 'Backup disimpan di galeri publik.'
            : 'Foto tidak tersimpan di galeri publik.',
        );
        uploadCapturedPhoto(firstAsset);
      }
    });
  };

  const requestStoragePermissionAndSave = async () => {
    if (Platform.OS !== 'android') {
      captureKtp(true);
      return;
    }

    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const result = await PermissionsAndroid.request(permission, {
      title: 'Izin menyimpan foto',
      message:
        'Mini Ecommerce butuh izin untuk menyimpan backup foto KTP ke galeri publik.',
      buttonPositive: 'Izinkan',
      buttonNegative: 'Tolak',
    });

    const granted = result === PermissionsAndroid.RESULTS.GRANTED;
    if (granted) {
      captureKtp(true);
    } else {
      Alert.alert(
        'Izin ditolak',
        'Foto tetap diambil, tetapi tidak akan tersimpan di galeri publik.',
      );
      captureKtp(false);
    }
  };

  const pickImages = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 5,
      quality: 0.8,
      maxWidth: 600,
      maxHeight: 600,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Gagal membuka galeri');
        return;
      }
      if (response.assets) {
        const prepared = response.assets
          .slice(0, 5)
          .map(item => ({
            uri: item.uri,
            fileName: item.fileName ?? null,
          }))
          .filter(item => item.uri);
        setProductImages(prepared);
        AsyncStorage.setItem(PRODUCT_ASSET_KEY, JSON.stringify(prepared)).catch(
          err => console.error('Gagal menyimpan foto produk:', err),
        );
      }
    });
  };

  const saveOfflinePreview = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
      selectionLimit: 1,
      quality: 0.7,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Gagal membuka galeri');
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.base64) {
        setOfflinePreview(asset.base64);
        AsyncStorage.setItem(OFFLINE_PREVIEW_KEY, asset.base64).catch(err =>
          console.error('Gagal menyimpan preview offline:', err),
        );
        Alert.alert(
          'Preview disimpan',
          'Preview offline siap dipakai saat offline.',
        );
      }
    });
  };

  const detectNotEnrolled = (message?: string) => {
    const normalized = (message ?? '').toLowerCase();
    return (
      normalized.includes('not enrolled') ||
      normalized.includes('not_enrolled') ||
      normalized.includes('no biometrics enrolled')
    );
  };

  const detectLockout = (message?: string) => {
    const normalized = (message ?? '').toLowerCase();
    return (
      normalized.includes('lockout') ||
      normalized.includes('locked') ||
      normalized.includes('temporary_disabled')
    );
  };

  const handleLockout = useCallback(
    async (reason?: string) => {
      // Saat sensor terkunci kita hapus token agar percobaan brute force tidak bisa diteruskan.
      await resetSecureToken();
      await logout(() => resetToLogin());
      Alert.alert(
        'Keamanan',
        reason ??
          'Sensor terkunci. Token dihapus dan Anda keluar demi keamanan.',
      );
    },
    [logout],
  );

  const refreshSensorAvailability = useCallback(async () => {
    try {
      const info = await isSensorAvailable();
      setSensorState(info);
      console.log('Sensor availability refreshed:', info);
      return info;
    } catch (err) {
      const fallback: SensorState = {
        available: false, 
        error: (err as Error)?.message,
      };
      setSensorState(fallback);
      return fallback;
    }
  }, []);

  useEffect(() => {
    refreshSensorAvailability();
  }, [refreshSensorAvailability]);

  const buildPromptMessage = (type?: string) =>
    type === 'FaceID'
      ? 'Pindai Wajah untuk Masuk'
      : 'Tempelkan Jari atau Pindai Wajah untuk Masuk';

  const handleManualLoginSuccess = async () => {
    const simulatedToken = `token-${userId || 'user'}-${Date.now()}`;
    await login(simulatedToken);
    setSecurityStatus('Token disimpan di Keychain. Login Cepat siap dipakai.');
    Alert.alert(
      'Login Manual',
      'Token berhasil disimpan aman untuk Login Cepat biometrik.',
    );
  };

  const handleQuickLogin = async () => {
    setSecurityStatus('');
    setPinFallbackNote('');
    const info = await refreshSensorAvailability();
    if (!info.available) {
      if (detectNotEnrolled(info.error)) {
        const message =
          'Biometrik (sidik jari/Face ID) belum diatur di HP ini. Silakan atur di Settings';
        setPinFallbackNote(
          'Autentikasi biometrik ditunda. Gunakan PIN/manual terlebih dahulu.',
        );
        Alert.alert('Butuh Setup', message);
      } else {
        Alert.alert(
          'Biometrik tidak tersedia',
          info.error || 'Sensor tidak tersedia.',
        );
      }
      return;
    }

    const promptMessage = buildPromptMessage(info.biometryType);

    try {
      // Pakai strength "weak" agar Face Unlock OEM yang tidak dikategorikan strong tetap ter-cover.
      const { success, error } = await simplePrompt(promptMessage, {
        biometricStrength: BiometricStrength.Weak,
      });

      if (success) {
        const token = await loadToken();
        if (token) {
          await login(token);
          setSecurityStatus('Login Cepat berhasil memakai token tersimpan.');
          navigation.navigate('MainBottomTabs');
        } else {
          setSecurityStatus('Tidak ada token tersimpan. Login manual dulu.');
          Alert.alert(
            'Info',
            'Tidak ada token tersimpan. Lakukan login manual dulu.',
          );
        }
        return;
      }

      if (detectLockout(error)) {
        await handleLockout('Sensor terkunci karena percobaan gagal.');
        return;
      }

      setSecurityStatus(
        error ? `Autentikasi dibatalkan: ${error}` : 'Autentikasi dibatalkan.',
      );
    } catch (err) {
      const message = (err as Error)?.message ?? '';
      if (detectLockout(message)) {
        await handleLockout('Sensor terkunci oleh sistem.');
        return;
      }
      Alert.alert('Error', 'Terjadi kesalahan pada sensor');
    }
  };

  const processPayment = () => {
    setPaymentStatus('Transfer Rp 500.000 sedang diproses.');
    Alert.alert('Berhasil', 'Transfer Rp 500.000 diproses.');
  };

  const handlePaymentConfirmation = async () => {
    setPaymentStatus('');
    const info = await refreshSensorAvailability();
    if (!info.available) {
      if (detectNotEnrolled(info.error)) {
        Alert.alert(
          'Butuh Setup',
          'Biometrik (sidik jari/Face ID) belum diatur di HP ini. Silakan atur di Settings',
        );
        setPinFallbackNote(
          'Transaksi butuh PIN karena biometrik belum disiapkan.',
        );
      } else {
        Alert.alert(
          'Biometrik tidak tersedia',
          info.error || 'Sensor tidak tersedia.',
        );
      }
      return;
    }

    try {
      const { success, error } = await simplePrompt(
        'Konfirmasi Transfer Rp 500.000',
        { biometricStrength: BiometricStrength.Weak },
      );

      if (success) {
        processPayment();
        setPaymentStatus('Transaksi diproses setelah verifikasi biometrik.');
        return;
      }

      if (detectLockout(error)) {
        await handleLockout('Sensor terkunci saat konfirmasi transfer.');
        return;
      }

      Alert.alert('Transaksi Dibatalkan', 'Transaksi Dibatalkan');
      setPaymentStatus('Transaksi dibatalkan atau dibatalkan pengguna.');
    } catch (err) {
      const message = (err as Error)?.message ?? '';
      if (detectLockout(message)) {
        await handleLockout('Sensor terkunci saat konfirmasi transfer.');
        return;
      }
      Alert.alert('Error', 'Terjadi kesalahan pada sensor');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profil</Text>

        <View style={styles.avatarRow}>
          {photo?.uri ? (
            <Image source={{ uri: photo.uri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{initials}</Text>
            </View>
          )}
          <View style={styles.avatarInfo}>
            <Text style={styles.label}>
              Gunakan kamera untuk memperbarui foto profil.
            </Text>
          </View>
        </View>

        {photo?.uri ? (
          <Text style={styles.meta}>
            Preview: {photo.fileName || 'foto baru'}
            {sizeLabel}
          </Text>
        ) : (
          <Text style={styles.meta}>Foto Dulu Gengs Biar Keren</Text>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Ambil Foto</Text>
          </Pressable>
          <Pressable
            style={[styles.buttonAlt, !photo && styles.buttonDisabled]}
            onPress={savePhoto}
            disabled={!photo}
          >
            <Text
              style={[
                styles.buttonTextAlt,
                !photo && styles.buttonTextDisabled,
              ]}
            >
              Simpan
            </Text>
          </Pressable>
        </View>

        {uploading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#1e90ff" />
            <Text style={styles.loadingText}>Mengupload foto...</Text>
          </View>
        )}

        <View style={styles.secondaryActions}>
          <Pressable
            style={[styles.smallButton, !photo && styles.buttonDisabled]}
            onPress={resetPhoto}
            disabled={!photo}
          >
            <Text
              style={[
                styles.smallButtonText,
                !photo && styles.buttonTextDisabled,
              ]}
            >
              Hapus Preview
            </Text>
          </Pressable>
          <Pressable
            style={styles.smallButton}
            onPress={requestStoragePermissionAndSave}
          >
            <Text style={styles.smallButtonText}>Backup Foto KTP</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>Foto Produk (maks 5)</Text>
          <Pressable style={styles.galleryButton} onPress={pickImages}>
            <Text style={styles.galleryButtonText}>Pilih dari Galeri</Text>
          </Pressable>
        </View>

        <FlatList
          data={productImages}
          keyExtractor={(item, index) =>
            item.uri || item.fileName || `img-${index}`
          }
          numColumns={3}
          columnWrapperStyle={styles.galleryRow}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.galleryImage} />
          )}
          ListEmptyComponent={
            <Text style={styles.help}>Belum ada foto galeri yang dipilih.</Text>
          }
        />

        <View style={styles.divider} />

        <View style={styles.previewCard}>
          <View style={styles.galleryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.galleryTitle}>Preview Offline</Text>
            </View>
            <Pressable
              style={styles.galleryButton}
              onPress={saveOfflinePreview}
            >
              <Text style={styles.galleryButtonText}>Simpan Preview</Text>
            </Pressable>
          </View>

          {offlinePreview ? (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${offlinePreview}`,
              }}
              style={styles.offlinePreviewImage}
            />
          ) : (
            <Text style={styles.help}>
              Belum ada preview offline yang disimpan.
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.securityCard}>
          <View style={styles.galleryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.galleryTitle}>Biometrik & Login Cepat</Text>
              <Text style={styles.help}>
                Sensor:{' '}
                {sensorState.available
                  ? sensorState.biometryType || 'Biometrics'
                  : 'Tidak tersedia'}
              </Text>
            </View>
            <Pressable
              style={styles.linkButton}
              onPress={refreshSensorAvailability}
            >
              <Text style={styles.linkText}>Cek Sensor</Text>
            </Pressable>
          </View>

          {pinFallbackNote ? (
            <Text style={styles.warningText}>{pinFallbackNote}</Text>
          ) : null}
          {securityStatus ? (
            <Text style={styles.statusText}>{securityStatus}</Text>
          ) : null}

          <View style={styles.actions}>
            {/* <Pressable
              style={styles.button}
              onPress={handleManualLoginSuccess}
            ></Pressable> */}
            <Pressable style={styles.buttonAlt} onPress={handleQuickLogin}>
              <Text style={styles.buttonTextAlt}>Login Cepat</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.smallButton, styles.primaryGhost]}
            onPress={handlePaymentConfirmation}
          >
            <Text style={styles.smallButtonText}>
              Konfirmasi Transfer Rp 500.000
            </Text>
          </Pressable>
          {paymentStatus ? (
            <Text style={styles.meta}>{paymentStatus}</Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    padding: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
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
    fontSize: 16,
    color: '#6b7280',
  },
  highlight: {
    color: '#111827',
    fontWeight: '700',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  avatarInfo: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e2530',
  },
  help: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  meta: {
    fontSize: 13,
    color: '#4b5563',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#1e90ff',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonAlt: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1e90ff',
    paddingVertical: 14,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  smallButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  linkText: {
    color: '#1e90ff',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e2530',
  },
  galleryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  galleryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  galleryRow: {
    gap: 10,
    marginBottom: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  previewCard: {
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  offlinePreviewImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  securityCard: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusText: {
    color: '#065f46',
    fontWeight: '600',
  },
  warningText: {
    color: '#b45309',
    fontWeight: '600',
  },
  primaryGhost: {
    backgroundColor: '#e0f2fe',
  },
});
