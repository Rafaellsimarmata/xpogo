import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value);

export const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const formatScoreLabel = (score: number) => {
  if (score >= 90) return "Sangat Potensial";
  if (score >= 75) return "Potensial";
  if (score >= 60) return "Perlu Persiapan";
  return "Perlu Validasi";
};

export const getScoreTone = (score: number) => {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-blue-500";
  if (score >= 60) return "text-warning";
  return "text-muted-foreground";
};

export const readinessColor = (readiness: string) => {
  if (readiness.includes("pemula")) return "bg-green-100 text-green-800";
  if (readiness.includes("persiapan")) return "bg-amber-100 text-amber-800";
  return "bg-blue-100 text-blue-800";
};

export const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));
