'use client';

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { useCountries } from "@/src/hooks/useCountries";
import { generateComplianceChecklist } from "@/src/services/documentAssistantService";
import { parseComplianceChecklist } from "@/src/lib/utils/parseCompliance";
import { useProductDetails } from "@/src/hooks/useProducts";
import { DEFAULT_PRODUCT_ID, DEFAULT_PRODUCT_NAME } from "@/src/constants";

export const useDocumentCenterController = () => {
  const searchParams = useSearchParams();
  const productQuery = searchParams?.get("product");
  const { state } = useWorkspaceStore();
  const { countries, isLoading: countriesLoading } = useCountries();
  const trackedProduct = productQuery
    ? state.products.find((product) => product.id === productQuery)
    : state.products[0];

  const {
    product: fetchedProduct,
    isLoading: productLoading,
    error: productError,
  } = useProductDetails(trackedProduct?.id);

  const productMeta =
    (trackedProduct &&
      (fetchedProduct
        ? {
            ...fetchedProduct,
            name: trackedProduct.name ?? fetchedProduct.name,
            description: trackedProduct.description ?? fetchedProduct.description,
          }
        : {
            id: trackedProduct.id,
            name: trackedProduct.name ?? trackedProduct.id,
            description: trackedProduct.description ?? "Produk kustom dari pengguna.",
            hsCode: trackedProduct.hsCode ?? "-",
            category: trackedProduct.category ?? "Kustom",
            difficultyLevel: "Data belum tersedia",
            majorMarkets: [],
          })) ??
    (fetchedProduct ?? {
      id: DEFAULT_PRODUCT_ID,
      name: DEFAULT_PRODUCT_NAME,
      hsCode: "-",
      category: "Produk unggulan",
      difficultyLevel: "Medium",
      majorMarkets: [],
    });

  const countryMeta = useMemo(() => {
    if (!trackedProduct) return undefined;
    if (trackedProduct.targetCountryId) {
      const matched = countries.find((country) => country.id === trackedProduct.targetCountryId);
      if (matched) {
        return matched;
      }
      if (trackedProduct.targetCountryName) {
        return {
          id: trackedProduct.targetCountryId,
          name: trackedProduct.targetCountryName,
          matchScore: 0,
          score: 0,
          readiness: "-",
          importValue: "-",
          gdp: "-",
          population: "-",
          estimatedTime: 0,
          easeOfLogistics: "-",
          tradeAgreements: [],
          topImports: [],
          businessTips: [],
          contacts: [],
          code: trackedProduct.targetCountryId,
          region: "-",
          stores: [],
        };
      }
    }
    return undefined;
  }, [trackedProduct, countries]);

  // Fetch compliance checklist from API when product and country are available
  const { data: complianceData, isLoading: complianceLoading, error: complianceError } = useQuery({
    queryKey: ["compliance", productMeta.name, countryMeta?.name],
    queryFn: async () => {
      if (!productMeta.name || !countryMeta) {
        return null;
      }
      return generateComplianceChecklist({
        productName: productMeta.name,
        origin: "Indonesia",
        destinationCountries: countryMeta.name,
        productType: productMeta.id,
      });
    },
    enabled: Boolean(productMeta.name && countryMeta),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Parse compliance data from API only
  const documents = useMemo(() => {
    if (!countryMeta) return [];

    // Only use API data
    if (complianceData?.content) {
      return parseComplianceChecklist(complianceData.content);
    }

    // Return empty array if no API data available
    return [];
  }, [countryMeta, complianceData]);

  const grouped = documents.reduce<Record<string, number>>(
    (acc, doc) => {
      acc[doc.status] = acc[doc.status] + 1;
      return acc;
    },
    { complete: 0, "in-progress": 0, pending: 0 },
  );

  const serviceProviders =
    countryMeta?.contacts?.map((contact) => ({
      id: contact.office,
      title: contact.office,
      subtitle: contact.phone,
      description: contact.email,
    })) ?? [];

  return {
    product: productMeta,
    country: countryMeta,
    documents,
    grouped,
    serviceProviders,
    countriesLoading,
    complianceLoading,
    complianceError,
    productLoading,
    productError: productError instanceof Error ? productError.message : null,
  };
};
