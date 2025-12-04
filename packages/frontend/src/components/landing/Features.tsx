'use client';

import { motion } from "framer-motion";
import { Brain, FileCheck2, Route, Zap, TrendingUp, ShieldCheck } from "lucide-react";

const featureData = [
  {
    title: "Market Intelligence AI",
    description: "Dapetin skor kecocokan pasar otomatis! AI kita analisis harga, tren, dan peluang ekspor buat produkmu.",
    icon: Brain,
    gradient: "from-primary via-accent to-primary",
  },
  {
    title: "DocuAssist AI",
    description: "Auto-checklist dokumen ekspor! Cukup pilih negara, semua persyaratan langsung keluar dengan status progress.",
    icon: FileCheck2,
    gradient: "from-emerald-500 via-accent to-primary",
  },
  {
    title: "Smart Matching",
    description: "Temukan buyer & distributor terpercaya otomatis. Sistem matching kita analisis berdasarkan rating dan review.",
    icon: TrendingUp,
    gradient: "from-indigo-500 via-purple-400 to-pink-500",
  },
  {
    title: "Export Workflow",
    description: "Step-by-step guide buat pemula! Dari riset pasar sampe kirim barang, kita pandu sampe berhasil.",
    icon: Route,
    gradient: "from-amber-500 via-orange-400 to-red-500",
  },
  {
    title: "Real-time Tracking",
    description: "Pantau progress ekspor real-time! Notif otomatis kalo ada update dokumen atau perubahan regulasi.",
    icon: Zap,
    gradient: "from-accent via-primary to-indigo-500",
  },
  {
    title: "Data Security",
    description: "Data UMKM-mu aman dengan enkripsi tingkat tinggi. ISO 27001 certified & compliance global.",
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
      damping: 12
    },
  }),
};

const Features = () => (
  <section id="features" className="relative overflow-hidden py-20">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent" />
    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-300/10 to-purple-400/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2"
        >
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Power Up Your Export
          </p>
        </motion.div>
        
        <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
          Semua yang kamu butuhkan
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            dalam satu platform
          </span>
        </h2>
        
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Gabungin analisis pasar cerdas sama bantuan dokumen AI. 
          Ekspor jadi semudah <span className="font-semibold text-primary">scroll TikTok</span>!
        </p>
      </div>

      {/* Features Grid */}
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
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            className="group relative overflow-hidden rounded-[2rem] border border-card/70 bg-gradient-to-b from-card/90 to-card/50 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-card-hover"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
            
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
            
            {/* Icon Container */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`relative mb-6 inline-flex rounded-2xl bg-gradient-to-br ${feature.gradient} p-3.5 text-primary-foreground shadow-lg`}
            >
              <feature.icon className="h-6 w-6" />
              {/* Icon Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-foreground/30 to-transparent blur-md" />
            </motion.div>

            {/* Content */}
            <h3 className="mb-3 text-xl font-bold text-foreground">
              {feature.title}
            </h3>
            <p className="text-muted-foreground">
              {feature.description}
            </p>

            {/* Hover Indicator */}
            <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span className="mr-2">Explore feature</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>

            {/* Progress Bar (Decorative) */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 rounded-2xl bg-gradient-to-r from-secondary/50 to-accent/10 p-8 text-center"
      >
        <p className="text-lg font-semibold text-foreground">
          🔥 <span className="text-primary">Limited Offer:</span> Daftar sekarang, dapatkan 
          <span className="font-bold text-primary"> analisis pasar GRATIS</span> untuk produk pertama!
        </p>
      </motion.div>
    </div>
  </section>
);

export default Features;
