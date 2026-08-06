const express = require('express');
const router = express.Router();
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
