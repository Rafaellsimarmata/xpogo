'use client';

import { FormEvent, useEffect, useState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { LookupState } from "@/src/types/market";
import { useMarketAnalysis } from "@/src/hooks/useMarketAnalysis";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { ROUTES, WORKSPACE_MESSAGES, DEFAULT_PRODUCT_ID, DEFAULT_PRODUCT_NAME } from "@/src/constants";
import { useProducts } from "@/src/hooks/useProducts";

export const useMarketAnalysisController = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lookupProduct, data, isLoading, error } = useMarketAnalysis();
  const { state, assignCountry } = useWorkspaceStore();
  const { products: productCatalog } = useProducts();
  const [productQuery, setProductQuery] = useState("");
  const [lookupState, setLookupState] = useState<LookupState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const fallbackProductId = productCatalog[0]?.id ?? state.products[0]?.id ?? DEFAULT_PRODUCT_ID;

  const activeProductId =
    searchParams?.get("product") ?? state.activeProductId ?? state.products[0]?.id ?? fallbackProductId;
  const customNameParam = searchParams?.get("name") ?? "";

  const trackedProduct = state.products.find((product) => product.id === activeProductId);

  const productMeta =
    productCatalog.find((product) => product.id === activeProductId) ??
    (trackedProduct
      ? { id: trackedProduct.id, name: trackedProduct.customName ?? trackedProduct.id }
      : productCatalog[0] ?? { id: fallbackProductId, name: DEFAULT_PRODUCT_NAME });

  useEffect(() => {
    if (customNameParam) {
      startTransition(() => {
        setProductQuery(customNameParam);
      });
      return;
    }
    if (productMeta?.name) {
      startTransition(() => {
        setProductQuery(productMeta.name);
      });
    }
  }, [customNameParam, productMeta?.name]);

  useEffect(() => {
    if (data?.countries?.length && !selectedCountryId) {
      startTransition(() => {
        setSelectedCountryId(data.countries[0].id);
      });
    }
  }, [data?.countries, selectedCountryId]);

  const onLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productQuery.trim()) {
      setLookupState("empty");
      setErrorMessage(WORKSPACE_MESSAGES.missingProduct);
      return;
    }

    setLookupState("loading");
    setErrorMessage(null);

    try {
      await lookupProduct(productQuery);
      setLookupState("idle");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Produk belum ditemukan, coba istilah lain.";
      setLookupState("not-found");
      setErrorMessage(message);
    }
  };

  const recommendedCountries = data?.countries ?? [];
  const selectedCountry = recommendedCountries.find(
    (country) => country.id === selectedCountryId,
  );

  const handleSaveCountry = () => {
    if (!activeProductId || !selectedCountryId) {
      setErrorMessage(WORKSPACE_MESSAGES.missingCountry);
      return;
    }
    assignCountry(activeProductId, selectedCountryId);
    router.push(ROUTES.workspace.dashboard);
  };

  return {
    productQuery,
    setProductQuery,
    onLookup,
    lookupState,
    errorMessage: errorMessage ?? error,
    isLoading,
    analysisResult: data?.product ?? null,
    recommendedCountries,
    selectedCountryId,
    setSelectedCountryId,
    selectedCountry,
    handleSaveCountry,
    productMeta,
    messages: WORKSPACE_MESSAGES,
  };
};
