const express = require('express');
const authMiddleware = require('../utils/authMiddleware');
const ChatbotSupabaseRealtimeHandler = require('../websocket/ChatbotSupabaseRealtimeHandler');

const router = express.Router();
const chatbotHandler = new ChatbotSupabaseRealtimeHandler();

// Initialize Supabase Realtime on startup
chatbotHandler.initialize();

/**
 * @route   POST /api/chatbot/join
 * @desc    Join chat session
 * @access  Private
 */
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ error: 'userName is required' });
    }

    const result = await chatbotHandler.handleJoinChat(userId, userName);
    res.json(result);
  } catch (error) {
    console.error('Error in join endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/chatbot/send-message
 * @desc    Send message to chatbot
 * @access  Private
 */
router.post('/send-message', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const result = await chatbotHandler.handleSendMessage(userId, message);
    res.json(result);
  } catch (error) {
    console.error('Error in send-message endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/chatbot/history
 * @desc    Get conversation history
 * @access  Private
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await chatbotHandler.handleGetHistory(userId);
    res.json(result);
  } catch (error) {
    console.error('Error in history endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/chatbot/clear
 * @desc    Clear conversation history
 * @access  Private
 */
router.post('/clear', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await chatbotHandler.handleClearChat(userId);
    res.json(result);
  } catch (error) {
    console.error('Error in clear endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/chatbot/analyze-product
 * @desc    Analyze product for export
 * @access  Private
 */
router.post('/analyze-product', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productInfo } = req.body;

    if (!productInfo || typeof productInfo !== 'string') {
      return res.status(400).json({ error: 'productInfo is required and must be a string' });
    }

    const result = await chatbotHandler.handleAnalyzeProduct(userId, productInfo);
    res.json(result);
  } catch (error) {
    console.error('Error in analyze-product endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/chatbot/market-strategy
 * @desc    Get market entry strategy
 * @access  Private
 */
router.post('/market-strategy', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { marketInfo } = req.body;

    if (!marketInfo || typeof marketInfo !== 'string') {
      return res.status(400).json({ error: 'marketInfo is required and must be a string' });
    }

    const result = await chatbotHandler.handleMarketStrategy(userId, marketInfo);
    res.json(result);
  } catch (error) {
    console.error('Error in market-strategy endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/chatbot/compliance-guidance
 * @desc    Get compliance guidance
 * @access  Private
 */
router.post('/compliance-guidance', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { complianceQuery } = req.body;

    if (!complianceQuery || typeof complianceQuery !== 'string') {
      return res.status(400).json({ error: 'complianceQuery is required and must be a string' });
    }

    const result = await chatbotHandler.handleComplianceGuidance(userId, complianceQuery);
    res.json(result);
  } catch (error) {
    console.error('Error in compliance-guidance endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/chatbot/shipping-guidance
 * @desc    Get shipping guidance
 * @access  Private
 */
router.post('/shipping-guidance', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingInfo } = req.body;

    if (!shippingInfo || typeof shippingInfo !== 'string') {
      return res.status(400).json({ error: 'shippingInfo is required and must be a string' });
    }

    const result = await chatbotHandler.handleShippingGuidance(userId, shippingInfo);
    res.json(result);
  } catch (error) {
    console.error('Error in shipping-guidance endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/chatbot/send-message-stream
 * @desc    Send message to chatbot with streaming response
 * @access  Private
 */
router.post('/send-message-stream', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Set headers for streaming immediately
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Flush headers immediately
    res.flushHeaders();

    await chatbotHandler.handleSendMessageStream(userId, message, res);
  } catch (error) {
    console.error('Error in send-message-stream endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
});

/**
 * @route   POST /api/chatbot/analyze-product-stream
 * @desc    Analyze product for export with streaming response
 * @access  Private
 */
router.post('/analyze-product-stream', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productInfo } = req.body;

    if (!productInfo || typeof productInfo !== 'string') {
      return res.status(400).json({ error: 'productInfo is required and must be a string' });
    }

    // Set headers for streaming immediately
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Flush headers immediately
    res.flushHeaders();

    await chatbotHandler.handleAnalyzeProductStream(userId, productInfo, res);
  } catch (error) {
    console.error('Error in analyze-product-stream endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
});

/**
 * @route   POST /api/chatbot/market-strategy-stream
 * @desc    Get market entry strategy with streaming response
 * @access  Private
 */
router.post('/market-strategy-stream', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { marketInfo } = req.body;

    if (!marketInfo || typeof marketInfo !== 'string') {
      return res.status(400).json({ error: 'marketInfo is required and must be a string' });
    }

    // Set headers for streaming immediately
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Flush headers immediately
    res.flushHeaders();

    await chatbotHandler.handleMarketStrategyStream(userId, marketInfo, res);
  } catch (error) {
    console.error('Error in market-strategy-stream endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
});

/**
 * @route   POST /api/chatbot/compliance-guidance-stream
 * @desc    Get compliance guidance with streaming response
 * @access  Private
 */
router.post('/compliance-guidance-stream', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { complianceQuery } = req.body;

    if (!complianceQuery || typeof complianceQuery !== 'string') {
      return res.status(400).json({ error: 'complianceQuery is required and must be a string' });
    }

    // Set headers for streaming immediately
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Flush headers immediately
    res.flushHeaders();

    await chatbotHandler.handleComplianceGuidanceStream(userId, complianceQuery, res);
  } catch (error) {
    console.error('Error in compliance-guidance-stream endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
});

/**
 * @route   POST /api/chatbot/shipping-guidance-stream
 * @desc    Get shipping guidance with streaming response
 * @access  Private
 */
router.post('/shipping-guidance-stream', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingInfo } = req.body;

    if (!shippingInfo || typeof shippingInfo !== 'string') {
      return res.status(400).json({ error: 'shippingInfo is required and must be a string' });
    }

    // Set headers for streaming immediately
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Flush headers immediately
    res.flushHeaders();

    await chatbotHandler.handleShippingGuidanceStream(userId, shippingInfo, res);
  } catch (error) {
    console.error('Error in shipping-guidance-stream endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
});

module.exports = router;
