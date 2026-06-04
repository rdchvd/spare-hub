export type Product = {
  id: number;
  seller: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ProductInput = {
  name: string;
  description: string;
  price: string;
  quantity: number;
};

export type PaginatedProducts = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
};
