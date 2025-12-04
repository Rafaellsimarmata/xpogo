'use client';

import Link from "next/link"; // ✅ Next.js Link
import { motion } from "framer-motion";
import { Sparkles, Play, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/src/components/ui/Button"; // ✅ huruf kecil

const Hero = () => (
  <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -100, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl"
      />
    </div>

    <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:gap-12 md:px-8 md:py-24 lg:grid-cols-2 lg:items-center">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-2.5 text-sm font-semibold tracking-wide text-primary shadow-lg shadow-primary/10 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 animate-pulse text-primary" />
          <span>Market Intelligence + DocuAssist AI</span>
          <Zap className="ml-2 h-3 w-3 animate-pulse text-amber-500" />
        </motion.div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Ekspor Jadi 
            <span className="relative mx-2">
              <span className="relative z-10 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Gampang
              </span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 blur-xl"
              />
            </span>
            <br />
            dengan <span className="text-primary">XPOGO</span>
          </h1>
          
          <p className="text-lg text-muted-foreground md:text-xl">
            Platform AI pertama yang bantu UMKM <span className="font-semibold text-primary">ekspor tanpa ribet</span>. 
            Cari pasar terbaik + siapin dokumen dalam <span className="font-semibold">satu aplikasi</span>.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button 
            size="lg" 
            asChild
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-0 shadow-button text-primary-foreground"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <span>Coba Sekarang</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            asChild
            className="border-primary/20 text-primary hover:bg-primary/5 hover:shadow-lg"
          >
            <Link href="https://youtu.be/dQw4w9WgXcQ?si=CzELudxCwe2KmqU3" className="group flex items-center gap-2" target="_blank">
              <Play className="h-4 w-4" />
              <span>Lihat Easter Egg</span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ▶
              </motion.div>
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
          <div className="rounded-2xl bg-card/80 p-4 backdrop-blur-sm shadow-card">
            <p className="text-2xl font-bold text-foreground">300+</p>
            <p className="text-muted-foreground">UMKM Sudah Ekspor</p>
          </div>
          <div className="rounded-2xl bg-card/80 p-4 backdrop-blur-sm shadow-card">
            <p className="text-2xl font-bold text-foreground">96%</p>
            <p className="text-muted-foreground">Dokumen Terselesaikan</p>
          </div>
          <div className="rounded-2xl bg-card/80 p-4 backdrop-blur-sm shadow-card">
            <p className="text-2xl font-bold text-foreground">4.9/5</p>
            <p className="text-muted-foreground">Rating Pengguna</p>
          </div>
        </div>
      </motion.div>

      {/* Right Content - Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          delay: 0.3 
        }}
        className="relative mt-8 lg:mt-0"
      >
        {/* Main Dashboard Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-card/70 bg-gradient-to-br from-card/90 to-secondary/60 p-6 shadow-2xl shadow-primary/20 backdrop-blur-lg">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          
          {/* Dashboard Content */}
          <div className="relative space-y-6 rounded-2xl bg-gradient-to-b from-foreground to-foreground/90 p-6 text-primary-foreground">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary-foreground/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">Live Analysis</span>
              </div>
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                Real-time
              </span>
            </div>

            {/* Market Match Scores */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/70">Market Match Score</span>
                  <span className="text-xs text-primary">Update: Just now</span>
                </div>
                
                {/* Japan */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-5 rounded-sm bg-red-500" />
                      <span>Jepang</span>
                    </div>
                    <span className="font-bold text-green-300">95/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/10">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                      className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-accent shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                    />
                  </div>
                </div>

                {/* UAE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-5 rounded-sm bg-green-500" />
                      <span>UAE</span>
                    </div>
                    <span className="font-bold text-amber-300">90/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/10">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "90%" }}
                      transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                      className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                    />
                  </div>
                </div>

                {/* Australia */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-5 rounded-sm bg-primary" />
                      <span>Australia</span>
                    </div>
                    <span className="font-bold text-primary">88/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/10">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      transition={{ delay: 1.1, duration: 1.5, ease: "easeOut" }}
                      className="block h-full rounded-full bg-gradient-to-r from-primary to-indigo-400"
                    />
                  </div>
                </div>
              </div>

              {/* DocuAssist Progress */}
              <div className="rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-semibold">DocuAssist AI</span>
                  </div>
                  <span className="text-xs text-accent">72% selesai</span>
                </div>
                <p className="mb-3 text-xs text-primary-foreground/70">
                  Checklist dokumen otomatis untuk ekspor ke Jepang
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-primary-foreground/10">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
                    className="block h-full rounded-full bg-gradient-to-r from-accent to-primary shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-primary-foreground/60">
                  <span>8/11 dokumen</span>
                  <span className="text-accent">3 hari tersisa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Testimonial Card */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 -right-4 w-[calc(100%-2rem)] rounded-2xl border border-primary/20 bg-card/90 p-4 text-sm shadow-xl shadow-primary/10 backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent" />
            <div>
              <p className="font-medium text-foreground">
                &ldquo;XPOGO bikin ekspor pertama kami ke Jepang berjalan lancar banget!&rdquo;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-semibold text-primary">Nadia · </span>
                Founder Rempah.id
              </p>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-xl" />
        <div className="absolute -right-4 bottom-10 h-16 w-16 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-xl" />
      </motion.div>
    </div>

    {/* Scroll Indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Scroll untuk lanjut</span>
        <div className="h-6 w-px bg-gradient-to-b from-primary to-transparent" />
      </div>
    </motion.div>
  </section>
);

export default Hero;
