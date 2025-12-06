'use client';

import Modal from "@/src/components/ui/Modal";
import { ProductCard } from "@/src/components/workspace/ProductCard";
import { useDashboardController } from "@/src/controllers/workspace/dashboardController";

const DashboardPage = () => {
  const {
    profile,
    productCards,
    newsItems,
    countryMatches,
    primaryCountry,
    countryOptions,
    newProductName,
    setNewProductName,
    modals,
    selectedCountryId,
    setSelectedCountryId,
    actions,
    messages,
    countriesLoading,
    countriesError,
  } = useDashboardController();

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Workspace Overview
              </p>
              <h1 className="mt-2 text-3xl font-bold text-foreground">Halo, {profile.businessName}</h1>
              <p className="text-sm text-muted-foreground">
                Pantau produk ekspor dan temukan insight terbaru tiap hari.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 px-5 py-3 text-sm text-foreground">
              Fokus produk: {productCards[0]?.meta.name ?? "Belum dipilih"}
            </div>
          </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productCards.map((card) => (
              <ProductCard
                key={card.workspace.id}
                title={card.meta.name}
                description={card.meta.description}
                countryName={card.targetCountry?.name}
                onExport={() => actions.startExportFlow(card.workspace.id)}
                onAnalyze={() => actions.startAnalysis(card.workspace.id, card.meta.name)}
              />
            ))}

            <button
              type="button"
              onClick={actions.openAddProductModal}
              className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-background/70 p-6 text-center text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <span className="text-lg font-semibold text-foreground">Add Product</span>
              <p className="mt-2">Masukkan nama produk baru untuk dianalisis.</p>
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Market Highlight
              </p>
              <h2 className="text-lg font-semibold text-foreground">
                Negara prioritas minggu ini: {primaryCountry?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {primaryCountry?.readiness} - estimasi proses {primaryCountry?.estimatedTime} hari
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {countriesLoading &&
              [1, 2, 3, 4].map((placeholder) => (
                <div
                  key={placeholder}
                  className="h-24 animate-pulse rounded-2xl border border-border/60 bg-background/50"
                />
              ))}
            {!countriesLoading && countryMatches.length > 0 && (
              <>
                {countryMatches.map((country) => (
                  <div
                    key={country.id}
                    className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-foreground"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{country.name}</p>
                        <p className="text-xs text-muted-foreground">{country.region}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary">{country.matchScore}/100</span>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {country.readiness} - estimasi {country.estimatedTime} hari
                    </p>
                  </div>
                ))}
              </>
            )}
            {!countriesLoading && countryMatches.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 p-4 text-sm text-muted-foreground md:col-span-2">
                {countriesError ?? "Belum ada data negara yang dapat ditampilkan saat ini."}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              News & Insight
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Update terbaru untuk eksportir</h2>
            <p className="text-sm text-muted-foreground">
              Placeholder news card untuk menampilkan berita resmi dari Kementerian Perdagangan, ITPC, dan partner.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {newsItems.map((news) => (
              <article
                key={news.title}
                className="rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition hover:border-primary/40"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {news.tag}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{news.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{news.summary}</p>
                <p className="mt-4 text-xs text-muted-foreground">{news.date}</p>
              </article>
            ))}
          </div>
        </div>
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
          className="mt-4 w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Simpan & buka Document Center
        </button>
      </Modal>

      <Modal
        open={modals.addProduct}
        onClose={actions.closeAddProductModal}
        title="Tambah Produk"
      >
        <p className="text-sm text-slate-600">
          Masukkan nama produk yang ingin dianalisis. Sistem akan membuka Market Intelligence dengan input
          tersebut secara otomatis.
        </p>
        <input
          type="text"
          value={newProductName}
          onChange={(event) => setNewProductName(event.target.value)}
          placeholder="contoh: Kopi Arabika"
          className="mt-4 w-full rounded-2xl border border-border/60 bg-white px-4 py-3 text-sm text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={actions.submitAddProduct}
          className="mt-4 w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Analisa produk
        </button>
      </Modal>
    </section>
  );
};

export default DashboardPage;
