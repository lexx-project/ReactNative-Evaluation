import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { getWishlist, setWishlist, WishlistMeta } from '../utils/storage';

type WishlistContextValue = {
  ids: number[];
  meta: WishlistMeta;
  toggle: (id: number) => Promise<void>;
  isInWishlist: (id: number) => boolean;
  hydrated: boolean;
  clear: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [meta, setMeta] = useState<WishlistMeta>({ count: 0, updatedAt: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await getWishlist();
        setIds(stored.ids);
        setMeta({
          count: stored.meta?.count ?? stored.ids.length,
          updatedAt: stored.meta?.updatedAt ?? 0,
        });
        if (stored.corrupted) {
          Alert.alert(
            'Wishlist diperbaiki',
            'Data yang rusak dibersihkan otomatis.',
          );
        }
      } catch (err) {
        console.error('Gagal memuat wishlist:', err);
        Alert.alert(
          'Wishlist rusak',
          'Data wishlist tidak bisa dibaca. Kami sudah membersihkannya.',
        );
        setIds([]);
        setMeta({ count: 0, updatedAt: 0 });
      } finally {
        setHydrated(true);
      }
    };

    hydrate();
  }, []);

  const persistWishlist = useCallback(
    async (nextIds: number[]) => {
      const nextMeta: WishlistMeta = {
        count: nextIds.length,
        updatedAt: Date.now(),
      };
      setIds(nextIds);
      setMeta(nextMeta);
      await setWishlist(nextIds, nextMeta);
    },
    [setIds, setMeta],
  );

  const toggle = useCallback(
    async (id: number) => {
      const exists = ids.includes(id);
      const nextIds = exists ? ids.filter(item => item !== id) : [...ids, id];
      await persistWishlist(nextIds);
    },
    [ids, persistWishlist],
  );

  const isInWishlist = useCallback(
    (id: number) => ids.includes(id),
    [ids],
  );

  const clear = useCallback(async () => {
    await persistWishlist([]);
  }, [persistWishlist]);

  const value = useMemo(
    () => ({ ids, meta, toggle, isInWishlist, hydrated, clear }),
    [ids, meta, toggle, isInWishlist, hydrated, clear],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist harus digunakan di dalam WishlistProvider');
  }
  return context;
}
