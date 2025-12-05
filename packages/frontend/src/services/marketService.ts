import { apiFetch } from "@/src/services/apiClient";
import type {
  MarketAnalysisResponse,
  MarketParseResponse,
} from "@/src/types/market";

export const analyzeMarket = (productName: string, token?: string | null) =>
  apiFetch<MarketAnalysisResponse>("market-intelligence/analyze", {
    method: "POST",
    body: { productName },
    tokenOverride: token ?? undefined,
  });

export const parseMarketData = (aiResponse: string, token?: string | null) =>
  apiFetch<MarketParseResponse>("market-intelligence/parse-data", {
    method: "POST",
    body: { aiResponse },
    tokenOverride: token ?? undefined,
  });
