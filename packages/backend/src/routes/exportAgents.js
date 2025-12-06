const express = require('express');
const ExportAgentController = require('../controllers/ExportAgentController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/export-agents
 * @desc    Get all export agents with optional filters
 * @access  Public (can be made private if needed)
 * @query   {string} category - Filter by specialization category
 * @query   {string} targetCountry - Filter by target country
 * @query   {string} city - Filter by city
 * @query   {boolean} verifiedOnly - Only return verified agents
 * @query   {number} minRating - Minimum rating
 */
router.get('/', ExportAgentController.getAllAgents);

/**
 * @route   GET /api/export-agents/recommendations
 * @desc    Get AI-powered recommendations for export agents based on user product
 * @access  Private
 * @query   {number} productId - Product ID (optional, uses first active product if not provided)
 * @query   {number} limit - Maximum number of recommendations (default: 5, max: 10)
 * @query   {boolean} verifiedOnly - Only recommend verified agents
 */
router.get('/recommendations', authMiddleware, ExportAgentController.getRecommendations);

/**
 * @route   GET /api/export-agents/recommendations/history
 * @desc    Get user's recommendation history
 * @access  Private
 * @query   {number} productId - Filter by product ID (optional)
 */
router.get('/recommendations/history', authMiddleware, ExportAgentController.getRecommendationHistory);

/**
 * @route   GET /api/export-agents/:id
 * @desc    Get a single export agent by ID
 * @access  Public
 */
router.get('/:id', ExportAgentController.getAgentById);

/**
 * @route   POST /api/export-agents
 * @desc    Create a new export agent (admin function)
 * @access  Public (should be protected with admin middleware in production)
 */
router.post('/', ExportAgentController.createAgent);

/**
 * @route   PUT /api/export-agents/:id
 * @desc    Update an export agent (admin function)
 * @access  Public (should be protected with admin middleware in production)
 */
router.put('/:id', ExportAgentController.updateAgent);

module.exports = router;

