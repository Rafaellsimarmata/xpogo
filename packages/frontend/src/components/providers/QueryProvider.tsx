"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

type QueryProviderProps = {
  children: ReactNode;
};

const createClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [client] = useState(createClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
