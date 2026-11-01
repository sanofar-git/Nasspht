const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/admin',    require('./routes/admin'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vizhop API is running 🚀' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── Sample Products Seed Data ────────────────────────────────────────────────
const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium noise-cancelling wireless headphones. 40-hour battery life, comfortable over-ear design, and Bluetooth 5.0 connectivity. Perfect for music lovers and professionals alike.',
    price: 2499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    stock: 50,
    discount: 15,
    rating: 4.8,
    reviews: 234,
  },
  {
    name: 'Ultra-Slim Laptop Pro 15"',
    description: 'A powerhouse in a sleek form factor. Featuring 12th Gen Intel Core i7, 16GB RAM, 512GB NVMe SSD, and a stunning 4K OLED display. Weighing just 1.2kg, it\'s your ultimate work companion.',
    price: 89999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop',
    stock: 20,
    discount: 10,
    rating: 4.9,
    reviews: 567,
  },
  {
    name: 'Smart Watch Series X',
    description: 'Track your fitness goals, receive notifications, and monitor your health with this advanced smartwatch. Features GPS, heart-rate monitor, sleep tracking, and 7-day battery life.',
    price: 8999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
    stock: 75,
    discount: 20,
    rating: 4.6,
    reviews: 892,
  },
  {
    name: 'DSLR Camera Kit Pro',
    description: 'Capture life\'s most precious moments in stunning detail. Includes 24MP sensor, 18-55mm lens kit, built-in WiFi, 4K video recording, and a weather-sealed body for all-condition shooting.',
    price: 54999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
    stock: 15,
    discount: 5,
    rating: 4.7,
    reviews: 345,
  },
  {
    name: 'Air Max Sports Sneakers',
    description: 'Engineered for peak performance and unmatched style. Features responsive cushioning technology, breathable mesh upper, and durable rubber outsole. Available in multiple colorways.',
    price: 7999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
    stock: 100,
    discount: 25,
    rating: 4.5,
    reviews: 1203,
  },
  {
    name: 'Designer Leather Backpack',
    description: 'A fusion of style and functionality. Crafted from premium genuine leather, this backpack features a 15" laptop compartment, multiple organizer pockets, and anti-theft design.',
    price: 4599,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop',
    stock: 40,
    discount: 10,
    rating: 4.4,
    reviews: 456,
  },
  {
    name: 'UV Protection Sunglasses',
    description: 'Protect your eyes in style with 100% UV400 protection polarized lenses. Lightweight titanium frame, scratch-resistant coating, and includes a premium hard case.',
    price: 1899,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop',
    stock: 80,
    discount: 30,
    rating: 4.3,
    reviews: 678,
  },
  {
    name: 'Smartphone Pro Max 256GB',
    description: 'The ultimate smartphone experience. Features a 6.7" Super AMOLED display, 200MP triple camera system, 5G connectivity, 5000mAh battery with 65W fast charging, and IP68 water resistance.',
    price: 79999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop',
    stock: 30,
    discount: 8,
    rating: 4.9,
    reviews: 2341,
  },
  {
    name: 'Classic Cotton T-Shirt (Pack of 3)',
    description: 'Everyday comfort in a classic fit. Made from 100% organic cotton, pre-shrunk, and available in a pack of 3 assorted colors. Machine washable and durable for everyday wear.',
    price: 999,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop',
    stock: 200,
    discount: 20,
    rating: 4.2,
    reviews: 3456,
  },
  {
    name: 'Wireless Gaming Mouse',
    description: 'Dominate your gameplay with this high-performance wireless gaming mouse. 25,600 DPI optical sensor, 6 programmable buttons, RGB lighting, and 70-hour battery life.',
    price: 3499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop',
    stock: 60,
    discount: 12,
    rating: 4.7,
    reviews: 890,
  },
  {
    name: 'Stainless Steel Water Bottle 1L',
    description: 'Stay hydrated in style. Double-walled vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof lid, BPA-free, and fits most car cup holders.',
    price: 899,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
    stock: 150,
    discount: 15,
    rating: 4.6,
    reviews: 1567,
  },
  {
    name: 'Yoga Mat Premium 6mm',
    description: 'Elevate your yoga practice with this premium non-slip mat. Made from eco-friendly TPE material, 6mm thickness for joint support, includes carrying strap, and machine washable.',
    price: 1299,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop',
    stock: 90,
    discount: 20,
    rating: 4.5,
    reviews: 723,
  },
];

// ─── DB Connection + Server Start ─────────────────────────────────────────────
const connectDB = async () => {
  let mongoConnected = false;
  if (process.env.MONGO_URI) {
    try {
      console.log('🔄 Attempting MongoDB connection...');
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB Connected successfully');
      mongoConnected = true;
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed:', err.message);
      console.log('📦 Activating built-in resilient JSON Database store.');
    }
  } else {
    console.log('ℹ️ No MONGO_URI provided. Using built-in resilient JSON Database store.');
  }

  try {
    // Seed admin user
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      const hashedPw = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPw,
        isAdmin: true,
        phone: '9999999999',
      });
      console.log('✅ Admin user seeded: admin@gmail.com / admin123');
    }

    // Seed sample products
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`✅ ${sampleProducts.length} sample products seeded`);
    }
  } catch (err) {
    console.error('Data initialization warning:', err.message);
  }
};

const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Vizhop Server running on http://localhost:${PORT}`);
    console.log(`📌 Admin: admin@gmail.com | Password: admin123`);
  });
});
