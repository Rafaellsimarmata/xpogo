'use client';

import { useMemo } from "react";
import { useDocumentCenterController } from "@/src/controllers/workspace/documentController";
import { DocumentTableWrapper } from "@/src/components/workspace/DocumentTableWrapper";
import { RecommendationList } from "@/src/components/workspace/RecommendationList";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import type { DocumentRequirement } from "@/src/lib/utils/parseCompliance";

export const DocumentCenterContent = () => {
  const {
    product,
    country,
    documents: apiDocuments,
    serviceProviders,
    complianceLoading,
    complianceError,
    productLoading,
    productError,
  } = useDocumentCenterController();

  const countryId = country?.id;

  // Use custom hook to manage localStorage-backed state without React warnings
  // Key changes with country to isolate saved states per country
  const [allDocumentStatuses, setAllDocumentStatuses] = useLocalStorage<Record<string, DocumentRequirement["status"]>>(
    `doc-statuses-${countryId || 'default'}`,
    {}
  );

  // Apply updates and calculate counts
  const documentsWithUpdates = useMemo(() => {
    return apiDocuments.map((doc) => ({
      ...doc,
      status: allDocumentStatuses[doc.id] ?? doc.status,
    }));
  }, [apiDocuments, allDocumentStatuses]);

  const counts = useMemo(() => {
    return {
      complete: documentsWithUpdates.filter(d => d.status === "complete").length,
      "in-progress": documentsWithUpdates.filter(d => d.status === "in-progress").length,
      pending: documentsWithUpdates.filter(d => d.status === "pending").length,
    };
  }, [documentsWithUpdates]);

  const handleStatusChange = (docId: string, newStatus: DocumentRequirement["status"]) => {
    setAllDocumentStatuses((prev) => ({
      ...prev,
      [docId]: newStatus,
    }));
  };

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Document Center
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Berkas & template siap pakai</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Data diambil dari checklist DocuAssist untuk produk {product.name}{" "}
            {country ? `dan target ${country.name}.` : "dan akan dilengkapi setelah negara tujuan dipilih."}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Kategori</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{product.category ?? "Belum ditentukan"}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">HS Code</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{product.hsCode ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Tingkat</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {product.difficultyLevel ?? "Belum ada data"}
              </p>
            </div>
          </div>
          {product.majorMarkets?.length ? (
            <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Pasar utama</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {product.majorMarkets.slice(0, 5).join(", ")}
              </p>
            </div>
          ) : null}
          {productLoading && (
            <p className="mt-2 text-xs text-muted-foreground">Memuat detail produk terbaru...</p>
          )}
          {productError && (
            <p className="mt-2 text-xs text-red-500">Gagal memuat detail produk: {productError}</p>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Selesai</p>
              <p className="mt-2 text-3xl font-bold text-success">{counts.complete}</p>
              <p className="text-xs text-muted-foreground">Berkas siap upload</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Proses</p>
              <p className="mt-2 text-3xl font-bold text-warning">{counts["in-progress"]}</p>
              <p className="text-xs text-muted-foreground">Menunggu update tim</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Pending</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{counts.pending}</p>
              <p className="text-xs text-muted-foreground">Belum mulai</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Daftar dokumen</h2>
                  <p className="text-sm text-muted-foreground">
                    Gunakan API upload untuk memperbarui status secara otomatis.
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {country ? `Target ${country.name}` : "Negara tujuan belum dipilih"}
                </div>
              </div>

              {country ? (
                <>
                  {complianceLoading && (
                    <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">
                          Memuat daftar dokumen kepatuhan dari AI...
                        </p>
                      </div>
                    </div>
                  )}
                  {complianceError && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-700">
                      <p className="font-semibold">Gagal memuat daftar kepatuhan</p>
                      <p className="mt-1 text-xs">
                        Menampilkan daftar dokumen standar. {complianceError instanceof Error ? complianceError.message : "Silakan coba lagi nanti."}
                      </p>
                    </div>
                  )}
                  {!complianceLoading && (
                    <DocumentTableWrapper 
                      countryId={country?.id}
                      documents={apiDocuments}
                      onStatusChange={handleStatusChange}
                    />
                  )}
                </>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-background/60 p-6 text-sm text-muted-foreground">
                  Pilih negara tujuan terlebih dahulu dari halaman Dashboard → Market Analysis agar checklist dapat
                  disesuaikan secara otomatis.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <RecommendationList
              title="Agen penyedia layanan"
              items={serviceProviders}
              emptyMessage={
                country
                  ? "Belum ada rekomendasi agen untuk negara ini."
                  : "Pilih negara tujuan untuk melihat rekomendasi agen."
              }
              ctaLabel="Hubungi"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
