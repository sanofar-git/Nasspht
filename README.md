# 🛒 Vizhop (Nasspht) - Full-Stack E-Commerce Platform

A modern, full-stack E-Commerce web application featuring a high-performance React + Vite frontend and a scalable Express + MongoDB backend. Includes full customer checkout flows, JWT authentication, and an Admin control panel.

---

## 🔗 Live Application & Assets

- 🚀 **Live Frontend (Vercel)**: [https://nasspht.vercel.app](https://nasspht.vercel.app)
- 🟢 **Live Backend API (Render)**: [https://nasspht.onrender.com](https://nasspht.onrender.com)
- 🎬 **Live Demo Video**: [Watch Demo Video](https://drive.google.com/file/d/1i7fG-vnVZI0kGNR0loXIqXaw_L0z660N/view?usp=sharing)
- 📁 **Google Drive Project Folder**: [Open Google Drive (Nasspjt)](https://drive.google.com/drive/folders/10L_osSYpoI0SQZRBM9s-B77__VXmtleF)

---

## 📚 Documentation Directory

Detailed project documentation is available in the [`docs/`](./docs) folder:

| Document | Description |
|---|---|
| 📖 [**`docs/INSTALLATION.md`**](./docs/INSTALLATION.md) | Local installation, environment variables setup, and quick start guide |
| 🏗️ [**`docs/STRUCTURE.md`**](./docs/STRUCTURE.md) | Full project architecture and detailed folder structure tree |
| 📡 [**`docs/API.md`**](./docs/API.md) | REST API endpoints specification, payload examples, and authentication |
| 🚀 [**`docs/DEPLOYMENT.md`**](./docs/DEPLOYMENT.md) | Step-by-step guide for hosting on Render, Vercel, and MongoDB Atlas |

---

## ✨ E-Commerce Features

### 👤 Customer Features
- **User Authentication**: Secure user registration, login, profile management, and JWT-based session persistence.
- **Product Catalog**: Explore products with real-time search, category filtering, price sorting, and pagination.
- **Product Details**: Product gallery, stock availability, ratings, and customer reviews.
- **Shopping Cart**: Dynamic persistent shopping cart with quantity adjustment, item removal, and live price calculation.
- **Checkout & Order System**: Complete checkout flow with shipping address, payment method selection, order summaries, and invoice confirmation.
- **Order History**: Personal user dashboard for tracking order statuses.

### 🛡️ Admin Management Panel
- **Analytics Dashboard**: Overview of total revenue, order count, registered users, and inventory stats.
- **Inventory Management**: Create, edit, update stock/pricing, and delete products.
- **Order Processing**: View customer orders and update status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **User Administration**: View and manage customer account permissions.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with global baseURL & interceptors
- **Styling**: Vanilla CSS (CSS3 variables, responsive grid & flexbox layouts)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Security & Middleware**: CORS, Dotenv

---

## 🔐 Roles & Permissions

| Feature / Endpoint | Guest | Registered User | Admin |
|---|:---:|:---:|:---:|
| Browse Products & Categories | ✅ | ✅ | ✅ |
| View Product Details | ✅ | ✅ | ✅ |
| User Register & Login | ✅ | ✅ | ✅ |
| Manage Personal Cart & Profile | ❌ | ✅ | ✅ |
| Place Orders & View History | ❌ | ✅ | ✅ |
| Manage Inventory (Create/Edit/Delete Products) | ❌ | ❌ | ✅ |
| Manage Customer Orders & Statuses | ❌ | ❌ | ✅ |
| View Analytics & Manage Users | ❌ | ❌ | ✅ |

---

## 📁 Repository Structure Overview

```
Nasspht/
├── client/          # Frontend source code (Vite + React)
├── server/          # Backend REST API source code (Express + MongoDB)
├── docs/            # Project documentation (API, Installation, Structure, Deployment)
├── LICENSE          # MIT License file
└── README.md        # Main repository overview
```

---

## 🚀 Quick Start Setup

### 1. Backend (`/server`)
```bash
cd server
npm install
# Configure server/.env (MONGO_URI, JWT_SECRET, PORT=8000)
npm run dev
```

### 2. Frontend (`/client`)
```bash
cd client
npm install
# Configure client/.env.production (VITE_API_URL)
npm run dev
```

Default Admin Credentials (Seeded):
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
