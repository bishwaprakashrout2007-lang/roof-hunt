# 🚀 Complete Vercel Deployment Guide - Roof Hunt

## ✅ GitHub Repository
**Your code is now at:** https://github.com/bishwaprakashrout2007-lang/roof-hunt

---

## 📋 Pre-Deployment Checklist

### CRITICAL: Update MongoDB Credentials
⚠️ **Your credentials were exposed earlier. You MUST:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Delete** the old user: `bishwaprakashrout2007_db_user`
3. **Create a NEW user** with a NEW password
4. Update your local `.env` file with NEW credentials

---

## 🔧 Step 1: Prepare Your Local Environment

### Verify Backend Credentials
Update `backend/.env` with **NEW MongoDB credentials only**:

```env
MONGODB_URI=mongodb+srv://YOUR_NEW_USERNAME:YOUR_NEW_PASSWORD@cluster0.l7hb4gt.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
```

### Test Locally (Before Deploying)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run seed      # Populate MongoDB
npm run dev       # Should run on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev       # Should run on http://localhost:5173
```

Verify both services work together before proceeding.

---

## 🌐 Step 2: Deploy Backend to Vercel

### 2.1 Sign In to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Sign in with GitHub account (if not already)

### 2.2 Import Backend Project
1. Click **"Add New"** → **"Project"**
2. Select **"Import Git Repository"**
3. Paste: `https://github.com/bishwaprakashrout2007-lang/roof-hunt`
4. Click **"Import"**

### 2.3 Configure Backend Settings
When the import dialog appears:

**Project Settings:**
- **Project Name:** `roof-hunt-backend` (or any name you prefer)
- **Framework:** `Other` (select from dropdown)
- **Root Directory:** `backend` ✅ (VERY IMPORTANT!)
- **Build Command:** `npm install` (or leave blank)
- **Output Directory:** (leave blank)
- **Install Command:** `npm install`

**Environment Variables** (Add these):
```
MONGODB_URI = mongodb+srv://YOUR_NEW_USERNAME:YOUR_NEW_PASSWORD@cluster0.l7hb4gt.mongodb.net/?appName=Cluster0
NODE_ENV = production
```

### 2.4 Deploy Backend
1. Click **"Deploy"** button
2. Wait for deployment to complete (2-5 minutes)
3. ✅ Copy your **Backend URL** when deployment succeeds
   - Example: `https://roof-hunt-backend.vercel.app`

### 2.5 Verify Backend Deployment
Test your backend by visiting:
```
https://roof-hunt-backend.vercel.app/properties
```
You should see JSON data with all properties.

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create New Frontend Project
1. In Vercel Dashboard, click **"Add New"** → **"Project"**
2. Select **"Import Git Repository"** again
3. Paste: `https://github.com/bishwaprakashrout2007-lang/roof-hunt`
4. Click **"Import"**

### 3.2 Configure Frontend Settings
When the import dialog appears:

**Project Settings:**
- **Project Name:** `roof-hunt-frontend` (or any name)
- **Framework:** `Vite` (or select from dropdown)
- **Root Directory:** `frontend` ✅ (VERY IMPORTANT!)
- **Build Command:** `npm run build`
- **Output Directory:** `dist` ✅
- **Install Command:** `npm install`

**Environment Variables:**
```
VITE_API_URL = https://roof-hunt-backend.vercel.app
```
(Replace with YOUR actual backend URL from Step 2.4)

### 3.3 Deploy Frontend
1. Click **"Deploy"** button
2. Wait for build and deployment (3-5 minutes)
3. ✅ Copy your **Frontend URL** when deployment succeeds
   - Example: `https://roof-hunt-frontend.vercel.app`

### 3.4 Verify Frontend Deployment
Visit your frontend URL:
```
https://roof-hunt-frontend.vercel.app
```
You should see the Roof Hunt website with properties displayed!

---

## 🔗 Step 4: Connect Backend & Frontend

### 4.1 Update Frontend to Use Backend URL
Since you've deployed the backend, update the frontend's API URL:

**In `frontend/src/App.jsx`, change:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://roof-hunt-backend.vercel.app';

// Then use:
const response = await fetch(`${API_URL}/properties${queryString}`);
```

Or if using environment variable:
```javascript
const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000' 
  : 'https://roof-hunt-backend.vercel.app';
```

### 4.2 Re-deploy Frontend
After updating the API URL:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

Vercel will **automatically re-deploy** when you push to `main` branch.

---

## 🌍 Final URLs

After successful deployment:

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | https://roof-hunt-frontend.vercel.app | Live ✅ |
| **Backend API** | https://roof-hunt-backend.vercel.app | Live ✅ |
| **API Endpoint** | https://roof-hunt-backend.vercel.app/properties | Live ✅ |
| **GitHub Repo** | https://github.com/bishwaprakashrout2007-lang/roof-hunt | Live ✅ |

---

## 🧪 Test Production Deployment

### 4.1 Test Backend API
Visit in browser:
```
https://roof-hunt-backend.vercel.app/properties
https://roof-hunt-backend.vercel.app/health
```
Should return JSON data.

### 4.2 Test Frontend
Visit: `https://roof-hunt-frontend.vercel.app`
- Should load properties
- Should be able to search/filter
- Should display images and details

### 4.3 Test API Communication
Use Search functionality in the frontend:
- Select a city → Click Search
- Should filter properties from backend
- No console errors in browser dev tools

---

## 🐛 Troubleshooting

### Backend Not Connecting to MongoDB
**Error:** "Failed to connect to MongoDB"
- ✅ Check MONGODB_URI is correct in Vercel Environment Variables
- ✅ Verify IP whitelist in MongoDB Atlas (Allow 0.0.0.0/0 for development)
- ✅ Verify username/password are correct
- ✅ Check database name is `roof_hunt_db`

**Solution:**
1. Go to Vercel Project Settings → Environment Variables
2. Verify MONGODB_URI is correct
3. Click "Deploy" button to restart with new variables

### Frontend Can't Fetch from Backend
**Error:** CORS error or connection timeout
- ✅ Check VITE_API_URL is correct in frontend Environment Variables
- ✅ Ensure backend is deployed and running
- ✅ Check CORS is enabled in backend (`cors()` middleware in server.js)

**Solution:**
1. Update `frontend/src/App.jsx` with correct backend URL
2. Commit and push to GitHub
3. Vercel will auto-deploy

### EADDRINUSE Error (Port Already in Use)
This only happens locally. On Vercel, ports are managed automatically.

---

## 📝 MongoDB Seed Data on Vercel

The database was seeded locally. To reseed on production:

**Option 1: Manual Reseed (Recommended)**
```bash
cd backend
node seed.js
```

**Option 2: Auto-reseed on Deploy**
Edit `backend/server.js` to auto-seed if collection is empty:
```javascript
async function startServer() {
  try {
    await connectDB();
    const db = getDB();
    const count = await db.collection('properties').countDocuments({});
    
    if (count === 0) {
      console.log("Database empty, seeding...");
      // Run seed logic here
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
```

---

## 🚀 Continuous Deployment

After initial setup, whenever you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Vercel automatically:**
1. ✅ Detects the push
2. ✅ Runs build command
3. ✅ Deploys to production
4. ✅ Updates live URL

No manual deployment needed!

---

## 📊 Project Structure for Vercel

```
roof-hunt/
├── backend/                  # Vercel Project 1
│   ├── server.js            # Express app
│   ├── database.js          # MongoDB connection
│   ├── seed.js              # Database seeding
│   ├── package.json
│   └── .env                 # (NOT COMMITTED)
├── frontend/                # Vercel Project 2
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── DEPLOYMENT_GUIDE.md
└── README.md
```

---

## 🔐 Security Checklist

- ✅ `.env` files are in `.gitignore` (NOT committed to GitHub)
- ✅ Environment variables set in Vercel dashboard
- ✅ MongoDB credentials are NEW (old ones deleted)
- ✅ CORS is enabled only for your frontend domain
- ✅ API key/secrets never hardcoded in code

---

## ✅ Final Verification Checklist

- [ ] GitHub repository updated: https://github.com/bishwaprakashrout2007-lang/roof-hunt
- [ ] MongoDB credentials changed (old user deleted, new user created)
- [ ] Backend deployed to Vercel (API endpoint working)
- [ ] Frontend deployed to Vercel (Website loading)
- [ ] Frontend connected to Backend (Search functionality working)
- [ ] Environment variables set in both Vercel projects
- [ ] API returning properties JSON
- [ ] Website displaying 50+ properties with images
- [ ] Filters (city, price, type) working correctly

---

## 💡 Quick Reference

**Backend Vercel URL:** `https://roof-hunt-backend.vercel.app`
**Frontend Vercel URL:** `https://roof-hunt-frontend.vercel.app`
**GitHub Repo:** `https://github.com/bishwaprakashrout2007-lang/roof-hunt`
**MongoDB Database:** `roof_hunt_db` (Cloud - MongoDB Atlas)

---

## 📞 Support

If something doesn't work:
1. Check Vercel deployment logs (Project Settings → Deployments)
2. Check browser console for errors (F12)
3. Verify environment variables are set correctly
4. Verify backend and frontend URLs are correct
5. Test API directly: `https://your-backend.vercel.app/properties`

---

**Deployment Date:** May 15, 2026
**Status:** Ready for Production ✅
