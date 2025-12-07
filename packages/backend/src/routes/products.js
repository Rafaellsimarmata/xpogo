const express = require('express');
const productsData = require('../data/products.json');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all Indonesian export products with optional filtering
 * @access  Public
 * @query   {string} category - Filter by category (Agricultural, Manufacturing, Mining, Energy, Artisan)
 * @query   {string} search - Search by product name (partial match)
 * @query   {string} difficulty - Filter by difficulty level (Low, Medium, High)
 */
router.get('/', (req, res) => {
  try {
    const { category, search, difficulty } = req.query;
    let results = [...productsData];

    if (category) {
      const normalizedCategory = category.toLowerCase();
      results = results.filter(
        product => product.category.toLowerCase() === normalizedCategory
      );
    }

    if (difficulty) {
      const normalizedDifficulty = difficulty.toLowerCase();
      results = results.filter(
        product => product.difficulty_level.toLowerCase() === normalizedDifficulty
      );
    }

    if (search) {
      const normalizedSearch = search.toLowerCase();
      results = results.filter(
        product => 
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch)
      );
    }

    results.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products' 
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get specific product by ID
 * @access  Public
 * @param   {string} id - Product ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = productsData.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch product' 
    });
  }
});

/**
 * @route   GET /api/products/categories/list
 * @desc    Get all available product categories
 * @access  Public
 */
router.get('/categories/list', (req, res) => {
  try {
    const categories = [...new Set(productsData.map(p => p.category))].sort();
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch categories' 
    });
  }
});

module.exports = router;
