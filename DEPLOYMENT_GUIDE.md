# Roof Hunt - Setup & Deployment Guide

## 🔐 SECURITY ALERT - Action Required IMMEDIATELY

You exposed your MongoDB credentials. **You MUST:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Delete the user `bishwaprakashrout2007_db_user`
3. Create a NEW user with a NEW password
4. Update `.env` with the new credentials

---

## ⚙️ Local Development Setup

### Backend Setup (Node.js)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update MongoDB credentials in `.env`:**
   ```
   MONGODB_URI=mongodb+srv://NEW_USERNAME:NEW_PASSWORD@cluster0.l7hb4gt.mongodb.net/?appName=Cluster0
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed the database with sample properties:**
   ```bash
   npm run seed
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup (React + Vite)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

---

## 📦 Backend API Endpoints

### Properties Endpoints

#### GET `/properties` - Get all properties with filters
**Query Parameters:**
- `city` (optional) - Filter by city name
- `type` (optional) - Filter by "Rent" or "Buy"
- `property_type` (optional) - Filter by "flat" or "house"
- `min_price` (optional) - Minimum price
- `max_price` (optional) - Maximum price

**Example:**
```bash
GET http://localhost:5000/properties?city=Bangalore&type=Rent&min_price=10000&max_price=50000
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": "507f1f77bcf86cd799439011",
    "title": "Luxurious 2 BHK Flat in Bangalore",
    "description": "A wonderful 2 bedroom flat...",
    "city": "Bangalore",
    "price": 25000,
    "type": "Rent",
    "property_type": "flat",
    "bedrooms": 2,
    "bathrooms": 1,
    "area_sqft": 850,
    "image_url": "https://..."
  }
]
```

#### GET `/properties/:property_id` - Get single property
```bash
GET http://localhost:5000/properties/507f1f77bcf86cd799439011
```

#### POST `/properties` - Create new property
**Body:**
```json
{
  "title": "Modern 3 BHK House",
  "description": "Beautiful house in Mumbai",
  "city": "Mumbai",
  "price": 45000,
  "type": "Rent",
  "property_type": "house",
  "bedrooms": 3,
  "bathrooms": 2,
  "area_sqft": 1200,
  "image_url": "https://..."
}
```

#### PUT `/properties/:property_id` - Update property
Same body structure as POST

#### DELETE `/properties/:property_id` - Delete property

---

## 🚀 Vercel Deployment Guide

### Prerequisites
- GitHub account with your code repository
- Vercel account (free at [vercel.com](https://vercel.com))
- MongoDB Atlas account with new credentials

### Step 1: Prepare Repository

Create a GitHub repository with this structure:
```
roof-hunt/
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── seed.js
│   ├── package.json
│   ├── .env (NOT COMMITTED)
│   └── .gitignore
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

**Make sure `.env` is in `.gitignore` - NEVER commit credentials!**

### Step 2: Deploy Backend to Vercel

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Go to [Vercel](https://vercel.com/dashboard)**

3. **Click "Add New..." → "Project"**

4. **Import your GitHub repository**

5. **Configure Backend:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`
   - **Start Command:** `node server.js`

6. **Set Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     MONGODB_URI = mongodb+srv://YOUR_NEW_USERNAME:YOUR_NEW_PASSWORD@cluster0.l7hb4gt.mongodb.net/?appName=Cluster0
     NODE_ENV = production
     ```

7. **Deploy Backend**

8. **Get your Vercel backend URL** (e.g., `https://roof-hunt-backend.vercel.app`)

### Step 3: Update Frontend for Vercel

Update `frontend/src/App.jsx` to use the Vercel backend URL:

```javascript
// Replace localhost URLs with Vercel URL
const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000' 
  : 'https://your-backend.vercel.app';

const response = await fetch(`${API_URL}/properties${queryString}`);
```

### Step 4: Deploy Frontend to Vercel

1. **In Vercel Dashboard, click "Add New..." → "Project" again**

2. **Import the same repository**

3. **Configure Frontend:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **No environment variables needed** (unless using custom API URL)

5. **Deploy Frontend**

6. **Your frontend will be live** (e.g., `https://roof-hunt-frontend.vercel.app`)

---

## ✅ MongoDB Seed on Vercel

Option 1: **Manual Seed (Recommended for first time)**
```bash
npm run seed
```

Option 2: **Automatic Seed on Deploy**
Edit `backend/server.js`:
```javascript
async function startServer() {
  try {
    await connectDB();
    
    // Auto-seed if empty
    if (process.env.NODE_ENV === 'production') {
      const db = getDB();
      const count = await db.collection('properties').countDocuments({});
      if (count === 0) {
        console.log("Seeding production database...");
        // Run seed logic here
      }
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

## 🔗 Environment Variables for Vercel

### Backend (.env or Vercel Settings)
```
MONGODB_URI=mongodb+srv://NEW_USERNAME:NEW_PASSWORD@cluster0.l7hb4gt.mongodb.net/?appName=Cluster0
NODE_ENV=production
PORT=5000
```

### Frontend (Optional - if using environment-specific URLs)
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB
- ✓ Check MongoDB URI is correct in `.env`
- ✓ Verify IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)
- ✓ Verify new username/password are correct

### Frontend can't fetch properties
- ✓ Check backend URL in `App.jsx`
- ✓ Verify CORS is enabled in `server.js`
- ✓ Check browser console for errors

### Vercel deployment fails
- ✓ Check build logs in Vercel dashboard
- ✓ Verify environment variables are set
- ✓ Ensure `.env` is in `.gitignore`
- ✓ Verify `package.json` has all dependencies

---

## 📝 Summary

| Component | Local | Vercel |
|-----------|-------|--------|
| **Backend** | http://localhost:5000 | https://your-backend.vercel.app |
| **Frontend** | http://localhost:5173 | https://your-frontend.vercel.app |
| **Database** | MongoDB Atlas (cloud) | MongoDB Atlas (cloud) |
| **Database Name** | roof_hunt_db | roof_hunt_db |

---

## 🎯 Quick Start Commands

### Local Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Seed Database (run once)
cd backend
npm run seed
```

### Vercel Deployment
```bash
# Push to GitHub (automatic deployment)
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

---

**Last Updated:** May 15, 2026
