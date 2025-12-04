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

    // Build the request payload with user's exact format
    const payload = {
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'You are a market intelligence analyst specializing in agricultural and food products. Provide concise, data-driven answers in the exact format specified. Include only factual information with relevant statistics when available.'
        },
        {
          role: 'user',
          content: `PRODUCT: ${productName}\n\nGenerate market intelligence for this product including:\n\n1. GLOBAL MARKET OVERVIEW:\n   - Current market size and growth trends\n   - Major producing countries\n   - Major consuming regions\n   - Price trends and key market drivers\n\n2. POTENTIAL EXPORT MARKETS:\n   - Top 5 potential importing countries\n   - Reason for each country's potential\n   - Specific opportunities/challenges for each\n   - Import regulations/tariffs considerations\n\n3. VISUALIZATION DATA:\n   Provide data in this exact table format:\n   | Country | Production Volume (MT) | Import Volume (MT) | Export Volume (MT) | Market Growth Rate (%) | Key Trade Partners |\n   |---------|------------------------|---------------------|--------------------|------------------------|---------------------|\n   | [Country1] | [data] | [data] | [data] | [data] | [partners] |\n   | [Country2] | [data] | [data] | [data] | [data] | [partners] |\n   (Include 8-10 major market countries)\n\n4. KEY CONSIDERATIONS:\n   - Quality standards and certifications needed\n   - Logistics and supply chain requirements\n   - Seasonality factors\n   - Competitive landscape\n\nFormat response with clear section headings. Use bullet points for lists. Ensure all data points are suitable for creating visualization maps.`
        }
      ],
      model: model
    };  

    try {
      const response = await axios.post(`${apiBaseUrl}/chat/completions`, payload, {
        headers: {
          'Authorization': `Bearer ${secretToken}`,
          'Content-Type': 'application/json'
        },
        // timeout: 60000 // 60 second timeout
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
      if (country.trim() !== 'Country') { // Skip header
        rows.push({
          country: country.trim(),
          productionVolume: production.trim(),
          importVolume: imports.trim(),
          exportVolume: exports.trim(),
          marketGrowthRate: growth.trim(),
          keyTradePartners: partners.trim()
        });
      }
    }

    return rows;
  }
}

module.exports = MarketIntelligenceService;
