const pool = require('../config/database');

class ExportAgent {
  /**
   * Find all active export agents with optional filters
   * @param {Object} filters - Filter options
   * @param {string} filters.category - Filter by specialization category
   * @param {string} filters.targetCountry - Filter by target country
   * @param {string} filters.city - Filter by city
   * @param {boolean} filters.verifiedOnly - Only return verified agents
   * @param {number} filters.minRating - Minimum rating
   * @returns {Promise<Array>} Array of export agents
   */
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM export_agents WHERE is_active = true';
    const params = [];
    let paramIndex = 1;

    if (filters.verifiedOnly) {
      query += ' AND is_verified = true';
    }

    if (filters.minRating) {
      query += ` AND rating >= $${paramIndex}`;
      params.push(filters.minRating);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND $${paramIndex} = ANY(specialization_categories)`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.targetCountry) {
      query += ` AND $${paramIndex} = ANY(target_countries)`;
      params.push(filters.targetCountry);
      paramIndex++;
    }

    if (filters.city) {
      query += ` AND city = $${paramIndex}`;
      params.push(filters.city);
      paramIndex++;
    }

    query += ' ORDER BY rating DESC, review_count DESC, created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Find export agent by ID
   * @param {number} id - Agent ID
   * @returns {Promise<Object|null>} Export agent or null
   */
  static async findById(id) {
    const result = await pool.query('SELECT * FROM export_agents WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Create a new export agent
   * @param {Object} agentData - Agent data
   * @returns {Promise<Object>} Created agent
   */
  static async create(agentData) {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      website,
      address,
      city,
      province,
      country = 'Indonesia',
      specializationCategories = [],
      targetCountries = [],
      services = [],
      languages = [],
      rating = 0.0,
      reviewCount = 0,
      experienceYears,
      licenseNumber,
      isVerified = false,
      metadata = null,
    } = agentData;

    const result = await pool.query(
      `INSERT INTO export_agents 
       (company_name, contact_person, email, phone, website, address, city, province, country,
        specialization_categories, target_countries, services, languages, rating, review_count,
        experience_years, license_number, is_verified, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
       RETURNING *`,
      [
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
        metadata ? JSON.stringify(metadata) : null,
      ]
    );
    return result.rows[0];
  }

  /**
   * Update an export agent
   * @param {number} id - Agent ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null>} Updated agent or null
   */
  static async update(id, updateData) {
    const allowedFields = [
      'company_name',
      'contact_person',
      'email',
      'phone',
      'website',
      'address',
      'city',
      'province',
      'country',
      'specialization_categories',
      'target_countries',
      'services',
      'languages',
      'rating',
      'review_count',
      'experience_years',
      'license_number',
      'is_verified',
      'is_active',
      'metadata',
    ];
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
    values.push(id);

    const result = await pool.query(
      `UPDATE export_agents 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Save agent recommendation for a user
   * @param {Object} recommendationData - Recommendation data
   * @returns {Promise<Object>} Created recommendation
   */
  static async saveRecommendation(recommendationData) {
    const { userId, productId, agentId, recommendationScore, matchReasons = [] } = recommendationData;

    const result = await pool.query(
      `INSERT INTO agent_recommendations 
       (user_id, product_id, agent_id, recommendation_score, match_reasons)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, productId, agentId, recommendationScore, matchReasons]
    );
    return result.rows[0];
  }

  /**
   * Get recommendations for a user
   * @param {number} userId - User ID
   * @param {number} productId - Product ID (optional)
   * @returns {Promise<Array>} Array of recommendations
   */
  static async getUserRecommendations(userId, productId = null) {
    let query = `
      SELECT ar.*, ea.company_name, ea.contact_person, ea.email, ea.phone, ea.website
      FROM agent_recommendations ar
      JOIN export_agents ea ON ar.agent_id = ea.id
      WHERE ar.user_id = $1
    `;
    const params = [userId];

    if (productId) {
      query += ' AND ar.product_id = $2';
      params.push(productId);
    }

    query += ' ORDER BY ar.recommendation_score DESC, ar.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = ExportAgent;

