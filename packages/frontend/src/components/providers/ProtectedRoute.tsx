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

  console.log("[ProtectedRoute] Rendering. loading:", loading, "user:", user?.name, "token:", !!token);

  useEffect(() => {
    console.log("[ProtectedRoute] useEffect triggered. loading:", loading, "user:", user?.name, "token:", !!token);
    
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
    console.log("[ProtectedRoute] Showing loading screen because loading === true");
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, return null (will redirect)
  if (!user && !token) {
    console.log("[ProtectedRoute] Not authenticated. Returning null to trigger redirect");
    return null;
  }

  // Auth valid, render children
  try {
    console.log("[ProtectedRoute] Auth valid. Rendering children...");
    return <>{children}</>;
  } catch (error) {
    console.error("[ProtectedRoute] Error rendering children:", error);
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error Loading Workspace</h2>
          <p className="text-sm text-muted-foreground mt-2">{String(error)}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
};
