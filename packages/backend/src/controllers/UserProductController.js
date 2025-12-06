const UserProductService = require('../services/UserProductService');

class UserProductController {
  /**
   * Get all products for the authenticated user
   * @route GET /api/user/products
   */
  static async getUserProducts(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const service = new UserProductService();
      const result = await service.getUserProducts(userId, status || null);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getUserProducts:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get a single product by ID
   * @route GET /api/user/products/:id
   */
  static async getProductById(req, res) {
    try {
      const userId = req.user.id;
      const productId = parseInt(req.params.id, 10);

      if (isNaN(productId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID',
        });
      }

      const service = new UserProductService();
      const result = await service.getProductById(productId, userId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getProductById:', error);
      if (error.message === 'Product not found') {
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
   * Create a new product
   * @route POST /api/user/products
   */
  static async createProduct(req, res) {
    try {
      const userId = req.user.id;
      const { name, description, category, hsCode, targetCountryId, targetCountryName, metadata } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Product name is required',
        });
      }

      const service = new UserProductService();
      const result = await service.createProduct(userId, {
        name,
        description,
        category,
        hsCode,
        targetCountryId,
        targetCountryName,
        metadata,
      });

      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createProduct:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Update a product
   * @route PUT /api/user/products/:id
   */
  static async updateProduct(req, res) {
    try {
      const userId = req.user.id;
      const productId = parseInt(req.params.id, 10);

      if (isNaN(productId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID',
        });
      }

      const service = new UserProductService();
      const result = await service.updateProduct(productId, userId, req.body);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateProduct:', error);
      if (error.message === 'Product not found') {
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
   * Delete a product
   * @route DELETE /api/user/products/:id
   */
  static async deleteProduct(req, res) {
    try {
      const userId = req.user.id;
      const productId = parseInt(req.params.id, 10);

      if (isNaN(productId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID',
        });
      }

      const service = new UserProductService();
      const result = await service.deleteProduct(productId, userId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      if (error.message === 'Product not found') {
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
   * Get product statistics
   * @route GET /api/user/products/stats
   */
  static async getProductStats(req, res) {
    try {
      const userId = req.user.id;

      const service = new UserProductService();
      const result = await service.getProductStats(userId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getProductStats:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = UserProductController;

