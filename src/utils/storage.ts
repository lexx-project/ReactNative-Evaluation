import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

export const STORAGE_KEYS = {
  token: '@miniapp:auth-token',
  expiredAt: '@miniapp:expired-at',
  theme: '@miniapp:theme',
  notification: '@miniapp:notification',
  productsCache: '@miniapp:products-cache',
  cart: '@miniapp:cart',
  wishlist: '@miniapp:wishlist',
  wishlistMeta: '@miniapp:wishlist-meta',
};

const TOKEN_SERVICE = 'com.ecom:userToken';
const TOKEN_USERNAME = 'user_token_holder';
const PRODUCT_DETAIL_PREFIX = '@product_detail:';

type TTLPayload<T> = {
  value: T;
  timestamp: number;
  ttl: number;
};

const MAX_CACHE_AGE = 30 * 60 * 1000; // 30 menit untuk produk/kategori
const DEFAULT_DETAIL_TTL = 5 * 60 * 1000; // 5 menit per item

export type WishlistMeta = {
  count: number;
  updatedAt: number;
};

const safeParse = async <T>(
  raw: string | null,
  keyToCleanup?: string,
): Promise<T | null> => {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('Gagal parse data storage:', err);
    if (keyToCleanup) {
      await AsyncStorage.removeItem(keyToCleanup).catch(cleanErr =>
        console.warn(`Gagal menghapus item corrupt ${keyToCleanup}:`, cleanErr),
      );
    }
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
    const [token, entries, expiredAt] = await Promise.all([
      loadToken(),
      AsyncStorage.multiGet([STORAGE_KEYS.theme, STORAGE_KEYS.notification]),
      AsyncStorage.getItem(STORAGE_KEYS.expiredAt),
    ]);

    const baseEntries = entries.reduce<Record<string, string | null>>(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {},
    );
    return {
      ...baseEntries,
      [STORAGE_KEYS.token]: token ?? null,
      [STORAGE_KEYS.expiredAt]: expiredAt ?? null,
    };
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
  const parsed = await safeParse<TTLPayload<T>>(
    raw,
    STORAGE_KEYS.productsCache,
  );
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

export async function loadCart<T>(): Promise<{
  items: T | [];
  corrupted: boolean;
}> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.cart);
    const parsed = await safeParse<{ items?: T }>(raw, STORAGE_KEYS.cart);
    const corrupted = !!raw && !parsed;
    return { items: parsed?.items ?? [], corrupted };
  } catch (err) {
    console.error('Gagal mengambil cart:', err);
    return { items: [], corrupted: true };
  }
}

export async function resetSecureToken() {
  try {
    await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  } catch (err) {
    console.error('Gagal reset token secure:', err);
  }
}

export async function saveAuthSession(token: string, expiredAt: number) {
  try {
    await Keychain.setGenericPassword(TOKEN_USERNAME, token, {
      service: TOKEN_SERVICE,
    });
    await AsyncStorage.setItem(STORAGE_KEYS.expiredAt, String(expiredAt));
  } catch (err) {
    console.error('Gagal menyimpan sesi auth:', err);
  }
}

export async function clearAuthSession() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.expiredAt);
  } catch (err) {
    console.error('Gagal membersihkan expiredAt:', err);
  }
  await resetSecureToken();
}

export async function loadAuthSession() {
  const [token, expiredRaw] = await Promise.all([
    loadToken(),
    AsyncStorage.getItem(STORAGE_KEYS.expiredAt),
  ]);

  let expiredAt: number | null = null;
  if (expiredRaw) {
    const parsed = Number(expiredRaw);
    if (Number.isFinite(parsed)) {
      expiredAt = parsed;
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.expiredAt);
    }
  }

  return { token, expiredAt };
}

export const isExpired = (expiredAt: number | null) =>
  typeof expiredAt === 'number' && expiredAt > 0 && Date.now() >= expiredAt;

export async function enforceExpiry(): Promise<'valid' | 'expired' | 'missing'> {
  try {
    const { token, expiredAt } = await loadAuthSession();
    if (!token) {
      return 'missing';
    }
    if (isExpired(expiredAt)) {
      await clearAuthSession();
      return 'expired';
    }
    return 'valid';
  } catch (err) {
    console.error('Gagal memverifikasi expiry token:', err);
    await clearAuthSession();
    return 'missing';
  }
}

export async function setWishlist(
  ids: number[],
  meta: Partial<WishlistMeta> = {},
) {
  const payloadMeta: WishlistMeta = {
    count: ids.length,
    updatedAt: Date.now(),
    ...meta,
  };

  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.wishlist, JSON.stringify(ids)],
      [STORAGE_KEYS.wishlistMeta, JSON.stringify(payloadMeta)],
    ]);
  } catch (err) {
    console.error('Gagal menyimpan wishlist:', err);
  }
}

export async function getWishlist(): Promise<{
  ids: number[];
  meta: WishlistMeta;
  corrupted: boolean;
}> {
  const [wishlistRaw, metaRaw] = await AsyncStorage.multiGet([
    STORAGE_KEYS.wishlist,
    STORAGE_KEYS.wishlistMeta,
  ]);

  const wishlistValue = await safeParse<number[]>(
    wishlistRaw[1],
    STORAGE_KEYS.wishlist,
  );
  const metaValue = await safeParse<WishlistMeta>(
    metaRaw[1],
    STORAGE_KEYS.wishlistMeta,
  );

  const corrupted =
    (!!wishlistRaw[1] && !wishlistValue) || (!!metaRaw[1] && !metaValue);

  return {
    ids: wishlistValue ?? [],
    meta: metaValue ?? { count: wishlistValue?.length ?? 0, updatedAt: 0 },
    corrupted,
  };
}

const productDetailKey = (id: number | string) =>
  `${PRODUCT_DETAIL_PREFIX}${id}`;

export async function setProductDetailCache<T>(
  id: number | string,
  value: T,
  ttlMs: number = DEFAULT_DETAIL_TTL,
) {
  const payload = {
    value,
    timestamp: Date.now(),
    ttl_product: ttlMs,
  };
  try {
    await AsyncStorage.setItem(productDetailKey(id), JSON.stringify(payload));
  } catch (err) {
    console.error('Gagal menyimpan cache detail produk:', err);
  }
}

export async function getProductDetailCache<T>(
  id: number | string,
): Promise<T | null> {
  const key = productDetailKey(id);
  const raw = await AsyncStorage.getItem(key);
  const parsed = await safeParse<{
    value: T;
    ttl_product: number;
    timestamp: number;
  }>(raw, key);
  if (!parsed) {
    return null;
  }

  const isFresh =
    typeof parsed.ttl_product === 'number' &&
    typeof parsed.timestamp === 'number' &&
    Date.now() - parsed.timestamp < parsed.ttl_product;
  if (!isFresh) {
    await AsyncStorage.removeItem(key).catch(err =>
      console.warn('Gagal menghapus cache produk kedaluwarsa:', err),
    );
    return null;
  }

  return parsed.value;
}

export async function clearSensitiveData() {
  try {
    const storedKeys = await AsyncStorage.getAllKeys();
    const detailKeys = storedKeys.filter(key =>
      key.startsWith(PRODUCT_DETAIL_PREFIX),
    );
    const keysToRemove = [
      STORAGE_KEYS.token,
      STORAGE_KEYS.expiredAt,
      STORAGE_KEYS.theme,
      STORAGE_KEYS.notification,
      STORAGE_KEYS.cart,
      STORAGE_KEYS.productsCache,
      STORAGE_KEYS.wishlist,
      STORAGE_KEYS.wishlistMeta,
      ...detailKeys,
    ];
    await AsyncStorage.multiRemove(keysToRemove);
    await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  } catch (err) {
    console.error('Gagal membersihkan data sensitif saat logout:', err);
  }
}
