'use client';

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { generateChecklist } from "@/src/lib/data/documents";
import { products } from "@/src/lib/data/products";
import { countries } from "@/src/lib/data/countries";
import { useWorkspaceStore } from "@/src/store/workspaceStore";

export const useDocumentCenterController = () => {
  const searchParams = useSearchParams();
  const productQuery = searchParams?.get("product");
  const { state } = useWorkspaceStore();

  const trackedProduct = productQuery
    ? state.products.find((product) => product.id === productQuery)
    : state.products[0];

  const productMeta =
    (trackedProduct &&
      (products.find((product) => product.id === trackedProduct.id) ?? {
        id: trackedProduct.id,
        name: trackedProduct.customName ?? trackedProduct.id,
      })) ??
    products[0];

  const countryMeta = trackedProduct?.targetCountryId
    ? countries.find((country) => country.id === trackedProduct.targetCountryId)
    : undefined;

  const documents = useMemo(() => {
    if (!countryMeta) return [];
    return generateChecklist(productMeta.id, countryMeta.id);
  }, [countryMeta, productMeta.id]);

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
  };
};
