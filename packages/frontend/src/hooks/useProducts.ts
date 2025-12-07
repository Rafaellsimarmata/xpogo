import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProductById,
  fetchProductCategories,
  fetchProducts,
} from "@/src/services/productService";
import type { Product, ProductFilters } from "@/src/types/products";

const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_CATEGORIES: string[] = [];

const isEmptyFilters = (filters?: ProductFilters) =>
  !filters ||
  Object.values(filters).every((value) => value === undefined || value === null || value === "");

const buildListKey = (filters?: ProductFilters) => {
  if (isEmptyFilters(filters)) {
    return ["products"];
  }
  return ["products", filters];
};

type UseProductsOptions = {
  enabled?: boolean;
};

export const useProducts = (filters?: ProductFilters, options?: UseProductsOptions) => {
  const query = useQuery({
    queryKey: buildListKey(filters),
    queryFn: () => fetchProducts(filters),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const products = useMemo<Product[]>(() => {
    if (query.data) return query.data;
    return EMPTY_PRODUCTS;
  }, [query.data]);

  return {
    ...query,
    products,
  };
};

export const useProductCategories = () => {
  const query = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => fetchProductCategories(),
  });

  const categories = useMemo(() => query.data ?? EMPTY_CATEGORIES, [query.data]);

  return {
    ...query,
    categories,
  };
};

export const useProductDetails = (productId?: string) => {
  const query = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId ?? ""),
    enabled: Boolean(productId),
  });

  return {
    ...query,
    product: query.data ?? null,
  };
};
