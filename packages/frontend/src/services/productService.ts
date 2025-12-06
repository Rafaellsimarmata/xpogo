import { apiFetch } from "@/src/services/apiClient";
import type {
  Product,
  ProductApiRecord,
  ProductCategoryResponse,
  ProductDetailResponse,
  ProductFilters,
  ProductListResponse,
} from "@/src/types/products";

const buildQueryString = (filters?: ProductFilters) => {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  const query = params.toString();
  return query ? `?${query}` : "";
};

const normalizeProduct = (record: ProductApiRecord): Product => ({
  id: record.id,
  name: record.name,
  category: record.category,
  description: record.description,
  hsCode: record.hs_code,
  image: record.image,
  annualExportsUsd: record.annual_exports_usd,
  majorMarkets: record.major_markets ?? [],
  difficultyLevel: record.difficulty_level,
});

const unwrapList = (payload: ProductListResponse | ProductApiRecord[]): ProductApiRecord[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.data ?? [];
};

export const fetchProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const query = buildQueryString(filters);
  const payload = await apiFetch<ProductListResponse>(`api/products${query}`, {
    skipAuth: true,
  });
  return unwrapList(payload).map((product) => normalizeProduct(product));
};

export const fetchProductById = async (productId: string): Promise<Product> => {
  const payload = await apiFetch<ProductDetailResponse>(`api/products/${productId}`, {
    skipAuth: true,
  });
  return normalizeProduct(payload.data);
};

export const fetchProductCategories = async (): Promise<string[]> => {
  const payload = await apiFetch<ProductCategoryResponse>("api/products/categories/list", {
    skipAuth: true,
  });
  return payload.data ?? [];
};
