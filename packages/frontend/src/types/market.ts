export interface MarketProduct {
  name: string;
  hsCode?: string;
  description?: string;
  marketIntelligence: string;
}

export interface CountryData {
  id: string;
  name: string;
  productionVolume: string;
  importVolume: string;
  exportVolume: string;
  marketGrowthRate: string;
  keyTradePartners: string;
}

export interface ParsedCountryRow {
  country: string;
  productionVolume: string;
  importVolume: string;
  exportVolume: string;
  marketGrowthRate: string;
  keyTradePartners: string;
}

export interface MarketAnalysisResponse {
  product: string;
  marketIntelligence: string;
}

export interface MarketParseResponse {
  parsedData: ParsedCountryRow[];
}

export type LookupState = "idle" | "loading" | "not-found" | "empty";
