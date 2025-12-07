"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika sedang loading (hydrating), jangan lakukan apa-apa
    if (loading) {
      console.log("[ProtectedRoute] Still loading auth state...");
      return;
    }

    // Setelah loading selesai, check auth
    if (!user && !token) {
      console.warn("[ProtectedRoute] No auth found after hydration. Redirecting to home...");
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");
        console.log("[ProtectedRoute] localStorage - Token:", !!storedToken, "User:", !!storedUser);
      }
      router.replace("/");
    } else {
      console.log("[ProtectedRoute] Auth found, allowing access. User:", user?.name);
    }
  }, [user, token, loading, router]);

  // Selama sedang loading atau tidak ada auth, show loading screen
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada auth setelah loading, return null (akan redirect)
  if (!user && !token) {
    return null;
  }

  // Auth valid, render children
  return <>{children}</>;
};
