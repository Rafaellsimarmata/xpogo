'use client';

import { motion } from "framer-motion";
import { Brain, FileCheck2, MessageCircle } from "lucide-react";

const features = [
  {
    title: "Market Intelligence",
    description: "Analisis pasar real-time dengan AI untuk menemukan peluang ekspor terbaik.",
    icon: Brain,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Document Center",
    description: "Manajemen dokumen ekspor otomatis dengan checklist dan template lengkap.",
    icon: FileCheck2,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    title: "Export Assistant",
    description: "AI assistant yang membantu seluruh proses ekspor dari A sampai Z.",
    icon: MessageCircle,
    gradient: "from-purple-500 to-pink-400",
  },
];


const Features = () => (
  <section id="features" className="relative overflow-hidden py-24 bg-gray-950">
    {/* Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </div>

    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Fitur Inti yang
            <span className="block bg-linear-to-r from-blue-400 to-secondary bg-clip-text text-transparent">
              Mengubah Ekspor Jadi Mudah
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Tiga fitur utama yang menyederhanakan proses ekspor dalam satu platform terintegrasi.
          </p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            {/* Feature Number */}
            <div className="absolute -top-10 -left-8">
              <div className={`text-7xl font-bold bg-linear-to-r ${feature.gradient} bg-clip-text text-transparent select-none`}>
                0{index + 1}
              </div>
            </div>

            {/* Feature Card */}
            <div className="relative bg-linear-to-b from-gray-900/80 to-gray-950/90 rounded-3xl p-8 border border-gray-800 backdrop-blur-sm">
              {/* Icon Circle */}
              <div className="relative mb-8">
                <div className="absolute inset-0">
                  <div 
                    className={`absolute inset-0 rounded-full bg-linear-to-r ${feature.gradient} blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                </div>
                <div className={`relative h-20 w-20 rounded-full bg-linear-to-r ${feature.gradient} flex items-center justify-center mx-auto`}>
                  <div className="absolute inset-2 rounded-full bg-gray-950 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-transparent via-blue-500 to-transparent group-hover:w-3/4 transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Simple CTA Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-blue-500/10 to-secondary/10 border border-blue-500/20">
          <span className="text-md text-primary">Mulai gratis dengan analisis pasar pertama</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Features;
