const { createClient } = require('@supabase/supabase-js');
const ChatbotService = require('../services/ChatbotService');

/**
 * Supabase Realtime handler for production deployments
 * Compatible with Vercel (no WebSocket server requirements)
 */
class ChatbotSupabaseRealtimeHandler {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_KEY;
    this.chatbotService = new ChatbotService();
    this.userConnections = new Map();

    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('Supabase credentials not configured. Realtime chat will not work.');
    }

    // Initialize Supabase client
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  /**
   * Initialize Supabase Realtime subscriptions
   */
  async initialize() {
    console.log('Initializing Supabase Realtime Handler...');

    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('Skipping Supabase Realtime initialization - credentials not configured');
      return;
    }

    try {
      // Set up database change listeners
      this.setupDatabaseListeners();
      console.log('Supabase Realtime initialized successfully');
    } catch (error) {
      console.error('Error initializing Supabase Realtime:', error);
    }
  }

  /**
   * Setup listeners for database changes (optional - for monitoring)
   */
  setupDatabaseListeners() {
    // This can be extended to listen for message changes
    // For now, we'll keep it simple and rely on REST API calls
  }

  /**
   * Broadcast message to client via Supabase Realtime
   * Client should be listening to a specific channel
   */
  async broadcastMessage(userId, event, data) {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        console.log('Supabase not configured, skipping broadcast');
        return null;
      }

      const channelName = `user-${userId}`;
      
      let channel = this.userConnections.get(channelName);
      
      if (!channel) {
        channel = this.supabase.channel(channelName);
        channel = await channel.subscribe((status) => {
          console.log(`Channel subscription status: ${status}`);
        });
        
        this.userConnections.set(channelName, channel);
      }

      channel.send('broadcast', {
        event,
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      });

      return channel;
    } catch (error) {
      console.error('Error broadcasting message:', error);
      return null;
    }
  }

  /**
   * Handle join-chat request via REST/HTTP
   */
  async handleJoinChat(userId, userName) {
    try {
      // Initialize conversation
      await this.chatbotService.initializeConversation(userId);

      // Broadcast welcome message
      await this.broadcastMessage(userId, 'chat-started', {
        success: true,
        message: `Welcome to XPogo AI Chatbot, ${userName}!`,
        userId,
        userName
      });

      return {
        success: true,
        message: 'Chat initialized',
        userId
      };
    } catch (error) {
      console.error('Error handling join-chat:', error);
      throw error;
    }
  }

  /**
   * Handle send-message request via REST/HTTP
   * Message is processed and response is broadcast
   */
  async handleSendMessage(userId, message) {
    try {
      // Broadcast typing indicator
      await this.broadcastMessage(userId, 'bot-typing', {
        status: 'typing',
        userId
      });

      // Process message and get response
      const response = await this.chatbotService.sendMessage(userId, message);

      // Broadcast response
      await this.broadcastMessage(userId, 'bot-response', response);

      return response;
    } catch (error) {
      console.error('Error handling send-message:', error);
      
      // Broadcast error
      await this.broadcastMessage(userId, 'error', {
        success: false,
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Handle get-history request
   */
  async handleGetHistory(userId) {
    try {
      const history = await this.chatbotService.getConversationSummary(userId);

      // Broadcast history
      await this.broadcastMessage(userId, 'conversation-history', {
        success: true,
        messages: history,
        count: history.length
      });

      return {
        success: true,
        messages: history
      };
    } catch (error) {
      console.error('Error handling get-history:', error);
      throw error;
    }
  }

  /**
   * Handle clear-chat request
   */
  async handleClearChat(userId) {
    try {
      const result = await this.chatbotService.clearConversation(userId);

      // Broadcast clear confirmation
      await this.broadcastMessage(userId, 'chat-cleared', {
        success: true,
        message: 'Conversation cleared'
      });

      return result;
    } catch (error) {
      console.error('Error handling clear-chat:', error);
      throw error;
    }
  }

  /**
   * Handle analyze-product request
   */
  async handleAnalyzeProduct(userId, productInfo) {
    try {
      // Broadcast typing indicator
      await this.broadcastMessage(userId, 'bot-typing', {
        status: 'analyzing',
        userId
      });

      const response = await this.chatbotService.analyzeProductForExport(userId, productInfo);

      // Broadcast response
      await this.broadcastMessage(userId, 'bot-response', response);

      return response;
    } catch (error) {
      console.error('Error handling analyze-product:', error);
      throw error;
    }
  }

  /**
   * Handle market-strategy request
   */
  async handleMarketStrategy(userId, marketInfo) {
    try {
      await this.broadcastMessage(userId, 'bot-typing', {
        status: 'planning',
        userId
      });

      const response = await this.chatbotService.getMarketEntryStrategy(userId, marketInfo);

      await this.broadcastMessage(userId, 'bot-response', response);

      return response;
    } catch (error) {
      console.error('Error handling market-strategy:', error);
      throw error;
    }
  }

  /**
   * Handle compliance-guidance request
   */
  async handleComplianceGuidance(userId, complianceQuery) {
    try {
      await this.broadcastMessage(userId, 'bot-typing', {
        status: 'analyzing',
        userId
      });

      const response = await this.chatbotService.getComplianceGuidance(userId, complianceQuery);

      await this.broadcastMessage(userId, 'bot-response', response);

      return response;
    } catch (error) {
      console.error('Error handling compliance-guidance:', error);
      throw error;
    }
  }

  /**
   * Handle shipping-guidance request
   */
  async handleShippingGuidance(userId, shippingInfo) {
    try {
      await this.broadcastMessage(userId, 'bot-typing', {
        status: 'analyzing',
        userId
      });

      const response = await this.chatbotService.getShippingGuidance(userId, shippingInfo);

      await this.broadcastMessage(userId, 'bot-response', response);

      return response;
    } catch (error) {
      console.error('Error handling shipping-guidance:', error);
      throw error;
    }
  }

  /**
   * Cleanup channel subscription when user disconnects
   */
  async cleanupUserConnection(userId) {
    try {
      const channelName = `user-${userId}`;
      const channel = this.userConnections.get(channelName);
      
      if (channel) {
        await channel.unsubscribe();
        this.userConnections.delete(channelName);
        console.log(`Cleaned up channel for user ${userId}`);
      }
    } catch (error) {
      console.error('Error cleaning up user connection:', error);
    }
  }

  /**
   * Handle streaming message response using Server-Sent Events
   */
  async handleSendMessageStream(userId, userMessage, res) {
    try {
      // Initialize conversation if needed
      const conv = await this.chatbotService.initializeConversation(userId);
      const messages = conv.messages;

      // Add user message to memory
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Save user message to database asynchronously (don't block streaming)
      this.chatbotService.saveMessage(userId, 'user', userMessage, 'message').catch(err => 
        console.error('Error saving user message:', err)
      );

      // Start streaming immediately - no "start" event, just begin streaming chunks
      await this.chatbotService.sendMessageWithStream(userId, userMessage, messages, res);
    } catch (error) {
      console.error('Error in streaming send message:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: error.message,
        })}\n\n`);
      }
      res.end();
    }
  }

  /**
   * Handle streaming product analysis
   */
  async handleAnalyzeProductStream(userId, productInfo, res) {
    try {
      // Initialize conversation if needed
      const conv = await this.chatbotService.initializeConversation(userId);
      const messages = conv.messages;

      // Create product analysis prompt
      const userMessage = `Tolong analisis produk ini untuk ekspor: ${productInfo}`;
      
      // Add to message history
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Save user message asynchronously (don't block streaming)
      this.chatbotService.saveMessage(userId, 'user', userMessage, 'analyze_product').catch(err => 
        console.error('Error saving user message:', err)
      );

      // Start streaming immediately
      await this.chatbotService.sendMessageWithStream(userId, userMessage, messages, res);
    } catch (error) {
      console.error('Error in streaming product analysis:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: error.message,
        })}\n\n`);
      }
      res.end();
    }
  }

  /**
   * Handle streaming market strategy
   */
  async handleMarketStrategyStream(userId, marketInfo, res) {
    try {
      const conv = await this.chatbotService.initializeConversation(userId);
      const messages = conv.messages;

      const userMessage = `Apa strategi masuk pasar terbaik untuk: ${marketInfo}`;
      
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Save user message asynchronously (don't block streaming)
      this.chatbotService.saveMessage(userId, 'user', userMessage, 'market_strategy').catch(err => 
        console.error('Error saving user message:', err)
      );

      // Start streaming immediately
      await this.chatbotService.sendMessageWithStream(userId, userMessage, messages, res);
    } catch (error) {
      console.error('Error in streaming market strategy:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: error.message,
        })}\n\n`);
      }
      res.end();
    }
  }

  /**
   * Handle streaming compliance guidance
   */
  async handleComplianceGuidanceStream(userId, complianceQuery, res) {
    try {
      const conv = await this.chatbotService.initializeConversation(userId);
      const messages = conv.messages;

      const userMessage = `Saya membutuhkan panduan kepatuhan: ${complianceQuery}`;
      
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Save user message asynchronously (don't block streaming)
      this.chatbotService.saveMessage(userId, 'user', userMessage, 'compliance_guidance').catch(err => 
        console.error('Error saving user message:', err)
      );

      // Start streaming immediately
      await this.chatbotService.sendMessageWithStream(userId, userMessage, messages, res);
    } catch (error) {
      console.error('Error in streaming compliance guidance:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: error.message,
        })}\n\n`);
      }
      res.end();
    }
  }

  /**
   * Handle streaming shipping guidance
   */
  async handleShippingGuidanceStream(userId, shippingInfo, res) {
    try {
      const conv = await this.chatbotService.initializeConversation(userId);
      const messages = conv.messages;

      const userMessage = `Tolong berikan panduan pengiriman untuk: ${shippingInfo}`;
      
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Save user message asynchronously (don't block streaming)
      this.chatbotService.saveMessage(userId, 'user', userMessage, 'shipping_guidance').catch(err => 
        console.error('Error saving user message:', err)
      );

      // Start streaming immediately
      await this.chatbotService.sendMessageWithStream(userId, userMessage, messages, res);
    } catch (error) {
      console.error('Error in streaming shipping guidance:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: error.message,
        })}\n\n`);
      }
      res.end();
    }
  }
}

module.exports = ChatbotSupabaseRealtimeHandler;
