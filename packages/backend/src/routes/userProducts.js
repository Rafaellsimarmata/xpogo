const express = require('express');
const UserProductController = require('../controllers/UserProductController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/user/products
 * @desc    Get all products for the authenticated user
 * @access  Private
 * @query   {string} status - Filter by status (active, archived)
 */
router.get('/', authMiddleware, UserProductController.getUserProducts);

/**
 * @route   GET /api/user/products/stats
 * @desc    Get product statistics for the authenticated user
 * @access  Private
 */
router.get('/stats', authMiddleware, UserProductController.getProductStats);

/**
 * @route   GET /api/user/products/:id
 * @desc    Get a single product by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, UserProductController.getProductById);

/**
 * @route   POST /api/user/products
 * @desc    Create a new product
 * @access  Private
 */
router.post('/', authMiddleware, UserProductController.createProduct);

/**
 * @route   PUT /api/user/products/:id
 * @desc    Update a product
 * @access  Private
 */
router.put('/:id', authMiddleware, UserProductController.updateProduct);

/**
 * @route   DELETE /api/user/products/:id
 * @desc    Delete a product (soft delete)
 * @access  Private
 */
router.delete('/:id', authMiddleware, UserProductController.deleteProduct);

module.exports = router;

