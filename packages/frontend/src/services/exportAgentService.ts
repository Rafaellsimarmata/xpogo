import { apiFetch } from "./apiClient";

export interface ExportAgent {
  id: number | string;
  name: string;
  company_name?: string;
  contact_person?: string;
  specialization: string;
  category: string;
  city?: string;
  phone?: string;
  email?: string;
  location?: string;
  verified?: boolean;
  rating?: number;
  description?: string;
}

export interface GetAgentsResponse {
  success: boolean;
  data: ExportAgent[];
  error?: string;
}


export const getExportAgentsByCategory = async (
  category: string
): Promise<ExportAgent[]> => {
  if (!category) return [];

  try {
    const response = await apiFetch<GetAgentsResponse>(
      `/api/export-agents?category=${encodeURIComponent(category)}`,
      {
        method: "GET",
        skipAuth: true,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching export agents:", error);
    return [];
  }
};

/**
 * Fetch all export agents
 */
export const getAllExportAgents = async (): Promise<ExportAgent[]> => {
  try {
    const response = await apiFetch<GetAgentsResponse>(
      "/api/export-agents",
      {
        method: "GET",
        skipAuth: true,
      }
    );

    if (response.success && response.data) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching export agents:", error);
    return [];
  }
};
