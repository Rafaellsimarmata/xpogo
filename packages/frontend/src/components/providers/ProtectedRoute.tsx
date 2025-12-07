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
    // If still loading, don't do anything
    if (loading) {
      console.log("[ProtectedRoute] Still loading auth state...");
      return;
    }

    // After loading, check auth
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

  // While loading auth, show loading screen
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

  // If not authenticated after loading, return null (will redirect)
  if (!user && !token) {
    return null;
  }

  // Auth valid, render children
  return <>{children}</>;
};
