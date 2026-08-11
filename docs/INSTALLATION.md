# 🛠️ Installation & Local Setup Guide

This guide provides step-by-step instructions for installing, configuring, and running the **Vizhop (Nasspht)** E-Commerce Application locally on your machine.

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: ([Download Git](https://git-scm.com/))
- **MongoDB Atlas Account** (or local MongoDB server running on `mongodb://localhost:27017`)

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/sanofar-git/Nasspht.git
cd Nasspht
```

---

### 2. Backend Setup (`/server`)

Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

#### Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```dotenv
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vizhop?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

> 💡 **Note**: Replace `<username>` and `<password>` with your actual MongoDB Atlas database credentials.

#### Start Backend Server
- **Development Mode** (with Nodemon hot reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

The server will connect to MongoDB, seed default admin user (`admin@gmail.com` / `admin123`) & sample products if the DB is empty, and listen at:
`http://localhost:8000`

---

### 3. Frontend Setup (`/client`)

Open a new terminal window, navigate to the `client` directory, and install dependencies:
```bash
cd client
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `client/` directory (optional for local dev as Vite proxy is pre-configured):
```dotenv
VITE_API_URL=http://localhost:8000
```

#### Start Frontend Dev Server
```bash
npm run dev
```

The Vite dev server will start at:
`http://localhost:5173`

---

## 🧪 Verification & Default Credentials

Open your browser and navigate to `http://localhost:5173`.

### Default Admin Account (Seeded Automatically):
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

### Health Check Endpoint:
- GET `http://localhost:8000/api/health` → Should return `{"status":"OK","message":"Vizhop API is running 🚀"}`
