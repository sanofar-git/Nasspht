const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── Create Order ─────────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items, totalPrice } = req.body;

    if (!shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    // Reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalPrice,
      status: 'Pending',
    });

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// ─── Get User Orders ──────────────────────────────────────────────────────────
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ─── Get Single Order ─────────────────────────────────────────────────────────
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name image price category')
      .populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure user can only see their own orders (unless admin)
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

module.exports = { createOrder, getUserOrders, getOrder };
