"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { ROUTES, DEFAULT_PRODUCT_ID, DEFAULT_PRODUCT_NAME } from "@/src/constants";
import { useProducts } from "@/src/hooks/useProducts";

type ProfileFormValues = {
  fullName: string;
  username: string;
  company: string;
  focusProduct: string;
};

export const useProfileController = () => {
  const router = useRouter();
  const { profile, updateProfile, setOnboardingComplete } = useUser();
  const { addProduct } = useWorkspaceStore();
  const isFirstSetup = !profile.onboardingComplete;
  const {
    products,
    isLoading: productsLoading,
    error,
  } = useProducts(undefined, { enabled: isFirstSetup });

  const productOptions = useMemo(
    () =>
      (!isFirstSetup
        ? []
        : products.length
        ? products
        : [
            {
              id: DEFAULT_PRODUCT_ID,
              name: DEFAULT_PRODUCT_NAME,
            },
          ]
      ).map((product) => ({
        id: product.id,
        name: product.name,
      })),
    [isFirstSetup, products],
  );

  const defaultFocusProduct = useMemo(
    () => profile.focusProduct ?? productOptions[0]?.id ?? DEFAULT_PRODUCT_ID,
    [profile.focusProduct, productOptions],
  );

  const defaultFormValues = useMemo(
    () => ({
      fullName: profile.fullName ?? "",
      username: profile.username ?? "",
      company: profile.company ?? "",
      focusProduct: defaultFocusProduct,
    }),
    [profile.fullName, profile.username, profile.company, defaultFocusProduct],
  );

  const form = useForm<ProfileFormValues>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    const currentValues = form.getValues();
    const shouldReset =
      currentValues.fullName !== defaultFormValues.fullName ||
      currentValues.username !== defaultFormValues.username ||
      currentValues.company !== defaultFormValues.company ||
      currentValues.focusProduct !== defaultFormValues.focusProduct;

    if (shouldReset) {
      form.reset(defaultFormValues);
    }
  }, [form, defaultFormValues]);

  const onSubmit = form.handleSubmit((values) => {
    updateProfile({
      fullName: values.fullName,
      username: values.username,
      company: values.company,
      businessName: values.company,
      focusProduct: isFirstSetup ? values.focusProduct : profile.focusProduct,
    });
    if (isFirstSetup) {
      const product = products.find((item) => item.id === values.focusProduct);
      addProduct(values.focusProduct, product?.name ?? values.focusProduct);
      setOnboardingComplete(true);
    } else if (profile.focusProduct) {
      addProduct(profile.focusProduct);
    }
    router.push(ROUTES.workspace.dashboard);
  });

  return {
    form,
    productOptions,
    onSubmit,
    profile,
    isFirstSetup,
    productListLoading: productsLoading,
    productListError: error instanceof Error ? error.message : null,
  };
};
