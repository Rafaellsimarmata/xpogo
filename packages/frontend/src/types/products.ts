export type ProductDifficultyLevel = "Low" | "Medium" | "High" | (string & {});

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  hsCode: string;
  image?: string;
  annualExportsUsd: number;
  majorMarkets: string[];
  difficultyLevel: ProductDifficultyLevel;
};

export type ProductFilters = {
  category?: string;
  search?: string;
  difficulty?: string;
};

export type ProductApiRecord = {
  id: string;
  name: string;
  category: string;
  description: string;
  hs_code: string;
  image?: string;
  annual_exports_usd: number;
  major_markets: string[];
  difficulty_level: string;
};

export type ProductListResponse = {
  success: boolean;
  count: number;
  data: ProductApiRecord[];
};

export type ProductDetailResponse = {
  success: boolean;
  data: ProductApiRecord;
};

export type ProductCategoryResponse = {
  success: boolean;
  count: number;
  data: string[];
};
