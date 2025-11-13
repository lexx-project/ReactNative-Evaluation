import axios from 'axios';

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
  const response = await api.get<ApiProduct[]>('/products');
  return response.data.map(product => ({
    ...product,
    rating: {
      rate: product.rating?.rate ?? 0,
      count: product.rating?.count ?? 0,
    },
  }));
}
