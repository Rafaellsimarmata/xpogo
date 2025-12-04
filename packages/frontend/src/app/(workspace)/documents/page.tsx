"use client";

import { useMemo } from "react";
import { useUser } from "@/src/context/UserContext";
import { products } from "@/src/lib/data/products";
import { countries } from "@/src/lib/data/countries";
import { generateChecklist } from "@/src/lib/data/documents";

const DocumentCenterPage = () => {
  const { profile } = useUser();
  const product = products.find((item) => item.id === profile.focusProduct) ?? products[0];
  const country =
    countries.find((item) => item.id === profile.targetCountry) ??
    countries.find((item) => item.readiness === "Cocok untuk pemula") ??
    countries[0];

  const documents = useMemo(
    () => generateChecklist(product.id, country.id),
    [product.id, country.id],
  );

  const grouped = documents.reduce(
    (acc, doc) => {
      acc[doc.status] = acc[doc.status] + 1;
      return acc;
    },
    { complete: 0, "in-progress": 0, pending: 0 },
  );

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Document Center
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Berkas & template siap pakai</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Data diambil dari checklist DocuAssist untuk produk {product.name} dan target {country.name}. Saat API aktif, halaman ini dapat menampilkan daftar upload, template, dan status verifikasi resmi.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Selesai</p>
              <p className="mt-2 text-3xl font-bold text-success">{grouped.complete}</p>
              <p className="text-xs text-muted-foreground">Berkas siap upload</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Proses</p>
              <p className="mt-2 text-3xl font-bold text-warning">{grouped["in-progress"]}</p>
              <p className="text-xs text-muted-foreground">Menunggu update tim</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Pending</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{grouped.pending}</p>
              <p className="text-xs text-muted-foreground">Belum mulai</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Daftar dokumen</h2>
            <span className="text-xs text-muted-foreground">Gunakan API upload untuk memperbarui status.</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2">Dokumen</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Level</th>
                  <th className="pb-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t border-border/40">
                    <td className="py-3">
                      <p className="font-semibold text-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-foreground"
                      >
                        {doc.status === "complete"
                          ? "Selesai"
                          : doc.status === "in-progress"
                            ? "Sedang berjalan"
                            : "Belum mulai"}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {doc.level === "basic" ? "Dasar" : "Advanced"}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        {doc.status === "complete" ? "Lihat berkas" : "Upload / tandai selesai"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentCenterPage;
