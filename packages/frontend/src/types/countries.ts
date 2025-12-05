export interface CountryMatch {
  id: string;
  name: string;
  code: string;
  region: string;
  matchScore: number;
  score: number;
  readiness: string;
  importValue: string;
  gdp: string;
  population: string;
  estimatedTime: number;
  easeOfLogistics: string;
  tradeAgreements: string[];
  topImports: Array<{
    name: string;
    volume: string;
    growth: string;
  }>;
  businessTips: string[];
  contacts: Array<{
    office: string;
    phone: string;
    email: string;
  }>;
}