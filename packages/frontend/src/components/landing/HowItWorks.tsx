'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, Upload, Search, FileText, Users, Rocket } from "lucide-react";

const steps = [
  {
    title: "Sign Up & Setup Profile",
    description: "Buat akun, isi profil UMKM-mu. Cuma butuh 2 menit!",
    icon: Upload,
    gradient: "from-primary to-accent",
    details: ["Email & password", "Data perusahaan", "Jenis produk"],
  },
  {
    title: "Pick Your Product",
    description: "Pilih produk yang mau diekspor dari database kami.",
    icon: Search,
    gradient: "from-emerald-500 to-teal-400",
    details: ["100+ produk", "HS Code auto-detect", "Market trends"],
  },
  {
    title: "Get Market Analysis",
    description: "Dapetin rekomendasi negara + skor kecocokan otomatis.",
    icon: Rocket,
    gradient: "from-amber-500 to-orange-400",
    details: ["Top 5 negara", "Harga pasar", "Competition level"],
  },
  {
    title: "Complete Documents",
    description: "Checklist dokumen lengkap dengan progress tracker.",
    icon: FileText,
    gradient: "from-indigo-500 to-purple-400",
    details: ["Auto-checklist", "Status real-time", "Deadline reminder"],
  },
  {
    title: "Connect with Buyers",
    description: "Temukan distributor & importer terverifikasi.",
    icon: Users,
    gradient: "from-pink-500 to-rose-400",
    details: ["Verified partners", "Rating system", "Direct chat"],
  },
  {
    title: "Export & Track",
    description: "Kirim produk dan pantau progress sampai tiba.",
    icon: CheckCircle2,
    gradient: "from-green-500 to-emerald-400",
    details: ["Shipping logistics", "Real-time tracking", "Support 24/7"],
  },
];

const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      <div className="absolute top-1/4 left-10 h-64 w-64 rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-10 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-400/5 to-purple-300/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2"
          >
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              How It Works
            </p>
          </motion.div>
          
          <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Ekspor dalam
            <span className="mx-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              6 Langkah Mudah
            </span>
          </h2>
          
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Dari zero to export hero! Ikuti panduan visual kami yang 
            <span className="font-semibold text-primary"> gamified & easy to follow</span>.
          </p>
        </div>

        {/* Steps - Desktop View */}
        <div className="hidden lg:block">
          {/* Progress Bar */}
          <div className="relative mb-12">
            <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-secondary via-accent/20 to-secondary" />
            <div className="relative flex justify-between">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="h-8 w-8 rounded-full border-4 border-card bg-gradient-to-r from-primary to-accent shadow-lg" />
                  {index < steps.length - 1 && (
                    <ChevronRight className="absolute -right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/30" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
                  hoveredStep === index
                    ? "border-primary/30 bg-gradient-to-br from-secondary/80 to-card shadow-card-hover scale-[1.02]"
                    : "border-border/50 bg-card/70 shadow-card"
                }`}
              >
                {/* Step Number */}
                <div className="absolute -right-4 -top-4">
                  <div className="relative">
                    <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${step.gradient} opacity-10`} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-foreground/10">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Icon */}
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${step.gradient} p-3 text-primary-foreground shadow-lg`}>
                  <step.icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {step.description}
                </p>

                {/* Details */}
                <div className="space-y-2">
                  {step.details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: hoveredStep === index ? 1 : 0.7,
                        x: hoveredStep === index ? 0 : -10
                      }}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      {detail}
                    </motion.div>
                  ))}
                </div>

                {/* Hover Arrow */}
                <ChevronRight className={`absolute bottom-4 right-4 h-4 w-4 text-primary transition-all duration-300 ${
                  hoveredStep === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                }`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps - Mobile View */}
        <div className="lg:hidden">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl border border-border/50 bg-card/80 p-6 shadow-card"
              >
                {/* Step Indicator */}
                <div className="absolute -left-3 top-6">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-primary-foreground font-bold shadow-lg`}>
                    {index + 1}
                  </div>
                </div>

                <div className="ml-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`inline-flex rounded-lg bg-gradient-to-br ${step.gradient} p-2 text-primary-foreground`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-primary/30" />
                    )}
                  </div>

                  <h3 className="mb-2 font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.details.map((detail, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-secondary px-3 py-1 text-xs text-primary"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground"
        >
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold">2</div>
              <div className="text-sm opacity-90">Menit Setup</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm opacity-90">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">0%</div>
              <div className="text-sm opacity-90">Biaya Awal</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
