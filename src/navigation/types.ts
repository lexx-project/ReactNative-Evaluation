import type { Product } from '../data/product';

export type MainStackParamList = {
  Home: undefined;
  ProductDetail: {
    productId: number;
    product?: Product;
  };
};
