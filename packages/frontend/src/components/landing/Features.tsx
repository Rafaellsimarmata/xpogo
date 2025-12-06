'use client';

import { motion } from "framer-motion";
import { Brain, FileCheck2, LayoutDashboard, MessageCircle, Zap, ShieldCheck } from "lucide-react";

const featureData = [
  {
    title: "Market Intelligence",
    description:
      "Masukkan nama produk, dapatkan rekomendasi negara dengan skor kecocokan, estimasi harga, dan insight buyer resmi ITPC.",
    icon: Brain,
    gradient: "from-primary via-accent to-primary",
  },
  {
    title: "Document Center",
    description:
      "Checklist dokumen otomatis berdasarkan produk & negara. Lengkap dengan status, template, dan reminder sebelum batas waktu.",
    icon: FileCheck2,
    gradient: "from-emerald-500 via-teal-400 to-primary",
  },
  {
    title: "Workspace Dashboard",
    description:
      "Pantau produk fokus, update negara prioritas, dan news regulasi ekspor setiap hari tanpa harus mencari manual.",
    icon: LayoutDashboard,
    gradient: "from-amber-500 via-orange-400 to-red-500",
  },
  {
    title: "Export Assistant",
    description:
      "Chatbot yang memahami konteks workspace kamu. Tanya dokumen yang belum selesai, buyer potensial, atau tips negosiasi.",
    icon: MessageCircle,
    gradient: "from-indigo-500 via-purple-400 to-pink-500",
  },
  {
    title: "Live Alerts & News",
    description:
      "Terima peringatan jika ada perubahan regulasi, kuota, atau kebijakan impor di negara tujuan sehingga tim bisa adaptif.",
    icon: Zap,
    gradient: "from-accent via-primary to-indigo-500",
  },
  {
    title: "Security & Compliance",
    description:
      "Data UMKM disimpan di server Indonesia dengan enkripsi penuh. Siap audit LKPP dan tender kementerian.",
    icon: ShieldCheck,
    gradient: "from-violet-500 via-purple-400 to-fuchsia-500",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  }),
};

const Features = () => (
  <section id="features" className="relative overflow-hidden py-20">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent" />
    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-300/10 to-purple-400/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="mb-16 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2"
        >
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Connected Modules</p>
        </motion.div>

        <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
          Semua modul terhubung
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            supaya tim ekspor tidak berpencar
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Tidak perlu lagi berpindah antar spreadsheet, chat grup, dan email. XPOGO menyatukan seluruh proses ekspor
          ke dalam satu workspace yang sinkron.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureData.map((feature, index) => (
          <motion.div
            key={feature.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{
              y: -8,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            className="group relative overflow-hidden rounded-[2rem] border border-card/70 bg-gradient-to-b from-card/90 to-card/50 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
            <div className="absolute top-0 right-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />

            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`relative mb-6 inline-flex rounded-2xl bg-gradient-to-br ${feature.gradient} p-3.5 text-primary-foreground shadow-lg`}
            >
              <feature.icon className="h-6 w-6" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-foreground/30 to-transparent blur-md" />
            </motion.div>

            <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 rounded-2xl bg-gradient-to-r from-secondary/50 to-accent/10 p-8 text-center"
      >
        <p className="text-lg font-semibold text-foreground">
          Daftar sekarang untuk mendapatkan analisis pasar pertama dan checklist dokumen percobaan secara gratis.
        </p>
      </motion.div>
    </div>
  </section>
);

export default Features;
