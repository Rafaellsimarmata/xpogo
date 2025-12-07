const UserProduct = require('../models/UserProduct');

class UserProductService {
  async getUserProducts(userId, status = null) {
    try {
      const products = await UserProduct.findByUserId(userId, status);
      
      const formattedProducts = products.map(product => ({
        ...product,
        metadata: product.metadata ? (typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata) : null,
      }));

      return {
        success: true,
        count: formattedProducts.length,
        data: formattedProducts,
      };
    } catch (error) {
      console.error('Error getting user products:', error);
      throw new Error(`Failed to get user products: ${error.message}`);
    }
  }

  /**
   * Get a single product by ID
   * @param {number} productId - Product ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Product response
   */
  async getProductById(productId, userId) {
    try {
      const product = await UserProduct.findByIdAndUserId(productId, userId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      return {
        success: true,
        data: {
          ...product,
          metadata: product.metadata ? (typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata) : null,
        },
      };
    } catch (error) {
      console.error('Error getting product:', error);
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }

  /**
   * Create a new product for a user
   * @param {number} userId - User ID
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product response
   */
  async createProduct(userId, productData) {
    try {
      const { name, description, category, hsCode, targetCountryId, targetCountryName, metadata } = productData;

      if (!name || name.trim().length === 0) {
        throw new Error('Product name is required');
      }

      const product = await UserProduct.create({
        userId,
        name: name.trim(),
        description: description?.trim() || null,
        category: category?.trim() || null,
        hsCode: hsCode?.trim() || null,
        targetCountryId: targetCountryId?.trim() || null,
        targetCountryName: targetCountryName?.trim() || null,
        metadata: metadata || null,
      });

      return {
        success: true,
        data: {
          ...product,
          metadata: product.metadata ? (typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata) : null,
        },
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  /**
   * Update a product
   * @param {number} productId - Product ID
   * @param {number} userId - User ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated product response
   */
  async updateProduct(productId, userId, updateData) {
    try {
      // Check if product exists and belongs to user
      const existingProduct = await UserProduct.findByIdAndUserId(productId, userId);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // Clean up update data
      const cleanedData = {};
      if (updateData.name !== undefined) cleanedData.name = updateData.name.trim();
      if (updateData.description !== undefined) cleanedData.description = updateData.description?.trim() || null;
      if (updateData.category !== undefined) cleanedData.category = updateData.category?.trim() || null;
      if (updateData.hsCode !== undefined) cleanedData.hs_code = updateData.hsCode?.trim() || null;
      if (updateData.targetCountryId !== undefined) cleanedData.target_country_id = updateData.targetCountryId?.trim() || null;
      if (updateData.targetCountryName !== undefined) cleanedData.target_country_name = updateData.targetCountryName?.trim() || null;
      if (updateData.status !== undefined) cleanedData.status = updateData.status;
      if (updateData.metadata !== undefined) cleanedData.metadata = updateData.metadata;

      const product = await UserProduct.update(productId, userId, cleanedData);

      if (!product) {
        throw new Error('Failed to update product');
      }

      return {
        success: true,
        data: {
          ...product,
          metadata: product.metadata ? (typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata) : null,
        },
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  /**
   * Delete a product (soft delete)
   * @param {number} productId - Product ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteProduct(productId, userId) {
    try {
      const deleted = await UserProduct.delete(productId, userId);
      
      if (!deleted) {
        throw new Error('Product not found');
      }

      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  /**
   * Get product statistics for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Statistics
   */
  async getProductStats(userId) {
    try {
      const total = await UserProduct.countByUserId(userId);
      const active = await UserProduct.countByUserId(userId, 'active');
      const archived = await UserProduct.countByUserId(userId, 'archived');

      return {
        success: true,
        data: {
          total,
          active,
          archived,
        },
      };
    } catch (error) {
      console.error('Error getting product stats:', error);
      throw new Error(`Failed to get product stats: ${error.message}`);
    }
  }
}

module.exports = UserProductService;

