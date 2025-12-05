"use client";

import type { DocumentRequirement } from "@/src/lib/data/documents";

const statusBadge: Record<DocumentRequirement["status"], string> = {
  complete: "border border-emerald-200 bg-emerald-50/80 text-emerald-700",
  "in-progress": "border border-amber-200 bg-amber-50/80 text-amber-700",
  pending: "border border-slate-200 bg-slate-50/80 text-slate-600",
};

const levelBadge: Record<DocumentRequirement["level"], string> = {
  basic: "bg-slate-100 text-slate-700",
  advanced: "bg-indigo-100 text-indigo-700",
};

type DocumentTableProps = {
  documents: DocumentRequirement[];
};

export const DocumentTable = ({ documents }: DocumentTableProps) => (
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
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[doc.status]}`}>
                {doc.status === "complete"
                  ? "Selesai"
                  : doc.status === "in-progress"
                    ? "Sedang berjalan"
                    : "Belum mulai"}
              </span>
            </td>
            <td className="py-3 text-xs text-muted-foreground">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelBadge[doc.level]}`}>
                {doc.level === "basic" ? "Dasar" : "Advanced"}
              </span>
            </td>
            <td className="py-3">
              <button
                type="button"
                className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
              >
                {doc.actionLabel ?? (doc.status === "complete" ? "Lihat berkas" : "Upload / tandai selesai")}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
