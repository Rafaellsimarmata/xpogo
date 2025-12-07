"use client";

import { useEffect } from "react";

export const GlobalErrorHandler = () => {
  useEffect(() => {
    // Catch unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("[GlobalErrorHandler] Unhandled Promise Rejection:", event.reason);
    };

    // Catch runtime errors
    const handleError = (event: ErrorEvent) => {
      console.error("[GlobalErrorHandler] Runtime Error:", event.error);
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
};
