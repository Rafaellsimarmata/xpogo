const express = require('express');
const NewsController = require('../controllers/NewsController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/news
 * @desc    Get export/import news articles
 * @access  Private
 * @query   {string} category - News category (regulations, market-insights, programs, events, all)
 * @query   {string} country - Filter by target country
 * @query   {string} productType - Filter by product type
 * @query   {number} limit - Number of news items (default: 5, max: 20)
 */
router.get('/', authMiddleware, NewsController.getNews);

/**
 * @route   GET /api/news/category/:category
 * @desc    Get news by category
 * @access  Private
 * @param   {string} category - News category
 * @query   {number} limit - Number of news items
 */
router.get('/category/:category', authMiddleware, NewsController.getNewsByCategory);

/**
 * @route   GET /api/news/country/:country
 * @desc    Get news filtered by country
 * @access  Private
 * @param   {string} country - Target country name
 * @query   {number} limit - Number of news items
 */
router.get('/country/:country', authMiddleware, NewsController.getNewsByCountry);

module.exports = router;

