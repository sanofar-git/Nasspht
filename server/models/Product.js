const mongoose = require('mongoose');
const { createModelAdapter } = require('./modelAdapter');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Electronics', 'Clothing', 'Footwear', 'Bags', 'Accessories', 'Sports', 'Home', 'Beauty', 'Books', 'Groceries', 'Pet Supplies', 'Toys', 'Automotive', 'Other'],
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual: discounted price
productSchema.virtual('finalPrice').get(function () {
  return parseFloat((this.price * (1 - this.discount / 100)).toFixed(2));
});

const MongooseProduct = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = createModelAdapter('Product', MongooseProduct);
