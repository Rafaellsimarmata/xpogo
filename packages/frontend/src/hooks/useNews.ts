import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/src/services/newsService";
import type { NewsFilters, NewsListResponse } from "@/src/types/news";

const buildNewsQueryKey = (filters?: NewsFilters) => [
  "news",
  filters?.category ?? null,
  filters?.country ?? null,
  filters?.productType ?? null,
  filters?.limit ?? null,
];

export const useNews = (filters?: NewsFilters) =>
  useQuery<NewsListResponse>({
    queryKey: buildNewsQueryKey(filters),
    queryFn: () => fetchNews(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
