"use client";

import { useEffect } from "react";
import WorkspaceNav from "@/src/components/layout/WorkspaceNav";
import { ProtectedRoute } from "@/src/components/providers/ProtectedRoute";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log("[WorkspaceLayout] Layout mounted");
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <WorkspaceNav />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
};

export default WorkspaceLayout;
