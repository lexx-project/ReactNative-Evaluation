import apiClient from '../api/client';
import { Product } from '../data/product';
import {
  getProductDetailCache,
  setProductDetailCache,
} from './storage';
import { retryWithBackoff } from './retry';

export async function loadProductDetailWithCache(
  productId: number,
  fallback?: Product,
) {
  const cached = await getProductDetailCache<Product>(productId);
  if (cached) {
    return { product: cached, fromCache: true };
  }

  const response = await retryWithBackoff(
    () => apiClient.get(`/products/${productId}`),
    {
      baseDelayMs: 700,
      retries: 3,
      onRetry: attempt => {
        console.warn(
          `Retry detail produk ke-${attempt} untuk ID ${productId}`,
        );
      },
    },
  );

  const payload = response.data;
  const normalized: Product = {
    id: payload.id ?? fallback?.id ?? productId,
    title: payload.title ?? fallback?.title ?? 'Produk',
    description:
      payload.description ??
      fallback?.description ??
      'Memuat detail produk, mohon tunggu...',
    price: payload.price ?? fallback?.price ?? 0,
    category: payload.category ?? fallback?.category ?? 'unknown',
    image:
      payload.thumbnail ??
      payload.images?.[0] ??
      fallback?.image ??
      'https://placehold.co/600x400?text=Produk',
    rating: {
      rate:
        typeof payload.rating === 'object'
          ? payload.rating.rate ?? fallback?.rating?.rate ?? 0
          : payload.rating ?? fallback?.rating?.rate ?? 0,
      count:
        typeof payload.rating === 'object'
          ? payload.rating.count ?? fallback?.rating?.count ?? 0
          : fallback?.rating?.count ?? 0,
    },
  };
  await setProductDetailCache(productId, normalized);
  return { product: normalized, fromCache: false };
}
