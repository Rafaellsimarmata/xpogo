"use client";

import { motion } from "framer-motion";
import { PlusCircle, Globe, FileCheck2 } from "lucide-react";

const actions = [
  {
    label: "Tambah Produk Baru",
    description: "Masukkan HS Code & kategori",
    icon: PlusCircle,
  },
  {
    label: "Lihat Market Analysis",
    description: "Rekomendasi negara tujuan",
    icon: Globe,
  },
  {
    label: "Cek Dokumen",
    description: "Checklist DocuAssist",
    icon: FileCheck2,
  },
];

const QuickActions = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {actions.map((action) => (
      <motion.button
        key={action.label}
        whileHover={{ y: -3 }}
        className="rounded-3xl border border-white/40 bg-white/80 p-4 text-left shadow shadow-blue-100 transition hover:border-blue-100 hover:bg-white"
      >
        <div className="mb-3 inline-flex rounded-2xl bg-blue-50 p-2 text-blue-500">
          <action.icon className="h-5 w-5" />
        </div>
        <p className="font-semibold text-slate-900">{action.label}</p>
        <p className="text-sm text-slate-500">{action.description}</p>
      </motion.button>
    ))}
  </div>
);

export default QuickActions;
