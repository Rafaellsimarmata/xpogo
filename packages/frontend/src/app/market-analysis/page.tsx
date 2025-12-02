'use client';

import { useMemo, useState } from "react";
import ProductSelector from "@/src/components/market/ProductSelector";
import ProductInfo from "@/src/components/market/ProductInfo";
import CountryCard from "@/src/components/market/CountryCard";
import DocumentChecklist from "@/src/components/market/DocumentChecklist";
import { products as productList, Product } from "@/src/lib/data/products";
import { countries } from "@/src/lib/data/countries";
import { generateChecklist } from "@/src/lib/data/documents";

const MarketAnalysisPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(productList[0]);

  const checklist = useMemo(
    () => (selectedProduct ? generateChecklist(selectedProduct.id, countries[0].id) : []),
    [selectedProduct],
  );

  return (
    <section className="bg-gradient-to-b from-white to-blue-50/40 py-12">
      <div className="mx-auto max-w-6xl space-y-8 px-6">
        <div className="rounded-[32px] border border-white/50 bg-white/80 p-8 shadow">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-500">
            Market Intelligence
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Analisis Negara Tujuan Ekspor</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pilih produk dan dapatkan rekomendasi negara lengkap dengan skor kecocokan, harga impor,
            dan estimasi waktu pengiriman.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ProductSelector
            selectedProductId={selectedProduct?.id}
            onSelect={(product) => setSelectedProduct(product)}
          />
          {selectedProduct ? (
            <div className="space-y-6">
              <ProductInfo product={selectedProduct} />
              <div className="grid gap-4 md:grid-cols-2">
                {countries.slice(0, 4).map((country) => (
                  <CountryCard key={country.id} country={country} />
                ))}
              </div>
              <DocumentChecklist documents={checklist} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 p-10 text-center text-slate-500">
              <p className="text-lg font-semibold text-slate-700">Belum ada produk dipilih</p>
              <p className="mt-2 text-sm">
                Tambahkan produk pertama Anda untuk mulai melihat rekomendasi negara.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MarketAnalysisPage;
