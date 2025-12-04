const axios = require('axios');

/**
 * AI Chatbot Service for Export Assistance
 * Provides real-time chat support for small enterprises exporting products
 */
class ChatbotService {
  constructor() {
    this.apiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.kolosal.ai/v1';
    this.secretToken = process.env.AI_SECRET_TOKEN;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick-17b-128e-instruct';
    this.conversationHistory = new Map(); // Store conversation history per user
  }

  /**
   * Initialize conversation history for a user
   */
  initializeConversation(userId) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, [
        {
          role: 'system',
          content: `You are an expert AI assistant specializing in helping small enterprises export their products. 
          
Your expertise includes:
- Product export documentation and compliance
- International trade regulations and customs
- Market analysis for different countries
- Shipping and logistics guidance
- Product pricing strategies for export markets
- Finding target markets and business opportunities
- Export financing and payment terms
- Product packaging and labeling requirements
- Certificate of Origin and trade documentation
- Import/Export regulations by country

Be helpful, professional, and provide actionable advice. Ask clarifying questions when needed.
If asked about something outside export assistance, politely redirect to export-related topics.`
        }
      ]);
    }
    return this.conversationHistory.get(userId);
  }

  /**
   * Get conversation history for a user
   */
  getConversationHistory(userId) {
    return this.conversationHistory.get(userId) || [];
  }

  /**
   * Send chat message and get AI response
   * This method is used for streaming responses in WebSocket
   */
  async sendMessage(userId, userMessage) {
    try {
      // Initialize conversation if needed
      const history = this.initializeConversation(userId);

      // Add user message to history
      history.push({
        role: 'user',
        content: userMessage
      });

      // Call AI API with conversation history
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: history,
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessage = response.data.choices[0].message.content;

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: assistantMessage
      });

      return {
        success: true,
        message: assistantMessage,
        messageType: 'response',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in chatbot service:', error.message);
      throw new Error(`Chatbot error: ${error.message}`);
    }
  }

  /**
   * Clear conversation history for a user
   */
  clearConversation(userId) {
    this.conversationHistory.delete(userId);
  }

  /**
   * Get conversation summary (useful for displaying chat history)
   */
  getConversationSummary(userId) {
    const history = this.getConversationHistory(userId);
    return history
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date().toISOString()
      }));
  }

  /**
   * Analyze product and provide export guidance
   */
  async analyzeProductForExport(userId, productInfo) {
    const {
      productName,
      description,
      targetMarkets,
      currentCapacity
    } = productInfo;

    const analysisPrompt = `Please analyze the following product for export potential and provide detailed guidance:

Product Name: ${productName}
Description: ${description}
Target Markets: ${targetMarkets}
Current Production Capacity: ${currentCapacity}

Please provide:
1. Export Feasibility Assessment
2. Recommended Target Markets (ranked by opportunity)
3. Required Compliance & Certifications
4. Estimated Costs for Export
5. Timeline for Market Entry
6. Key Risks & How to Mitigate Them
7. Next Steps to Get Started

Format as actionable advice for a small business.`;

    return this.sendMessage(userId, analysisPrompt);
  }

  /**
   * Get market entry strategy
   */
  async getMarketEntryStrategy(userId, marketInfo) {
    const {
      country,
      productType,
      budget,
      timeline
    } = marketInfo;

    const strategyPrompt = `I need help developing an export strategy for entering the ${country} market.

Details:
- Product Type: ${productType}
- Available Budget: ${budget}
- Timeline: ${timeline}

Please provide a detailed market entry strategy including:
1. Market Overview & Opportunity Assessment
2. Regulatory & Compliance Requirements
3. Pricing Strategy for This Market
4. Distribution Channels
5. Marketing Approach
6. Required Documentation
7. Cost Breakdown
8. 12-Month Action Plan

Make it specific and actionable for a small enterprise.`;

    return this.sendMessage(userId, strategyPrompt);
  }

  /**
   * Get answers about specific compliance requirements
   */
  async getComplianceGuidance(userId, complianceQuery) {
    const {
      productType,
      destinationCountry,
      specificConcern
    } = complianceQuery;

    const compliancePrompt = `I need guidance on export compliance for my product.

Details:
- Product Type: ${productType}
- Destination Country: ${destinationCountry}
- Specific Concern: ${specificConcern}

Please provide:
1. Relevant Regulations & Standards
2. Required Certifications
3. Documentation Needed
4. Common Pitfalls to Avoid
5. Timeline for Compliance
6. Estimated Costs
7. Resources & Contact Information

Provide practical, actionable advice.`;

    return this.sendMessage(userId, compliancePrompt);
  }

  /**
   * Get shipping and logistics guidance
   */
  async getShippingGuidance(userId, shippingInfo) {
    const {
      productWeight,
      productSize,
      destination,
      urgency,
      budget
    } = shippingInfo;

    const shippingPrompt = `I need guidance on shipping my products internationally.

Details:
- Product Weight/Size: ${productWeight} / ${productSize}
- Destination: ${destination}
- Urgency: ${urgency}
- Budget Constraints: ${budget}

Please advise on:
1. Best Shipping Methods
2. Estimated Costs & Timeline
3. Documentation Required
4. Insurance Recommendations
5. Packaging Requirements
6. Incoterms Selection
7. Recommended Carriers

Focus on cost-effective solutions for small businesses.`;

    return this.sendMessage(userId, shippingPrompt);
  }

  /**
   * Stream response chunk by chunk (for real-time WebSocket delivery)
   */
  async streamMessage(userId, userMessage) {
    try {
      const history = this.initializeConversation(userId);

      // Add user message to history
      history.push({
        role: 'user',
        content: userMessage
      });

      // Call AI API
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: history,
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessage = response.data.choices[0].message.content;

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Return the full message for streaming
      return {
        success: true,
        message: assistantMessage,
        messageType: 'response',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error in stream message:', error.message);
      throw new Error(`Stream error: ${error.message}`);
    }
  }
}

module.exports = ChatbotService;
