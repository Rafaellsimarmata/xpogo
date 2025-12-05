'use client';

import { FormEvent, useMemo, useState } from "react";
import ProductInfo from "@/src/components/market/ProductInfo";
import CountryCard from "@/src/components/market/CountryCard";
import type { MarketProduct, CountryData, ParsedCountryRow } from "@/src/types/market";
import { useAuth } from "@/src/context/AuthContext";

type LookupState = "idle" | "loading" | "not-found" | "empty";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const MarketAnalysisPage = () => {
  const { user, token } = useAuth();
  const [productQuery, setProductQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [lookupState, setLookupState] = useState<LookupState>("idle");
  const [recommendedCountries, setRecommendedCountries] = useState<CountryData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isAuthenticated = useMemo(() => Boolean(user && token), [user, token]);

  const activeCountry = recommendedCountries.find((c) => c.id === selectedCountryId) ?? recommendedCountries[0] ?? null;

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productQuery.trim()) {
      setLookupState("empty");
      setErrorMessage("Masukkan nama produk atau HS Code terlebih dahulu.");
      setSelectedProduct(null);
      return;
    }

    if (!isAuthenticated) {
      setLookupState("not-found");
      setErrorMessage("Sesi Anda berakhir, silakan login ulang.");
      setSelectedProduct(null);
      setRecommendedCountries([]);
      return;
    }

    if (!BACKEND_URL) {
      setLookupState("not-found");
      setErrorMessage("Konfigurasi backend belum disetel.");
      setSelectedProduct(null);
      setRecommendedCountries([]);
      return;
    }

    setLookupState("loading");
    setErrorMessage(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const analyzeResponse = await fetch(`${BACKEND_URL}market-intelligence/analyze`, {
        method: "POST",
        headers,
        body: JSON.stringify({ productName: productQuery }),
      });

      if (!analyzeResponse.ok) {
        const payload = await analyzeResponse.json().catch(() => null);
        const message =
          payload?.message ??
          payload?.error ??
          (analyzeResponse.status === 401 || analyzeResponse.status === 403
            ? "Sesi Anda berakhir, silakan login ulang."
            : "Produk belum ditemukan, coba istilah lain.");
        throw new Error(message);
      }

      const analyzeData = await analyzeResponse.json();

      const cleanedMarketIntelligence = analyzeData.marketIntelligence
        .substring(0, analyzeData.marketIntelligence.indexOf("## 3. VISUALIZATION DATA"))
        .trim();

      const productData: MarketProduct = {
        name: analyzeData.product,
        marketIntelligence: cleanedMarketIntelligence,
      };

      setSelectedProduct(productData);

      const parseResponse = await fetch(`${BACKEND_URL}market-intelligence/parse-data`, {
        method: "POST",
        headers,
        body: JSON.stringify({ aiResponse: analyzeData.marketIntelligence }),
      });

      if (!parseResponse.ok) {
        const payload = await parseResponse.json().catch(() => null);
        const message =
          payload?.message ??
          payload?.error ??
          (parseResponse.status === 401 || parseResponse.status === 403
            ? "Sesi Anda berakhir, silakan login ulang."
            : "Gagal membaca data negara.");
        throw new Error(message);
      }

      const parseData = await parseResponse.json();

      const formattedCountries: CountryData[] = (parseData.parsedData as ParsedCountryRow[])
        .filter((item) => item.country !== "---------")
        .map((item) => ({
          id: item.country.toLowerCase().replace(/\s+/g, "-"),
          name: item.country,
          productionVolume: item.productionVolume,
          importVolume: item.importVolume,
          exportVolume: item.exportVolume,
          marketGrowthRate: item.marketGrowthRate,
          keyTradePartners: item.keyTradePartners,
        }));

      setRecommendedCountries(formattedCountries);
      setSelectedCountryId(null);
      setLookupState("idle");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error during market analysis:", error);
      setSelectedProduct(null);
      setRecommendedCountries([]);
      setLookupState("not-found");
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil data pasar."
      );
    }
  };

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        
        {/* Header */}
        <div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Market Intelligence
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">
            Analisis pasar berdasarkan produk
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan produk atau HS Code untuk melihat deskripsi produk, negara prioritas, dan checklist dokumen yang harus dipenuhi.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

          {/* Search Sidebar */}
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
                    className="mt-2 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  disabled={lookupState === "loading"}
                >
                  {lookupState === "loading" ? "Mengambil data produk..." : "Generate analisis"}
                </button>

                {/* Error messages */}
                {lookupState === "empty" && (
                  <p className="text-xs text-red-500">
                    {errorMessage ?? "Masukkan nama produk terlebih dahulu."}
                  </p>
                )}
                {lookupState === "not-found" && errorMessage && (
                  <p className="text-xs text-red-500">{errorMessage}</p>
                )}
                {!isAuthenticated && (
                  <p className="text-xs text-red-500">
                    Anda perlu login untuk menggunakan analisis pasar.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">

            {/* Loading Skeleton */}
            {lookupState === "loading" && (
              <div className="space-y-6 animate-pulse">
                <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm space-y-4">
                  <div className="h-6 w-48 rounded bg-border/40"></div>
                  <div className="h-3 w-80 rounded bg-border/30"></div>
                  <div className="h-3 w-64 rounded bg-border/30"></div>
                </div>

                <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm space-y-6">
                  <div className="h-5 w-40 rounded bg-border/40"></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="h-24 rounded-2xl bg-border/30"></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Info & Countries */}
            {selectedProduct && lookupState !== "loading" && (
              <>
                <ProductInfo product={selectedProduct} />

                <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Negara rekomendasi</h2>
                      <p className="text-sm text-muted-foreground">Klik negara untuk fokuskan informasi dokumen.</p>
                    </div>
                    {activeCountry && (
                      <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-foreground">
                        Fokus: {activeCountry.name}
                      </span>
                    )}
                  </div>

                  {recommendedCountries.length > 0 ? (
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
                      Belum ada rekomendasi. Lengkapi data produk untuk mendapatkan analisis pasar otomatis.
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Empty State */}
            {!selectedProduct && lookupState !== "loading" && (
              <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/70 px-6 text-center">
                <p className="text-lg font-semibold text-foreground">Mulai dengan memasukkan produk</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Setelah produk ditemukan, sistem menampilkan ringkasan produk, negara prioritas, dan checklist dokumen secara otomatis.
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
