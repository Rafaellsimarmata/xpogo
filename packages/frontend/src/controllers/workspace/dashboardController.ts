'use client';

import { useEffect, useMemo, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { countries } from "@/src/lib/data/countries";
import { products } from "@/src/lib/data/products";
import { useUser } from "@/src/context/UserContext";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import type { WorkspaceProduct } from "@/src/types/workspace";
import { ROUTES, WORKSPACE_MESSAGES } from "@/src/constants";

const normalizeProductMeta = (workspaceProduct: WorkspaceProduct) => {
  const product = products.find((item) => item.id === workspaceProduct.id);
  if (product) return product;
  return {
    id: workspaceProduct.id,
    name: workspaceProduct.customName ?? workspaceProduct.id,
    description: "Produk kustom dari pengguna.",
  };
};

const getCountryMeta = (countryId?: string) =>
  countryId ? countries.find((country) => country.id === countryId) : undefined;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export const useDashboardController = () => {
  const router = useRouter();
  const { profile } = useUser();
  const { state, assignCountry, addProduct } = useWorkspaceStore();

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string>(countries[0]?.id ?? "");
  const [newProductName, setNewProductName] = useState("");

  const trackedProducts = state.products;

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        id: country.id,
        name: country.name,
      })),
    [],
  );

  useEffect(() => {
    if (countryOptions.length > 0 && !selectedCountryId) {
      startTransition(() => {
        setSelectedCountryId(countryOptions[0].id);
      });
    }
  }, [countryOptions, selectedCountryId]);

  const productCards = trackedProducts.map((workspaceProduct) => {
    const meta = normalizeProductMeta(workspaceProduct);
    const targetCountry = getCountryMeta(workspaceProduct.targetCountryId);
    return {
      workspace: workspaceProduct,
      meta,
      targetCountry,
    };
  });

  const focusProduct = productCards[0] ?? {
    workspace: trackedProducts[0] ?? ({ id: products[0].id } as WorkspaceProduct),
    meta: normalizeProductMeta(trackedProducts[0] ?? { id: products[0].id }),
    targetCountry: getCountryMeta(trackedProducts[0]?.targetCountryId),
  };

  const countryMatches = useMemo(
    () => [...countries].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4),
    [],
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

  const startAnalysis = (productId: string) => {
    router.push(`${ROUTES.workspace.marketAnalysis}?product=${productId}`);
  };

  const openAddProductModal = () => {
    setAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setAddProductModalOpen(false);
    setNewProductName("");
  };

  const submitAddProduct = () => {
    const trimmed = newProductName.trim();
    if (!trimmed) return;
    const slug = slugify(trimmed) || `produk-${Date.now()}`;
    addProduct(slug, trimmed);
    setAddProductModalOpen(false);
    setNewProductName("");
    router.push(
      `${ROUTES.workspace.marketAnalysis}?product=${slug}&name=${encodeURIComponent(trimmed)}`,
    );
  };

  const newsItems = [
    {
      title: "Update Kuota Ekspor Kopi ke Jepang 2025",
      summary:
        "Kementerian Perdagangan merilis kuota baru untuk ekspor kopi specialty ke Jepang dengan tambahan 15%.",
      tag: "Regulasi",
      date: "5 Des 2025",
    },
    {
      title: "Subsidi Logistik Laut untuk UMKM",
      summary:
        "Program subsidi logistik laut tahap III dibuka hingga Januari 2026, prioritas rute Asia Timur.",
      tag: "Program",
      date: "3 Des 2025",
    },
    {
      title: "Permintaan Produk Kerajinan di Dubai",
      summary:
        "ITPC Dubai mencatat kenaikan permintaan produk kayu ringan sebesar 28% menjelang Expo Timur Tengah.",
      tag: "Market Insight",
      date: "1 Des 2025",
    },
    {
      title: "Workshop Packaging untuk Pasar UE",
      summary:
        "Atase Perdagangan Brussels mengadakan workshop daring mengenai standar kemasan UE untuk produk pangan.",
      tag: "Event",
      date: "29 Nov 2025",
    },
  ];

  return {
    profile,
    productCards,
    countryMatches,
    primaryCountry,
    newsItems,
    countryOptions,
    modals: {
      export: exportModalOpen,
      countrySelect: countryModalOpen,
      addProduct: addProductModalOpen,
    },
    selectedCountryId,
    setSelectedCountryId,
    newProductName,
    setNewProductName,
    actions: {
      startExportFlow,
      handleExportDecision,
      submitCountrySelection,
      startAnalysis,
      openAddProductModal,
      closeAddProductModal,
      submitAddProduct,
      closeExportModal: () => setExportModalOpen(false),
      closeCountryModal: () => setCountryModalOpen(false),
    },
    messages: WORKSPACE_MESSAGES,
  };
};
