"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ChatbotFloating from "@/src/components/chatbot/ChatbotFloating";

const WorkspaceLayoutProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isWorkspaceRoute = pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/market-analysis") ||
    pathname?.startsWith("/documents");

  return (
    <>
      {children}
      {isWorkspaceRoute && <ChatbotFloating />}
    </>
  );
};

export default WorkspaceLayoutProvider;
