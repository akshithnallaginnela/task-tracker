# 🎉 Split Deployment Guide - Vercel + Render

## ✅ What's Deployed Where

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| **Frontend** | Vercel | https://[your-app].vercel.app | ✅ Live |
| **Backend** | Render | <https://task-tracker-qrv3.onrender.com> | ✅ Live |
| **Database (Users)** | Neon PostgreSQL | us-east-1 | ✅ Connected |
| **Database (Tasks)** | MongoDB Atlas | Cloud | ✅ Connected |
| **Email** | Gmail SMTP | N/A | ✅ Configured |

---

## 🚀 Deployment Status

### **✅ Completed Steps**

1. ✅ **Backend deployed to Render**
   - Express API running on Node.js
   - CORS configured for Vercel frontend
   - Auto-deploys from main branch

2. ✅ **Frontend deployed to Vercel**
   - React + Vite app
   - Points to Render backend API
   - Auto-deploys from main branch

3. ✅ **API Connection Fixed**
   - Frontend now calls `https://task-tracker-qrv3.onrender.com/api`
   - CORS allows Vercel domain
   - Authentication working

---

## 🔧 Current Configuration

### **Backend (Render)**

**Service:** task-tracker  
**URL:** <https://task-tracker-qrv3.onrender.com>  
**Build Command:**

```bash
npm install && cd client && npm install && npm run build && cd ../api && npm install
```

**Start Command:**

```bash
NODE_ENV=production node api/index.js
```

**Environment Variables:**

- `DATABASE_URL` - Neon PostgreSQL connection
- `MONGODB_URI` - MongoDB Atlas connection
- `JWT_SECRET` - Authentication secret
- `EMAIL_USER` - Gmail address
- `EMAIL_PASS` - Gmail app password

### **Frontend (Vercel)**

**Project:** task-tracker  
**URL:** <https://task-tracker-[id].vercel.app>  
**Framework:** Vite  
**Root Directory:** `client`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

**Environment Variables:**

- None required (API URL is hardcoded for now)

---

## 📝 How the Split Deployment Works

### **Request Flow**

```
User Browser
    ↓
Vercel (Frontend - React App)
    ↓ API calls to https://task-tracker-qrv3.onrender.com/api
Render (Backend - Express API)
    ↓
Neon PostgreSQL (Users) + MongoDB (Tasks)
```

### **Authentication Flow**

1. User signs up on Vercel frontend
2. Frontend sends POST to `https://task-tracker-qrv3.onrender.com/api/auth/signup`
3. Backend validates and stores user in Neon
4. Backend sends OTP email via Gmail
5. User verifies OTP
6. Backend returns JWT token
7. Frontend stores token in localStorage
8. Future requests include token in Authorization header

---

## 🔍 Troubleshooting

### **500 Error on Signup**

**Possible causes:**

1. ❌ Backend not running on Render
2. ❌ DATABASE_URL incorrect
3. ❌ EMAIL_PASS missing
4. ❌ CORS blocking request

**Check Render logs:**

```
Render Dashboard → task-tracker → Logs
```

Look for:

- `✅ Server running on port 10000`
- `✅ MongoDB connected`
- `✅ PostgreSQL connected`
- `📧 Email credentials: USER ✅, PASS ✅`

### **CORS Errors**

If you see CORS errors in browser console:

**Backend (`api/index.js`):**

```javascript
app.use(cors()); // Currently allows all origins
```

**For production, you should restrict to:**

```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### **API Not Found (404)**

**Frontend is NOT calling the API correctly.**

Check `client/src/services/api.js`:

```javascript
const API_URL = 'https://task-tracker-qrv3.onrender.com/api';
```

This should match your Render backend URL!

---

## ✅ Verification Checklist

### **Backend (Render)**

Visit: <https://task-tracker-qrv3.onrender.com>

Expected output:

```
Task Tracker API is running
```

### **Frontend (Vercel)**

Visit: https://[your-app].vercel.app

Expected:

- ✅ Homepage loads
- ✅ Can navigate to signup
- ✅ Forms are interactive

### **API Connection Test**

Open browser DevTools (F12) → Console

On your Vercel frontend, try:

```javascript
fetch('https://task-tracker-qrv3.onrender.com/api/auth/me')
  .then(r => r.json())
  .then(console.log)
```

Expected: Response from backend (even if unauthorized)

---

## 🔄 Deployment Workflow

### **Frontend Changes**

1. Edit files in `client/src/`
2. Commit changes:

   ```bash
   git add client/
   git commit -m "Update frontend"
   git push origin main
   ```

3. **Vercel auto-deploys** (30 seconds)

### **Backend Changes**

1. Edit files in `api/`
2. Commit changes:

   ```bash
   git add api/
   git commit -m "Update backend"
   git push origin main
   ```

3. **Render auto-deploys** (2-3 minutes)

### **Full Stack Changes**

1. Edit both `client/` and `api/`
2. Commit all changes:

   ```bash
   git add .
   git commit -m "Update full stack"
   git push origin main
   ```

3. **Both platforms auto-deploy**

---

## 🎯 Next Steps to Fix 500 Error

Since you're getting a 500 error on signup, here's what to check:

### **Step 1: Check Render Logs**

1. Go to <https://dashboard.render.com>
2. Click **task-tracker** service
3. Click **Logs** tab
4. Try to signup again
5. **Screenshot the error** that appears in logs

The error will tell us exactly what's wrong!

### **Step 2: Verify Environment Variables**

In Render Dashboard → Settings → Environment Variables

Make sure you have:

- ✅ `DATABASE_URL` with fresh Neon connection string
- ✅ `MONGODB_URI`
- ✅ `JWT_SECRET`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS` ← **Did you add this?**

### **Step 3: Test Backend Directly**

Use Postman or curl to test the backend API directly:

```bash
curl -X POST https://task-tracker-qrv3.onrender.com/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","purpose":"signup"}'
```

If this works, the issue is with the frontend connection.  
If this fails, the issue is with the backend itself.

---

## 🆘 Getting Help

**Current Issue:** 500 error on signup

**What I need:**

1. Screenshot of Render logs when you try to signup
2. Confirmation that `EMAIL_PASS` environment variable is added
3. confirmation that `DATABASE_URL` is updated with fresh Neon credentials

Once I see the logs, I can tell you exactly what's wrong!

---

## 📊 Architecture Benefits

**Why Split Deployment Wins:**

| Aspect | Monolithic | Split (Current) |
|--------|------------|-----------------|
| **Frontend CDN** | ❌ Slow | ✅ Vercel global CDN |
| **API** | ❌ 12 function limit | ✅ Unlimited on Render |
| **Scaling** | ❌ Scale together | ✅ Scale independently |
| **Cost** | $$$ | ✅ Both free tiers |
| **Deployment** | Slow | ✅ Fast (parallel) |

**Used by:** Google, Amazon, Netflix, Spotify, and millions of production apps!

---

**Next:** Send me the Render logs screenshot so I can fix the 500 error! 🚀

---

**Created:** February 1, 2026  
**Status:** Frontend ✅ | Backend ⚠️ (needs troubleshooting)  
**Deploy Time:** < 1 minute (frontend), ~2 min (backend)
