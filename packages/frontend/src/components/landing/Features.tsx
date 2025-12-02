"use client";

import { motion } from "framer-motion";
import { Brain, FileCheck2, Route } from "lucide-react";

const featureData = [
  {
    title: "Market Intelligence",
    description: "Skoring otomatis untuk menentukan negara tujuan ekspor terbaik disertai data harga, waktu pengiriman, dan kesiapan pasar.",
    icon: Brain,
    accent: "from-blue-600 via-blue-500 to-cyan-300",
  },
  {
    title: "DocuAssist",
    description: "Checklist dokumen ekspor personal berdasarkan profil UMKM, produk yang dipilih, dan regulasi negara tujuan.",
    icon: FileCheck2,
    accent: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    title: "Easy Export Process",
    description: "Workflow terpandu mulai dari riset pasar hingga koneksi ke importer atau distributor terpercaya.",
    icon: Route,
    accent: "from-indigo-600 via-blue-500 to-sky-400",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1 },
  }),
};

const Features = () => (
  <section className="bg-white/60">
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
          Fitur Unggulan
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">All-in-One Export Assistant</h2>
        <p className="mt-2 text-slate-500">
          XPOGO menggabungkan analisis pasar dengan asistensi dokumen dalam satu platform modern.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {featureData.map((feature, index) => (
          <motion.div
            key={feature.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="group rounded-3xl border border-white/50 bg-gradient-to-b from-white to-white/60 p-6 shadow-lg shadow-blue-500/10 backdrop-blur-md transition hover:-translate-y-2 hover:shadow-2xl"
          >
            <div
              className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${feature.accent} p-3 text-white shadow-lg`}
            >
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-3 text-sm text-slate-500">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
