"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/src/services/authService";
import type { AuthContextValue, AuthUser, SignInPayload } from "@/src/types/auth";
import { ROUTES } from "@/src/constants";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { mutateAsync: authenticate, isPending } = useMutation({ mutationFn: login });

  const signIn = useCallback(
    async (payload: SignInPayload) => {
      const data = await authenticate(payload);

      localStorage.setItem("auth_token", data.token);
      setToken(data.token);

      setUser({
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        role: "Owner",
        company: data.user.business_name || "Nusantara Craft",
      });

      router.push(ROUTES.workspace.profile);
    },
    [authenticate, router],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setToken(null);
    router.push("/signin");
  }, [router]);

  const value = useMemo(
    () => ({ user, token, loading: isPending, signIn, signOut }),
    [user, token, isPending, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
