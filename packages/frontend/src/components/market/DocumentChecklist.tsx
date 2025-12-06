"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle, UploadCloud } from "lucide-react";
import type { DocumentRequirement } from "@/src/lib/utils/parseCompliance";
import { checklistCompletion } from "@/src/lib/utils/parseCompliance";

type DocumentChecklistProps = {
  documents: DocumentRequirement[];
  title?: string;
  description?: string;
  meta?: ReactNode;
};

const statusStyles: Record<string, string> = {
  complete: "bg-green-50 text-green-600 border-green-100",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-100",
  pending: "bg-slate-50 text-slate-500 border-slate-100",
};

const statusLabel: Record<string, string> = {
  complete: "Sudah ada",
  "in-progress": "Sedang diurus",
  pending: "Belum lengkap",
};

const DocumentChecklist = ({
  documents,
  title = "DocuAssist Checklist",
  description = "Checklist otomatis berdasarkan produk, negara, dan profil UMKM Anda.",
  meta,
}: DocumentChecklistProps) => {
  const progress = checklistCompletion(documents);

  return (
    <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {meta ?? (
          <span className="rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
            Progress {progress}%
          </span>
        )}
      </div>
      <div className="mt-6 h-3 rounded-full bg-slate-100">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="block h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-300"
        />
      </div>
      <div className="mt-6 space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`flex flex-col gap-4 rounded-2xl border bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between ${statusStyles[doc.status]}`}
          >
            <div>
              <p className="font-semibold">{doc.title}</p>
              <p className="text-sm opacity-80">{doc.description}</p>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs text-slate-700">
                {doc.status === "complete" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {statusLabel[doc.status]}
              </span>
              {doc.status !== "complete" && (
                <button className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs text-blue-600">
                  <UploadCloud className="h-4 w-4" />
                  {doc.actionLabel ?? "Upload"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 w-full rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-semibold text-blue-600">
        Download Checklist
      </button>
    </div>
  );
};

export default DocumentChecklist;