import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductInput } from "./types";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listMyProducts,
  listProducts,
  updateProduct,
} from "./client";

export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
  mine: () => [...productKeys.all, "mine"] as const,
};

export const productQueries = {
  list: () =>
    queryOptions({
      queryKey: productKeys.list(),
      queryFn: listProducts,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: productKeys.detail(id),
      queryFn: () => getProduct(id),
    }),
  mine: () =>
    queryOptions({
      queryKey: productKeys.mine(),
      queryFn: listMyProducts,
    }),
};

export function useProducts() {
  return useQuery(productQueries.list());
}

export function useProduct(id: number) {
  return useQuery({ ...productQueries.detail(id), enabled: Number.isFinite(id) });
}

export function useMyProducts(enabled = true) {
  return useQuery({ ...productQueries.mine(), enabled });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductInput) => createProduct(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<ProductInput>) => updateProduct(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
