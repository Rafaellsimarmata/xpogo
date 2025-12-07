'use client';

import { motion } from "framer-motion";
import { UserCircle, Search, FileText, MessageSquare, Truck, BarChart } from "lucide-react";

const steps = [
  {
    title: "Profil UMKM",
    icon: UserCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    desc: "Setup data perusahaan dan produk fokus",
  },
  {
    title: "Analisis Pasar",
    icon: Search,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    desc: "Temukan negara terbaik dengan AI",
  },
  {
    title: "Dokumen Ekspor",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    desc: "Checklist otomatis dan template",
  },
  {
    title: "Asisten AI",
    icon: MessageSquare,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    desc: "Tanya langsung ke Export Assistant",
  },
  {
    title: "Kirim Produk",
    icon: Truck,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    desc: "Tracking shipment dan pengiriman",
  },
  {
    title: "Monitoring",
    icon: BarChart,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    desc: "Pantau progress real-time",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 bg-gray-950">
      {/* Background sama dengan landing page */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950" />
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="mb-4 text-4xl md:text-5xl font-bold text-white">
              Cara Kerja
              <span className="block bg-linear-to-r from-blue-400 to-secondary bg-clip-text text-transparent">
                XPOGO
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Enam langkah sederhana menuju ekspor sukses
            </p>
          </motion.div>
        </div>

        {/* Desktop Layout - 2 Rows tanpa garis */}
        <div className="hidden lg:block">
          {/* First Row - Steps 1-3 */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {steps.slice(0, 3).map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="group relative bg-linear-to-b from-gray-900/40 to-gray-950/40 rounded-3xl p-8 border border-gray-800 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Step Number - Top Left */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className="h-10 w-10 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">0{index + 1}</span>
                    </div>
                  </div>
                  
                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-2xl ${step.bg} ${step.border} border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      {step.desc}
                    </p>
                  </div>
                  
                  {/* Bottom Hover Line */}
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-linear-to-r from-blue-500 to-cyan-500 -translate-x-1/2 group-hover:w-3/4 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second Row - Steps 4-6 */}
          <div className="grid grid-cols-3 gap-8">
            {steps.slice(3).map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 3) * 0.1 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="group relative bg-linear-to-b from-gray-900/40 to-gray-950/40 rounded-3xl p-8 border border-gray-800 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Step Number - Top Right */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="h-10 w-10 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">0{index + 4}</span>
                    </div>
                  </div>
                  
                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-2xl ${step.bg} ${step.border} border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      {step.desc}
                    </p>
                  </div>
                  
                  {/* Bottom Hover Line */}
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-linear-to-r from-blue-500 to-cyan-500 -translate-x-1/2 group-hover:w-3/4 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout - tanpa garis */}
        <div className="lg:hidden">
          <div className="space-y-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="group bg-linear-to-b from-gray-900/40 to-gray-950/40 rounded-2xl p-4 border border-gray-800 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    {/* Step Number */}
                    <div className="shrink-0">
                      <div className="h-9 w-9 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">0{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className={`p-2.5 rounded-xl ${step.bg} ${step.border} border transition-all duration-300 group-hover:scale-105`}>
                      <step.icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mobile Hover Line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Simple CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-blue-500/10 to-secondary/10 border border-blue-500/20 backdrop-blur-sm">
            <span className="text-sm text-blue-300">Mulai alur ekspor profesional Anda</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
