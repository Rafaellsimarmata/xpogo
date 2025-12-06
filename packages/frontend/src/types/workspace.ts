export type WorkspaceProduct = {
  id: string; // Base catalog product ID
  userProductId: string;
  name: string;
  description?: string;
  category?: string;
  hsCode?: string;
  targetCountryId?: string;
  targetCountryName?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};
