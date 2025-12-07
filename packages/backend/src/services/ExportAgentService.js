const axios = require('axios');
const ExportAgent = require('../models/ExportAgent');
const UserProduct = require('../models/UserProduct');

class ExportAgentService {
  constructor() {
    this.apiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.kolosal.ai/v1';
    this.secretToken = process.env.AI_SECRET_TOKEN;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick-17b-128e-instruct';
  }

  async getAllAgents(filters = {}) {
    try {
      const agents = await ExportAgent.findAll(filters);

      const formattedAgents = agents.map(agent => ({
        ...agent,
        metadata: agent.metadata ? (typeof agent.metadata === 'string' ? JSON.parse(agent.metadata) : agent.metadata) : null,
      }));

      return {
        success: true,
        count: formattedAgents.length,
        data: formattedAgents,
      };
    } catch (error) {
      console.error('Error getting all agents:', error);
      throw new Error(`Failed to get agents: ${error.message}`);
    }
  }

  /**
   * Get a single agent by ID
   * @param {number} agentId - Agent ID
   * @returns {Promise<Object>} Agent response
   */
  async getAgentById(agentId) {
    try {
      const agent = await ExportAgent.findById(agentId);

      if (!agent) {
        throw new Error('Export agent not found');
      }

      return {
        success: true,
        data: {
          ...agent,
          metadata: agent.metadata ? (typeof agent.metadata === 'string' ? JSON.parse(agent.metadata) : agent.metadata) : null,
        },
      };
    } catch (error) {
      console.error('Error getting agent:', error);
      throw new Error(`Failed to get agent: ${error.message}`);
    }
  }

  /**
   * Get AI-powered recommendations for export agents based on user product
   * @param {number} userId - User ID
   * @param {number} productId - Product ID (optional)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Recommendations response
   */
  async getRecommendations(userId, productId = null, options = {}) {
    try {
      let product = null;
      if (productId) {
        product = await UserProduct.findByIdAndUserId(productId, userId);
        if (!product) {
          throw new Error('Product not found');
        }
      } else {
        const products = await UserProduct.findByUserId(userId, 'active');
        if (products.length > 0) {
          product = products[0]; // Use first active product
        }
      }

      if (!product) {
        throw new Error('No product found for recommendations. Please add a product first.');
      }

      const allAgents = await ExportAgent.findAll({ verifiedOnly: options.verifiedOnly || false });

      if (allAgents.length === 0) {
        return {
          success: true,
          count: 0,
          message: 'No export agents available at the moment',
          data: [],
        };
      }

      const recommendations = await this.generateAIRecommendations(product, allAgents, options.limit || 5);

      for (const rec of recommendations) {
        await ExportAgent.saveRecommendation({
          userId,
          productId: product.id,
          agentId: rec.agent.id,
          recommendationScore: rec.score,
          matchReasons: rec.reasons,
        }).catch(err => console.error('Error saving recommendation:', err));
      }

      return {
        success: true,
        count: recommendations.length,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          targetCountry: product.target_country_name,
        },
        data: recommendations.map(rec => ({
          agent: {
            id: rec.agent.id,
            companyName: rec.agent.company_name,
            contactPerson: rec.agent.contact_person,
            email: rec.agent.email,
            phone: rec.agent.phone,
            website: rec.agent.website,
            address: rec.agent.address,
            city: rec.agent.city,
            province: rec.agent.province,
            specializationCategories: rec.agent.specialization_categories,
            targetCountries: rec.agent.target_countries,
            services: rec.agent.services,
            languages: rec.agent.languages,
            rating: parseFloat(rec.agent.rating),
            reviewCount: rec.agent.review_count,
            experienceYears: rec.agent.experience_years,
            isVerified: rec.agent.is_verified,
          },
          score: rec.score,
          reasons: rec.reasons,
        })),
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }

  /**
   * Generate AI-powered recommendations for export agents
   * @param {Object} product - User product
   * @param {Array} agents - Available agents
   * @param {number} limit - Maximum number of recommendations
   * @returns {Promise<Array>} Array of recommendations with scores
   */
  async generateAIRecommendations(product, agents, limit = 5) {
    try {
      if (!this.secretToken) {
        throw new Error('AI_SECRET_TOKEN environment variable is not set');
      }

      const agentsData = agents.map(agent => ({
        id: agent.id,
        companyName: agent.company_name,
        specialization: agent.specialization_categories || [],
        targetCountries: agent.target_countries || [],
        services: agent.services || [],
        rating: parseFloat(agent.rating) || 0,
        experienceYears: agent.experience_years || 0,
        isVerified: agent.is_verified,
        city: agent.city,
      }));

      const prompt = `Anda adalah konsultan ekspor profesional yang membantu usaha kecil di Indonesia menemukan agen ekspor yang tepat.

Produk yang akan diekspor:
- Nama: ${product.name}
- Kategori: ${product.category || 'Tidak ditentukan'}
- Deskripsi: ${product.description || 'Tidak ada deskripsi'}
- HS Code: ${product.hs_code || 'Tidak ditentukan'}
- Negara Tujuan: ${product.target_country_name || 'Belum ditentukan'}

Berikut adalah daftar agen ekspor yang tersedia:
${JSON.stringify(agentsData, null, 2)}

Tugas Anda:
1. Analisis setiap agen ekspor dan cocokkan dengan kebutuhan produk di atas
2. Berikan skor rekomendasi (0-100) untuk setiap agen berdasarkan:
   - Kecocokan spesialisasi dengan kategori produk
   - Kecocokan negara tujuan
   - Rating dan pengalaman agen
   - Verifikasi dan kredibilitas
3. Berikan 3-5 alasan singkat mengapa agen tersebut cocok (atau tidak cocok)

Format respons sebagai JSON array dengan struktur berikut:
[
  {
    "agentId": <id agen>,
    "score": <skor 0-100>,
    "reasons": ["alasan 1", "alasan 2", "alasan 3"]
  }
]

Urutkan berdasarkan skor tertinggi. Hanya berikan maksimal ${limit} rekomendasi terbaik.
Hanya kembalikan JSON array, tanpa teks tambahan.`;

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
          temperature: 0.3,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content.trim();
      
      let jsonContent = content;
      if (content.startsWith('```')) {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1];
        }
      }

      const aiRecommendations = JSON.parse(jsonContent);

      const recommendations = aiRecommendations
        .map(aiRec => {
          const agent = agents.find(a => a.id === aiRec.agentId);
          if (!agent) return null;

          return {
            agent,
            score: Math.min(100, Math.max(0, aiRec.score || 0)),
            reasons: Array.isArray(aiRec.reasons) ? aiRec.reasons : [],
          };
        })
        .filter(rec => rec !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return recommendations;
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      
      return this.generateFallbackRecommendations(product, agents, limit);
    }
  }

  /**
   * Fallback recommendation algorithm when AI fails
   * @param {Object} product - User product
   * @param {Array} agents - Available agents
   * @param {number} limit - Maximum number of recommendations
   * @returns {Array} Array of recommendations with scores
   */
  generateFallbackRecommendations(product, agents, limit) {
    const recommendations = agents.map(agent => {
      let score = 50;
      const reasons = [];

      if (product.category && agent.specialization_categories) {
        const categoryMatch = agent.specialization_categories.some(cat =>
          cat.toLowerCase().includes(product.category.toLowerCase()) ||
          product.category.toLowerCase().includes(cat.toLowerCase())
        );
        if (categoryMatch) {
          score += 20;
          reasons.push(`Spesialisasi dalam kategori ${product.category}`);
        }
      }

      if (product.target_country_name && agent.target_countries) {
        const countryMatch = agent.target_countries.some(country =>
          country.toLowerCase().includes(product.target_country_name.toLowerCase()) ||
          product.target_country_name.toLowerCase().includes(country.toLowerCase())
        );
        if (countryMatch) {
          score += 20;
          reasons.push(`Berpengalaman dengan ekspor ke ${product.target_country_name}`);
        }
      }

      if (agent.rating >= 4.5) {
        score += 10;
        reasons.push('Rating tinggi');
      } else if (agent.rating >= 4.0) {
        score += 5;
        reasons.push('Rating baik');
      }

      if (agent.is_verified) {
        score += 10;
        reasons.push('Agen terverifikasi');
      }

      if (agent.experience_years && agent.experience_years >= 5) {
        score += 5;
        reasons.push(`Berpengalaman ${agent.experience_years} tahun`);
      }

      return {
        agent,
        score: Math.min(100, score),
        reasons: reasons.length > 0 ? reasons : ['Agen ekspor tersedia'],
      };
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Create a new export agent (admin function)
   * @param {Object} agentData - Agent data
   * @returns {Promise<Object>} Created agent response
   */
  async createAgent(agentData) {
    try {
      const agent = await ExportAgent.create(agentData);

      return {
        success: true,
        data: {
          ...agent,
          metadata: agent.metadata ? (typeof agent.metadata === 'string' ? JSON.parse(agent.metadata) : agent.metadata) : null,
        },
      };
    } catch (error) {
      console.error('Error creating agent:', error);
      throw new Error(`Failed to create agent: ${error.message}`);
    }
  }

  /**
   * Update an export agent (admin function)
   * @param {number} agentId - Agent ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated agent response
   */
  async updateAgent(agentId, updateData) {
    try {
      const agent = await ExportAgent.update(agentId, updateData);

      if (!agent) {
        throw new Error('Export agent not found');
      }

      return {
        success: true,
        data: {
          ...agent,
          metadata: agent.metadata ? (typeof agent.metadata === 'string' ? JSON.parse(agent.metadata) : agent.metadata) : null,
        },
      };
    } catch (error) {
      console.error('Error updating agent:', error);
      throw new Error(`Failed to update agent: ${error.message}`);
    }
  }

  /**
   * Get user's recommendation history
   * @param {number} userId - User ID
   * @param {number} productId - Product ID (optional)
   * @returns {Promise<Object>} Recommendations history
   */
  async getRecommendationHistory(userId, productId = null) {
    try {
      const recommendations = await ExportAgent.getUserRecommendations(userId, productId);

      return {
        success: true,
        count: recommendations.length,
        data: recommendations,
      };
    } catch (error) {
      console.error('Error getting recommendation history:', error);
      throw new Error(`Failed to get recommendation history: ${error.message}`);
    }
  }
}

module.exports = ExportAgentService;

