'use client';

import { motion } from "framer-motion";
import { Star, Quote, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Rizki Pratama",
    role: "Founder KopiLokal.id",
    content:
      "Sebelumnya kami riset pasar manual sampai 2 minggu. Dengan XPOGO, negara tujuan langsung jelas dan dokumen dicek otomatis.",
    rating: 5,
    achievement: "Ekspor pertama selesai 21 hari",
    delay: 0.1,
    gradient: "from-primary to-accent",
  },
  {
    name: "Sari Dewi",
    role: "Owner Batik Nusantara",
    content:
      "Document Center memaksa tim kami disiplin. Semua checklist disimpan di satu timeline jadi gampang kalau ada audit buyer.",
    rating: 5,
    achievement: "5 negara aktif dalam 6 bulan",
    delay: 0.2,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    name: "Ahmad Fauzi",
    role: "CEO Snack Mulia",
    content:
      "Export Assistant berguna banget saat lembur. Tinggal tanya di floating button, AI bantu merangkum regulasi terbaru.",
    rating: 5,
    achievement: "Biaya konsultasi turun 60%",
    delay: 0.3,
    gradient: "from-amber-500 to-orange-400",
  },
  {
    name: "Maya Putri",
    role: "Co-founder Rempah.id",
    content:
      "Dashboard memberikan news regulasi harian. Kami selalu siap sebelum buyer bertanya soal aturan impor terbaru.",
    rating: 5,
    achievement: "3 kontrak Eropa baru",
    delay: 0.4,
    gradient: "from-indigo-500 to-purple-400",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="relative overflow-hidden py-20">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
    <div className="absolute top-0 right-0 h-96 w-96 -translate-y-48 translate-x-48 rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2"
        >
          <TrendingUp className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Export Stories</p>
        </motion.div>

        <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
          Dipakai oleh UMKM yang serius
          <span className="mx-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            menembus pasar global
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Workflow XPOGO membantu tim penjualan, operasional, dan founder berbicara dengan bahasa yang sama.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((testi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: testi.delay }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-card/70 bg-gradient-to-b from-card/90 to-card/60 p-6 shadow-card backdrop-blur-sm"
          >
            <Quote className="absolute -top-2 -right-2 h-16 w-16 text-secondary group-hover:text-primary/20 transition-colors" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-6 text-lg italic text-foreground">&ldquo;{testi.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${testi.gradient}`} />
                <div className="flex-1">
                  <p className="font-bold text-foreground">{testi.name}</p>
                  <p className="text-sm text-muted-foreground">{testi.role}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-accent/10 p-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{testi.achievement}</span>
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br ${testi.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground shadow-2xl shadow-primary/30"
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold">98%</div>
            <div className="text-sm opacity-90">Tingkat kepuasan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">4.9/5</div>
            <div className="text-sm opacity-90">Rata-rata rating pengguna</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm opacity-90">Produk aktif di workspace</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm opacity-90">Export Assistant siap</div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonials;
