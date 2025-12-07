const axios = require('axios');

/**
 * News Service for Export/Import News
 * Generates relevant news articles for Indonesian small enterprises exporting products
 */
class NewsService {
  constructor() {
    this.apiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.kolosal.ai/v1';
    this.secretToken = process.env.AI_SECRET_TOKEN;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick-17b-128e-instruct';
  }

  /**
   * Generate export/import news articles
   * @param {object} options - Options for news generation
   * @param {string} options.category - News category (regulations, market-insights, programs, events)
   * @param {string} options.country - Target country filter (optional)
   * @param {string} options.productType - Product type filter (optional)
   * @param {number} options.limit - Number of news items to generate (default: 5)
   * @returns {Promise<object>} Generated news articles
   */
  async generateNews(options = {}) {
    const {
      category = 'all',
      country = null,
      productType = null,
      limit = 5,
    } = options;

    const categoryMap = {
      'all': 'semua kategori',
      'regulations': 'regulasi dan kebijakan',
      'market-insights': 'insight pasar dan peluang',
      'programs': 'program pemerintah dan subsidi',
      'events': 'event dan workshop',
    };

    const categoryText = categoryMap[category] || categoryMap['all'];

    let contextText = `Berita terkait ekspor-impor untuk usaha kecil Indonesia.`;
    
    if (country) {
      contextText += ` Fokus pada pasar ${country}.`;
    }
    
    if (productType) {
      contextText += ` Relevan dengan produk ${productType}.`;
    }

    const prompt = `Anda adalah jurnalis ahli yang mengkhususkan diri dalam berita ekspor-impor untuk usaha kecil Indonesia.

${contextText}

Buatkan ${limit} artikel berita terkini dalam kategori: ${categoryText}.

Setiap artikel harus memiliki:
1. Judul yang menarik dan informatif
2. Ringkasan singkat (2-3 kalimat)
3. Tag/kategori yang relevan
4. Tanggal publikasi (format: DD MMM YYYY, gunakan tanggal terkini)
5. Sumber yang kredibel (contoh: Kementerian Perdagangan, ITPC, Atase Perdagangan, dll.)
6. URL sumber berita (link ke website resmi sumber)

Format setiap artikel sebagai berikut:
TITLE: [Judul Artikel]
SUMMARY: [Ringkasan 2-3 kalimat]
TAG: [Kategori: Regulasi/Program/Market Insight/Event]
DATE: [DD MMM YYYY]
SOURCE: [Nama Sumber Berita]
SOURCE_URL: [URL lengkap ke artikel atau halaman resmi sumber]

Pisahkan setiap artikel dengan baris kosong.

Untuk SOURCE_URL, gunakan URL resmi dari:
- Kementerian Perdagangan: https://www.kemendag.go.id
- ITPC (Indonesia Trade Promotion Center): https://www.itpc.id atau https://www.kemendag.go.id/itpc
- Atase Perdagangan: https://www.kemendag.go.id/atase-perdagangan
- Badan Pengembangan Ekspor Nasional: https://www.nationalexport.gov.id
- OSS (Online Single Submission): https://oss.go.id
- Situs resmi pemerintah terkait ekspor-impor

Jika tidak ada URL spesifik, gunakan URL halaman utama sumber tersebut.

Fokus pada:
- Update regulasi ekspor-impor terbaru
- Program subsidi dan bantuan untuk UMKM eksportir
- Peluang pasar ekspor baru
- Workshop dan pelatihan ekspor
- Perubahan tarif dan kuota
- Standar dan sertifikasi baru
- Insight pasar internasional

Gunakan bahasa Indonesia yang profesional dan mudah dipahami oleh pelaku usaha kecil.`;

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
          temperature: 0.8,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const newsItems = this.parseNewsContent(content);

      return {
        success: true,
        count: newsItems.length,
        category,
        filters: {
          country: country || null,
          productType: productType || null,
        },
        data: newsItems,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating news:', error.message);
      throw new Error(`Failed to generate news: ${error.message}`);
    }
  }

  /**
   * Get source URL based on source name
   * @param {string} sourceName - Name of the news source
   * @returns {string} Source URL
   */
  getSourceUrl(sourceName) {
    const sourceMap = {
      'Kementerian Perdagangan': 'https://www.kemendag.go.id',
      'Kemendag': 'https://www.kemendag.go.id',
      'ITPC': 'https://www.kemendag.go.id/itpc',
      'Indonesia Trade Promotion Center': 'https://www.kemendag.go.id/itpc',
      'Atase Perdagangan': 'https://www.kemendag.go.id/atase-perdagangan',
      'BPEN': 'https://www.nationalexport.gov.id',
      'Badan Pengembangan Ekspor Nasional': 'https://www.nationalexport.gov.id',
      'OSS': 'https://oss.go.id',
      'Online Single Submission': 'https://oss.go.id',
      'BKPM': 'https://www.bkpm.go.id',
      'Badan Koordinasi Penanaman Modal': 'https://www.bkpm.go.id',
      'Kementerian Koperasi dan UKM': 'https://www.kemenkopukm.go.id',
      'Kemenkop UKM': 'https://www.kemenkopukm.go.id',
    };

    if (sourceMap[sourceName]) {
      return sourceMap[sourceName];
    }

    const sourceLower = sourceName.toLowerCase();
    for (const [key, url] of Object.entries(sourceMap)) {
      if (sourceLower.includes(key.toLowerCase()) || key.toLowerCase().includes(sourceLower)) {
        return url;
      }
    }

    return 'https://www.kemendag.go.id';
  }

  /**
   * Parse AI-generated news content into structured format
   * @param {string} content - Raw AI response
   * @returns {Array} Parsed news items
   */
  parseNewsContent(content) {
    const newsItems = [];
    const articles = content.split(/\n\s*\n/).filter(block => block.trim());

    for (const article of articles) {
      const lines = article.split('\n').map(line => line.trim()).filter(Boolean);
      
      let title = '';
      let summary = '';
      let tag = 'Berita';
      let date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      let source = 'Kementerian Perdagangan';
      let sourceUrl = 'https://www.kemendag.go.id';

      for (const line of lines) {
        if (line.startsWith('TITLE:')) {
          title = line.replace(/^TITLE:\s*/i, '').trim();
        } else if (line.startsWith('SUMMARY:')) {
          summary = line.replace(/^SUMMARY:\s*/i, '').trim();
        } else if (line.startsWith('TAG:')) {
          tag = line.replace(/^TAG:\s*/i, '').replace(/^kategori:\s*/i, '').trim();
        } else if (line.startsWith('DATE:')) {
          date = line.replace(/^DATE:\s*/i, '').trim();
        } else if (line.startsWith('SOURCE:')) {
          source = line.replace(/^SOURCE:\s*/i, '').trim();
        } else if (line.startsWith('SOURCE_URL:') || line.startsWith('SOURCE URL:')) {
          const url = line.replace(/^SOURCE_URL:\s*/i, '').replace(/^SOURCE URL:\s*/i, '').trim();
          if (url.match(/^https?:\/\//)) {
            sourceUrl = url;
          } else if (url) {
            sourceUrl = url.startsWith('/') ? `https://www.kemendag.go.id${url}` : `https://${url}`;
          }
        }
      }

      if (sourceUrl === 'https://www.kemendag.go.id' && source !== 'Kementerian Perdagangan') {
        sourceUrl = this.getSourceUrl(source);
      }

      if (!title && lines.length > 0) {
        title = lines[0].replace(/^#{1,3}\s*/, '').trim();
      }
      if (!summary && lines.length > 1) {
        summary = lines.slice(1).join(' ').substring(0, 200);
      }

      if (title && title.length > 5) {
        newsItems.push({
          id: `news-${Date.now()}-${newsItems.length}`,
          title,
          summary: summary || title,
          tag: tag || 'Berita',
          date: date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          source: source || 'Kementerian Perdagangan',
          sourceUrl: sourceUrl || this.getSourceUrl(source || 'Kementerian Perdagangan'),
        });
      }
    }

    if (newsItems.length === 0 && content.trim()) {
      const firstLine = content.split('\n')[0].trim();
      if (firstLine.length > 10) {
        newsItems.push({
          id: `news-${Date.now()}`,
          title: firstLine.substring(0, 100),
          summary: content.substring(0, 200),
          tag: 'Berita',
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          source: 'Kementerian Perdagangan',
          sourceUrl: 'https://www.kemendag.go.id',
        });
      }
    }

    return newsItems;
  }

  /**
   * Get news by category
   * @param {string} category - News category
   * @param {number} limit - Number of items
   * @returns {Promise<object>} News items
   */
  async getNewsByCategory(category, limit = 5) {
    return this.generateNews({ category, limit });
  }

  /**
   * Get news filtered by country
   * @param {string} country - Target country
   * @param {number} limit - Number of items
   * @returns {Promise<object>} News items
   */
  async getNewsByCountry(country, limit = 5) {
    return this.generateNews({ country, limit });
  }
}

module.exports = NewsService;

