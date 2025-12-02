const MarketIntelligenceService = require('../services/MarketIntelligenceService');

class MarketIntelligenceController {
  /**
   * Generate market intelligence for a product
   * POST /market-intelligence/analyze
   */
  static async analyzeProduct(req, res) {
    try {
      const { productName } = req.body;

      if (!productName) {
        return res.status(400).json({ error: 'productName is required in request body' });
      }

      const intelligence = await MarketIntelligenceService.generateMarketIntelligence(productName);
      res.status(200).json(intelligence);
    } catch (err) {
      console.error('Error in analyzeProduct:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Parse and extract table data from market intelligence response
   * POST /market-intelligence/parse-data
   */
  static async parseData(req, res) {
    try {
      const { aiResponse } = req.body;

      if (!aiResponse) {
        return res.status(400).json({ error: 'aiResponse is required in request body' });
      }

      const parsedData = MarketIntelligenceService.parseMarketData(aiResponse);
      res.status(200).json({
        parsedData,
        count: parsedData.length,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error in parseData:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = MarketIntelligenceController;
