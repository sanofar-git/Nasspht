# 🚀 Production Deployment Guide

This document details step-by-step deployment instructions for hosting **Vizhop (Nasspht)**:
- **Backend API**: [Render](https://render.com)
- **Frontend App**: [Vercel](https://vercel.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a new Cluster (Shared Free Tier M0 is sufficient).
3. Under **Database Access**, create a Database User with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so Render backend can connect.
5. Get your connection string under **Database ➔ Connect ➔ Drivers**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vizhop?retryWrites=true&w=majority
   ```

---

## 🖥️ Step 2: Backend Deployment (Render)

1. Sign in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub Repository (`sanofar-git/Nasspht`).
4. Configure the Web Service settings:
   - **Name**: `nasspht`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Scroll to **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Your strong random secret key |
   | `CLIENT_URL` | `https://nasspht.vercel.app` |
6. Click **Create Web Service**.
7. Once deployed, note down your live API URL:
   `https://nasspht.onrender.com`

---

## 🌐 Step 3: Frontend Deployment (Vercel)

1. Sign in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import the GitHub Repository (`sanofar-git/Nasspht`).
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` (Click Edit ➔ select `client`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://nasspht.onrender.com` |
6. Click **Deploy**.
7. Vercel will generate your live site URL:
   `https://nasspht.vercel.app`

---

## 🔒 Step 4: Verify CORS Configuration

Ensure `server/index.js` allows your Vercel URL in CORS middleware:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nasspht.vercel.app',
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
```

---

## 🌐 Live Production Links

- 🟢 **Live Backend**: [https://nasspht.onrender.com](https://nasspht.onrender.com)
- 🚀 **Live Frontend**: [https://nasspht.vercel.app](https://nasspht.vercel.app)
