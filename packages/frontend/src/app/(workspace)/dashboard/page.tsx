'use client';

import { useMemo } from "react";
import { Globe2, FileCheck2, Users2, ClipboardList } from "lucide-react";
import StatsCard from "@/src/components/dashboard/StatsCard";
import QuickActions, { type QuickActionItem } from "@/src/components/dashboard/QuickActions";
import RecentActivity, { type ActivityItem } from "@/src/components/dashboard/RecentActivity";
import { useUser } from "@/src/context/UserContext";
import { countries } from "@/src/lib/data/countries";
import { products } from "@/src/lib/data/products";
import { generateChecklist, checklistCompletion } from "@/src/lib/data/documents";

const statusBadge: Record<string, string> = {
  complete: "border border-emerald-200 bg-emerald-50/80 text-emerald-700",
  "in-progress": "border border-amber-200 bg-amber-50/80 text-amber-700",
  pending: "border border-slate-200 bg-slate-50/80 text-slate-600",
};

const levelBadge: Record<string, string> = {
  basic: "bg-slate-100 text-slate-700",
  "advanced": "bg-indigo-100 text-indigo-700",
};

const DashboardPage = () => {
  const { profile } = useUser();
  const focusProductId = profile.focusProduct ?? "kerajinan";
  const focusProduct = products.find((product) => product.id === focusProductId) ?? products[0];

  const countryMatches = useMemo(
    () => [...countries].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4),
    [],
  );
  const primaryCountry = profile.targetCountry
    ? countries.find((country) => country.id === profile.targetCountry) ?? countryMatches[0]
    : countryMatches[0];

  const checklist = useMemo(
    () => generateChecklist(focusProduct.id, primaryCountry?.id ?? "japan"),
    [focusProduct.id, primaryCountry?.id],
  );
  const completion = checklistCompletion(checklist);
  const completedDocs = checklist.filter((doc) => doc.status === "complete").length;
  const pendingDocs = checklist.filter((doc) => doc.status !== "complete").length;
  const readyBuyers = primaryCountry?.stores?.filter((store) => store.ready).length ?? 0;
  const visibleDocs = checklist.slice(0, 6);

  const stats = [
    {
      label: "Kelengkapan Dokumen",
      value: `${completion}%`,
      subtext: `${completedDocs}/${checklist.length} checklist DocuAssist`,
      icon: <FileCheck2 className="h-5 w-5" />,
      footnote: "Update otomatis setiap kali upload dokumen",
    },
    {
      label: "Negara Prioritas",
      value: `${countryMatches.length}`,
      subtext: `${primaryCountry?.name ?? "Negara"} berada di posisi teratas`,
      icon: <Globe2 className="h-5 w-5" />,
      footnote: "Berdasarkan skor Market Analysis minggu ini",
    },
    {
      label: "Buyer Siap Dihubungi",
      value: `${readyBuyers}`,
      subtext: `${primaryCountry?.name ?? "Negara"} verified`,
      icon: <Users2 className="h-5 w-5" />,
      footnote: "Data diambil dari modul Smart Matching",
    },
  ];

  const quickActions: QuickActionItem[] = [
    {
      label: "DocuAssist",
      description: "Atur checklist & reminder dokumen",
      status: `${pendingDocs} belum selesai`,
      icon: FileCheck2,
    },
    {
      label: "Market Analysis",
      description: "Pantau ranking negara dan biaya masuk",
      status: `${countryMatches.length} negara`,
      icon: Globe2,
    },
    {
      label: "Buyer Pipeline",
      description: "Catat follow-up prospek dari ITPC",
      status: `${readyBuyers} buyer`,
      icon: Users2,
    },
    {
      label: "Task Board",
      description: "Koordinasikan tim operasional",
      status: "3 tugas aktif",
      icon: ClipboardList,
    },
  ];

  const activities: ActivityItem[] = [
    {
      title: "Review label Jepang",
      detail: "DocuAssist menunggu approve QA",
      time: "09:20",
      status: "progress",
    },
    {
      title: "Sinkron data market",
      detail: "Skor negara diperbarui otomatis",
      time: "08:05",
      status: "done",
    },
    {
      title: "Input buyer baru",
      detail: "3 kontak menunggu jadwal meeting",
      time: "Kemarin",
      status: "waiting",
    },
  ];

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Workspace Overview
              </p>
              <h1 className="mt-2 text-3xl font-bold text-foreground">Halo, {profile.fullName}</h1>
              <p className="text-sm text-muted-foreground">
                Progress ekspor untuk {profile.company} terlihat di sini.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <span className="rounded-full border border-border/80 px-3 py-1 text-foreground">
                Fokus produk: <span className="font-semibold">{focusProduct.name}</span> (HS {focusProduct.hsCode})
              </span>
              {primaryCountry && (
                <span className="rounded-full border border-border/80 px-3 py-1 text-foreground">
                  Target negara: <span className="font-semibold">{primaryCountry.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Checklist Dokumen</h2>
                  <p className="text-sm text-muted-foreground">
                    Urutkan dokumen yang harus dipenuhi sebelum pengiriman.
                  </p>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                  {completion}% lengkap
                </span>
              </div>
              <div className="mt-4 divide-y divide-border/60">
                {visibleDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="grid gap-4 py-4 text-sm text-foreground sm:grid-cols-[2.2fr_0.6fr_0.8fr_0.6fr]"
                  >
                    <div>
                      <p className="font-semibold">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </div>
                    <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${levelBadge[doc.level]}`}>
                      {doc.level === "basic" ? "Dasar" : "Advanced"}
                    </span>
                    <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[doc.status]}`}>
                      {doc.status === "complete"
                        ? "Selesai"
                        : doc.status === "in-progress"
                          ? "Sedang berjalan"
                          : "Belum mulai"}
                    </span>
                    {doc.actionLabel ? (
                      <button
                        type="button"
                        className="self-start text-xs font-semibold text-primary underline-offset-2 hover:underline"
                      >
                        {doc.actionLabel}
                      </button>
                    ) : (
                      <span className="self-start text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Negara Prioritas</h2>
                  <p className="text-sm text-muted-foreground">Data Market Analysis terbaru.</p>
                </div>
                <span className="text-xs text-muted-foreground">Update harian</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="pb-2">Negara</th>
                      <th className="pb-2">Skor</th>
                      <th className="pb-2">Estimasi</th>
                      <th className="pb-2">Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryMatches.map((country) => (
                      <tr key={country.id} className="border-t border-border/40 text-foreground">
                        <td className="py-3">
                          <div>
                            <p className="font-semibold">{country.name}</p>
                            <p className="text-xs text-muted-foreground">{country.region}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 flex-1 rounded-full bg-border/60">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                style={{ width: `${country.matchScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{country.matchScore}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{country.estimatedTime} hari</td>
                        <td className="py-3 text-xs text-muted-foreground">{country.readiness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <QuickActions items={quickActions} />
            <RecentActivity items={activities} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
