const NewsService = require('../services/NewsService');

class NewsController {
  /**
   * Get export/import news
   * @route GET /api/news
   * @query {string} category - News category (regulations, market-insights, programs, events, all)
   * @query {string} country - Filter by target country
   * @query {string} productType - Filter by product type
   * @query {number} limit - Number of news items (default: 5, max: 20)
   */
  static async getNews(req, res) {
    try {
      const { category = 'all', country, productType, limit = 5 } = req.query;
      
      const limitNum = Math.min(parseInt(limit, 10) || 5, 20);

      const service = new NewsService();
      const result = await service.generateNews({
        category,
        country: country || null,
        productType: productType || null,
        limit: limitNum,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getNews:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get news by category
   * @route GET /api/news/category/:category
   */
  static async getNewsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { limit = 5 } = req.query;
      const limitNum = Math.min(parseInt(limit, 10) || 5, 20);

      const service = new NewsService();
      const result = await service.getNewsByCategory(category, limitNum);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getNewsByCategory:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get news by country
   * @route GET /api/news/country/:country
   */
  static async getNewsByCountry(req, res) {
    try {
      const { country } = req.params;
      const { limit = 5 } = req.query;
      const limitNum = Math.min(parseInt(limit, 10) || 5, 20);

      const service = new NewsService();
      const result = await service.getNewsByCountry(country, limitNum);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getNewsByCountry:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = NewsController;

