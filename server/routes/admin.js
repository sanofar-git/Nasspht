const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly); // All admin routes require admin auth

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
