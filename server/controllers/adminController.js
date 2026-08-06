const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders, topProducts] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
      ]),
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      pendingOrders,
      deliveredOrders,
      recentOrders,
      topProducts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

// ─── Get All Users ────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin) return res.status(400).json({ message: 'Cannot delete admin user' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ─── Update Order Status ──────────────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser, getAllOrders, updateOrderStatus };
