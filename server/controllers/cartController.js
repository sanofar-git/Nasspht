const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── Get Cart ─────────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ items: [], totalPrice: 0, totalItems: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// ─── Add to Cart ──────────────────────────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const finalPrice = product.price * (1 - product.discount / 100);

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, price: finalPrice }],
      });
    } else {
      const existingItem = cart.items.find(i => i.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = finalPrice;
      } else {
        cart.items.push({ product: productId, quantity, price: finalPrice });
      }
      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// ─── Update Cart Item ─────────────────────────────────────────────────────────
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i._id.toString() === req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart' });
  }
};

// ─── Remove from Cart ─────────────────────────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

// ─── Clear Cart ───────────────────────────────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
