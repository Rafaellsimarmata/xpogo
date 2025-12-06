import { apiFetch } from "@/src/services/apiClient";
import type { NewsFilters, NewsListResponse } from "@/src/types/news";

const buildQuery = (filters?: NewsFilters) => {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.country) params.set("country", filters.country);
  if (filters.productType) params.set("productType", filters.productType);
  if (filters.limit) params.set("limit", String(filters.limit));
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const fetchNews = (filters?: NewsFilters) => {
  const query = buildQuery(filters);
  return apiFetch<NewsListResponse>(`api/news${query}`);
};
