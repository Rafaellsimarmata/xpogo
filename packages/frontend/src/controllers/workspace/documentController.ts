'use client';

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { generateChecklist } from "@/src/lib/data/documents";
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
            name: trackedProduct.customName ?? fetchedProduct.name,
          }
        : {
            id: trackedProduct.id,
            name: trackedProduct.customName ?? trackedProduct.id,
            description: "Produk kustom dari pengguna.",
            hsCode: "-",
            category: "Kustom",
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

  const countryMeta = trackedProduct?.targetCountryId
    ? countries.find((country) => country.id === trackedProduct.targetCountryId)
    : undefined;

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

  // Parse compliance data and merge with static checklist
  const documents = useMemo(() => {
    if (!countryMeta) return [];

    // Get static checklist as base
    const staticChecklist = generateChecklist(productMeta.id, countryMeta.id);

    // If we have API data, parse and merge it
    if (complianceData?.content) {
      const apiDocuments = parseComplianceChecklist(complianceData.content);

      // Merge API documents with static ones, avoiding duplicates
      const merged = [...staticChecklist];
      apiDocuments.forEach((apiDoc) => {
        // Check if similar document already exists
        const exists = merged.some(
          (doc) =>
            doc.title.toLowerCase() === apiDoc.title.toLowerCase() ||
            doc.id === apiDoc.id
        );
        if (!exists) {
          merged.push(apiDoc);
        }
      });

      return merged;
    }

    return staticChecklist;
  }, [countryMeta, productMeta.id, complianceData]);

  const grouped = documents.reduce(
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
