const ExportAgentService = require('../services/ExportAgentService');

class ExportAgentController {
  /**
   * Get all export agents with optional filters
   * @route GET /api/export-agents
   */
  static async getAllAgents(req, res) {
    try {
      const { category, targetCountry, city, verifiedOnly, minRating } = req.query;

      const filters = {};
      if (category) filters.category = category;
      if (targetCountry) filters.targetCountry = targetCountry;
      if (city) filters.city = city;
      if (verifiedOnly === 'true') filters.verifiedOnly = true;
      if (minRating) filters.minRating = parseFloat(minRating);

      const service = new ExportAgentService();
      const result = await service.getAllAgents(filters);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getAllAgents:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get a single agent by ID
   * @route GET /api/export-agents/:id
   */
  static async getAgentById(req, res) {
    try {
      const agentId = parseInt(req.params.id, 10);

      if (isNaN(agentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid agent ID',
        });
      }

      const service = new ExportAgentService();
      const result = await service.getAgentById(agentId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getAgentById:', error);
      if (error.message === 'Export agent not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get AI-powered recommendations for export agents
   * @route GET /api/export-agents/recommendations
   */
  static async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.query.productId ? parseInt(req.query.productId, 10) : null;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
      const verifiedOnly = req.query.verifiedOnly === 'true';

      if (productId && isNaN(productId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID',
        });
      }

      const service = new ExportAgentService();
      const result = await service.getRecommendations(userId, productId, {
        limit: Math.min(limit, 10), // Max 10 recommendations
        verifiedOnly,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      if (error.message === 'Product not found' || error.message.includes('No product found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get user's recommendation history
   * @route GET /api/export-agents/recommendations/history
   */
  static async getRecommendationHistory(req, res) {
    try {
      const userId = req.user.id;
      const productId = req.query.productId ? parseInt(req.query.productId, 10) : null;

      if (productId && isNaN(productId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID',
        });
      }

      const service = new ExportAgentService();
      const result = await service.getRecommendationHistory(userId, productId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getRecommendationHistory:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Create a new export agent (admin function)
   * @route POST /api/export-agents
   */
  static async createAgent(req, res) {
    try {
      const {
        companyName,
        contactPerson,
        email,
        phone,
        website,
        address,
        city,
        province,
        country,
        specializationCategories,
        targetCountries,
        services,
        languages,
        rating,
        reviewCount,
        experienceYears,
        licenseNumber,
        isVerified,
        metadata,
      } = req.body;

      if (!companyName || companyName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Company name is required',
        });
      }

      const service = new ExportAgentService();
      const result = await service.createAgent({
        companyName: companyName.trim(),
        contactPerson,
        email,
        phone,
        website,
        address,
        city,
        province,
        country: country || 'Indonesia',
        specializationCategories: Array.isArray(specializationCategories) ? specializationCategories : [],
        targetCountries: Array.isArray(targetCountries) ? targetCountries : [],
        services: Array.isArray(services) ? services : [],
        languages: Array.isArray(languages) ? languages : [],
        rating: rating ? parseFloat(rating) : 0.0,
        reviewCount: reviewCount ? parseInt(reviewCount, 10) : 0,
        experienceYears,
        licenseNumber,
        isVerified: isVerified === true,
        metadata,
      });

      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createAgent:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Update an export agent (admin function)
   * @route PUT /api/export-agents/:id
   */
  static async updateAgent(req, res) {
    try {
      const agentId = parseInt(req.params.id, 10);

      if (isNaN(agentId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid agent ID',
        });
      }

      const service = new ExportAgentService();
      const result = await service.updateAgent(agentId, req.body);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateAgent:', error);
      if (error.message === 'Export agent not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = ExportAgentController;

