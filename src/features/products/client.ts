import { apiRequest } from "@/features/auth/client";
import type { UserProfile } from "@/features/auth/types";
import type { PaginatedProducts, Product, ProductInput } from "./types";

export function canManageProducts(user: UserProfile | null | undefined): boolean {
  if (!user) return false;
  return user.role === "seller" || user.role === "admin";
}

function unwrapProductList(data: Product[] | PaginatedProducts): Product[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function listProducts(): Promise<Product[]> {
  const data = await apiRequest<Product[] | PaginatedProducts>("/api/products/", {
    method: "GET",
    auth: false,
  });
  return unwrapProductList(data);
}

export async function getProduct(id: number): Promise<Product> {
  return apiRequest<Product>(`/api/products/${id}/`, { method: "GET", auth: false });
}

export async function listMyProducts(): Promise<Product[]> {
  const data = await apiRequest<Product[] | PaginatedProducts>("/api/products/my/", {
    method: "GET",
  });
  return unwrapProductList(data);
}

export async function createProduct(body: ProductInput): Promise<Product> {
  return apiRequest<Product>("/api/products/", { method: "POST", body });
}

export async function updateProduct(id: number, body: Partial<ProductInput>): Promise<Product> {
  return apiRequest<Product>(`/api/products/${id}/`, { method: "PATCH", body });
}

export async function deleteProduct(id: number): Promise<void> {
  await apiRequest(`/api/products/${id}/`, { method: "DELETE" });
}
