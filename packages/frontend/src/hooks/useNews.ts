import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/src/services/newsService";
import type { NewsFilters, NewsListResponse } from "@/src/types/news";

export const useNews = (filters?: NewsFilters) =>
  useQuery<NewsListResponse>({
    queryKey: ["news", filters],
    queryFn: () => fetchNews(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: (previous) => previous,
  });
