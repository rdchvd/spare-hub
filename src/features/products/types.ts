export type ProductConditionApi = "new" | "used" | "refurbished";
export type ProductConditionUi = "new" | "used" | "refurb";
export type ProductCurrency = "USD" | "EUR" | "UAH";

export type ProductSeller = {
  id: number;
  company_name: string;
  display_name: string;
};

export type Product = {
  id: number;
  seller: number | ProductSeller | null;
  name: string;
  brand: string;
  description: string;
  price: string;
  currency: ProductCurrency;
  condition: ProductConditionApi;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ProductInput = {
  name: string;
  brand: string;
  description: string;
  price: string;
  currency: ProductCurrency;
  condition: ProductConditionApi;
  quantity: number;
};

export type PaginatedProducts = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
};
