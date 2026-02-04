# 🚀 Neon PostgreSQL - Vercel Deployment Guide

## Quick Start: 3 Simple Steps

### Step 1️⃣: Set up Neon Database (5 minutes)

1. Go to **<https://neon.tech>** and sign up
2. Create new project: **"task-tracker"**
3. Create database: **"tasktracker_users"**
4. **Copy the connection string** - it looks like:

   ```
   postgres://user:password@host.neon.tech/tasktracker_users?sslmode=require
   ```

### Step 2️⃣: Test Locally (2 minutes)

1. Create `.env` file in project root:

   ```env
   DATABASE_URL=postgres://your-neon-connection-string
   MONGODB_URI=your-mongodb-atlas-string
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

2. Test backend:

   ```bash
   npm start
   ```

   Should see:

   ```
   ✅ PostgreSQL connection established successfully
   ✅ Connected to MongoDB Atlas
   ```

### Step 3️⃣: Deploy to Vercel (5 minutes)

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Login and deploy:

   ```bash
   vercel login
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - Go to project → Settings → Environment Variables
   - Add: `DATABASE_URL`, `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`

4. Deploy to production:

   ```bash
   vercel --prod
   ```

**🎉 Done! Your app is live!**

---

## 📋 Detailed Setup

### Neon Connection String Format

```
postgres://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require
```

Example:

```
postgres://myuser:abc123@ep-cool-morning-123456.us-east-2.aws.neon.tech/tasktracker_users?sslmode=require
```

### Required Environment Variables

```env
# PostgreSQL (Users) - Neon
DATABASE_URL=postgres://...

# MongoDB (Tasks) - MongoDB Atlas  
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=random-secret-at-least-32-chars

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Verification Checklist

After deployment, test:

- [ ] Can access app at Vercel URL
- [ ] Sign up with email (receives OTP)
- [ ] Verify email with OTP code
- [ ] Login works
- [ ] Can create tasks
- [ ] Forgot password works
- [ ] Check Neon dashboard - users table exists

---

## 🔍 Check Your Database

### Neon SQL Editor

1. Go to <https://console.neon.tech>
2. Select your project
3. Click **SQL Editor**
4. Run:

```sql
-- View all users
SELECT id, name, email, "createdAt" FROM users ORDER BY "createdAt" DESC;

-- Count total users
SELECT COUNT(*) as total_users FROM users;
```

---

## 🐛 Troubleshooting

### Connection Issues

**Problem:** "Unable to connect to PostgreSQL"

**Solution:**

```bash
# Check connection string has sslmode=require
DATABASE_URL=postgres://...?sslmode=require

# Verify in Vercel dashboard → Environment Variables
# Make sure no extra spaces or quotes
```

### OTP Emails Not Sending

**Problem:** Users don't receive OTP emails

**Solution:**

1. Check `EMAIL_USER` and `EMAIL_PASS` in Vercel
2. Verify Gmail app password (not regular password)
3. Check Vercel logs: `vercel logs`

### First Request Slow

**Problem:** First API call takes 1-2 seconds

**Explanation:** Neon auto-pauses databases. First request "wakes" it up. This is normal and by design for cost savings.

---

## 📊 Monitoring

### Neon Dashboard

- **Metrics:** Connection count, query performance
- **Storage:** Database size, usage
- **Branches:** Create test branches
- <https://console.neon.tech>

### Vercel Dashboard

- **Functions:** Execution logs
- **Analytics:** Page views, performance
- **Deployments:** Deploy history
- <https://vercel.com/dashboard>

---

## 💰 Neon Free Tier

✅ **Included:**

- 3 Projects
- 10 Database branches per project
- 3 GB storage
- 100 hours compute/month
- Automatic backups
- SSL connections

**Perfect for development and small production apps!**

---

## 🎯 Your Code is Already Configured

✅ `api/config/database.js` - Detects `DATABASE_URL`  
✅ SSL configuration - Auto-enabled for Neon  
✅ Connection pooling - Optimized for serverless  
✅ Error handling - Graceful fallbacks  

**No code changes needed!**

---

## 🚀 Deploy Command

```bash
# First time
vercel

# Production
vercel --prod

# View logs
vercel logs
```

---

## 📝 Files Included

- ✅ `.env.example` - Template for environment variables
- ✅ `vercel.json` - Vercel configuration (already exists)
- ✅ `package.json` - Build scripts configured
- ✅ Database configuration - Neon-ready

---

## 🎉 You're Ready

Your Student Task Tracker is ready for Neon PostgreSQL and Vercel deployment!

**Next Step:** Follow Step 1️⃣ above to create your Neon account.

---

**Questions?**

- Neon Docs: <https://neon.tech/docs>
- Vercel Docs: <https://vercel.com/docs>
- Check NEON_SETUP_GUIDE.md for detailed walkthrough

**Created:** February 1, 2026
