const ChatbotService = require('../services/ChatbotService');

/**
 * WebSocket handler for real-time chatbot communication
 */
class ChatbotWebSocketHandler {
  constructor(io) {
    this.io = io;
    this.chatbotService = new ChatbotService();
    this.userConnections = new Map(); // Track user WebSocket connections
  }

  /**
   * Initialize WebSocket event handlers
   */
  initialize() {
    console.log("Initializing Chatbot WebSocket Handler...");

    this.io.on('connection', (socket) => {
      console.log(`New WebSocket connection: ${socket.id}`);

      // Handle user joining chat
      socket.on('join-chat', (data) => {
        this.handleJoinChat(socket, data);
      });

      // Handle incoming messages
      socket.on('send-message', (data) => {
        this.handleSendMessage(socket, data);
      });

      // Handle getting conversation history
      socket.on('get-history', (data) => {
        this.handleGetHistory(socket, data);
      });

      // Handle clearing conversation
      socket.on('clear-chat', (data) => {
        this.handleClearChat(socket, data);
      });

      // Handle product analysis request
      socket.on('analyze-product', (data) => {
        this.handleAnalyzeProduct(socket, data);
      });

      // Handle market entry strategy request
      socket.on('market-strategy', (data) => {
        this.handleMarketStrategy(socket, data);
      });

      // Handle compliance guidance request
      socket.on('compliance-guidance', (data) => {
        this.handleComplianceGuidance(socket, data);
      });

      // Handle shipping guidance request
      socket.on('shipping-guidance', (data) => {
        this.handleShippingGuidance(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`WebSocket error for socket ${socket.id}:`, error);
        socket.emit('error', {
          success: false,
          error: 'Connection error occurred'
        });
      });
    });
  }

  /**
   * Handle user joining chat
   */
  handleJoinChat(socket, data) {
    const { userId, userName } = data;

    if (!userId) {
      socket.emit('error', {
        success: false,
        error: 'userId is required'
      });
      return;
    }

    // Store connection
    this.userConnections.set(userId, socket.id);

    // Initialize conversation
    this.chatbotService.initializeConversation(userId);

    // Send welcome message
    socket.emit('chat-started', {
      success: true,
      message: `Welcome to Export Assistant! 👋 I'm here to help you with all aspects of exporting your products. What would you like to know?`,
      userId,
      timestamp: new Date().toISOString()
    });

    console.log(`User ${userId} (${userName}) joined chat`);
  }

  /**
   * Handle incoming chat messages
   */
  async handleSendMessage(socket, data) {
    const { userId, message } = data;

    if (!userId || !message) {
      socket.emit('error', {
        success: false,
        error: 'userId and message are required'
      });
      return;
    }

    try {
      // Send typing indicator
      socket.emit('bot-typing', {
        status: 'typing',
        userId
      });

      // Get AI response
      const response = await this.chatbotService.sendMessage(userId, message);

      // Send response back to client
      socket.emit('bot-response', {
        success: true,
        message: response.message,
        messageType: response.messageType,
        timestamp: response.timestamp,
        userId
      });
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', {
        success: false,
        error: error.message || 'Failed to process message'
      });
    }
  }


  /**
   * Handle getting conversation history
   */
  handleGetHistory(socket, data) {
    const { userId } = data;

    if (!userId) {
      socket.emit('error', {
        success: false,
        error: 'userId is required'
      });
      return;
    }

    const history = this.chatbotService.getConversationSummary(userId);

    socket.emit('conversation-history', {
      success: true,
      history,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle clearing conversation
   */
  handleClearChat(socket, data) {
    const { userId } = data;

    if (!userId) {
      socket.emit('error', {
        success: false,
        error: 'userId is required'
      });
      return;
    }

    this.chatbotService.clearConversation(userId);

    socket.emit('chat-cleared', {
      success: true,
      message: 'Conversation cleared. Starting fresh!',
      userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle product analysis request
   */
  async handleAnalyzeProduct(socket, data) {
    const { userId, productInfo } = data;

    if (!userId || !productInfo) {
      socket.emit('error', {
        success: false,
        error: 'userId and productInfo are required'
      });
      return;
    }

    try {
      socket.emit('bot-typing', { status: 'typing', userId });

      const response = await this.chatbotService.analyzeProductForExport(userId, productInfo);

      socket.emit('bot-response', {
        success: true,
        message: response.message,
        analysisType: 'product-export',
        timestamp: response.timestamp,
        userId
      });
    } catch (error) {
      console.error('Error analyzing product:', error);
      socket.emit('error', {
        success: false,
        error: error.message || 'Failed to analyze product'
      });
    }
  }

  /**
   * Handle market entry strategy request
   */
  async handleMarketStrategy(socket, data) {
    const { userId, marketInfo } = data;

    if (!userId || !marketInfo) {
      socket.emit('error', {
        success: false,
        error: 'userId and marketInfo are required'
      });
      return;
    }

    try {
      socket.emit('bot-typing', { status: 'typing', userId });

      const response = await this.chatbotService.getMarketEntryStrategy(userId, marketInfo);

      socket.emit('bot-response', {
        success: true,
        message: response.message,
        strategyType: 'market-entry',
        timestamp: response.timestamp,
        userId
      });
    } catch (error) {
      console.error('Error getting market strategy:', error);
      socket.emit('error', {
        success: false,
        error: error.message || 'Failed to generate market strategy'
      });
    }
  }

  /**
   * Handle compliance guidance request
   */
  async handleComplianceGuidance(socket, data) {
    const { userId, complianceQuery } = data;

    if (!userId || !complianceQuery) {
      socket.emit('error', {
        success: false,
        error: 'userId and complianceQuery are required'
      });
      return;
    }

    try {
      socket.emit('bot-typing', { status: 'typing', userId });

      const response = await this.chatbotService.getComplianceGuidance(userId, complianceQuery);

      socket.emit('bot-response', {
        success: true,
        message: response.message,
        guidanceType: 'compliance',
        timestamp: response.timestamp,
        userId
      });
    } catch (error) {
      console.error('Error getting compliance guidance:', error);
      socket.emit('error', {
        success: false,
        error: error.message || 'Failed to provide compliance guidance'
      });
    }
  }

  /**
   * Handle shipping guidance request
   */
  async handleShippingGuidance(socket, data) {
    const { userId, shippingInfo } = data;

    if (!userId || !shippingInfo) {
      socket.emit('error', {
        success: false,
        error: 'userId and shippingInfo are required'
      });
      return;
    }

    try {
      socket.emit('bot-typing', { status: 'typing', userId });

      const response = await this.chatbotService.getShippingGuidance(userId, shippingInfo);

      socket.emit('bot-response', {
        success: true,
        message: response.message,
        guidanceType: 'shipping',
        timestamp: response.timestamp,
        userId
      });
    } catch (error) {
      console.error('Error getting shipping guidance:', error);
      socket.emit('error', {
        success: false,
        error: error.message || 'Failed to provide shipping guidance'
      });
    }
  }

  /**
   * Handle user disconnect
   */
  handleDisconnect(socket) {
    // Find and remove user from connections
    for (const [userId, socketId] of this.userConnections.entries()) {
      if (socketId === socket.id) {
        this.userConnections.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }
}

module.exports = ChatbotWebSocketHandler;
