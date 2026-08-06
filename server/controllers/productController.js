const Product = require('../models/Product');

// ─── Get All Products ─────────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// ─── Get Single Product ───────────────────────────────────────────────────────
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// ─── Create Product (Admin) ───────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock, discount } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const product = await Product.create({
      name, description, price, category, image,
      stock: stock || 0,
      discount: discount || 0,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// ─── Update Product (Admin) ───────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, category, image, stock, discount, rating, reviews } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.image = image ?? product.image;
    product.stock = stock ?? product.stock;
    product.discount = discount ?? product.discount;
    product.rating = rating ?? product.rating;
    product.reviews = reviews ?? product.reviews;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// ─── Delete Product (Admin) ───────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// ─── Get Categories ───────────────────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };
