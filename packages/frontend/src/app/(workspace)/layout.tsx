"use client";

import { useEffect } from "react";
import WorkspaceNav from "@/src/components/layout/WorkspaceNav";
import { ProtectedRoute } from "@/src/components/providers/ProtectedRoute";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log("[WorkspaceLayout] Layout mounted");
  }, []);

  try {
    console.log("[WorkspaceLayout] Rendering with ProtectedRoute...");
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <WorkspaceNav />
          <main>{children}</main>
        </div>
      </ProtectedRoute>
    );
  } catch (error) {
    console.error("[WorkspaceLayout] Error:", error);
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error Loading Workspace</h2>
          <p className="text-sm text-muted-foreground mt-2">Please refresh the page</p>
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

export default WorkspaceLayout;
