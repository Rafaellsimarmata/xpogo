"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/src/services/authService";
import type { AuthContextValue, AuthUser, SignInPayload, SignInOptions } from "@/src/types/auth";
import { ROUTES } from "@/src/constants";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY_USER = "auth_user";
const STORAGE_KEY_TOKEN = "auth_token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { mutateAsync: authenticate, isPending } = useMutation({ mutationFn: login });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    console.log("[AuthContext] useEffect started - checking localStorage...");
    
    // Set timeout to ensure hydration completes even if there's an error
    const hydrationTimeout = setTimeout(() => {
      if (!isHydrated) {
        console.warn("[AuthContext] Hydration timeout - forcing completion");
        setIsHydrated(true);
      }
    }, 5000); // 5 second timeout
    
    try {
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);

      console.log("[AuthContext] localStorage check - Token exists:", !!storedToken, "User exists:", !!storedUser);

      if (storedToken) {
        console.log("[AuthContext] Setting token from localStorage");
        setToken(storedToken);
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          console.log("[AuthContext] User restored from localStorage:", parsedUser.name);
          setUser(parsedUser);
        } catch (error) {
          console.warn("[AuthContext] Failed to parse stored user", error);
          localStorage.removeItem(STORAGE_KEY_USER);
          localStorage.removeItem(STORAGE_KEY_TOKEN);
        }
      }
    } catch (error) {
      console.error("[AuthContext] Failed to access localStorage", error);
    }
    
    // Mark as hydrated after restoring state
    console.log("[AuthContext] Hydration complete - setting isHydrated to true");
    setIsHydrated(true);
    clearTimeout(hydrationTimeout);
  }, []);

  const signIn = useCallback(
    async (payload: SignInPayload, options?: SignInOptions) => {
      console.log("[AuthContext] Sign in started for:", payload.email);
      try {
        const data = await authenticate(payload);
        console.log("[AuthContext] Authenticate mutation completed");

        const newUser: AuthUser = {
          id: data.user.id,
          name: data.user.username,
          email: data.user.email,
          role: "Owner",
          company: data.user.business_name || "Nusantara Craft",
        };

        try {
          const tokenToStore = data.token;
          const userToStore = JSON.stringify(newUser);
          
          localStorage.setItem(STORAGE_KEY_TOKEN, tokenToStore);
          localStorage.setItem(STORAGE_KEY_USER, userToStore);
          
          console.log("[AuthContext] User and token saved to localStorage. User:", newUser.name);
          console.log("[AuthContext] Verification - Token in localStorage:", !!localStorage.getItem(STORAGE_KEY_TOKEN));
          console.log("[AuthContext] Verification - User in localStorage:", !!localStorage.getItem(STORAGE_KEY_USER));
        } catch (error) {
          console.error("[AuthContext] Failed to save to localStorage", error);
          throw error;
        }
        
        setToken(data.token);
        setUser(newUser);
        
        console.log("[AuthContext] State updated. Scheduling redirect to dashboard...");
        // Schedule redirect for next event loop to ensure state is committed
        setTimeout(() => {
          console.log("[AuthContext] Performing redirect now");
          router.push(options?.redirectTo ?? ROUTES.workspace.dashboard);
          console.log("[AuthContext] router.push() called");
        }, 0);
      } catch (error) {
        console.error("[AuthContext] Sign in error:", error);
        throw error;
      }
    },
    [authenticate, router],
  );

  const signOut = useCallback(() => {
    console.log("[AuthContext] Sign out started...");
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      console.log("[AuthContext] User logged out - localStorage cleared");
    } catch (error) {
      console.error("[AuthContext] Failed to clear localStorage", error);
    }
    
    setUser(null);
    setToken(null);
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({ user, token, loading: isPending || !isHydrated, signIn, signOut }),
    [user, token, isPending, isHydrated, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
