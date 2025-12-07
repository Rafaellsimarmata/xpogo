import { useQuery } from "@tanstack/react-query";
import { getExportAgentsByCategory } from "@/src/services/exportAgentService";
import type { ExportAgent } from "@/src/services/exportAgentService";

export const useExportAgents = (category?: string) => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["exportAgents", category],
    queryFn: async () => {
      if (!category) return [];
      return getExportAgentsByCategory(category);
    },
    enabled: Boolean(category),
    staleTime: 1000 * 60 * 60, 
  });

  return {
    agents: data as ExportAgent[],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
