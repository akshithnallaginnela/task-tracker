# Vercel Deployment Guide - Task Tracker

## 🎯 Overview
This guide will help you deploy your Task Tracker app to Vercel with:
- **Neon PostgreSQL** (Free tier, serverless-ready)
- **MongoDB Atlas** (Free tier, cloud database)
- **Vercel** (Free tier, hosting)

Total cost: **$0/month** ✨

---

## 📋 Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Email for database services

---

## Step 1: Set Up Neon PostgreSQL (5 minutes)

### 1.1 Create Neon Account
1. Go to https://neon.tech
2. Click "Sign Up" (use GitHub for easy login)
3. No credit card required! ✅

### 1.2 Create Database
1. Click "Create Project"
2. Enter project name: `tasktracker`
3. Select region closest to you
4. Click "Create Project"

### 1.3 Get Connection String
1. After creation, you'll see a connection string
2. **IMPORTANT**: Copy the entire connection string that looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **Save this** - you'll need it for Vercel!

### 1.4 Initialize Database (Optional - Vercel will do this automatically)
The app will automatically create the `users` table on first run.

---

## Step 2: Set Up MongoDB Atlas (5 minutes)

### 2.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google

### 2.2 Create Free Cluster
1. Click "Create" under free tier (M0)
2. Select cloud provider: **AWS**
3. Select region closest to you
4. Cluster name: `TaskTracker` (or leave default)
5. Click "Create Cluster" (takes 1-3 minutes)

### 2.3 Create Database User
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `tasktracker`
5. Click "Autogenerate Secure Password" - **SAVE THIS PASSWORD**
6. Database User Privileges: "Atlas admin" (or "Read and write to any database")
7. Click "Add User"

### 2.4 Configure Network Access
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (shows 0.0.0.0/0)
   - ⚠️ This is safe for our use case with password protection
4. Click "Confirm"

### 2.5 Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://tasktracker:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** with the password you saved earlier
7. Change the database name from `/?` to `/tasktracker?`:
   ```
   mongodb+srv://tasktracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tasktracker?retryWrites=true&w=majority
   ```
8. **Save this complete string** - you'll need it for Vercel!

---

## Step 3: Prepare GitHub Repository (2 minutes)

### 3.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `task-tracker`
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README (we already have code)
5. Click "Create repository"

### 3.2 Push Your Code
```bash
# In your task-tracker folder
git init
git add .
git commit -m "Initial commit - Task Tracker with user auth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git push -u origin main
```

---

## Step 4: Deploy to Vercel (5 minutes)

### 4.1 Import Project
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`task-tracker`)
4. Click "Import"

### 4.2 Configure Build Settings
Vercel will auto-detect settings, but verify:

**Framework Preset**: Vite
**Root Directory**: `./` (leave as is)
**Build Command**: `cd client && npm install && npm run build`
**Output Directory**: `client/dist`
**Install Command**: `npm install`

### 4.3 Add Environment Variables
Click "Environment Variables" and add these **one by one**:

| Name | Value | Where to get it |
|------|-------|-----------------|
| `DATABASE_URL` | Your Neon connection string | From Step 1.3 |
| `MONGODB_URI` | Your MongoDB Atlas connection string | From Step 2.5 |
| `JWT_SECRET` | Generate random string (see below) | Generate new |
| `JWT_EXPIRES_IN` | `7d` | Type manually |
| `NODE_ENV` | `production` | Type manually |

**Generate JWT_SECRET**: Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and paste as `JWT_SECRET`.

### 4.4 Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://task-tracker-xxx.vercel.app`

---

## Step 5: Test Your Deployment (2 minutes)

### 5.1 Open Your App
1. Click the generated URL
2. You should see the login page

### 5.2 Create Test Account
1. Click "Sign Up"
2. Enter name, email, password
3. If successful, you're redirected to dashboard!
4. ✅ PostgreSQL is working (user created)

### 5.3 Create Test Task
1. Click "Add Task"
2. Fill in task details
3. Click "Create Task"
4. ✅ MongoDB is working (task saved)

### 5.4 Test Theme Switching
1. Go to "Account Settings"
2. Change theme to Dark
3. ✅ Theme context is working

---

## 🎉 Success Checklist

- [ ] Neon PostgreSQL created and connected
- [ ] MongoDB Atlas created and connected
- [ ] GitHub repository created and pushed
- [ ] Vercel deployment successful
- [ ] Can sign up new users
- [ ] Can create tasks
- [ ] Can switch themes
- [ ] Each user sees only their tasks

---

## 🔧 Troubleshooting

### Build Failed on Vercel

**Error: "Cannot find module 'pg'"**
```bash
# Make sure api/package.json exists
cd api
npm install
git add package.json package-lock.json
git commit -m "Add API dependencies"
git push
```
Then redeploy on Vercel.

**Error: "MONGODB_URI is not defined"**
- Go to Vercel → Your Project → Settings → Environment Variables
- Verify `MONGODB_URI` is set correctly
- Redeploy

### Database Connection Failed

**PostgreSQL Error**
1. Check `DATABASE_URL` in Vercel environment variables
2. Make sure connection string includes `?sslmode=require`
3. Verify Neon project is active (not paused)

**MongoDB Error**
1. Check `MONGODB_URI` has correct password (no < >)
2. Verify "Allow Access from Anywhere" is enabled in Network Access
3. Check database user exists and has correct permissions

### Can't Login After Deployment

**Clear old data**:
- Open browser DevTools (F12)
- Go to Application → Local Storage
- Delete all items
- Refresh page and try signup again

### Tasks Not Loading

**Check Vercel Logs**:
1. Go to Vercel → Your Project → Deployments
2. Click latest deployment
3. Go to "Functions" tab
4. Check `/api/index` logs for errors

---

## 🚀 Post-Deployment Tips

### Custom Domain (Optional)
1. Vercel → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

### Environment Variables Updates
If you need to change env vars:
1. Vercel → Settings → Environment Variables
2. Edit the variable
3. **Important**: Redeploy for changes to take effect

### Monitoring
- **Neon Dashboard**: Monitor PostgreSQL usage
- **MongoDB Atlas**: Check cluster metrics
- **Vercel Analytics**: Track app usage

### Free Tier Limits
- **Neon**: 10 projects, 3GB storage
- **MongoDB Atlas**: 512MB storage, shared cluster
- **Vercel**: 100GB bandwidth/month, unlimited deployments

---

## 📊 Architecture Diagram

```
User Browser
    ↓
Vercel Frontend (React + Vite)
    ↓
Vercel Serverless API (Express)
    ↓
    ├── Neon PostgreSQL (User Auth)
    └── MongoDB Atlas (Tasks)
```

---

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens for authentication
- [x] Environment variables not in code
- [x] SSL/TLS for all database connections
- [x] CORS enabled for API
- [x] User data isolated by userId

---

## 📝 Quick Reference

### Important URLs
- **Your App**: Check Vercel dashboard
- **Neon Console**: https://console.neon.tech
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Vercel Dashboard**: https://vercel.com/dashboard

### Need Help?
1. Check Vercel function logs
2. Check Neon query logs
3. Check MongoDB Atlas metrics
4. Review this guide's troubleshooting section

---

## 🎯 Next Steps

After successful deployment:
1. Share your app URL with friends!
2. Set up a custom domain
3. Monitor usage in dashboards
4. Consider upgrading if you hit free tier limits

---

**Congratulations! Your Task Tracker is now live! 🎉**
