const express = require('express');
const MarketIntelligenceController = require('../controllers/MarketIntelligenceController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /market-intelligence/analyze:
 *   post:
 *     tags:
 *       - Market Intelligence
 *     summary: Analyze market intelligence for a product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Name of the product to analyze
 *             required:
 *               - productName
 *             example:
 *               productName: "Coffee"
 *     responses:
 *       200:
 *         description: Market intelligence generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: string
 *                 marketIntelligence:
 *                   type: string
 *                   description: Full market intelligence analysis
 *                 model:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       400:
 *         description: Missing productName parameter
 *       401:
 *         description: Unauthorized - no valid token
 *       500:
 *         description: Failed to generate market intelligence
 */
router.post('/analyze', authMiddleware, MarketIntelligenceController.analyzeProduct);

/**
 * @swagger
 * /market-intelligence/parse-data:
 *   post:
 *     tags:
 *       - Market Intelligence
 *     summary: Parse market data from AI response
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aiResponse:
 *                 type: string
 *                 description: Raw AI response containing market data table
 *             required:
 *               - aiResponse
 *     responses:
 *       200:
 *         description: Data parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parsedData:
 *                   type: array
 *                 count:
 *                   type: integer
 *                 timestamp:
 *                   type: string
 *       400:
 *         description: Missing aiResponse parameter
 *       401:
 *         description: Unauthorized - no valid token
 *       500:
 *         description: Failed to parse data
 */
router.post('/parse-data', authMiddleware, MarketIntelligenceController.parseData);

module.exports = router;
