"use client";

import { useMemo } from "react";
import DocumentChecklist from "@/src/components/market/DocumentChecklist";
import { useUser } from "@/src/context/UserContext";
import { products } from "@/src/lib/data/products";
import { countries } from "@/src/lib/data/countries";
import { generateChecklist, checklistCompletion } from "@/src/lib/data/documents";

const DocuAssistPage = () => {
  const { profile } = useUser();
  const product = products.find((item) => item.id === profile.focusProduct) ?? products[0];
  const country =
    countries.find((item) => item.id === profile.targetCountry) ??
    countries.find((item) => item.readiness === "Cocok untuk pemula") ??
    countries[0];

  const checklist = useMemo(
    () => generateChecklist(product.id, country.id),
    [product.id, country.id],
  );

  const completion = checklistCompletion(checklist);
  const totalDocs = checklist.length;
  const pendingDocs = checklist.filter((doc) => doc.status !== "complete").length;

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            DocuAssist
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Checklist dokumen aktif</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Menggunakan data produk <span className="font-semibold text-foreground">{product.name}</span> untuk target{" "}
            <span className="font-semibold text-foreground">{country.name}</span>. Sesuaikan data profil untuk melihat checklist lainnya.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Progress</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{completion}%</p>
              <p className="text-xs text-muted-foreground">{totalDocs} dokumen ditrack</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Pending</p>
              <p className="mt-2 text-3xl font-bold text-warning">{pendingDocs}</p>
              <p className="text-xs text-muted-foreground">Perlu tindakan segera</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Produk</p>
              <p className="mt-2 font-semibold text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">HS {product.hsCode}</p>
            </div>
          </div>
        </div>

        <DocumentChecklist
          documents={checklist}
          title="Checklist prioritas"
          description={`Persyaratan yang aktif untuk produk ${product.name} ke ${country.name}. Setelah API terhubung, data ini akan mengikuti akun pengguna.`}
        />
      </div>
    </section>
  );
};

export default DocuAssistPage;
