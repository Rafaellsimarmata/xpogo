export type NewsCategory =
  | "regulations"
  | "market-insights"
  | "programs"
  | "events"
  | (string & {});

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  tag?: string;
  date?: string;
  source?: string;
  sourceUrl?: string;
};

export type NewsFilters = {
  category?: NewsCategory;
  country?: string;
  productType?: string;
  limit?: number;
};

export type NewsListResponse = {
  success: boolean;
  count: number;
  category?: string;
  filters?: {
    country?: string;
    productType?: string;
  };
  data: NewsArticle[];
  timestamp: string;
};
