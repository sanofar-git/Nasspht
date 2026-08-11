const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cart = require('./models/Cart');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/vizhop';

const clearCarts = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear all carts
    await Cart.deleteMany({});
    console.log('🧹 Cleared all existing carts to fix dangling product references');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
};

clearCarts();
