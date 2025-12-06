'use client';

import { motion } from "framer-motion";
import { Star, Quote, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Rizki Pratama",
    role: "Founder KopiLokal.id",
    content: "Sebelumnya kami riset pasar manual sampai 2 minggu. Dengan XPOGO, negara tujuan langsung jelas dan dokumen dicek otomatis.",
    rating: 5,
    achievement: "Ekspor pertama selesai 21 hari",
    delay: 0.1,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    name: "Sari Dewi",
    role: "Owner Batik Nusantara",
    content: "Document Center memaksa tim kami disiplin. Semua checklist disimpan di satu timeline jadi gampang kalau ada audit buyer.",
    rating: 5,
    achievement: "5 negara aktif dalam 6 bulan",
    delay: 0.2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    name: "Ahmad Fauzi",
    role: "CEO Snack Mulia",
    content: "Export Assistant berguna banget saat lembur. Tinggal tanya di floating button, AI bantu merangkum regulasi terbaru.",
    rating: 5,
    achievement: "Biaya konsultasi turun 60%",
    delay: 0.3,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    name: "Maya Putri",
    role: "Co-founder Rempah.id",
    content: "Dashboard memberikan news regulasi harian. Kami selalu siap sebelum buyer bertanya soal aturan impor terbaru.",
    rating: 5,
    achievement: "3 kontrak Eropa baru",
    delay: 0.4,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
];

const stats = [
  { value: "98%", label: "Tingkat kepuasan" },
  { value: "4.9/5", label: "Rata-rata rating" },
  { value: "500+", label: "Produk aktif" },
  { value: "24/7", label: "Asisten AI siap" },
];

const Testimonials = () => (
  <section id="testimonials" className="relative py-24 bg-gray-950">
    {/* Background */}
    <div className="absolute inset-0 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950" />
    <div className="absolute top-0 right-0 h-64 w-64 -translate-y-32 translate-x-32 rounded-full bg-linear-to-r from-blue-500/5 to-cyan-500/5 blur-3xl" />

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
            Testimoni
            <span className="block bg-linear-to-r from-blue-400 to-secondary bg-clip-text text-transparent">
              dari UMKM Indonesia
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Workflow XPOGO membantu tim penjualan, operasional, dan founder berbicara dengan bahasa yang sama.
          </p>
        </motion.div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {testimonials.map((testi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: testi.delay }}
            whileHover={{ y: -5 }}
            className="group relative"
          >
            {/* Testimonial Card */}
            <div className="relative bg-linear-to-b from-gray-900/40 to-gray-950/40 rounded-3xl p-8 border border-gray-800 backdrop-blur-sm">
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-700 group-hover:text-blue-500/20 transition-colors" />
              
              {/* Rating */}
              <div className="mb-6 flex items-center gap-1">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              {/* Content */}
              <p className="mb-8 text-gray-300 leading-relaxed italic">&ldquo;{testi.content}&rdquo;</p>
              
              {/* Author */}
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <div className={`h-12 w-12 rounded-full ${testi.bg} ${testi.border} border flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${testi.color}`}>{testi.name.charAt(0)}</span>
                </div>
                
                {/* Info */}
                <div>
                  <p className="font-bold text-white">{testi.name}</p>
                  <p className="text-sm text-gray-400">{testi.role}</p>
                </div>
              </div>
              
              {/* Achievement */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${testi.bg} ${testi.border} border`}>
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">{testi.achievement}</span>
              </div>
              
              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="bg-linear-to-b from-gray-900/40 to-gray-950/40 rounded-3xl p-8 border border-gray-800 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonials;