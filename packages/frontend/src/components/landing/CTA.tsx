"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/src/components/ui/Button";

const CTA = () => (
  <section className="py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-white/50 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 p-10 text-white shadow-2xl"
    >
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">Siap Ekspor?</p>
        <h3 className="text-3xl font-semibold">Mulai dengan analisis gratis dan checklist dokumen otomatis</h3>
        <p className="text-white/80">
          Cukup isi profil UMKM lalu pilih produk dan negara tujuan. XPOGO akan menyiapkan insight dan dokumen
          yang harus disiapkan.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Daftar Sekarang</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/signin">Sudah punya akun</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  </section>
);

export default CTA;
