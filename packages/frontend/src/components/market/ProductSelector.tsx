"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useProducts, useProductCategories } from "@/src/hooks/useProducts";
import type { Product } from "@/src/types/products";
import { PRODUCT_DIFFICULTY_LEVELS } from "@/src/constants";

type ProductSelectorProps = {
  selectedProductId?: string;
  onSelect: (product: Product) => void;
};

const ProductSelector = ({ selectedProductId, onSelect }: ProductSelectorProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(handler);
  }, [query]);

  const filters = useMemo(
    () => ({
      search: debouncedQuery || undefined,
      category: category || undefined,
      difficulty: difficulty || undefined,
    }),
    [debouncedQuery, category, difficulty],
  );

  const { products, isLoading, error } = useProducts(filters);
  const { categories } = useProductCategories();

  return (
    <div className="rounded-3xl border border-white/40 bg-white/80 p-5 shadow">
      <p className="text-sm font-semibold text-slate-900">Pilih Produk</p>
      <div className="mt-3 flex items-center rounded-2xl border border-slate-100 bg-white px-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="search"
          placeholder="Cari produk atau HS Code"
          className="w-full border-0 bg-transparent px-3 py-2 text-sm outline-none"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-2xl border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-200/50"
        >
          <option value="">Semua kategori</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          className="rounded-2xl border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-200/50"
        >
          <option value="">Semua tingkat</option>
          {PRODUCT_DIFFICULTY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 max-h-72 space-y-3 overflow-auto pr-2">
        {isLoading && (
          <p className="text-center text-xs text-slate-400">Memuat daftar produk...</p>
        )}
        {!isLoading && products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
              product.id === selectedProductId
                ? "border-blue-200 bg-blue-50/60 text-blue-600"
                : "border-white/60 bg-white/60 hover:border-blue-100",
            )}
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-xs text-slate-400">{product.hsCode}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        ))}
        {!isLoading && !products.length && (
          <p className="text-center text-xs text-slate-400">Produk tidak ditemukan.</p>
        )}
        {error && (
          <p className="text-center text-xs text-red-500">
            Gagal memuat produk. {error instanceof Error ? error.message : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;
