import { apiFetch } from "@/src/services/apiClient";
import type { CountryMatch, Contact, TopImport, TradeAgreement } from "@/src/types/countries";

export type CountryFilters = {
  region?: string;
  search?: string;
};

type CountryApiRecord = Partial<CountryMatch> & {
  code?: string;
  slug?: string;
  readiness?: string;
};

type CountryListResponse =
  | CountryApiRecord[]
  | {
      data?: CountryApiRecord[];
      countries?: CountryApiRecord[];
    };

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureArray = <T>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : []);

const normalizeCountryRecord = (record: CountryApiRecord, index: number): CountryMatch => {
  const baseName = record.name ?? record.code ?? `Negara ${index + 1}`;
  const baseCode = (record.code ?? record.id ?? baseName.substring(0, 2)).toString().toUpperCase();
  const slug =
    record.slug ??
    record.id ??
    (slugify(baseName) || slugify(baseCode.toLowerCase()) || `country-${index + 1}`);
  const tradeAgreements = ensureArray<TradeAgreement>(record.tradeAgreements);
  const topImports = ensureArray<TopImport>(record.topImports);
  const businessTips = ensureArray(record.businessTips);
  const contacts = ensureArray<Contact>(record.contacts);

  const readiness = record.readiness ?? "Data belum tersedia";
  const matchScore = record.matchScore ?? record.score ?? 0;
  const score = record.score ?? matchScore;

  return {
    ...record,
    id: slug,
    name: baseName,
    code: baseCode,
    region: record.region ?? "Unknown",
    matchScore,
    score,
    readiness,
    importValue: record.importValue ?? "-",
    gdp: record.gdp ?? "-",
    population: record.population ?? "-",
    estimatedTime: record.estimatedTime ?? 0,
    easeOfLogistics: record.easeOfLogistics ?? "Informasi logistik belum tersedia.",
    tradeAgreements,
    topImports,
    businessTips,
    contacts,
    stores: record.stores,
  };
};

const normalizeCountryPayload = (payload: CountryListResponse): CountryMatch[] => {
  if (Array.isArray(payload)) {
    return payload.map((country, index) => normalizeCountryRecord(country, index));
  }

  const list = payload.countries ?? payload.data ?? [];
  return list.map((country, index) => normalizeCountryRecord(country, index));
};

const createQueryString = (filters?: CountryFilters) => {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.region) params.set("region", filters.region);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const fetchCountries = async (filters?: CountryFilters) => {
  const query = createQueryString(filters);
  const response = await apiFetch<CountryListResponse>(`api/countries${query}`, {
    skipAuth: true,
  });
  return normalizeCountryPayload(response);
};

export const fetchCountryByCode = (code: string) =>
  apiFetch<CountryApiRecord>(`api/countries/${code}`, {
    skipAuth: true,
  }).then((record) => normalizeCountryRecord(record, 0));
