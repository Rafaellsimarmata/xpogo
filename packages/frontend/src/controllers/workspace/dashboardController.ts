'use client';

import { useEffect, useMemo, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import type { WorkspaceProduct } from "@/src/types/workspace";
import { ROUTES, WORKSPACE_MESSAGES, DEFAULT_PRODUCT_ID, DEFAULT_PRODUCT_NAME } from "@/src/constants";
import { useCountries } from "@/src/hooks/useCountries";
import { useProducts } from "@/src/hooks/useProducts";
import { useNews } from "@/src/hooks/useNews";
import type { Product } from "@/src/types/products";
import type { NewsFilters, NewsArticle, NewsListResponse } from "@/src/types/news";

const fallbackProductMeta: Product = {
  id: DEFAULT_PRODUCT_ID,
  name: DEFAULT_PRODUCT_NAME,
  category: "Agricultural",
  description: "Produk ekspor unggulan Indonesia.",
  hsCode: "-",
  annualExportsUsd: 0,
  majorMarkets: [],
  difficultyLevel: "Medium",
};

const resolveProductMeta = (workspaceProduct: WorkspaceProduct, catalog: Product[]) => {
  const product = catalog.find((item) => item.id === workspaceProduct.id);
  if (product) return product;
  return {
    ...fallbackProductMeta,
    id: workspaceProduct.id,
    name: workspaceProduct.customName ?? workspaceProduct.id,
  };
};

export const useDashboardController = () => {
  const router = useRouter();
  const { profile } = useUser();
  const { state, assignCountry, addProduct, removeProduct } = useWorkspaceStore();
  const {
    countries,
    isLoading: countriesLoading,
    error: countriesError,
  } = useCountries();
  const {
    products: productCatalog,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts();
  const [newsFilters, setNewsFilters] = useState<NewsFilters>({ limit: 4 });
  const {
    data: newsPayload,
    isLoading: newsLoading,
    isFetching: newsFetching,
    error: newsError,
    refetch: refetchNews,
  } = useNews(newsFilters);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [removeProductModalOpen, setRemoveProductModalOpen] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedCatalogProductId, setSelectedCatalogProductId] = useState("");
  const [productToRemove, setProductToRemove] = useState<WorkspaceProduct | null>(null);

  const trackedProducts = state.products;
  const focusProductId =
    profile.focusProduct ?? trackedProducts[0]?.id ?? productCatalog[0]?.id ?? DEFAULT_PRODUCT_ID;
  const orderedProducts = useMemo(() => {
    if (!focusProductId) return trackedProducts;
    const index = trackedProducts.findIndex((product) => product.id === focusProductId);
    if (index <= 0) return trackedProducts;
    const focus = trackedProducts[index];
    const remaining = trackedProducts.filter((_, idx) => idx !== index);
    return [focus, ...remaining];
  }, [trackedProducts, focusProductId]);

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        id: country.id,
        name: country.name,
      })),
    [countries],
  );

  useEffect(() => {
    if (countryOptions.length > 0 && !selectedCountryId) {
      startTransition(() => {
        setSelectedCountryId(countryOptions[0].id);
      });
    }
  }, [countryOptions, selectedCountryId]);

  const productCards = orderedProducts.map((workspaceProduct, index) => {
    const meta = resolveProductMeta(workspaceProduct, productCatalog);
    const targetCountry = workspaceProduct.targetCountryId
      ? countries.find((country) => country.id === workspaceProduct.targetCountryId)
      : undefined;
    return {
      workspace: workspaceProduct,
      meta,
      targetCountry,
      isFocus: index === 0,
    };
  });

  const defaultWorkspaceProduct: WorkspaceProduct = orderedProducts[0] ?? {
    id: productCatalog[0]?.id ?? DEFAULT_PRODUCT_ID,
  };

  const focusProduct = productCards[0] ?? {
    workspace: defaultWorkspaceProduct,
    meta: resolveProductMeta(defaultWorkspaceProduct, productCatalog),
    targetCountry: defaultWorkspaceProduct.targetCountryId
      ? countries.find((country) => country.id === defaultWorkspaceProduct.targetCountryId)
      : undefined,
  };

  const countryMatches = useMemo(
    () => [...countries].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4),
    [countries],
  );

  const focusCountryId = focusProduct.workspace.targetCountryId ?? profile.targetCountry;

  const primaryCountry = focusCountryId
    ? countries.find((country) => country.id === focusCountryId) ?? countryMatches[0]
    : countryMatches[0];

  const startExportFlow = (productId: string) => {
    const tracked = trackedProducts.find((product) => product.id === productId);
    if (tracked?.targetCountryId) {
      router.push(`${ROUTES.workspace.documents}?product=${productId}`);
      return;
    }
    setPendingProductId(productId);
    if (countryOptions.length > 0) {
      setSelectedCountryId(countryOptions[0].id);
    }
    setExportModalOpen(true);
  };

  const handleExportDecision = (proceedWithoutAnalysis: boolean) => {
    if (!pendingProductId) return;
    if (proceedWithoutAnalysis) {
      setExportModalOpen(false);
      setCountryModalOpen(true);
      return;
    }
    setExportModalOpen(false);
    router.push(`${ROUTES.workspace.marketAnalysis}?product=${pendingProductId}`);
  };

  const submitCountrySelection = () => {
    if (!pendingProductId || !selectedCountryId) return;
    assignCountry(pendingProductId, selectedCountryId);
    setCountryModalOpen(false);
    router.push(`${ROUTES.workspace.documents}?product=${pendingProductId}`);
  };

  const startAnalysis = (productId: string, productName?: string) => {
    const params = new URLSearchParams({ product: productId });
    if (productName) {
      params.set("name", productName);
    }
    router.push(`${ROUTES.workspace.marketAnalysis}?${params.toString()}`);
  };

  const availableCatalogProducts = useMemo(
    () =>
      productCatalog.filter(
        (product) => !trackedProducts.some((workspaceProduct) => workspaceProduct.id === product.id),
      ),
    [productCatalog, trackedProducts],
  );

  const addProductOptions = availableCatalogProducts.map((product) => ({
    id: product.id,
    name: product.name,
  }));

  const openAddProductModal = () => {
    const fallback = addProductOptions[0]?.id ?? "";
    setSelectedCatalogProductId(fallback);
    setAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setAddProductModalOpen(false);
    setSelectedCatalogProductId("");
  };

  const submitAddProduct = () => {
    if (!selectedCatalogProductId) return;
    const product = productCatalog.find((item) => item.id === selectedCatalogProductId);
    if (!product) return;
    addProduct(product.id, product.name);
    setAddProductModalOpen(false);
    setSelectedCatalogProductId("");
  };

  const requestRemoveProduct = (productId: string) => {
    if (trackedProducts.length <= 1) {
      return;
    }
    const workspaceProduct = trackedProducts.find((product) => product.id === productId);
    if (!workspaceProduct) return;
    setProductToRemove(workspaceProduct);
    setRemoveProductModalOpen(true);
  };

  const confirmRemoveProduct = () => {
    if (!productToRemove) return;
    removeProduct(productToRemove.id);
    setRemoveProductModalOpen(false);
    setProductToRemove(null);
  };

  const closeRemoveProductModal = () => {
    setRemoveProductModalOpen(false);
    setProductToRemove(null);
  };

const productToRemoveMeta = productToRemove
  ? resolveProductMeta(productToRemove, productCatalog)
  : null;

const newsProductOptions = useMemo(() => {
  const seen = new Map<string, string>();
  productCatalog.forEach((product) => {
    if (!seen.has(product.id)) {
      seen.set(product.id, product.name);
    }
  });
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
}, [productCatalog]);

  const resolvedNewsPayload = newsPayload as NewsListResponse | undefined;
  const newsItems = (resolvedNewsPayload?.data ?? []) as NewsArticle[];
  const newsMeta = {
    category: resolvedNewsPayload?.category,
    timestamp: resolvedNewsPayload?.timestamp,
  };

  const setNewsCategory = (category?: string) => {
    setNewsFilters((prev) => ({
      ...prev,
      category: category || undefined,
    }));
  };

  const setNewsCountry = (country: string) => {
    setNewsFilters((prev) => ({
      ...prev,
      country: country || undefined,
    }));
  };

  const setNewsProductType = (productType: string) => {
    setNewsFilters((prev) => ({
      ...prev,
      productType: productType || undefined,
    }));
  };

  return {
    profile,
    productCards,
    countryMatches,
    countriesLoading,
    countriesError: countriesError instanceof Error ? countriesError.message : null,
    primaryCountry,
    newsItems,
    newsLoading,
    newsRefreshing: newsFetching && !newsLoading,
    newsError: newsError instanceof Error ? newsError.message : null,
    newsMeta,
    countryOptions,
    productsLoading,
    productsError: productsError instanceof Error ? productsError.message : null,
    canRemoveProducts: trackedProducts.length > 1,
    addProductOptions,
    newsFilters,
    newsProductOptions,
    modals: {
      export: exportModalOpen,
      countrySelect: countryModalOpen,
      addProduct: addProductModalOpen,
      removeProduct: removeProductModalOpen,
    },
    selectedCountryId,
    setSelectedCountryId,
    selectedCatalogProductId,
    setSelectedCatalogProductId,
    productPendingRemoval: productToRemoveMeta,
    actions: {
      startExportFlow,
      handleExportDecision,
      submitCountrySelection,
      startAnalysis,
      openAddProductModal,
      closeAddProductModal,
      submitAddProduct,
      requestRemoveProduct,
      confirmRemoveProduct,
      closeRemoveProductModal,
      setNewsCategory,
      setNewsCountry,
      setNewsProductType,
      refreshNews: () => refetchNews(),
      closeExportModal: () => setExportModalOpen(false),
      closeCountryModal: () => setCountryModalOpen(false),
    },
    messages: WORKSPACE_MESSAGES,
  };
};
