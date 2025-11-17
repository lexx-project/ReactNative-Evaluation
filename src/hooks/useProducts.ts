import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProducts, Product } from '../data/product';
import { getProductsCache, setProductsCache } from '../utils/storage';
import { useConnectivity } from '../context/ConnectivityContext';

type UseProductsResult = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const { isOffline } = useConnectivity();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }

    setIsLoading(true);

    try {
      const cached = await getProductsCache<Product[]>();
      if (cached && isMountedRef.current) {
        setProducts(cached);
        setError(null);
        if (isOffline) {
          setIsLoading(false);
          return;
        }
      }

      if (isOffline) {
        setError('Offline. Data dari cache.');
        setIsLoading(false);
        return;
      }

      const data = await fetchProducts();
      if (isMountedRef.current) {
        setProducts(data);
        setError(null);
        await setProductsCache(data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      if (isMountedRef.current) {
        setError('Gagal memuat produk. Tarik untuk refresh atau coba lagi.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isOffline]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    isLoading,
    error,
    refetch: loadProducts,
  };
}
