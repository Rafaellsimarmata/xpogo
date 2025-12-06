"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  createUserProduct,
  deleteUserProduct,
  fetchUserProducts,
  updateUserProduct,
} from "@/src/services/userProductService";
import type { WorkspaceProduct } from "@/src/types/workspace";
import type { UserProduct } from "@/src/types/userProducts";

type WorkspaceState = {
  products: WorkspaceProduct[];
  activeProductId: string | null;
  isLoading: boolean;
  error: string | null;
};

type WorkspaceAction =
  | { type: "SET_ACTIVE"; productId: string | null }
  | { type: "SET_PRODUCTS"; products: WorkspaceProduct[] }
  | { type: "UPSERT_PRODUCT"; product: WorkspaceProduct }
  | { type: "REMOVE_PRODUCT"; userProductId: string }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERROR"; message: string | null };

type AddProductPayload = {
  baseProductId: string;
  name: string;
  description?: string;
  category?: string;
  hsCode?: string;
  targetCountryId?: string;
  targetCountryName?: string;
  metadata?: Record<string, unknown>;
};

const initialState: WorkspaceState = {
  products: [],
  activeProductId: null,
  isLoading: false,
  error: null,
};

const mapUserProductToWorkspace = (record: UserProduct): WorkspaceProduct => ({
  id: record.baseProductId,
  userProductId: record.userProductId,
  name: record.name,
  description: record.description,
  category: record.category,
  hsCode: record.hsCode,
  targetCountryId: record.targetCountryId,
  targetCountryName: record.targetCountryName,
  status: record.status,
  metadata: record.metadata,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const reducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case "SET_ACTIVE":
      return { ...state, activeProductId: action.productId };
    case "SET_PRODUCTS": {
      const nextActive =
        action.products.find((product) => product.id === state.activeProductId)?.id ??
        action.products[0]?.id ??
        null;
      return {
        ...state,
        products: action.products,
        activeProductId: nextActive,
      };
    }
    case "UPSERT_PRODUCT": {
      const exists = state.products.some(
        (product) => product.userProductId === action.product.userProductId,
      );
      const products = exists
        ? state.products.map((product) =>
            product.userProductId === action.product.userProductId ? action.product : product,
          )
        : [...state.products, action.product];
      return {
        ...state,
        products,
        activeProductId: action.product.id,
      };
    }
    case "REMOVE_PRODUCT": {
      const products = state.products.filter(
        (product) => product.userProductId !== action.userProductId,
      );
      const nextActive = products.length
        ? products.find((product) => product.id === state.activeProductId)?.id ?? products[0].id
        : null;
      return {
        ...state,
        products,
        activeProductId: nextActive,
      };
    }
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.message };
    default:
      return state;
  }
};

const WorkspaceStoreContext = createContext<
  | {
      state: WorkspaceState;
      refreshProducts: () => Promise<void>;
      setActiveProduct: (productId: string | null) => void;
      assignCountry: (params: {
        userProductId: string;
        countryId: string;
        countryName: string;
      }) => Promise<void>;
      addProduct: (payload: AddProductPayload) => Promise<WorkspaceProduct>;
      removeProduct: (userProductId: string) => Promise<void>;
    }
  | undefined
>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const hydrateProducts = useCallback(async () => {
    if (!token) {
      dispatch({ type: "SET_PRODUCTS", products: [] });
      dispatch({ type: "SET_LOADING", value: false });
      dispatch({ type: "SET_ERROR", message: null });
      return;
    }
    dispatch({ type: "SET_LOADING", value: true });
    try {
      const products = await fetchUserProducts({ status: "active" }, token);
      dispatch({
        type: "SET_PRODUCTS",
        products: products.map((record) => mapUserProductToWorkspace(record)),
      });
      dispatch({ type: "SET_ERROR", message: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memuat produk pengguna.";
      dispatch({ type: "SET_ERROR", message });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  }, [token]);

  useEffect(() => {
    hydrateProducts();
  }, [hydrateProducts]);

  const refreshProducts = useCallback(async () => {
    await hydrateProducts();
  }, [hydrateProducts]);

  const setActiveProduct = useCallback((productId: string | null) => {
    dispatch({ type: "SET_ACTIVE", productId });
  }, []);

  const addProduct = useCallback(
    async (payload: AddProductPayload) => {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const requestBody = {
        name: payload.name,
        description: payload.description,
        category: payload.category,
        hsCode: payload.hsCode,
        targetCountryId: payload.targetCountryId,
        targetCountryName: payload.targetCountryName,
        metadata: {
          ...(payload.metadata ?? {}),
          baseProductId: payload.baseProductId,
        },
      };
      const created = await createUserProduct(requestBody, token);
      const mapped = mapUserProductToWorkspace(created);
      dispatch({ type: "UPSERT_PRODUCT", product: mapped });
      return mapped;
    },
    [token],
  );

  const updateProduct = useCallback(
    async (
      userProductId: string,
      payload: Partial<AddProductPayload & { status: "active" | "archived" }>,
    ) => {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const existing = state.products.find((product) => product.userProductId === userProductId);
      const requestBody = {
        name: payload.name ?? existing?.name ?? "",
        description: payload.description ?? existing?.description,
        category: payload.category ?? existing?.category,
        hsCode: payload.hsCode ?? existing?.hsCode,
        targetCountryId: payload.targetCountryId ?? existing?.targetCountryId,
        targetCountryName: payload.targetCountryName ?? existing?.targetCountryName,
        status: payload.status ?? (existing?.status as "active" | "archived") ?? "active",
        metadata: {
          ...(existing?.metadata ?? {}),
          ...(payload.metadata ?? {}),
        },
      };
      const updated = await updateUserProduct(userProductId, requestBody, token);
      const mapped = mapUserProductToWorkspace(updated);
      dispatch({ type: "UPSERT_PRODUCT", product: mapped });
      return mapped;
    },
    [state.products, token],
  );

  const assignCountry = useCallback(
    async ({
      userProductId,
      countryId,
      countryName,
    }: {
      userProductId: string;
      countryId: string;
      countryName: string;
    }) => {
      await updateProduct(userProductId, {
        targetCountryId: countryId,
        targetCountryName: countryName,
      });
    },
    [updateProduct],
  );

  const removeProduct = useCallback(
    async (userProductId: string) => {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      await deleteUserProduct(userProductId, token);
      dispatch({ type: "REMOVE_PRODUCT", userProductId });
    },
    [token],
  );

  const value = useMemo(
    () => ({
      state,
      refreshProducts,
      setActiveProduct,
      assignCountry,
      addProduct,
      removeProduct,
    }),
    [state, refreshProducts, setActiveProduct, assignCountry, addProduct, removeProduct],
  );

  return <WorkspaceStoreContext.Provider value={value}>{children}</WorkspaceStoreContext.Provider>;
};

export const useWorkspaceStore = () => {
  const context = useContext(WorkspaceStoreContext);
  if (!context) {
    throw new Error("useWorkspaceStore must be used within WorkspaceProvider");
  }
  return context;
};
