export interface Products {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  images?: string[];
  stock: number;
  sku?: string;
  categoryId?: string;
  store?: any;
  variants?: any[];
  createdAt?: string;
  updatedAt?: string;
}