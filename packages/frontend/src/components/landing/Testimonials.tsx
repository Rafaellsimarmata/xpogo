'use client';

import { motion } from "framer-motion";
import { Star, Quote, TrendingUp, Zap } from "lucide-react";

const testimonials = [
  {
    name: "Rizki Pratama, 24",
    role: "Founder @KopiLokalID",
    content: "XPOGO bikin ekspor pertama kami ke Jepang cuma 3 minggu! UI-nya keren banget, ga ribet kaya platform lain.",
    rating: 5,
    achievement: "First export: $25,000",
    delay: 0.1,
    gradient: "from-primary to-accent",
  },
  {
    name: "Sari Dewi, 27",
    role: "Owner @BatikNusantara",
    content: "DocuAssist AI-nya ngebantu banget! Checklist dokumen otomatis, jadi ga perlu hire konsultan mahal.",
    rating: 5,
    achievement: "Exported to 5 countries",
    delay: 0.2,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    name: "Ahmad Fauzi, 26",
    role: "CEO @SnackMulia",
    content: "Market Intelligence-nya accurate banget! Rekomendasi negara pas sesuai produk kami. Revenue naik 300%!",
    rating: 5,
    achievement: "300% growth in 6 months",
    delay: 0.3,
    gradient: "from-amber-500 to-orange-400",
  },
  {
    name: "Maya Putri, 25",
    role: "Co-founder @Rempah.id",
    content: "Connecting with verified buyers jadi gampang banget. Udah dapet 3 kontrak besar dari platform ini!",
    rating: 5,
    achievement: "3 major contracts secured",
    delay: 0.4,
    gradient: "from-indigo-500 to-purple-400",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="relative overflow-hidden py-20">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
    <div className="absolute top-0 right-0 h-96 w-96 -translate-y-48 translate-x-48 rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-400/10 px-4 py-2"
        >
          <Zap className="h-4 w-4 animate-pulse text-pink-500" />
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">
            Success Stories
          </p>
        </motion.div>

        <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
          Dipercaya oleh 
          <span className="mx-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            UMKM Muda Indonesia
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Lihat bagaimana anak muda Indonesia menguasai pasar global dengan XPOGO.
        </p>
      </div>

      {/* Testimonials Grid */}
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
            {/* Quote Icon */}
            <Quote className="absolute -top-2 -right-2 h-16 w-16 text-secondary group-hover:text-primary/20 transition-colors" />

            {/* Content */}
            <div className="relative">
              {/* Rating */}
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  5.0
                </span>
              </div>

              {/* Testimonial Text */}
              <p className="mb-6 text-lg italic text-foreground">
                &ldquo;{testi.content}&rdquo;
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${testi.gradient}`} />
                <div className="flex-1">
                  <p className="font-bold text-foreground">{testi.name}</p>
                  <p className="text-sm text-muted-foreground">{testi.role}</p>
                </div>
              </div>

              {/* Achievement */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-secondary to-accent/10 p-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {testi.achievement}
                </span>
              </div>
            </div>

            {/* Hover Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${testi.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          </motion.div>
        ))}
      </div>

      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground shadow-2xl shadow-primary/30"
      >
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold">98%</div>
            <div className="text-sm opacity-90">User Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">4.9/5</div>
            <div className="text-sm opacity-90">App Store Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm opacity-90">Active Communities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm opacity-90">Support Response</div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonials;
