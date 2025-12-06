"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { DEFAULT_PRODUCT_ID } from "@/src/constants";
import type { WorkspaceProduct } from "@/src/types/workspace";

const fallbackProductId = DEFAULT_PRODUCT_ID;

type WorkspaceState = {
  products: WorkspaceProduct[];
  activeProductId: string;
};

type WorkspaceAction =
  | { type: "SET_ACTIVE"; productId: string }
  | { type: "ASSIGN_COUNTRY"; productId: string; countryId: string }
  | { type: "ADD_PRODUCT"; productId: string; customName?: string }
  | { type: "REMOVE_PRODUCT"; productId: string };

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
      removeProduct: (productId: string) => void;
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
    case "REMOVE_PRODUCT": {
      const nextProducts = state.products.filter((product) => product.id !== action.productId);
      if (nextProducts.length === 0) {
        return {
          products: [{ id: fallbackProductId }],
          activeProductId: fallbackProductId,
        };
      }
      const nextActive =
        state.activeProductId === action.productId ? nextProducts[0].id : state.activeProductId;
      return {
        ...state,
        products: nextProducts,
        activeProductId: nextActive,
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

  const removeProduct = useCallback(
    (productId: string) => dispatch({ type: "REMOVE_PRODUCT", productId }),
    [],
  );

  const value = useMemo(
    () => ({
      state,
      setActiveProduct,
      assignCountry,
      addProduct,
      removeProduct,
    }),
    [state, setActiveProduct, assignCountry, addProduct, removeProduct],
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
