"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { delay } from "@/src/lib/utils";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const demoUser: AuthUser = {
  id: "founder-123",
  name: "Alya Pratama",
  email: "alya@xpogo.id",
  role: "Owner",
  company: "Nusantara Craft",
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(demoUser);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async ({ email }: SignInPayload) => {
    setLoading(true);
    await delay();
    setUser({
      ...demoUser,
      email,
    });
    setLoading(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
    }),
    [user, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
