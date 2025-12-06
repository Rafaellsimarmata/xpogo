"use client";

import { Building2, Globe2 } from "lucide-react";

type ProductCardProps = {
  title: string;
  description?: string;
  countryName?: string;
  onExport: () => void;
  onAnalyze: () => void;
};

export const ProductCard = ({
  title,
  description,
  countryName,
  onExport,
  onAnalyze,
}: ProductCardProps) => (
  <div className="flex flex-col justify-between rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Produk</p>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-sm text-foreground">
        <Globe2 className="h-4 w-4 text-primary" />
        {countryName ? (
          <span>Target negara: {countryName}</span>
        ) : (
          <span>Negara tujuan belum dipilih</span>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onExport}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Building2 className="h-4 w-4" />
          Export
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40"
        >
          Analysis Product
        </button>
      </div>
    </div>
  </div>
);
