# XPOGO - Export On The Go

## Quick Links
- Website: https://xpogo.vercel.app/ 
- Live Demo: 

## Overview of the Idea
XPOGO adalah platform ekspor sederhana berbasis AI yang dirancang untuk membantu UMKM memulai proses ekspor tanpa kerumitan. Pengguna cukup memilih produk, menentukan negara tujuan, dan mengikuti alur dokumen yang sudah disederhanakan. Dengan tambahan wawasan pasar dan bantuan asisten AI, XPOGO menjadi pintu masuk yang ramah bagi UMKM yang baru pertama kali mencoba ekspor.

## Project Goal
Membangun sistem yang mempermudah UMKM dalam mengambil keputusan ekspor melalui fitur inti seperti pemilihan negara tujuan, pengelolaan dokumen, insight pasar, serta asistensi AI. Tujuannya adalah menciptakan pengalaman persiapan ekspor yang lebih cepat, lebih terstruktur, dan mengurangi risiko kesalahan di tahap awal.

## How It Works
### User Flow
1. **Klik “Mulai Sekarang” → diarahkan ke halaman Sign In.**  
   Pengguna dapat:
   - **Masuk** jika sudah punya akun (email + password), atau  
   - **Daftar** jika belum punya akun.

2. **Jika memilih Daftar (Buat Akun Baru)**  
   Pengguna mengisi:
   - **Email**  
   - **Username**  
   - **Nama Perusahaan**  
   - **Password**  
   Setelah berhasil, pengguna otomatis masuk ke **Workspace**.

3. **Isi Initial Produk.**  
   Pada onboarding awal, pengguna hanya perlu memasukkan **produk utama** yang ingin diekspor (tanpa data UMKM panjang).

4. **Masuk ke Dashboard Produk.**  
   Pengguna melihat daftar produk yang sudah dimasukkan, lalu memilih salah satu produk untuk memulai proses ekspor.

5. **Pilih Mode: Ekspor Langsung atau Analisis Terlebih Dahulu.**  
   Saat membuka detail produk, pengguna memiliki dua opsi:
   - **Ekspor Sekarang** → pengguna memilih negara tujuan **secara manual**.  
   - **Analisis Pasar Dulu** → sistem menjalankan analisa otomatis dan menampilkan **rekomendasi negara**.  
     Pengguna dapat memilih salah satu negara rekomendasi dan menyimpannya.

6. **Jika produk sudah memiliki negara tujuan → klik export di salah satu produk → lanjut ke Document Center.**  
   Di halaman ini, pengguna dapat:
   - Melihat **kebutuhan dokumen ekspor** berdasarkan negara tujuan.  
   - Melihat **agent / mitra** yang tersedia.  
   - Melakukan **checklist dokumen** yang sudah disiapkan.  
   - Semua perubahan checklist **tersimpan otomatis** pada produk tersebut.

7. **Gunakan Asisten AI kapan saja.**  
   Chatbot mendukung percakapan bebas serta beberapa menu khusus:
   - **Analyze Product** → *Get export viability analysis*  
   - **Market Strategy** → *Get market entry strategy*  
   - **Compliance Check** → *Get compliance requirements*  
   - **Shipping Guide** → *Get shipping logistics*  
   - **Clear Chat** → memulai percakapan baru  

### Core Functionality
- **Market Intelligence:** Memberikan insight produk serta rekomendasi negara tujuan berdasarkan analisis permintaan dan peluang pasar.
- **Document Center:** Menyediakan daftar dokumen kelengkapan ekspor, checklist dokumen yang dapat ditandai sesuai progres, serta informasi agent/mitra yang tersedia.
- **Dashboard Produk:** Menampilkan ringkasan produk beserta negara tujuan yang dipilih, dilengkapi dengan news dan insight relevan untuk mendukung pengambilan keputusan.
- **Export Assistant (AI):** Asisten percakapan cerdas yang menjawab berbagai pertanyaan terkait ekspor, mulai dari analisis produk hingga strategi pasar dan kepatuhan regulasi.

## Tools Used
- **Next.js 15 + Tailwind CSS:** Fondasi frontend responsive dengan animasi halus.
- **Express.js + Node.js:** Backend API ringan untuk autentikasi, workflow, dan integrasi AI.
- **Framer Motion & Lucide Icons:** Memberi nuansa premium pada landing dan dashboard.

- **Vercel:** Deployment cepat untuk frontend dan layanan backend.

## UI Approach
Antarmuka XPOGO dirancang dengan tema dark-neon dan sentuhan gradient biru untuk menghadirkan kesan modern dan teknologi, namun tetap ramah bagi pelaku UMKM. Copywriting dibuat sederhana dan komunikatif agar fitur mudah dipahami. Tata letak menggunakan grid responsif sehingga informasi yang kompleks tetap nyaman dibaca, baik di perangkat mobile maupun desktop.

## Team Information
- **Haikal Jitra:** Team Leader, Frontend Developer
- **Christian Nathaniel:** UI/UX, Frontend Developer
- **Rafael Simarmata:** Backend Developer, AI Developer


## How to Install
Repositori ini adalah monorepo minimal berbasis npm workspaces yang terdiri dari:
- `frontend` – Aplikasi Next.js (port 3000)
- `backend` – API Express.js (port 3001)

### Langkah Cepat
1. Instal dependensi dari root repositori:
   ```bash
   npm install
   ```
2. Jalankan kedua server dev sekaligus:
   ```bash
   npm run dev
   ```

### Menjalankan Per Paket
```bash
npm run dev:frontend
npm run dev:backend
```
Frontend akan tersedia di http://localhost:3000 dan otomatis memanggil backend di http://localhost:3001/health.

### Catatan
- Pastikan menggunakan npm v7+ agar workspaces dikenali.
- Jalankan `npm install` sebelum menjalankan mode dev agar seluruh workspace terpasang.
