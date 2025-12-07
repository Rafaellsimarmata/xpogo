"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [renderTimeout, setRenderTimeout] = useState(false);


  useEffect(() => {
    // Safety timeout: if loading takes more than 3 seconds, force render
    const timeout = setTimeout(() => {
      console.warn("[ProtectedRoute] Loading timeout - forcing render");
      setRenderTimeout(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // If still loading, don't do anything
    if (loading) {
      return;
    }

    // After loading, check auth
    if (!user && !token) {
      router.replace("/");
    }
  }, [user, token, loading, router]);

  // While loading auth, show loading screen (unless timeout occurred)
  if (loading && !renderTimeout) {
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
    return null;
  }

  // Auth valid, render children
  try {
    return <>{children}</>;
  } catch (error) {
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
