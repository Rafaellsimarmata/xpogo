import { apiFetch } from "@/src/services/apiClient";

export interface ComplianceRequest {
  productName: string;
  origin?: string;
  destinationCountries?: string;
  productType?: string;
}

export interface ComplianceResponse {
  success: boolean;
  content: string;
  documentType: string;
  timestamp: string;
}

/**
 * Generate compliance checklist for export
 */
export const generateComplianceChecklist = async (
  data: ComplianceRequest
): Promise<ComplianceResponse> => {
  return apiFetch<ComplianceResponse>("/document-assistant/compliance", {
    method: "POST",
    body: data,
  });
};

