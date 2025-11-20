import { useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';

import { useAuth, PendingLink } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { navigationRef, resetToLogin } from '../navigation/navigationRef';
import { loadProductDetailWithCache } from '../utils/productDetail';
import { enforceExpiry } from '../utils/storage';

type ParsedDeepLink =
  | { type: 'product'; id: number }
  | { type: 'cart' }
  | { type: 'checkout' }
  | { type: 'add-to-cart'; id: number }
  | { type: 'invalid' };

const goHome = () => {
  navigationRef.navigate('MainApp', {
    screen: 'Beranda',
    params: {
      screen: 'MainBottomTabs',
      params: { screen: 'Home' },
    },
  });
};

const normalizePath = (url: string) => {
  try {
    const parsed = new URL(url);
    const isAppHost =
      parsed.hostname.includes('miniecom') ||
      parsed.hostname.includes('ecommerceapp');
    const hostPart = isAppHost ? '' : parsed.hostname;
    const path = parsed.pathname.startsWith('/') ? parsed.pathname : `/${parsed.pathname}`;
    return [hostPart, path.replace(/^\//, '')].filter(Boolean).join('/');
  } catch {
    return url.replace(/^.*?:\/\//, '');
  }
};

const parseDeepLink = (url: string): ParsedDeepLink => {
  const normalized = normalizePath(url);
  const segments = normalized.split('/').filter(Boolean);
  const [first, second] = segments;
  if (first === 'product') {
    const id = Number(second);
    return Number.isFinite(id) ? { type: 'product', id } : { type: 'invalid' };
  }
  if (first === 'cart') {
    return { type: 'cart' };
  }
  if (first === 'checkout') {
    return { type: 'checkout' };
  }
  if (first === 'add-to-cart') {
    const id = Number(second);
    return Number.isFinite(id)
      ? { type: 'add-to-cart', id }
      : { type: 'invalid' };
  }
  return { type: 'invalid' };
};

const pendingFromLink = (link: ParsedDeepLink): PendingLink | null => {
  if (link.type === 'product') {
    return { type: 'product', productId: link.id };
  }
  if (link.type === 'cart') {
    return { type: 'cart' };
  }
  if (link.type === 'checkout') {
    return { type: 'checkout' };
  }
  if (link.type === 'add-to-cart') {
    return { type: 'add-to-cart', productId: link.id };
  }
  return null;
};

export default function DeepLinkHandler({
  navigationReady,
}: {
  navigationReady: boolean;
}) {
  const { status, setPendingLink, pendingLink, consumePendingLink } = useAuth();
  const { addToCart } = useCart();

  const executeLink = useCallback(
    async (link: ParsedDeepLink) => {
      if (!navigationReady) {
        const queued = pendingFromLink(link);
        if (queued) {
          setPendingLink(queued);
        }
        return true;
      }

      if (link.type === 'invalid') {
        Alert.alert('Tautan tidak valid', 'Dialihkan ke beranda');
        goHome();
        return true;
      }

      const requiresAuth = true;
      const expiryState = await enforceExpiry();
      if (requiresAuth && expiryState !== 'valid') {
        const pending = pendingFromLink(link);
        if (pending) {
          setPendingLink(pending);
        }
        resetToLogin();
        return true;
      }

      if (link.type === 'product') {
        navigationRef.navigate('MainApp', {
          screen: 'Beranda',
          params: {
            screen: 'ProductDetail',
            params: { productId: link.id },
          },
        });
        return true;
      }

      if (link.type === 'cart') {
        navigationRef.navigate('MainApp', {
          screen: 'Beranda',
          params: { screen: 'Cart' },
        });
        return true;
      }

      if (link.type === 'checkout') {
        navigationRef.navigate('MainApp', {
          screen: 'Beranda',
          params: { screen: 'Checkout' },
        });
        return true;
      }

      if (link.type === 'add-to-cart') {
        try {
          const { product } = await loadProductDetailWithCache(link.id);
          addToCart(product);
          Alert.alert('Berhasil', 'Produk ditambahkan ke keranjang.');
        } catch (err) {
          console.error('Gagal memproses deep link add-to-cart', err);
          Alert.alert(
            'Gagal menambah produk',
            'Kami tidak dapat memuat detail produk untuk ditambahkan.',
          );
        }
        return true;
      }
      return false;
    },
    [addToCart, navigationReady, setPendingLink],
  );

  const handleUrl = useCallback(
    async (url: string, isInitial = false, listener?: (url: string) => void) => {
      const parsed = parseDeepLink(url);
      const consumed = await executeLink(parsed);
      if (!consumed && listener) {
        listener(url);
      }
    },
    [executeLink],
  );

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        handleUrl(url, true);
      }
    });

    const subscription = Linking.addEventListener('url', event => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);

  useEffect(() => {
    if (status === 'authenticated' && pendingLink) {
      const parsed: ParsedDeepLink =
        pendingLink.type === 'product'
          ? { type: 'product', id: pendingLink.productId }
          : pendingLink.type === 'cart'
          ? { type: 'cart' }
          : pendingLink.type === 'checkout'
          ? { type: 'checkout' }
          : { type: 'add-to-cart', id: pendingLink.productId };
      executeLink(parsed).then(() => {
        consumePendingLink();
      });
    }
  }, [consumePendingLink, executeLink, pendingLink, status]);

  return null;
}
