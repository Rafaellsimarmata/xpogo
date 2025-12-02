"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { products as productList, Product } from "@/src/lib/data/products";
import { cn } from "@/src/lib/utils";

type ProductSelectorProps = {
  selectedProductId?: string;
  onSelect: (product: Product) => void;
};

const ProductSelector = ({ selectedProductId, onSelect }: ProductSelectorProps) => {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query) return productList;
    return productList.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

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
      <div className="mt-4 max-h-72 space-y-3 overflow-auto pr-2">
        {filteredProducts.map((product) => (
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
        {!filteredProducts.length && (
          <p className="text-center text-xs text-slate-400">Produk tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;
