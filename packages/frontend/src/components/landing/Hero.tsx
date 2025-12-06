'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

const heroStats = [
  { label: "Negara siap ekspor", value: "35+" },
  { label: "Checklist akurat", value: "96%" },
  { label: "Analisis pasar", value: "< 5 menit" },
];

const Hero = () => (
  <section
    id="hero"
    className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background"
  >
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 blur-3xl"
      />
    </div>

    <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:gap-12 md:px-8 md:py-20 lg:grid-cols-2 lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-2.5 text-sm font-semibold tracking-wide text-primary shadow-lg shadow-primary/10 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 animate-pulse text-primary" />
          <span>Workspace XPOGO</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Semua tahapan ekspor
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              di satu workspace
            </span>
          </h1>

          <p className="text-lg text-muted-foreground md:text-xl">
            Mulai dari pemilihan produk, analisis negara tujuan, sampai checklist dokumen dan Export Assistant berbasis AI.
            XPOGO memandu UMKM mengikuti alur yang sama dengan tim ekspor profesional.
          </p>

          <div className="flex flex-wrap gap-2 text-sm text-primary">
            <span className="rounded-full bg-primary/10 px-4 py-1">Market Intelligence</span>
            <span className="rounded-full bg-primary/10 px-4 py-1">Document Center</span>
            <span className="rounded-full bg-primary/10 px-4 py-1">Export Assistant</span>
            <span className="rounded-full bg-primary/10 px-4 py-1">Dashboard & News</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild className="group bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <Link href="/signin" className="flex items-center gap-2">
              <span>Masuk Workspace</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild className="border-primary/30 text-primary hover:bg-primary/5">
            <Link
              href="https://youtu.be/dQw4w9WgXcQ?si=-iFSVY8XkRnYJih_"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Globe2 className="h-4 w-4" />
              <span>Lihat demo Market Intelligence</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-card/80 px-5 py-4 shadow-card"
            >
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative"
      >
        <div className="relative grid gap-5 rounded-[32px] bg-card/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/30 to-card/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Market Intelligence</p>
                <p className="text-lg font-semibold text-foreground">Produk Kopi</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Live</span>
            </div>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-foreground">Jepang</p>
                    <p className="text-xs text-muted-foreground">Premium demand • Stable price</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">92</p>
                </div>
              </div>

              {[{ label: "UAE", score: 90 }, { label: "Australia", score: 88 }].map((country, idx) => (
                <div key={country.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{country.label}</span>
                    <span className="font-semibold text-primary">{country.score}/100</span>
                  </div>

                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border/50">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${country.score}%` }}
                      transition={{ delay: 0.6 + idx * 0.2, duration: 1 }}
                      className="block h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-primary/15 to-accent/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Document Center</p>
                <p className="text-lg font-semibold text-foreground">Checklist Jepang</p>
              </div>
              <span className="text-xs text-primary">8/11 selesai</span>
            </div>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-2xl bg-card/60 px-3 py-2">
                <span>Certificate of Origin</span>
                <span className="text-xs text-emerald-500">Approved</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-card/60 px-3 py-2">
                <span>Label Bahasa Jepang</span>
                <span className="text-xs text-primary">Dalam review</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card/90 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Export Assistant</p>
              <span className="text-xs text-muted-foreground">Chat aktif</span>
            </div>

            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="rounded-2xl bg-card/70 p-3">
                <p className="text-xs uppercase tracking-widest text-primary">Assistant</p>
                <p className="text-sm text-foreground">
                  “Buyer Jepang meminta contoh produk minggu depan. Pastikan COO selesai terlebih dulu.”
                </p>
              </div>

              <div className="rounded-2xl bg-card/70 p-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Kamu</p>
                <p className="text-sm text-foreground">“Tolong susun daftar dokumen yang masih pending.”</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
