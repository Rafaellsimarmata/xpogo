'use client';

import ProductInfo from "@/src/components/market/ProductInfo";
import CountryCard from "@/src/components/market/CountryCard";
import { useMarketAnalysisController } from "@/src/controllers/workspace/marketAnalysisController";

export const MarketAnalysisContent = () => {
  const {
    productQuery,
    setProductQuery,
    onLookup,
    lookupState,
    errorMessage,
    isLoading,
    analysisResult,
    recommendedCountries,
    selectedCountryId,
    setSelectedCountryId,
    selectedCountry,
    handleSaveCountry,
    productMeta,
    messages,
  } = useMarketAnalysisController();

  return (
    <section className="bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Market Intelligence
          </p>
          <h1 className="text-3xl font-bold text-foreground">Temukan Negara Prioritas Ekspor</h1>
          <p className="text-sm text-muted-foreground">{messages.analysisPlaceholder}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
            <form onSubmit={onLookup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={productQuery}
                  onChange={(event) => setProductQuery(event.target.value)}
                  placeholder={`contoh: ${productMeta.name}`}
                  className="mt-2 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Mengambil data produk..." : "Generate analisis"}
              </button>

              {lookupState === "empty" && (
                <p className="text-xs text-red-500">
                  {errorMessage ?? "Masukkan nama produk terlebih dahulu."}
                </p>
              )}
              {lookupState === "not-found" && errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
              )}
            </form>
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/70 p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">Langkah penggunaan</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Masukkan nama produk dan jalankan analisis.</li>
              <li>Pilih salah satu negara rekomendasi.</li>
              <li>Simpan negara untuk memperbarui Dashboard dan Document Center.</li>
            </ol>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="space-y-4 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
              <div className="h-6 w-48 rounded bg-border/40" />
              <div className="h-3 w-80 rounded bg-border/30" />
              <div className="h-3 w-64 rounded bg-border/30" />
            </div>

            <div className="space-y-6 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
              <div className="h-5 w-40 rounded bg-border/40" />
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 rounded-2xl bg-border/30" />
                ))}
              </div>
            </div>
          </div>
        )}

        {analysisResult && !isLoading && (
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <ProductInfo product={analysisResult} />

            <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Negara rekomendasi</h2>
                  <p className="text-sm text-muted-foreground">Klik negara untuk fokuskan informasi dokumen.</p>
                </div>
                {selectedCountry && (
                  <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-foreground">
                    Fokus: {selectedCountry.name}
                  </span>
                )}
              </div>

              {recommendedCountries.length > 0 ? (
                <>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {recommendedCountries.map((country) => (
                      <CountryCard
                        key={country.id}
                        country={country}
                        isActive={country.id === selectedCountryId}
                        onSelect={(next) => setSelectedCountryId(next.id)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveCountry}
                    className="mt-4 w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Simpan negara tujuan
                  </button>
                </>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Belum ada rekomendasi. Lengkapi data produk untuk mendapatkan analisis pasar otomatis.
                </p>
              )}
            </div>
          </div>
        )}

        {!analysisResult && !isLoading && (
          <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/70 px-6 text-center">
            <p className="text-lg font-semibold text-foreground">Mulai dengan memasukkan produk</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Setelah produk ditemukan, sistem menampilkan ringkasan produk, negara prioritas, dan checklist dokumen
              secara otomatis.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
