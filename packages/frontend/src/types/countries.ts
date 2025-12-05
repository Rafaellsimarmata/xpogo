export type TradeAgreement = string;

export type TopImport = {
  name: string;
  volume: string;
  growth: string;
};

export type StoreOption = {
  id: string;
  name: string;
  rating: number;
  specialization: string;
  contact: string;
  location: string;
  ready?: boolean;
};

export type BusinessTip = string;

export type Contact = {
  office: string;
  phone: string;
  email: string;
};

export type CountryMatch = {
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
  tradeAgreements: TradeAgreement[];
  topImports: TopImport[];
  businessTips: BusinessTip[];
  contacts: Contact[];
  stores?: StoreOption[];
};
