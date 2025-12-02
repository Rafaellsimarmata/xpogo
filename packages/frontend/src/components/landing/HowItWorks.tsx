"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const steps = [
  {
    title: "Lengkapi Profil",
    description: "Isi profil UMKM dan produk unggulan. DocuAssist akan memahami jenis bisnis Anda.",
  },
  {
    title: "Analisis Produk",
    description: "Pilih produk dan lihat rekomendasi negara tujuan dengan skor kecocokan otomatis.",
  },
  {
    title: "Checklist Dokumen",
    description: "Dapatkan daftar dokumen wajib sesuai negara, lengkap dengan status dan tindakan.",
  },
  {
    title: "Hubungkan Buyer",
    description: "Saat dokumen lengkap, pilih daftar distributor dan importer terpercaya.",
  },
];

const HowItWorks = () => (
  <section className="mx-auto max-w-6xl px-6 py-20">
    <div className="mb-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">Workflow</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Empat langkah siap ekspor</h2>
      <p className="mt-2 text-slate-500">Panduan visual yang membantu tim Anda bergerak lebih cepat.</p>
    </div>
    <div className="grid gap-6 md:grid-cols-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: index * 0.1 }}
          className="group rounded-3xl border border-white/50 bg-white/70 p-6 shadow shadow-blue-500/5"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Step {index + 1}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:text-blue-500" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{step.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
