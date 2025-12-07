import { useQuery } from "@tanstack/react-query";
import { fetchCountries, type CountryFilters } from "@/src/services/countryService";
import type { CountryMatch } from "@/src/types/countries";

const buildKey = (filters?: CountryFilters) => {
  if (!filters || (Object.keys(filters).length === 0 && filters.constructor === Object)) {
    return ["countries"];
  }

  return ["countries", filters];
};

export const useCountries = (filters?: CountryFilters) => {
  const query = useQuery({
    queryKey: buildKey(filters),
    queryFn: () => fetchCountries(filters),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30, 
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    countries: (query.data ?? []) as CountryMatch[],
  };
};
