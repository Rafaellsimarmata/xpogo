"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { products } from "@/src/lib/data/products";
import { useUser } from "@/src/context/UserContext";
import { useWorkspaceStore } from "@/src/store/workspaceStore";
import { ROUTES } from "@/src/constants";

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

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        name: product.name,
      })),
    [],
  );

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: profile.fullName ?? "",
      username: profile.username ?? "",
      company: profile.company ?? "",
      focusProduct: profile.focusProduct ?? productOptions[0]?.id ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateProfile({
      fullName: values.fullName,
      username: values.username,
      company: values.company,
      businessName: values.company,
      focusProduct: values.focusProduct,
    });
    const product = products.find((item) => item.id === values.focusProduct);
    addProduct(values.focusProduct, product?.name ?? values.focusProduct);
    setOnboardingComplete(true);
    router.push(ROUTES.workspace.dashboard);
  });

  return {
    form,
    productOptions,
    onSubmit,
  };
};
