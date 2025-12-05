"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(
    async ({ email, password }: SignInPayload) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();

        setUser({
          id: data.user.id,
          name: data.user.username,
          email: data.user.email,
          role: "Owner",
          company: "Nusantara Craft",
        });

        router.push("/dashboard");

      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const signOut = useCallback(() => {
    setUser(null);
    router.push("/signin"); 
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};