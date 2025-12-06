"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { products } from "@/src/lib/data/products";
import type { WorkspaceProduct } from "@/src/types/workspace";

const fallbackProductId = products[0]?.id ?? "default-product";

type WorkspaceState = {
  products: WorkspaceProduct[];
  activeProductId: string;
};

type WorkspaceAction =
  | { type: "SET_ACTIVE"; productId: string }
  | { type: "ASSIGN_COUNTRY"; productId: string; countryId: string }
  | { type: "ADD_PRODUCT"; productId: string; customName?: string };

const initialState: WorkspaceState = {
  products: [{ id: fallbackProductId }],
  activeProductId: fallbackProductId,
};

const WorkspaceStoreContext = createContext<
  | {
      state: WorkspaceState;
      setActiveProduct: (productId: string) => void;
      assignCountry: (productId: string, countryId: string) => void;
      addProduct: (productId: string, customName?: string) => void;
    }
  | undefined
>(undefined);

const reducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case "SET_ACTIVE":
      return { ...state, activeProductId: action.productId };
    case "ASSIGN_COUNTRY":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.productId
            ? { ...product, targetCountryId: action.countryId }
            : product,
        ),
      };
    case "ADD_PRODUCT": {
      const exists = state.products.some((product) => product.id === action.productId);
      const nextProducts = exists
        ? state.products
        : [...state.products, { id: action.productId, customName: action.customName }];
      return {
        ...state,
        products: nextProducts,
        activeProductId: action.productId,
      };
    }
    default:
      return state;
  }
};

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setActiveProduct = useCallback(
    (productId: string) => dispatch({ type: "SET_ACTIVE", productId }),
    [],
  );

  const assignCountry = useCallback(
    (productId: string, countryId: string) =>
      dispatch({ type: "ASSIGN_COUNTRY", productId, countryId }),
    [],
  );

  const addProduct = useCallback(
    (productId: string, customName?: string) =>
      dispatch({ type: "ADD_PRODUCT", productId, customName }),
    [],
  );

  const value = useMemo(
    () => ({
      state,
      setActiveProduct,
      assignCountry,
      addProduct,
    }),
    [state, setActiveProduct, assignCountry, addProduct],
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
