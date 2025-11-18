import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

export const STORAGE_KEYS = {
  token: '@miniapp:auth-token',
  theme: '@miniapp:theme',
  notification: '@miniapp:notification',
  productsCache: '@miniapp:products-cache',
  cart: '@miniapp:cart',
};

const TOKEN_SERVICE = 'com.ecom:userToken';
const TOKEN_USERNAME = 'user_token_holder';

type TTLPayload<T> = {
  value: T;
  timestamp: number;
  ttl: number;
};

const MAX_CACHE_AGE = 30 * 60 * 1000; // 30 menit untuk produk/kategori

const safeParse = <T>(raw: string | null): T | null => {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('Gagal parse data storage:', err);
    return null;
  }
};

export async function saveToken(token: string) {
  try {
    await Keychain.setGenericPassword(TOKEN_USERNAME, token, {
      service: TOKEN_SERVICE,
    });
  } catch (err) {
    console.error('Gagal menyimpan token:', err);
  }
}

export async function loadToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKEN_SERVICE,
    });
    return credentials?.password ?? null;
  } catch (err) {
    const message = (err as Error)?.message ?? '';
    const isAccessDenied = message.toLowerCase().includes('access denied');
    if (isAccessDenied) {
      throw err;
    }
    console.error('Gagal mengambil token:', err);
    return null;
  }
}

export async function multiLoadBasics() {
  try {
    const [token, entries] = await Promise.all([
      loadToken(),
      AsyncStorage.multiGet([STORAGE_KEYS.theme, STORAGE_KEYS.notification]),
    ]);

    const baseEntries = entries.reduce<Record<string, string | null>>(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {},
    );
    return { ...baseEntries, [STORAGE_KEYS.token]: token ?? null };
  } catch (err) {
    const message = (err as Error)?.message ?? '';
    if (message.toLowerCase().includes('access denied')) {
      throw err;
    }
    console.error('Gagal melakukan multiGet:', err);
    return {};
  }
}

export async function setProductsCache<T>(value: T) {
  try {
    const payload: TTLPayload<T> = {
      value,
      timestamp: Date.now(),
      ttl: MAX_CACHE_AGE,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.productsCache, JSON.stringify(payload));
  } catch (err) {
    console.error('Gagal menyimpan cache produk:', err);
  }
}

export async function getProductsCache<T>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.productsCache);
  const parsed = safeParse<TTLPayload<T>>(raw);
  if (!parsed) {
    return null;
  }

  const isFresh = Date.now() - parsed.timestamp < parsed.ttl;
  if (!isFresh) {
    return null;
  }
  return parsed.value;
}

export async function persistCart(items: unknown) {
  try {
    // mergeItem untuk perubahan kecil dan agar tidak overwrite struktur lain yang mungkin ditambahkan
    await AsyncStorage.mergeItem(
      STORAGE_KEYS.cart,
      JSON.stringify({ items }),
    );
  } catch (err: any) {
    const message = err?.message ?? '';
    if (message.toLowerCase().includes('quota')) {
      console.warn(
        'Penyimpanan penuh (Quota exceeded). Cart hanya disimpan di memori sekarang.',
      );
    } else {
      console.error('Gagal menyimpan cart:', err);
    }
  }
}

export async function loadCart<T>(): Promise<T | []> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.cart);
    const parsed = safeParse<{ items?: T }>(raw);
    return parsed?.items ?? [];
  } catch (err) {
    console.error('Gagal mengambil cart:', err);
    return [];
  }
}

export async function clearSensitiveData() {
  try {
    await Promise.all([
      AsyncStorage.multiRemove([
        STORAGE_KEYS.token,
        STORAGE_KEYS.theme,
        STORAGE_KEYS.notification,
        STORAGE_KEYS.cart,
        STORAGE_KEYS.productsCache,
      ]),
      Keychain.resetGenericPassword({ service: TOKEN_SERVICE }),
    ]);
  } catch (err) {
    console.error('Gagal membersihkan data sensitif saat logout:', err);
  }
}

export async function resetSecureToken() {
  try {
    await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  } catch (err) {
    console.error('Gagal reset token secure:', err);
  }
}
