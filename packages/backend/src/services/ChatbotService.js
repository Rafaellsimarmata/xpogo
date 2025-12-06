const axios = require('axios');
const pool = require('../config/database');

/**
 * AI Chatbot Service for Export Assistance
 * Provides real-time chat support for small enterprises exporting products
 * Stores conversation history in PostgreSQL database
 */
class ChatbotService {
  constructor() {
    this.apiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.kolosal.ai/v1';
    this.secretToken = process.env.AI_SECRET_TOKEN;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick-17b-128e-instruct';
    this.conversationHistory = new Map(); // Cache for active conversations
  }

  /**
   * Initialize or get conversation for a user
   * Loads existing messages from database or creates new conversation
   */
  async initializeConversation(userId) {
    if (!this.conversationHistory.has(userId)) {
      try {
        // Get or create conversation
        const convResult = await pool.query(
          'SELECT id FROM chatbot_conversations WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC LIMIT 1',
          [userId]
        );

        let conversationId;
        if (convResult.rows.length === 0) {
          // Create new conversation
          const createConvResult = await pool.query(
            'INSERT INTO chatbot_conversations (user_id, title) VALUES ($1, $2) RETURNING id',
            [userId, `Conversation ${new Date().toLocaleDateString()}`]
          );
          conversationId = createConvResult.rows[0].id;
        } else {
          conversationId = convResult.rows[0].id;
        }

        // Load conversation history from database
        const messagesResult = await pool.query(
          'SELECT role, content FROM chatbot_messages WHERE user_id = $1 ORDER BY created_at ASC',
          [userId]
        );

        const messages = [
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
        ];

        // Add existing messages to conversation
        messagesResult.rows.forEach(msg => {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        });

        this.conversationHistory.set(userId, {
          conversationId,
          messages
        });
      } catch (error) {
        console.error('Error initializing conversation:', error);
        // Fallback to in-memory conversation
        this.conversationHistory.set(userId, {
          conversationId: null,
          messages: [
            {
              role: 'system',
              content: `You are an expert AI assistant specializing in helping small enterprises export their products.`
            }
          ]
        });
      }
    }
    return this.conversationHistory.get(userId);
  }

  /**
   * Get conversation history for a user from database
   */
  async getConversationHistory(userId) {
    try {
      const result = await pool.query(
        'SELECT role, content, created_at FROM chatbot_messages WHERE user_id = $1 ORDER BY created_at ASC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  /**
   * Save message to database
   */
  async saveMessage(userId, role, content, messageType = 'message') {
    try {
      await pool.query(
        `INSERT INTO chatbot_messages (user_id, role, content, message_type) 
         VALUES ($1, $2, $3, $4)`,
        [userId, role, content, messageType]
      );
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  /**
   * Send chat message and get AI response
   */
  async sendMessage(userId, userMessage) {
    try {
      // Initialize conversation if needed
      const conv = await this.initializeConversation(userId);
      const messages = conv.messages;

      // Add user message to memory
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Save user message to database
      await this.saveMessage(userId, 'user', userMessage, 'message');

      // Call AI API with conversation history
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: messages,
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
      const tokensUsed = response.data.usage?.total_tokens || 0;

      // Add assistant response to memory
      messages.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Save assistant message to database
      await pool.query(
        `INSERT INTO chatbot_messages (user_id, role, content, message_type, tokens_used) 
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, 'assistant', assistantMessage, 'response', tokensUsed]
      );

      // Update conversation message count
      if (conv.conversationId) {
        await pool.query(
          'UPDATE chatbot_conversations SET message_count = message_count + 2 WHERE id = $1',
          [conv.conversationId]
        );
      }

      return {
        success: true,
        message: assistantMessage,
        messageType: 'response',
        timestamp: new Date().toISOString(),
        tokensUsed
      };
    } catch (error) {
      console.error('Error in chatbot service:', error.message);
      throw new Error(`Chatbot error: ${error.message}`);
    }
  }

  /**
   * Clear conversation history for a user
   */
  async clearConversation(userId) {
    try {
      // Mark conversation as inactive
      await pool.query(
        'UPDATE chatbot_conversations SET is_active = false WHERE user_id = $1',
        [userId]
      );
      
      // Clear from memory cache
      this.conversationHistory.delete(userId);
      
      return { success: true, message: 'Conversation cleared' };
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation summary
   */
  async getConversationSummary(userId) {
    try {
      const history = await this.getConversationHistory(userId);
      return history
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at
        }));
    } catch (error) {
      console.error('Error getting summary:', error);
      return [];
    }
  }

  /**
   * Analyze product and provide export guidance
   */
  async analyzeProductForExport(userId, productInfo) {
    // productInfo is now a string with product description
    const analysisPrompt = `Please analyze the following product for export potential and provide detailed guidance:

${productInfo}

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
    // marketInfo is now a string with market details
    const strategyPrompt = `I need help developing an export strategy based on the following details:

${marketInfo}

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
    // complianceQuery is now a string with compliance details
    const compliancePrompt = `I need guidance on export compliance based on the following details:

${complianceQuery}

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
    // shippingInfo is now a string with shipping details
    const shippingPrompt = `I need guidance on shipping my products internationally.

${shippingInfo}

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
   * Stream response chunk by chunk (for real-time Realtime delivery)
   */
  async streamMessage(userId, userMessage) {
    try {
      const conv = await this.initializeConversation(userId);
      const messages = conv.messages;

      // Add user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      await this.saveMessage(userId, 'user', userMessage, 'message');

      // Call AI API
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: messages,
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
      const tokensUsed = response.data.usage?.total_tokens || 0;

      // Add to memory and database
      messages.push({
        role: 'assistant',
        content: assistantMessage
      });

      await pool.query(
        `INSERT INTO chatbot_messages (user_id, role, content, message_type, tokens_used) 
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, 'assistant', assistantMessage, 'response', tokensUsed]
      );

      // Update conversation count
      if (conv.conversationId) {
        await pool.query(
          'UPDATE chatbot_conversations SET message_count = message_count + 2 WHERE id = $1',
          [conv.conversationId]
        );
      }

      return {
        success: true,
        message: assistantMessage,
        messageType: 'response',
        timestamp: new Date().toISOString(),
        tokensUsed
      };
    } catch (error) {
      console.error('Error in stream message:', error.message);
      throw new Error(`Stream error: ${error.message}`);
    }
  }

  /**
   * Send message with streaming response using Server-Sent Events
   * Streams response word-by-word as generated by the AI model
   */
  async sendMessageWithStream(userId, userMessage, messages, res) {
    try {
      let fullResponse = '';
      let tokensUsed = 0;
      let promptTokens = 0;
      let completionTokens = 0;

      // Use native fetch for true streaming from AI API
      const response = await fetch(`${this.apiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 800,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API Error: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Stream directly from AI API without buffering entire response
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Stream ended - process any remaining buffer and send finish event
          if (buffer.trim()) {
            const lines = buffer.split('\n');
            for (const line of lines) {
              if (!line.trim() || !line.startsWith('data: ')) continue;
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.usage) {
                  tokensUsed = parsed.usage.total_tokens || 0;
                  promptTokens = parsed.usage.prompt_tokens || 0;
                  completionTokens = parsed.usage.completion_tokens || 0;
                }
              } catch (e) {
                // Ignore parse errors in final buffer
              }
            }
          }
          
          // Send completion event
          res.write(`data: ${JSON.stringify({
            type: 'finish',
            fullResponse: fullResponse,
            tokensUsed: tokensUsed,
            promptTokens: promptTokens,
            completionTokens: completionTokens,
          })}\n\n`);
          res.end();
          
          // Save full response to database asynchronously
          this.saveStreamedMessage(userId, fullResponse, tokensUsed).catch(err => 
            console.error('Error saving streamed message:', err)
          );
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.replace('data: ', '').trim();
          
          if (data === '[DONE]') {
            // Stream finished - send completion event
            res.write(`data: ${JSON.stringify({
              type: 'finish',
              fullResponse: fullResponse,
              tokensUsed: tokensUsed,
              promptTokens: promptTokens,
              completionTokens: completionTokens,
            })}\n\n`);
            res.end();
            
            // Save full response to database asynchronously
            this.saveStreamedMessage(userId, fullResponse, tokensUsed).catch(err => 
              console.error('Error saving streamed message:', err)
            );
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            const finishReason = parsed.choices?.[0]?.finish_reason;
            
            // Extract token usage from the final chunk (if available)
            if (parsed.usage) {
              tokensUsed = parsed.usage.total_tokens || 0;
              promptTokens = parsed.usage.prompt_tokens || 0;
              completionTokens = parsed.usage.completion_tokens || 0;
            }
            
            // Handle content delta
            if (deltaContent) {
              fullResponse += deltaContent;
              
              // Send each chunk immediately as it arrives from AI API
              res.write(`data: ${JSON.stringify({
                type: 'chunk',
                content: deltaContent,
              })}\n\n`);
            }
            
            // If finish_reason is present, the stream is ending
            if (finishReason === 'stop' && parsed.usage) {
              // Final chunk with usage stats - wait for [DONE] to send finish event
              continue;
            }
          } catch (parseError) {
            // Skip invalid JSON chunks silently
            console.warn('Failed to parse SSE chunk:', parseError, 'Data:', data);
          }
        }
      }
    } catch (error) {
      console.error('Error in sendMessageWithStream:', error.message);
      res.write(`data: ${JSON.stringify({
        type: 'error',
        error: error.message,
      })}\n\n`);
      res.end();
    }
  }

  /**
   * Save streamed message to database after streaming completes
   */
  async saveStreamedMessage(userId, content, tokenCount) {
    try {
      // Get conversation
      const conv = await this.initializeConversation(userId);
      
      // Add to conversation history
      if (conv.messages) {
        conv.messages.push({
          role: 'assistant',
          content: content
        });
      }

      // Save to database
      await pool.query(
        `INSERT INTO chatbot_messages (user_id, role, content, message_type, tokens_used) 
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, 'assistant', content, 'response', tokenCount]
      );

      // Update conversation message count (only assistant message, user message already counted)
      if (conv.conversationId) {
        await pool.query(
          'UPDATE chatbot_conversations SET message_count = message_count + 1 WHERE id = $1',
          [conv.conversationId]
        );
      }
    } catch (error) {
      console.error('Error saving streamed message:', error);
    }
  }
}

module.exports = ChatbotService;
