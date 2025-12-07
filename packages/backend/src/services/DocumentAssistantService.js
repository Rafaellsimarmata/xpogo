const axios = require('axios');

class DocumentAssistantService {
  constructor() {
    this.apiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.kolosal.ai/v1';
    this.secretToken = process.env.AI_SECRET_TOKEN;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick-17b-128e-instruct';
  }

  async generateProductDescription(productData) {
    const {
      productName,
      category,
      features,
      targetMarket,
      specifications,
    } = productData;

    const prompt = `Anda adalah spesialis dokumentasi ekspor ahli untuk usaha kecil.
    
Buatkan deskripsi produk yang profesional dan siap ekspor untuk produk berikut:

Nama Produk: ${productName}
Kategori: ${category}
Fitur Utama: ${features || 'Tidak ditentukan'}
Pasar Sasaran: ${targetMarket || 'Internasional'}
Spesifikasi: ${specifications || 'Tidak ditentukan'}

Tolong berikan:
1. Ringkasan Eksekutif (2-3 kalimat)
2. Deskripsi Produk Detail (menyoroti manfaat ekspor)
3. Poin Penjualan Utama (3-5 poin)
4. Kepatuhan & Sertifikasi (standar yang direkomendasikan untuk ekspor)
5. Informasi Pengemasan & Pengiriman

Format respons dengan cara yang jelas dan profesional sesuai untuk dokumentasi ekspor.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        model: this.model,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating product description:', error.message);
      throw new Error(`Failed to generate product description: ${error.message}`);
    }
  }

  /**
   * Generate Export Compliance Document
   * Creates a compliance checklist for export requirements
   */
  async generateComplianceDocument(productData) {
    const {
      productName,
      origin,
      destinationCountries,
      productType,
    } = productData;

    const prompt = `Anda adalah ahli dalam kepatuhan perdagangan internasional.

Buatkan daftar periksa kepatuhan ekspor untuk produk berikut:

Nama Produk: ${productName}
Negara Asal: ${origin}
Negara Tujuan: ${destinationCountries || 'Beberapa'}
Jenis Produk: ${productType}

Tolong berikan dokumen kepatuhan komprehensif termasuk:
1. Persyaratan Dokumentasi (Kode HS, Sertifikat Asal, dll.)
2. Regulasi Impor berdasarkan Tujuan
3. Sertifikasi yang Diperlukan (CE, FDA, ISO, dll.)
4. Persyaratan Pelabelan & Pengemasan
5. Standar Kualitas
6. Opsi Pembayaran & Incoterms
7. Asuransi & Manajemen Risiko

PENTING: Format output harus mengikuti format berikut untuk setiap dokumen:
- Nama dokumen (tanpa checkbox atau simbol apapun di awal)
- Baris kosong
- Deskripsi singkat dokumen (1-2 kalimat)

Contoh format yang benar:
NIB & OSS

Nomor Induk Berusaha dan akses OSS untuk legalitas kegiatan ekspor.

Certificate of Origin (SKA)

Membuktikan barang berasal dari Indonesia untuk mendapatkan tarif preferensi.

Hanya berikan daftar dokumen dengan format di atas, tanpa penjelasan tambahan, tanpa nomor urut, tanpa checkbox, dan tanpa simbol apapun di awal nama dokumen.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'compliance_checklist',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating compliance document:', error.message);
      throw new Error(`Failed to generate compliance document: ${error.message}`);
    }
  }

  /**
   * Generate Invoice Template/Sample
   * Creates a professional export invoice template
   */
  async generateInvoiceTemplate(companyData) {
    const {
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      invoiceTerms,
    } = companyData;

    const prompt = `Anda adalah ahli dalam dokumentasi perdagangan internasional.

Buatkan template faktur ekspor profesional untuk:

Perusahaan: ${companyName}
Alamat: ${companyAddress}
Kontak: ${companyPhone} / ${companyEmail}
Syarat Pembayaran: ${invoiceTerms || 'NET 30'}

Tolong buatkan:
1. Bagian Header Faktur Profesional
2. Format Detail Perusahaan
3. Bagian Informasi Pembeli
4. Struktur Tabel Item/Baris Produk
5. Bagian Perhitungan Pajak & Bea
6. Bagian Incoterms & Syarat Pengiriman
7. Bagian Syarat Pembayaran & Detail Bank
8. Footer dengan Ketentuan Hukum

Berikan dalam format seperti JSON terstruktur yang dapat digunakan sebagai template untuk faktur.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'invoice_template',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating invoice template:', error.message);
      throw new Error(`Failed to generate invoice template: ${error.message}`);
    }
  }

  /**
   * Generate Packing List / Shipping Documentation
   * Creates a detailed packing list for shipments
   */
  async generatePackingList(shipmentData) {
    const {
      productNames,
      quantities,
      totalWeight,
      destination,
      shipmentDate,
      packagingType,
    } = shipmentData;

    const prompt = `Anda adalah ahli dalam dokumentasi pengiriman internasional.

Buatkan daftar pengepakan profesional untuk pengiriman ekspor:

Produk: ${productNames}
Jumlah: ${quantities}
Berat Total: ${totalWeight}
Tujuan: ${destination}
Tanggal Pengiriman: ${shipmentDate}
Jenis Kemasan: ${packagingType}

Tolong buatkan daftar pengepakan komprehensif termasuk:
1. Header Pengiriman (nomor referensi, tanggal)
2. Informasi Pengirim & Penerima
3. Tabel Detail Produk (dengan deskripsi, jumlah, berat)
4. Berat & Dimensi Total
5. Instruksi Penanganan Khusus
6. Bagian Deklarasi Bea Cukai
7. Bagian Informasi Pengangkut
8. Baris Tanda Tangan & Sertifikasi

Format sebagai dokumentasi profesional yang sesuai untuk clearance bea cukai.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'packing_list',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating packing list:', error.message);
      throw new Error(`Failed to generate packing list: ${error.message}`);
    }
  }

  /**
   * Generate Bill of Lading / Shipping Agreement
   * Creates a bill of lading for sea/air freight
   */
  async generateBillOfLading(shippingData) {
    const {
      shipperName,
      consigneeName,
      notifyParty,
      portOfLoading,
      portOfDischarge,
      carrierName,
      shipmentDate,
    } = shippingData;

    const prompt = `Anda adalah ahli dalam dokumentasi maritim/pengiriman internasional.

Buatkan Bill of Lading (B/L) profesional untuk:

Pengirim: ${shipperName}
Penerima: ${consigneeName}
Pihak yang Diberitahu: ${notifyParty || 'Sesuai penerima'}
Pelabuhan Muat: ${portOfLoading}
Pelabuhan Bongkar: ${portOfDischarge}
Pengangkut: ${carrierName}
Tanggal Pengiriman: ${shipmentDate}

Tolong buatkan Bill of Lading lengkap dengan:
1. Header B/L & Nomor Referensi
2. Detail Pengirim, Penerima, Pihak yang Diberitahu
3. Pelabuhan Muat & Bongkar
4. Informasi Kapal Pengiriman
5. Bagian Deskripsi Barang
6. Detail Berat & Volume
7. Syarat Freight & Biaya
8. Incoterms & Klausul Tanggung Jawab
9. Syarat & Ketentuan
10. Blok Tanda Tangan

Format sebagai dokumentasi maritim profesional.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'bill_of_lading',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating bill of lading:', error.message);
      throw new Error(`Failed to generate bill of lading: ${error.message}`);
    }
  }

  /**
   * Generate Export Proforma Invoice
   * Creates a proforma invoice for export quotation
   */
  async generateProformaInvoice(quoteData) {
    const {
      companyName,
      buyerName,
      products,
      quantities,
      unitPrices,
      paymentTerms,
      validityPeriod,
    } = quoteData;

    const prompt = `Anda adalah ahli dalam dokumentasi perdagangan internasional dan penawaran harga.

Buatkan Proforma Invoice profesional untuk penawaran ekspor:

Penjual: ${companyName}
Pembeli: ${buyerName}
Produk: ${products}
Jumlah: ${quantities}
Harga Satuan: ${unitPrices}
Syarat Pembayaran: ${paymentTerms}
Berlaku Hingga: ${validityPeriod}

Tolong buatkan Proforma Invoice lengkap termasuk:
1. Header Profesional dengan Detail Perusahaan
2. Nomor & Tanggal Proforma Invoice
3. Informasi Pembeli & Penjual
4. Tabel Deskripsi Item Detail (produk, jumlah, harga)
5. Subtotal, Pajak, & Jumlah Total
6. Syarat & Metode Pembayaran
7. Syarat Pengiriman (Incoterms)
8. Masa Berlaku
9. Syarat & Ketentuan
10. Catatan & Instruksi Khusus

Format sebagai dokumen perdagangan internasional profesional.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'proforma_invoice',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating proforma invoice:', error.message);
      throw new Error(`Failed to generate proforma invoice: ${error.message}`);
    }
  }

  /**
   * Generate Export Market Analysis
   * Analyzes target markets for product export
   */
  async generateMarketAnalysis(marketData) {
    const {
      productType,
      targetCountries,
      currentMarketShare,
      competitorInfo,
    } = marketData;

    const prompt = `Anda adalah ahli dalam riset pasar internasional dan strategi ekspor.

Berikan analisis pasar untuk ekspor:

Jenis Produk: ${productType}
Negara Sasaran: ${targetCountries}
Posisi Pasar Saat Ini: ${currentMarketShare || 'Pendatang baru'}
Pesaing: ${competitorInfo || 'Tidak ditentukan'}

Tolong berikan analisis pasar komprehensif termasuk:
1. Gambaran Pasar & Estimasi Ukuran
2. Potensi Pasar Negara Sasaran
3. Analisis Pesaing
4. Strategi Masuk Pasar
5. Strategi Penetapan Harga untuk Pasar Ekspor
6. Saluran Distribusi & Logistik
7. Rekomendasi Pemasaran & Promosi
8. Penilaian Risiko & Mitigasi
9. Peluang Pertumbuhan
10. Timeline & Rencana Implementasi

Buat rekomendasi spesifik untuk usaha kecil.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'market_analysis',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating market analysis:', error.message);
      throw new Error(`Failed to generate market analysis: ${error.message}`);
    }
  }
}

module.exports = DocumentAssistantService;
