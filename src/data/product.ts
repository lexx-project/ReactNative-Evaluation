import axios from 'axios';
import { retryWithBackoff } from '../utils/retry';

export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
};

type ApiProduct = Omit<Product, 'rating'> & {
  rating?: Partial<ProductRating>;
};

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

export async function fetchProducts(): Promise<Product[]> {
  const response = await retryWithBackoff(() => api.get<ApiProduct[]>('/products'), {
    retries: 3,
    baseDelayMs: 800,
    onRetry: (attempt, err) => {
      console.warn(`Retry produk ke-${attempt} karena`, (err as Error)?.message);
    },
  });

  return response.data.map(product => ({
    ...product,
    rating: {
      rate: product.rating?.rate ?? 0,
      count: product.rating?.count ?? 0,
    },
  }));
}
