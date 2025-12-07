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
    this.conversationHistory = new Map();
  }

  /**
   * Initialize or get conversation for a user
   * Loads existing messages from database or creates new conversation
   */
  async initializeConversation(userId) {
    if (!this.conversationHistory.has(userId)) {
      try {
        const convResult = await pool.query(
          'SELECT id FROM chatbot_conversations WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC LIMIT 1',
          [userId]
        );

        let conversationId;
        if (convResult.rows.length === 0) {
          const createConvResult = await pool.query(
            'INSERT INTO chatbot_conversations (user_id, title) VALUES ($1, $2) RETURNING id',
            [userId, `Conversation ${new Date().toLocaleDateString()}`]
          );
          conversationId = createConvResult.rows[0].id;
        } else {
          conversationId = convResult.rows[0].id;
        }

        const messagesResult = await pool.query(
          'SELECT role, content FROM chatbot_messages WHERE user_id = $1 ORDER BY created_at ASC',
          [userId]
        );

        const messages = [
          {
            role: 'system',
            content: `Anda adalah asisten AI ahli yang mengkhususkan diri dalam membantu usaha kecil mengekspor produk mereka. 
          
Keahlian Anda meliputi:
- Dokumentasi ekspor produk dan kepatuhan
- Regulasi perdagangan internasional dan bea cukai
- Analisis pasar untuk berbagai negara
- Panduan pengiriman dan logistik
- Strategi penetapan harga produk untuk pasar ekspor
- Mencari pasar sasaran dan peluang bisnis
- Pembiayaan ekspor dan syarat pembayaran
- Persyaratan pengemasan dan pelabelan produk
- Sertifikat Asal dan dokumentasi perdagangan
- Regulasi Impor/Ekspor berdasarkan negara

Bersikaplah membantu, profesional, dan berikan saran yang dapat ditindaklanjuti. Ajukan pertanyaan klarifikasi jika diperlukan.
Jika ditanya tentang sesuatu di luar bantuan ekspor, alihkan dengan sopan ke topik terkait ekspor.`
          }
        ];

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
        this.conversationHistory.set(userId, {
          conversationId: null,
          messages: [
            {
              role: 'system',
              content: `Anda adalah asisten AI ahli yang mengkhususkan diri dalam membantu usaha kecil mengekspor produk mereka.`
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
          max_tokens: 2000,
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
      await pool.query(
        'UPDATE chatbot_conversations SET is_active = false WHERE user_id = $1',
        [userId]
      );
      
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
    const analysisPrompt = `Tolong analisis produk berikut untuk potensi ekspor dan berikan panduan detail:

${productInfo}

Tolong berikan:
1. Penilaian Kelayakan Ekspor
2. Pasar Sasaran yang Direkomendasikan (diurutkan berdasarkan peluang)
3. Kepatuhan & Sertifikasi yang Diperlukan
4. Perkiraan Biaya untuk Ekspor
5. Timeline untuk Masuk Pasar
6. Risiko Utama & Cara Menguranginya
7. Langkah Selanjutnya untuk Memulai

Format sebagai saran yang dapat ditindaklanjuti untuk usaha kecil.`;

    return this.sendMessage(userId, analysisPrompt);
  }

  /**
   * Get market entry strategy
   */
  async getMarketEntryStrategy(userId, marketInfo) {
    const strategyPrompt = `Saya membutuhkan bantuan untuk mengembangkan strategi ekspor berdasarkan detail berikut:

${marketInfo}

Tolong berikan strategi masuk pasar yang detail termasuk:
1. Gambaran Pasar & Penilaian Peluang
2. Persyaratan Regulasi & Kepatuhan
3. Strategi Penetapan Harga untuk Pasar Ini
4. Saluran Distribusi
5. Pendekatan Pemasaran
6. Dokumentasi yang Diperlukan
7. Rincian Biaya
8. Rencana Aksi 12 Bulan

Buatlah spesifik dan dapat ditindaklanjuti untuk usaha kecil.`;

    return this.sendMessage(userId, strategyPrompt);
  }

  /**
   * Get answers about specific compliance requirements
   */
  async getComplianceGuidance(userId, complianceQuery) {
    const compliancePrompt = `Saya membutuhkan panduan tentang kepatuhan ekspor berdasarkan detail berikut:

${complianceQuery}

Tolong berikan:
1. Regulasi & Standar yang Relevan
2. Sertifikasi yang Diperlukan
3. Dokumentasi yang Diperlukan
4. Kesalahan Umum yang Harus Dihindari
5. Timeline untuk Kepatuhan
6. Perkiraan Biaya
7. Sumber Daya & Informasi Kontak

Berikan saran praktis yang dapat ditindaklanjuti.`;

    return this.sendMessage(userId, compliancePrompt);
  }

  /**
   * Get shipping and logistics guidance
   */
  async getShippingGuidance(userId, shippingInfo) {
    // shippingInfo is now a string with shipping details
    const shippingPrompt = `Saya membutuhkan panduan tentang pengiriman produk saya secara internasional.

${shippingInfo}

Tolong berikan saran tentang:
1. Metode Pengiriman Terbaik
2. Perkiraan Biaya & Timeline
3. Dokumentasi yang Diperlukan
4. Rekomendasi Asuransi
5. Persyaratan Pengemasan
6. Pemilihan Incoterms
7. Pengangkut yang Direkomendasikan

Fokus pada solusi yang hemat biaya untuk usaha kecil.`;

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
          max_tokens: 2000,
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
          max_tokens: 2000,
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
