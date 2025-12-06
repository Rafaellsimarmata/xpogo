export type UserProductStatus = "active" | "archived";

export type UserProductRecord = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  category: string;
  hs_code: string;
  target_country_id?: string | null;
  target_country_name?: string | null;
  status: UserProductStatus;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type UserProductListResponse = {
  success: boolean;
  count?: number;
  data: UserProductRecord[];
};

export type UserProductStatsResponse = {
  success: boolean;
  data: {
    total: number;
    active: number;
    archived: number;
  };
};

export type UserProductResponse = {
  success: boolean;
  data: UserProductRecord;
};

export type UserProductPayload = {
  name: string;
  description?: string;
  category?: string;
  hsCode?: string;
  targetCountryId?: string;
  targetCountryName?: string;
  status?: UserProductStatus;
  metadata?: Record<string, unknown>;
};

export type UserProduct = {
  userProductId: string;
  baseProductId: string;
  name: string;
  description?: string;
  category?: string;
  hsCode?: string;
  targetCountryId?: string;
  targetCountryName?: string;
  status: UserProductStatus;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};
