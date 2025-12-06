"use client";

import { Building2, Globe2, Star, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

type ProductCardProps = {
  title: string;
  description?: string;
  countryName?: string;
  onExport: () => void;
  onAnalyze: () => void;
  onRemove?: () => void;
  isFocus?: boolean;
  disableRemove?: boolean;
};

export const ProductCard = ({
  title,
  description,
  countryName,
  onExport,
  onAnalyze,
  onRemove,
  isFocus,
  disableRemove,
}: ProductCardProps) => (
  <div
    className={cn(
      "relative flex flex-col justify-between rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm",
      isFocus && "border-primary/50 shadow-primary/10",
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Produk</p>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {isFocus && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Star className="h-3 w-3" />
          Fokus
        </span>
      )}
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
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        disabled={disableRemove}
        className={cn(
          "absolute right-4 top-4 rounded-full border border-border/60 p-2 text-xs text-muted-foreground transition hover:text-destructive",
          disableRemove && "cursor-not-allowed opacity-40",
        )}
        aria-label="Hapus produk"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);
