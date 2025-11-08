import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type RootTabParamList = {
  Home: undefined;
  About: undefined;
};

export default function AboutScreen() {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://upload.lexxganz.my.id/uploads/logoecomerce%20(1).png',
            }}
            style={styles.appLogo}
          />
          <Text style={styles.name}>MiniEcommerce</Text>
          <Text style={styles.tagline}>
            Katalog toko online simpel buat kamu eksplor produk dan masukin ke
            keranjang belanja dengan cepat.
          </Text>
          <Section
            title="Tentang Aplikasi Ini"
            body="MiniEcommerce bantu kamu lihat daftar produk keren lengkap dengan harga, rating, dan tombol 'Tambah ke Keranjang' yang gampang banget dipake."
          />
          <Section
            title="Fitur Utama"
            body={
              '• Tampilan produk yang pas di HP atau tablet\n' +
              '• Cari produk langsung ketemu\n' +
              '• Keranjang belanja pop-up buat cek total\n' +
              '• Navigasi tab & stack yang udah akrab di tangan'
            }
          />
          <Section
            title="Teknologi"
            body="Aplikasi dibangun menggunakan React Native 0.80 + TypeScript, NativeWind untuk styling modern, dan React Navigation untuk pengelolaan layar."
          />
        </View>
        <Pressable
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Pergi Belanja</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type SectionProps = {
  title: string;
  body: string;
};

function Section({ title, body }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f9',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    width: '100%',
    maxWidth: 420,
  },
  appLogo: {
    width: 250,
    height: 200,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e1f2a',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: '#e7f0ff',
    color: '#1e64ff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f7f8fb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2a37',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
  shopButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
