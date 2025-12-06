import { apiFetch } from "@/src/services/apiClient";
import type {
  UserProduct,
  UserProductListResponse,
  UserProductPayload,
  UserProductRecord,
  UserProductResponse,
  UserProductStatsResponse,
  UserProductStatus,
} from "@/src/types/userProducts";

type FetchUserProductOptions = {
  status?: UserProductStatus;
};

const normalizeUserProduct = (record: UserProductRecord): UserProduct => {
  const metadata = record.metadata ?? {};
  const baseProductId =
    (typeof metadata?.baseProductId === "string" && metadata.baseProductId) ||
    (typeof (metadata as { baseProductId?: string }).baseProductId === "string" &&
      (metadata as { baseProductId?: string }).baseProductId) ||
    String(record.id);

  return {
    userProductId: String(record.id),
    baseProductId,
    name: record.name,
    description: record.description,
    category: record.category,
    hsCode: record.hs_code,
    targetCountryId: record.target_country_id ?? undefined,
    targetCountryName: record.target_country_name ?? undefined,
    status: record.status,
    metadata,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
};

const withToken = (token?: string | null) => (token ? { tokenOverride: token } : {});

export const fetchUserProducts = async (
  options: FetchUserProductOptions = {},
  token?: string | null,
): Promise<UserProduct[]> => {
  const params = new URLSearchParams();
  if (options.status) {
    params.set("status", options.status);
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  const payload = await apiFetch<UserProductListResponse>(`api/user/products${query}`, {
    ...withToken(token),
  });
  const records = payload.data ?? [];
  return records.map((record) => normalizeUserProduct(record));
};

export const fetchUserProductStats = async (token?: string | null) => {
  const payload = await apiFetch<UserProductStatsResponse>("api/user/products/stats", {
    ...withToken(token),
  });
  return payload.data;
};

export const createUserProduct = async (
  payload: UserProductPayload,
  token?: string | null,
): Promise<UserProduct> => {
  const response = await apiFetch<UserProductResponse>("api/user/products", {
    method: "POST",
    body: payload,
    ...withToken(token),
  });
  return normalizeUserProduct(response.data);
};

export const updateUserProduct = async (
  userProductId: string,
  payload: UserProductPayload,
  token?: string | null,
): Promise<UserProduct> => {
  const response = await apiFetch<UserProductResponse>(`api/user/products/${userProductId}`, {
    method: "PUT",
    body: payload,
    ...withToken(token),
  });
  return normalizeUserProduct(response.data);
};

export const deleteUserProduct = async (userProductId: string, token?: string | null) => {
  await apiFetch<unknown>(`api/user/products/${userProductId}`, {
    method: "DELETE",
    ...withToken(token),
  });
};
