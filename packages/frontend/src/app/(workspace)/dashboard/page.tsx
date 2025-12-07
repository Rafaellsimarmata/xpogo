'use client';

console.log("[DashboardPage Module] Loading dashboard page module...");

import { Plus, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "@/src/components/ui/Modal";
import { ProductCard } from "@/src/components/workspace/ProductCard";
import { useDashboardController } from "@/src/controllers/workspace/dashboardController";

console.log("[DashboardPage Module] Imports complete");

const DashboardPage = () => {
  console.log("[DashboardPage] Component rendering (at top level)");
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[DashboardPage] Component mounted (useEffect called)");
  }, []);

  console.log("[DashboardPage] Starting to call useDashboardController hook...");
  
  let controller;
  try {
    controller = useDashboardController();
    console.log("[DashboardPage] Controller initialized successfully");
  } catch (error) {
    console.error("[DashboardPage] Error initializing controller:", error);
    setInitError(String(error));
    return (
      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-red-600">Error Loading Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-4">{initError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Reload
            </button>
          </div>
        </div>
      </section>
    );
  }

  try {
    
    const {
    profile,
    productCards,
    workspaceLoading,
    workspaceError,
    newsItems,
    newsLoading,
    newsRefreshing,
    newsError,
    newsMeta,
    countryOptions,
    addProductOptions,
    newsProductOptions,
    modals,
    selectedCountryId,
    setSelectedCountryId,
    selectedCatalogProductId,
    setSelectedCatalogProductId,
    productPendingRemoval,
    newsFilters,
    addProductLoading,
    countrySelectionLoading,
    removeProductLoading,
    actions,
    messages,
    canRemoveProducts,
    productsLoading,
    productsError,
  } = controller;

  const showNewsSkeleton = newsLoading || newsRefreshing;
  const showProductSkeleton = workspaceLoading && productCards.length === 0;

  console.log("[DashboardPage] Rendering dashboard. Products:", productCards.length, "News:", newsItems?.length);

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Workspace Overview
              </p>
              <h1 className="mt-2 text-3xl font-bold text-foreground">
                Halo, {profile?.fullName ?? profile?.username ?? "Eksportir"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Pantau produk ekspor dan temukan insight terbaru tiap hari.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 px-5 py-3 text-right text-sm text-foreground">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Perusahaan</p>
              <p className="text-base font-semibold">
                {profile?.company ?? profile?.businessName ?? "Belum ditentukan"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {showProductSkeleton
              ? Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={`product-skeleton-${index}`}
                    className="animate-pulse rounded-3xl border border-border/60 bg-background/70 p-6"
                  >
                    <div className="h-4 w-24 rounded bg-border/60" />
                    <div className="mt-3 h-6 w-2/3 rounded bg-border/50" />
                    <div className="mt-2 h-4 w-full rounded bg-border/40" />
                    <div className="mt-6 h-5 w-1/2 rounded bg-border/50" />
                  </div>
                ))
              : productCards.map((card) => (
                  <ProductCard
                    key={`${card.workspace.userProductId}-${card.workspace.id}`}
                    title={card.workspace.name ?? card.meta.name}
                    description={card.workspace.description ?? card.meta.description}
                    countryName={card.targetCountry?.name ?? card.workspace.targetCountryName}
                    onExport={() => actions.startExportFlow(card.workspace.id)}
                    onAnalyze={() => actions.startAnalysis(card.workspace.id, card.meta.name)}
                    onRemove={
                      canRemoveProducts ? () => actions.requestRemoveProduct(card.workspace.id) : undefined
                    }
                    disableRemove={!canRemoveProducts}
                  />
                ))}

            {!workspaceLoading && productCards.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border/60 bg-background/70 p-6 text-center text-sm text-muted-foreground">
                Belum ada produk yang dipantau. Tambahkan produk unggulan Anda terlebih dahulu.
              </div>
            )}

            <button
              type="button"
              onClick={actions.openAddProductModal}
              className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-background/70 p-6 text-center text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-6 w-6" />
              </span>
              <span className="mt-3 text-lg font-semibold text-foreground">Tambah Produk</span>
              <p className="mt-2">Pilih produk siap ekspor lainnya untuk dipantau.</p>
            </button>
          </div>
          {workspaceError && (
            <p className="mt-3 text-xs text-destructive">Gagal memuat produk pengguna: {workspaceError}</p>
          )}
        </div>

        <section className="space-y-4 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                News & Insight
              </p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Kabar ekspor terbaru</h2>
              {newsMeta.timestamp && (
                <p className="text-xs text-muted-foreground">Terakhir diperbarui: {new Date(newsMeta.timestamp).toLocaleString("id-ID")}</p>
              )}
            </div>
            <button
              type="button"
              onClick={actions.refreshNews}
              className="inline-flex items-center gap-2 rounded-2xl border border-border/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 disabled:opacity-60"
              disabled={newsRefreshing}
            >
              {newsRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {newsRefreshing ? "Memuat..." : "Muat ulang"}
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2 sm:flex-1">
              {[
                { label: "Semua", value: "" },
                { label: "Regulasi", value: "regulations" },
                { label: "Market Insights", value: "market-insights" },
                { label: "Program", value: "programs" },
                { label: "Event", value: "events" },
              ].map((category) => (
                <button
                  key={category.value || "all"}
                  type="button"
                  onClick={() => actions.setNewsCategory(category.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    (newsFilters.category ?? "") === (category.value ?? "")
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-secondary-foreground hover:text-primary"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              <select
                value={newsFilters.country ?? ""}
                onChange={(event) => actions.setNewsCountry(event.target.value)}
                className="w-full rounded-2xl border border-border/60 bg-white px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Semua negara</option>
                {countryOptions.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select
                value={newsFilters.productType ?? ""}
                onChange={(event) => actions.setNewsProductType(event.target.value)}
                className="w-full rounded-2xl border border-border/60 bg-white px-3 py-2 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Semua produk</option>
                {newsProductOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {showNewsSkeleton &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`news-skeleton-${index}`}
                  className="animate-pulse rounded-3xl border border-border/60 bg-background/70 p-4"
                >
                  <div className="h-3 w-24 rounded bg-border/60" />
                  <div className="mt-3 h-5 w-3/4 rounded bg-border/50" />
                  <div className="mt-2 h-3 w-full rounded bg-border/40" />
                </div>
              ))}
            {!showNewsSkeleton &&
              newsItems.map((news) => (
                <article
                  key={news.id}
                  className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition hover:border-primary/40"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold uppercase tracking-[0.3em]">{news.tag ?? "Berita"}</span>
                    <span>{news.date}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{news.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{news.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{news.source}</span>
                    {news.sourceUrl && (
                      <a
                        href={news.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Detail
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            {!showNewsSkeleton && !newsItems.length && (
              <div className="md:col-span-2 rounded-3xl border border-dashed border-border/60 bg-background/60 p-6 text-center text-sm text-muted-foreground">
                {newsError ?? "Belum ada berita sesuai filter yang dipilih."}
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal
        open={modals.export}
        onClose={actions.closeExportModal}
        title="Konfirmasi Export"
      >
        <p className="text-sm text-slate-600">{messages.exportConfirmation}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => actions.handleExportDecision(true)}
            className="flex-1 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Ya, lanjutkan
          </button>
          <button
            type="button"
            onClick={() => actions.handleExportDecision(false)}
            className="flex-1 rounded-2xl border border-secondary-foreground/60 px-4 py-2 text-sm font-semibold text-secondary transition hover:border-primary/40"
          >
            Tidak, analisa dulu
          </button>
        </div>
      </Modal>

      <Modal
        open={modals.countrySelect}
        onClose={actions.closeCountryModal}
        title="Pilih Negara Tujuan"
      >
        <p className="text-sm text-slate-600">
          Tentukan negara tujuan sebelum melanjutkan ke Document Center.
        </p>
        <select
          value={selectedCountryId}
          onChange={(event) => setSelectedCountryId(event.target.value)}
          className="mt-4 w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          disabled={countrySelectionLoading}
        >
          {countryOptions.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={actions.submitCountrySelection}
          disabled={countrySelectionLoading || !selectedCountryId}
          className="mt-4 w-full cursor-pointer rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {countrySelectionLoading ? "Menyimpan..." : "Simpan & buka Document Center"}
        </button>
      </Modal>

      <Modal
        open={modals.addProduct}
        onClose={actions.closeAddProductModal}
        title="Tambah Produk"
      >
        <p className="text-sm text-slate-600">
          Pilih produk resmi dari katalog ekspor Indonesia untuk ditambahkan ke workspace Anda.
        </p>
        {productsLoading && (
          <p className="mt-4 text-xs text-muted-foreground">Memuat katalog produk...</p>
        )}
        {productsError && (
          <p className="mt-4 text-xs text-destructive">Gagal memuat katalog: {productsError}</p>
        )}
        <select
          value={selectedCatalogProductId}
          onChange={(event) => setSelectedCatalogProductId(event.target.value)}
          className="mt-4 w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          disabled={productsLoading || addProductOptions.length === 0 || addProductLoading}
        >
          {addProductOptions.length === 0 ? (
            <option value="">Semua produk sudah ditambahkan</option>
          ) : (
            addProductOptions.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))
          )}
        </select>
        <button
          type="button"
          onClick={actions.submitAddProduct}
          disabled={!selectedCatalogProductId || addProductLoading}
          className="mt-4 w-full cursor-pointer rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {addProductLoading ? "Menambahkan..." : "Tambahkan produk"}
        </button>
      </Modal>

      <Modal
        open={modals.removeProduct}
        onClose={actions.closeRemoveProductModal}
        title="Hapus Produk"
      >
        <p className="text-sm text-slate-600">
          {productPendingRemoval
            ? `Hapus ${productPendingRemoval.name} dari daftar produk yang dipantau?`
            : "Hapus produk ini dari workspace?"}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={actions.confirmRemoveProduct}
            disabled={removeProductLoading}
            className="flex-1 cursor-pointer rounded-2xl bg-destructive px-4 py-2 text-sm font-semibold text-white transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {removeProductLoading ? "Menghapus..." : "Ya, hapus"}
          </button>
          <button
            type="button"
            onClick={actions.closeRemoveProductModal}
            className="flex-1 rounded-2xl border border-border/60 px-4 py-2 text-sm font-semibold text-secondary transition hover:border-primary/40"
          >
            Batalkan
          </button>
        </div>
      </Modal>
    </section>
    );
  } catch (error) {
    console.error("[DashboardPage] Error rendering dashboard:", error);
    return (
      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-900">Error</h2>
            <p className="text-sm text-red-700 mt-2">
              Terjadi kesalahan saat memuat dashboard. Silakan muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </section>
    );
  }
};

export default DashboardPage;
