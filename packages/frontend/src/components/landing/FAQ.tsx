'use client';

import { motion } from "framer-motion";
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
  <section id="faq" className="relative overflow-hidden py-24 bg-gray-950">
    {/* Background */}
    <div className="absolute inset-0 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950" />
    <div className="pointer-events-none absolute -bottom-20 -left-8 sm:-left-20 h-64 w-64 rounded-full bg-linear-to-r from-blue-500/5 to-cyan-500/5 blur-3xl" />

    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="mb-4 text-4xl md:text-5xl font-bold text-white">
            Pertanyaan Umum
            <span className="block bg-linear-to-r from-blue-400 to-secondary bg-clip-text text-transparent">
              tentang XPOGO
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Cari jawaban untuk pertanyaan yang paling sering diajukan.
          </p>
        </motion.div>
      </div>

      {/* FAQ Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-linear-to-b from-gray-900/40 to-gray-950/40 rounded-3xl p-6 border border-gray-800 backdrop-blur-sm"
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left hover:no-underline px-6 py-5">
                <div className="flex items-start gap-4 w-full">
                  {/* Number Badge */}
                  <div className="shrink-0">
                    <div className="h-10 w-10 rounded-full bg-linear-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-400">{index + 1}</span>
                    </div>
                  </div>
                  
                  {/* Question */}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-white text-lg">
                      {faq.question}
                    </h3>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-5 pt-0">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-14"
                >
                  <div className="pt-4 border-t border-gray-800/50">
                    <p className="text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Simple CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-blue-500/10 to-secondary/10 border border-blue-500/20 backdrop-blur-sm">
          <span className="text-sm text-blue-300">Masih ada pertanyaan? Hubungi kami kapan saja</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FAQ;
