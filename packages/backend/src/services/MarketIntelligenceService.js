const axios = require('axios');

class MarketIntelligenceService {
  /**
   * Generate market intelligence for a given product using AI API
   * @param {string} productName - The product name to analyze
   * @returns {Promise<object>} Market intelligence data from AI
   */
  static async generateMarketIntelligence(productName) {
    if (!productName || productName.trim().length === 0) {
      throw new Error('Product name is required');
    }

    const secretToken = process.env.AI_SECRET_TOKEN;
    if (!secretToken) {
      throw new Error('AI_SECRET_TOKEN environment variable is not set');
    }

    const apiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.together.xyz/v1';
    const model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick-17b-128e-instruct';

    const payload = {
      max_tokens: 2500,
      messages: [
        {
          role: 'system',
          content: 'Anda adalah analis intelijen pasar yang mengkhususkan diri dalam produk pertanian dan makanan. Berikan jawaban ringkas yang didukung data dalam format yang ditentukan. Sertakan hanya informasi faktual dengan statistik relevan jika tersedia.'
        },
        {
          role: 'user',
          content: `PRODUK: ${productName}\n\nBuatkan intelijen pasar untuk produk ini termasuk:\n\n1. GAMBARAN PASAR GLOBAL:\n   - Ukuran pasar saat ini dan tren pertumbuhan\n   - Negara produsen utama\n   - Wilayah konsumen utama\n   - Tren harga dan pendorong pasar utama\n\n2. PASAR EKSPOR POTENSIAL:\n   - 5 negara pengimpor potensial teratas\n   - Alasan potensi setiap negara\n   - Peluang/tantangan spesifik untuk masing-masing\n   - Pertimbangan regulasi impor/tarif\n\n3. DATA VISUALISASI:\n   Berikan data dalam format tabel yang tepat ini:\n   | Negara | Volume Produksi (MT) | Volume Impor (MT) | Volume Ekspor (MT) | Tingkat Pertumbuhan Pasar (%) | Mitra Dagang Utama |\n   |--------|----------------------|-------------------|-------------------|-------------------------------|-------------------|\n   | [Negara1] | [data] | [data] | [data] | [data] | [mitra] |\n   | [Negara2] | [data] | [data] | [data] | [data] | [mitra] |\n   (Sertakan 8-10 negara pasar utama)\n\n4. PERTIMBANGAN UTAMA:\n   - Standar kualitas dan sertifikasi yang diperlukan\n   - Persyaratan logistik dan rantai pasok\n   - Faktor musiman\n   - Lanskap kompetitif\n\nFormat respons dengan judul bagian yang jelas. Gunakan poin-poin untuk daftar. Pastikan semua titik data cocok untuk membuat peta visualisasi.`
        }
      ],
      model: model
    };  

    try {
      const response = await axios.post(`${apiBaseUrl}/chat/completions`, payload, {
        headers: {
          'Authorization': `Bearer ${secretToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.choices && response.data.choices[0]) {
        const content = response.data.choices[0].message.content;
        return {
          product: productName,
          marketIntelligence: content,
          model: model,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Unexpected response format from AI API');
      }
    } catch (err) {
      console.error('Error calling AI API:', err.message);
      throw new Error(`Failed to generate market intelligence: ${err.message}`);
    }
  }

  /**
   * Parse market data from AI response (optional utility)
   * Extracts table data for visualization
   * @param {string} aiResponse - Raw response from AI
   * @returns {array} Parsed market data
   */
  static parseMarketData(aiResponse) {
    const tablePattern = /\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g;
    const rows = [];
    let match;

    while ((match = tablePattern.exec(aiResponse)) !== null) {
      const [, country, production, imports, exports, growth, partners] = match;
      const countryTrimmed = country.trim();
      const productionTrimmed = production.trim();
      
      if (countryTrimmed === 'Country' || countryTrimmed === 'Negara') {
        continue;
      }
      
      const isSeparatorRow = 
        countryTrimmed.match(/^[-=]+$/) || 
        productionTrimmed.match(/^[-=]+$/) ||
        countryTrimmed === '--------' ||
        countryTrimmed === '---------' ||
        countryTrimmed === '----------';
      
      if (isSeparatorRow) {
        continue;
      }
      
      const isHeaderLike = 
        countryTrimmed.toLowerCase().includes('volume') ||
        countryTrimmed.toLowerCase().includes('produksi') ||
        countryTrimmed.toLowerCase().includes('impor') ||
        countryTrimmed.toLowerCase().includes('ekspor') ||
        countryTrimmed.toLowerCase().includes('pertumbuhan') ||
        countryTrimmed.toLowerCase().includes('mitra') ||
        countryTrimmed.toLowerCase().includes('dagang');
      
      if (isHeaderLike) {
        continue;
      }
      
      rows.push({
        country: countryTrimmed,
        productionVolume: productionTrimmed,
        importVolume: imports.trim(),
        exportVolume: exports.trim(),
        marketGrowthRate: growth.trim(),
        keyTradePartners: partners.trim()
      });
    }

    return rows;
  }
}

module.exports = MarketIntelligenceService;
