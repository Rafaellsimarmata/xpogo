"use client";

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { analyzeMarket, parseMarketData } from "@/src/services/marketService";
import type {
  CountryData,
  MarketProduct,
  ParsedCountryRow,
} from "@/src/types/market";

type LookupVariables = {
  productQuery: string;
  authToken?: string | null;
};

type MarketLookupResult = {
  product: MarketProduct;
  countries: CountryData[];
};

const cleanMarketSection = (marketText: string) => {
  const stopMarker = "## 3. VISUALIZATION DATA";
  const markerIndex = marketText.indexOf(stopMarker);
  if (markerIndex === -1) {
    return marketText.trim();
  }
  return marketText.substring(0, markerIndex).trim();
};

const formatCountries = (rows: ParsedCountryRow[]): CountryData[] =>
  rows
    .filter((row) => row.country !== "---------")
    .map((row) => ({
      id: row.country.toLowerCase().replace(/\s+/g, "-"),
      name: row.country,
      productionVolume: row.productionVolume,
      importVolume: row.importVolume,
      exportVolume: row.exportVolume,
      marketGrowthRate: row.marketGrowthRate,
      keyTradePartners: row.keyTradePartners,
    }));

export const useMarketAnalysis = () => {
  const { token } = useAuth();

  const {
    mutateAsync,
    data,
    isPending,
    error,
    reset,
  } = useMutation({
    mutationFn: async ({ productQuery, authToken }: LookupVariables) => {
      if (!authToken) {
        throw new Error("Sesi Anda berakhir, silakan login ulang.");
      }

      const analysis = await analyzeMarket(productQuery, authToken);
      const product: MarketProduct = {
        name: analysis.product,
        marketIntelligence: cleanMarketSection(analysis.marketIntelligence),
      };

      const parsed = await parseMarketData(analysis.marketIntelligence, authToken);
      const countries = formatCountries(parsed.parsedData);
      return { product, countries } satisfies MarketLookupResult;
    },
  });

  const lookupProduct = useCallback(
    (productQuery: string) =>
      mutateAsync({ productQuery, authToken: token }),
    [mutateAsync, token],
  );

  return {
    lookupProduct,
    data: data ?? null,
    isLoading: isPending,
    error: error instanceof Error ? error.message : null,
    reset,
  };
};
