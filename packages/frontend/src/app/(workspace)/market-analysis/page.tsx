'use client';

import { FormEvent, useMemo, useState } from "react";
import ProductInfo from "@/src/components/market/ProductInfo";
import CountryCard from "@/src/components/market/CountryCard";
import DocumentChecklist from "@/src/components/market/DocumentChecklist";
import { products as productList, type Product } from "@/src/lib/data/products";
import { countries } from "@/src/lib/data/countries";
import { generateChecklist } from "@/src/lib/data/documents";
import { delay } from "@/src/lib/utils";

const MarketAnalysisPage = () => {
  const [productQuery, setProductQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "not-found" | "empty">("idle");

  const suggestions = useMemo(() => {
    if (!productQuery.trim()) {
      return productList.slice(0, 4);
    }
    const normalized = productQuery.trim().toLowerCase();
    return productList
      .filter(
        (product) =>
          product.name.toLowerCase().includes(normalized) ||
          product.hsCode.replace(/\./g, "").includes(normalized.replace(/[^0-9]/g, "")),
      )
      .slice(0, 4);
  }, [productQuery]);

  const recommendedCountries = useMemo(() => {
    if (!selectedProduct) return [];
    return [...countries]
      .map((country) => ({
        ...country,
        weightedScore: Math.round(
          (country.matchScore + selectedProduct.stats.demandIndex + selectedProduct.stats.priceIndex) / 3,
        ),
      }))
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 4);
  }, [selectedProduct]);

  const activeCountry = useMemo(() => {
    if (!recommendedCountries.length) return null;
    if (selectedCountryId) {
      return recommendedCountries.find((country) => country.id === selectedCountryId) ?? recommendedCountries[0];
    }
    return recommendedCountries[0];
  }, [recommendedCountries, selectedCountryId]);

  const checklist = useMemo(() => {
    if (!selectedProduct || !activeCountry) return [];
    return generateChecklist(selectedProduct.id, activeCountry.id);
  }, [selectedProduct, activeCountry]);

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productQuery.trim()) {
      setLookupState("empty");
      setSelectedProduct(null);
      return;
    }

    setLookupState("loading");
    await delay(500);

    const normalized = productQuery.trim().toLowerCase();
    const matchedProduct =
      productList.find((product) => product.name.toLowerCase() === normalized) ??
      productList.find(
        (product) =>
          product.name.toLowerCase().includes(normalized) ||
          product.hsCode.replace(/\./g, "").includes(normalized.replace(/[^0-9]/g, "")),
      );

    if (matchedProduct) {
      setSelectedProduct(matchedProduct);
      setSelectedCountryId(null);
      setLookupState("idle");
      return;
    }

    setSelectedProduct(null);
    setLookupState("not-found");
  };

  const handleSuggestionSelect = (product: Product) => {
    setProductQuery(product.name);
    setSelectedProduct(product);
    setSelectedCountryId(null);
    setLookupState("idle");
  };

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Market Intelligence
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Analisis pasar berdasarkan produk</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan produk atau HS Code untuk melihat deskripsi produk, negara prioritas, dan checklist dokumen
            yang harus dipenuhi.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Produk / HS Code
                  </label>
                  <input
                    type="text"
                    value={productQuery}
                    onChange={(event) => setProductQuery(event.target.value)}
                    placeholder="contoh: Kopi, 0901.11.10"
                    className="mt-2 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  disabled={lookupState === "loading"}
                >
                  {lookupState === "loading" ? "Mengambil data produk..." : "Generate analisis"}
                </button>
                {lookupState === "empty" && (
                  <p className="text-xs text-red-500">Masukkan nama produk atau HS Code terlebih dahulu.</p>
                )}
                {lookupState === "not-found" && (
                  <p className="text-xs text-red-500">
                    Produk belum ada di database. Coba istilah lain atau hubungi tim kami.
                  </p>
                )}
              </form>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Contoh cepat
              </p>
              <div className="mt-4 space-y-2 text-sm">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSuggestionSelect(product)}
                    className="w-full rounded-2xl border border-border/50 bg-background/80 px-4 py-3 text-left text-foreground transition hover:border-primary/30"
                  >
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground">HS {product.hsCode}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {selectedProduct ? (
              <>
                <ProductInfo product={selectedProduct} />

                <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Negara rekomendasi</h2>
                      <p className="text-sm text-muted-foreground">Klik kartu untuk fokuskan checklist.</p>
                    </div>
                    {activeCountry && (
                      <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-foreground">
                        Fokus: {activeCountry.name}
                      </span>
                    )}
                  </div>
                  {recommendedCountries.length ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {recommendedCountries.map((country) => (
                        <CountryCard
                          key={country.id}
                          country={country}
                          isActive={country.id === activeCountry?.id}
                          onSelect={(next) => setSelectedCountryId(next.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Belum ada rekomendasi. Lengkapi data produk untuk mendapatkan rekomendasi negara otomatis.
                    </p>
                  )}
                </div>

                <DocumentChecklist
                  documents={checklist}
                  title="Checklist dokumen prioritas"
                  description={
                    activeCountry
                      ? `Daftar persyaratan untuk pengiriman ${selectedProduct.name} ke ${activeCountry.name}.`
                      : "Daftar persyaratan dokumen untuk negara tujuan."
                  }
                />
              </>
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/70 text-center">
                <p className="text-lg font-semibold text-foreground">Mulai dengan memasukkan produk</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Setelah produk ditemukan, kami menampilkan ringkasan produk, negara rekomendasi, dan checklist dokumen
                  secara otomatis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketAnalysisPage;
