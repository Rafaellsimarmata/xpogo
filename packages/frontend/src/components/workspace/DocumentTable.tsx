"use client";

import { useState, useEffect } from "react";
import type { DocumentRequirement } from "@/src/lib/utils/parseCompliance";

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
  onStatusChange?: (docId: string, newStatus: DocumentRequirement["status"]) => void;
  countryId?: string;
};

const getStoredUpdates = (countryId?: string): Record<string, DocumentRequirement["status"]> => {
  if (typeof window === "undefined") return {};
  const storageKey = `document-status-${countryId}`;
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Failed to parse stored document updates", e);
    return {};
  }
};

export const DocumentTable = ({ documents: initialDocuments, onStatusChange, countryId }: DocumentTableProps) => {
  const [documentUpdates, setDocumentUpdates] = useState<Record<string, DocumentRequirement["status"]>>(() =>
    getStoredUpdates(countryId)
  );

  // Save to localStorage whenever documentUpdates changes
  useEffect(() => {
    const storageKey = `document-status-${countryId}`;
    localStorage.setItem(storageKey, JSON.stringify(documentUpdates));
  }, [documentUpdates, countryId]);

  // Apply local updates to documents
  const documents = initialDocuments.map((doc) => ({
    ...doc,
    status: documentUpdates[doc.id] ?? doc.status,
  }));

  const handleDocumentStatusChange = (docId: string, checked: boolean) => {
    const newStatus: DocumentRequirement["status"] = checked ? "complete" : "pending";
    setDocumentUpdates((prev) => ({
      ...prev,
      [docId]: newStatus,
    }));
    onStatusChange?.(docId, newStatus);
  };

  return (
  <div className="mt-4 overflow-x-auto">
    <table className="w-full text-left text-sm">
      <thead className="text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th className="pb-2">Dokumen</th>
          <th className="pb-2 min-w-[120px]">Status</th>
          <th className="pb-2">Level</th>
          <th className="pb-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id} className="border-t border-border/40">
            <td className="py-3">
              <p className="font-semibold text-foreground">{doc.title}</p>
            </td>
            <td className="py-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusBadge[doc.status]}`}>
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.status === "complete"}
                  onChange={(e) => handleDocumentStatusChange(doc.id, e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  Dokumen sudah dikirim
                </span>
              </label>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};
