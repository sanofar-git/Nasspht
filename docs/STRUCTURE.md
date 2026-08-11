# 🏗️ Project Architecture & Folder Structure

This document provides an in-depth explanation of the file structure and component architecture of the **Vizhop (Nasspht)** E-Commerce platform.

---

## 📂 Overall Repository Tree

```
Nasspht/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static public assets
│   ├── src/                    # React application source code
│   │   ├── assets/             # Images, icons, and styling assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Footer.jsx      # Global Application Footer
│   │   │   ├── Navbar.jsx      # Global Navigation Header with Cart badge
│   │   │   └── ProductCard.jsx # Product Card with quick add-to-cart
│   │   ├── context/            # React Context State Management
│   │   │   ├── AuthContext.jsx # Authentication state & JWT handling
│   │   │   └── CartContext.jsx # Cart item management & API sync
│   │   ├── pages/              # User Page Views
│   │   │   ├── admin/          # Admin Control Panel Views
│   │   │   │   ├── AdminLayout.jsx  # Sidebar & Admin Layout Wrapper
│   │   │   │   ├── AllOrders.jsx    # Manage all customer orders
│   │   │   │   ├── AllProducts.jsx  # Admin product inventory table
│   │   │   │   ├── AllUsers.jsx     # User management table
│   │   │   │   ├── Dashboard.jsx    # Analytics dashboard & summary cards
│   │   │   │   ├── EditProduct.jsx  # Edit product details
│   │   │   │   └── NewProduct.jsx   # Create new product form
│   │   │   ├── Cart.jsx             # Shopping cart view & quantity controls
│   │   │   ├── Checkout.jsx         # Shipping details & payment order submission
│   │   │   ├── Landing.jsx          # Hero section, categories & featured items
│   │   │   ├── Login.jsx            # User authentication login
│   │   │   ├── OrderConfirmation.jsx # Post-checkout invoice summary
│   │   │   ├── ProductDetail.jsx    # Detailed view, reviews, and stock
│   │   │   ├── Products.jsx         # Product catalog with search, filter & pagination
│   │   │   ├── Profile.jsx          # User profile & order history
│   │   │   └── Register.jsx         # User registration form
│   │   ├── App.jsx              # Main router & layout entry
│   │   ├── index.css            # Custom CSS styling system
│   │   └── main.jsx             # React DOM root & global Axios setup
│   ├── .env.production          # Production environment variables
│   ├── index.html               # Main HTML template
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite dev server & proxy settings
│
├── server/                     # Express.js REST API Backend
│   ├── controllers/            # Controller business logic
│   │   ├── adminController.js   # Analytics, user & order management logic
│   │   ├── authController.js    # Register, login, profile management
│   │   ├── cartController.js    # Add, update, remove, clear cart items
│   │   ├── orderController.js   # Create order, get order details & user orders
│   │   └── productController.js # CRUD products, search, category filter
│   ├── middleware/             # Express middlewares
│   │   └── auth.js             # JWT verification & Admin permission guards
│   ├── models/                 # Mongoose Database Schemas
│   │   ├── Cart.js             # Shopping cart model (user reference + item array)
│   │   ├── Order.js            # Customer order model with shipping & payment info
│   │   ├── Product.js          # Product model (name, price, stock, images, ratings)
│   │   └── User.js             # User account model with role (isAdmin) flag
│   ├── routes/                 # API Endpoint Routes
│   │   ├── admin.js            # Admin protected routes
│   │   ├── auth.js             # Authentication routes
│   │   ├── cart.js             # Shopping cart routes
│   │   ├── orders.js           # Order management routes
│   │   └── products.js         # Product catalog routes
│   ├── index.js                # Express app entry, DB connect & server bootstrap
│   ├── package.json             # Backend dependencies
│   ├── clearCarts.js           # Helper script to clear cart data
│   └── seedProducts.js         # Database seeding script for sample items
│
├── docs/                       # Project Documentation
│   ├── API.md                  # REST API endpoints documentation
│   ├── DEPLOYMENT.md           # Step-by-step production deployment guide
│   ├── INSTALLATION.md         # Local setup & quick start guide
│   └── STRUCTURE.md            # Directory structure documentation
│
├── .gitignore                  # Git untracked files configuration
├── LICENSE                     # MIT Open Source License
└── README.md                   # Project Overview & documentation index
```

---

## ⚙️ Key Architectural Concepts

1. **Client-Side Rendering (Vite + React)**
   - Router managed via `react-router-dom`.
   - Global auth state handled by `AuthContext.jsx` using LocalStorage and JWT headers.
   - Global shopping cart synced with backend API via `CartContext.jsx`.

2. **Server Architecture (Node + Express + Mongoose)**
   - Layered architecture: `Routes` ➔ `Middleware` ➔ `Controllers` ➔ `Mongoose Models`.
   - Security enforced via custom JWT middleware (`auth.js`) supporting `protect` and `adminOnly` roles.

3. **Data Flow**
   - Client sends HTTP requests to Express endpoints.
   - Protected endpoints require `Authorization: Bearer <JWT_TOKEN>`.
   - Data stored in MongoDB Atlas document database.
