'use client';

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/Accordion";

const faqData = [
  {
    question: "Apa itu XPOGO dan bagaimana cara kerjanya?",
    answer: "XPOGO adalah platform AI pertama di Indonesia yang membantu UMKM untuk ekspor. Kami menggabungkan Market Intelligence AI untuk analisis pasar dan DocuAssist AI untuk checklist dokumen otomatis. Cukup daftar, pilih produk, dan sistem kami akan merekomendasikan negara tujuan ekspor terbaik beserta dokumen yang diperlukan.",
  },
  {
    question: "Berapa biaya untuk menggunakan XPOGO?",
    answer: "Kami menawarkan paket FREE untuk memulai dengan fitur dasar Market Intelligence. Untuk fitur lengkap termasuk DocuAssist AI dan Smart Matching, tersedia paket Pro mulai dari Rp 299.000/bulan. Tidak ada biaya tersembunyi dan kamu bisa cancel kapan saja!",
  },
  {
    question: "Apakah XPOGO cocok untuk pemula yang belum pernah ekspor?",
    answer: "Absolutely! XPOGO dirancang khusus untuk UMKM yang baru memulai. Fitur Export Workflow kami menyediakan panduan step-by-step dari riset pasar hingga pengiriman. Plus, tim support kami siap membantu 24/7 dalam Bahasa Indonesia.",
  },
  {
    question: "Bagaimana sistem DocuAssist AI bekerja?",
    answer: "DocuAssist AI menggunakan machine learning untuk mengidentifikasi dokumen yang diperlukan berdasarkan jenis produk dan negara tujuan. Sistem akan generate checklist otomatis, memberikan template dokumen, dan mengingatkan deadline. Akurasi checklist kami mencapai 96%!",
  },
  {
    question: "Apakah data bisnis saya aman di XPOGO?",
    answer: "Keamanan data adalah prioritas utama kami. XPOGO menggunakan enkripsi end-to-end dan sudah tersertifikasi ISO 27001. Semua data disimpan di server lokal Indonesia dan tidak akan dibagikan ke pihak ketiga tanpa izin.",
  },
  {
    question: "Negara mana saja yang bisa jadi tujuan ekspor?",
    answer: "Database kami mencakup 35+ negara tujuan ekspor populer termasuk Jepang, UAE, Australia, Singapura, Amerika, dan negara-negara Eropa. Sistem Market Intelligence kami akan merekomendasikan negara dengan skor kecocokan tertinggi untuk produkmu.",
  },
  {
    question: "Bagaimana cara connect dengan verified buyers?",
    answer: "Fitur Smart Matching kami akan mencocokkan produkmu dengan database 1000+ verified buyers dan distributors. Setiap partner sudah melalui verifikasi ketat dan memiliki rating dari pengguna lain. Kamu bisa langsung chat dan negosiasi dalam platform.",
  },
  {
    question: "Berapa lama proses dari daftar sampai ekspor pertama?",
    answer: "Rata-rata pengguna XPOGO berhasil melakukan ekspor pertama dalam 3-4 minggu. Dengan DocuAssist AI, proses persiapan dokumen yang biasanya memakan waktu berminggu-minggu bisa dipercepat hingga 70%!",
  },
];

const FAQ = () => (
  <section id="faq" className="relative overflow-hidden py-20">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />

    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2"
        >
          <HelpCircle className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
        </motion.div>

        <h2 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
          Pertanyaan yang Sering
          <span className="mx-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ditanyakan
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Belum yakin? Cek jawaban dari pertanyaan yang paling sering muncul.
        </p>
      </div>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-border/50 bg-card/80 p-6 shadow-card backdrop-blur-sm"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border/50"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-5">
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="font-semibold">{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 pr-4 text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl bg-gradient-to-r from-secondary/50 to-accent/10 p-8 text-center"
      >
        <p className="text-lg text-foreground">
          Masih punya pertanyaan?{" "}
          <a href="mailto:support@xpogo.id" className="font-semibold text-primary hover:underline">
            Hubungi tim kami
          </a>{" "}
          atau chat langsung via WhatsApp.
        </p>
      </motion.div>
    </div>
  </section>
);

export default FAQ;
