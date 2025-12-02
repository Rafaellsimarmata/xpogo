"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import Button from "@/src/components/ui/Button";

const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-blue-700 shadow shadow-blue-200/50">
          <Sparkles className="h-4 w-4 text-blue-500" />
          Market Intelligence + DocuAssist
        </span>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Ekspor Jadi Mudah dengan <span className="gradient-text">XPOGO</span>
        </h1>
        <p className="text-lg text-slate-600">
          Temukan negara tujuan terbaik, dapatkan scoring otomatis, dan lengkapi checklist dokumen
          ekspor dengan bantuan AI berbahasa Indonesia.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">Mulai Sekarang</Link>
          </Button>
          <Button variant="secondary" size="lg" icon={<Play className="h-4 w-4" />} asChild>
            <Link href="/market-analysis">Pelajari Lebih Lanjut</Link>
          </Button>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <div>
            <p className="text-2xl font-semibold text-slate-900">300+</p>
            <p>UMKM dibantu ekspor</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">96%</p>
            <p>Checklist dokumen selesai</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative"
      >
        <div className="glass-panel gradient-border relative rounded-[32px] border-white/50 bg-white/80 p-6 shadow-2xl">
          <div className="space-y-4 rounded-2xl bg-slate-900/90 p-6 text-white">
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Market Match</span>
              <span>Realtime</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Jepang</span>
                <span className="font-semibold">95/100</span>
              </div>
              <div className="h-2 rounded-full bg-white/20">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "95%" }}
                  transition={{ delay: 0.5, duration: 1.2 }}
                  className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>UAE</span>
                <span className="font-semibold">90/100</span>
              </div>
              <div className="h-2 rounded-full bg-white/20">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                />
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
              <p className="font-semibold text-white">DocuAssist</p>
              <p>Checklist siap: 8/11</p>
              <div className="mt-2 h-2 rounded-full bg-white/20">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ delay: 1.1, duration: 1.2 }}
                  className="block h-full rounded-full bg-gradient-to-r from-green-400 to-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 w-11/12 -translate-x-1/2 rounded-3xl border border-blue-200/60 bg-white/80 p-4 text-sm shadow-lg shadow-blue-500/10">
          <p className="text-slate-500">“Checklist dokumen otomatis membantu tim ekspor kami.”</p>
          <p className="mt-2 font-semibold text-slate-900">Nadia · Founder Rempah.id</p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
