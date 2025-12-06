const pool = require('../config/database');

class UserProduct {
  /**
   * Find all products for a user
   * @param {number} userId - User ID
   * @param {string} status - Filter by status (optional)
   * @returns {Promise<Array>} Array of products
   */
  static async findByUserId(userId, status = null) {
    let query = 'SELECT * FROM user_products WHERE user_id = $1';
    const params = [userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find a product by ID and user ID
   * @param {number} productId - Product ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Product or null
   */
  static async findByIdAndUserId(productId, userId) {
    const result = await pool.query(
      'SELECT * FROM user_products WHERE id = $1 AND user_id = $2',
      [productId, userId]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new product for a user
   * @param {Object} productData - Product data
   * @param {number} productData.userId - User ID
   * @param {string} productData.name - Product name
   * @param {string} productData.description - Product description (optional)
   * @param {string} productData.category - Product category (optional)
   * @param {string} productData.hsCode - HS Code (optional)
   * @param {string} productData.targetCountryId - Target country ID (optional)
   * @param {string} productData.targetCountryName - Target country name (optional)
   * @param {Object} productData.metadata - Additional metadata (optional)
   * @returns {Promise<Object>} Created product
   */
  static async create(productData) {
    const {
      userId,
      name,
      description = null,
      category = null,
      hsCode = null,
      targetCountryId = null,
      targetCountryName = null,
      metadata = null,
    } = productData;

    const result = await pool.query(
      `INSERT INTO user_products 
       (user_id, name, description, category, hs_code, target_country_id, target_country_name, metadata, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
       RETURNING *`,
      [userId, name, description, category, hsCode, targetCountryId, targetCountryName, metadata ? JSON.stringify(metadata) : null]
    );
    return result.rows[0];
  }

  /**
   * Update a product
   * @param {number} productId - Product ID
   * @param {number} userId - User ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null>} Updated product or null
   */
  static async update(productId, userId, updateData) {
    const allowedFields = ['name', 'description', 'category', 'hs_code', 'target_country_id', 'target_country_name', 'status', 'metadata'];
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'metadata' && value !== null) {
          updates.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return null;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(productId, userId);

    const result = await pool.query(
      `UPDATE user_products 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete a product (soft delete by setting status to 'archived')
   * @param {number} productId - Product ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(productId, userId) {
    const result = await pool.query(
      `UPDATE user_products 
       SET status = 'archived', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [productId, userId]
    );
    return result.rows.length > 0;
  }

  /**
   * Hard delete a product
   * @param {number} productId - Product ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async hardDelete(productId, userId) {
    const result = await pool.query(
      'DELETE FROM user_products WHERE id = $1 AND user_id = $2 RETURNING id',
      [productId, userId]
    );
    return result.rows.length > 0;
  }

  /**
   * Get product count for a user
   * @param {number} userId - User ID
   * @param {string} status - Filter by status (optional)
   * @returns {Promise<number>} Product count
   */
  static async countByUserId(userId, status = null) {
    let query = 'SELECT COUNT(*) FROM user_products WHERE user_id = $1';
    const params = [userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = UserProduct;

