# 🚀 Neon PostgreSQL Setup Guide for Vercel Deployment

## 📋 Overview

This guide will help you set up **Neon PostgreSQL** (serverless PostgreSQL) for your Student Task Tracker app to deploy on Vercel.

**Current Setup:**

- ✅ MongoDB Atlas (for tasks)
- ✅ PostgreSQL (for users) - Need to migrate to Neon
- ✅ Code already supports Neon via `DATABASE_URL`

---

## 🎯 Step 1: Create Neon Account & Database

### 1.1 Sign Up for Neon

1. Go to **<https://neon.tech>**
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with GitHub (recommended) or email
4. Free tier includes:
   - ✅ 3 projects
   - ✅ 10 branches per project
   - ✅ 3 GB storage
   - ✅ Perfect for development & production

### 1.2 Create a New Project

1. Click **"Create a project"**
2. Configure:
   - **Project name:** `task-tracker` (or your choice)
   - **Database name:** `tasktracker_users`
   - **Region:** Choose closest to your users (e.g., US East for USA)
   - **PostgreSQL version:** 16 (latest)
3. Click **"Create Project"**

### 1.3 Get Your Connection String

After project creation, you'll see:

```
postgres://[username]:[password]@[host]/[database]?sslmode=require
```

**Example:**

```
postgres://myuser:abc123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/tasktracker_users?sslmode=require
```

**📋 COPY THIS - You'll need it!**

---

## 🔧 Step 2: Update Your Project Configuration

### 2.1 Create/Update .env File

Create a `.env` file in `c:\Users\Akshith\task-tracker\` with:

```env
# MongoDB (Tasks)
MONGODB_URI=your-mongodb-atlas-connection-string

# Neon PostgreSQL (Users)
DATABASE_URL=postgres://username:password@host/database?sslmode=require

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server
PORT=5000
NODE_ENV=development
```

### 2.2 Replace the VALUES

Replace these placeholders:

1. **DATABASE_URL**: Paste your Neon connection string
2. **MONGODB_URI**: Your existing MongoDB Atlas connection
3. **JWT_SECRET**: Generate a random secret (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
4. **EMAIL_USER**: Your Gmail address
5. **EMAIL_PASS**: Your Gmail app password

---

## 🧪 Step 3: Test Locally with Neon

### 3.1 Install Dependencies (if needed)

```bash
cd c:\Users\Akshith\task-tracker
npm install dotenv sequelize pg pg-hstore
```

### 3.2 Start the Backend

```bash
npm start
```

**Expected Output:**

```
✅ Connected to MongoDB Atlas
✅ PostgreSQL connection established successfully.
✅ PostgreSQL database synced
Server running on port 5000
```

### 3.3 Test User Registration

1. Start frontend: `cd client && npm run dev`
2. Go to <http://localhost:5173>
3. Try to sign up with a new account
4. ✅ Should work with Neon database!

---

## 🌐 Step 4: Deploy to Vercel

### 4.1 Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### 4.2 Create vercel.json

Create `vercel.json` in the root of your project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4.3 Update package.json (Root)

Make sure your root `package.json` has:

```json
{
  "name": "task-tracker",
  "version": "1.0.0",
  "scripts": {
    "start": "node api/index.js",
    "dev": "nodemon api/index.js",
    "vercel-build": "cd client && npm install && npm run build"
  }
}
```

### 4.4 Update client/package.json

Add this build script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4.5 Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? **task-tracker**
- Directory? **./** (hit enter)

### 4.6 Set Environment Variables in Vercel

1. Go to <https://vercel.com>
2. Click your project
3. Go to **Settings → Environment Variables**
4. Add these variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
| `MONGODB_URI` | Your MongoDB Atlas string | Production, Preview, Development |
| `JWT_SECRET` | Your JWT secret | Production, Preview, Development |
| `EMAIL_USER` | Your Gmail | Production, Preview, Development |
| `EMAIL_PASS` | Your Gmail app password | Production, Preview, Development |
| `NODE_ENV` | `production` | Production only |

### 4.7 Redeploy

After adding environment variables:

```bash
vercel --prod
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Can access the app at your Vercel URL
- [ ] Can sign up with email verification
- [ ] OTP emails are received
- [ ] Can log in with created account
- [ ] Can create tasks
- [ ] Can use forgot password flow
- [ ] All features work as expected

---

## 🔍 Check Database in Neon

1. Go to <https://console.neon.tech>
2. Select your project
3. Click **"SQL Editor"**
4. Run query to see users:

```sql
SELECT * FROM users;
```

You should see your registered users!

---

## 🐛 Troubleshooting

### "Cannot connect to PostgreSQL"

**Solution:**

1. Verify `DATABASE_URL` is correct
2. Check Neon project is active
3. Ensure connection string has `?sslmode=require`

### "CORS errors on Vercel"

**Solution:** Update `api/index.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app'
    : '*',
  credentials: true
}));
```

### "Environment variables not working"

**Solution:**

1. Check spelling in Vercel dashboard
2. Redeploy after adding variables
3. Check they're set for all environments

### "Database connection timeout"

**Solution:** Neon databases auto-pause. First request may be slow. This is normal.

---

## 💡 Neon Features to Explore

1. **Branching** - Create database branches for testing
2. **Time Travel** - Restore to any point in time
3. **Autoscaling** - Automatic scaling with traffic
4. **Pooling** - Built-in connection pooling
5. **Monitoring** - View database metrics

---

## 📊 Database Schema

Your Users table structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Next Steps After Migration

1. **Test thoroughly** on Vercel
2. **Set up monitoring** in Neon dashboard
3. **Configure backups** (automatic in Neon)
4. **Add custom domain** in Vercel
5. **Enable analytics** for your app

---

## 📝 Important Notes

✅ **Your code is already configured for Neon!**

- The `database.js` file automatically detects `DATABASE_URL`
- SSL is properly configured
- Connection pooling is optimized for serverless

✅ **Free Tier Limits:**

- 3 GB storage
- 100 hours of compute per month
- More than enough for development & small production apps

✅ **Upgrade Path:**

- When you need more, Neon scales easily
- Pay-as-you-go pricing
- No downtime during upgrades

---

**🚀 You're ready to deploy with Neon PostgreSQL!**

Need help? Check:

- Neon Docs: <https://neon.tech/docs>
- Vercel Docs: <https://vercel.com/docs>
- This project's README

---

**Created:** February 1, 2026
**Status:** ✅ Ready to Deploy
