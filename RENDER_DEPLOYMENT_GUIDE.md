# 🚀 Render Deployment Guide

## ✅ Why Render?

- **No serverless function limits** (unlike Vercel free tier)
- **Simple full-stack deployment** - One service for both frontend and backend
- **Free tier includes** - 750 hours/month, persistent disk, PostgreSQL
- **Auto-deploys from GitHub** - Push to deploy

---

## 📋 Pre-Deployment Checklist

✅ Your project is ready with:

- `render.yaml` configuration file
- Updated `api/index.js` to serve frontend in production
- Environment variables documented
- GitHub repository up to date

---

## 🎯 Step-by-Step Deployment

### **Step 1: Push Latest Code to GitHub**

Your code changes are ready. Let's commit and push:

```bash
git add .
git commit -m "feat: Configure for Render deployment with static file serving"
git push origin main
```

### **Step 2: Sign Up / Log In to Render**

1. Go to <https://render.com>
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### **Step 3: Create New Web Service**

1. Click **"New +"** → **"Web Service"**
2. Connect your repository:
   - If first time: Click **"Connect GitHub"** → Authorize
   - Search for **"task-tracker"**
   - Click **"Connect"**

### **Step 4: Configure the Service**

Render will detect `render.yaml` but verify these settings:

| Setting | Value |
|---------|-------|
| **Name** | `task-tracker` |
| **Region** | Oregon (US West) or closest to you |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && cd client && npm install && npm run build && cd ../api && npm install` |
| **Start Command** | `node api/index.js` |
| **Plan** | `Free` |

### **Step 5: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"** for each:

#### **1. NODE_ENV**

```
NODE_ENV=production
```

#### **2. DATABASE_URL** (Neon PostgreSQL)

```
DATABASE_URL=postgresql://neondb_owner:npg_9ZOwe0gbxcJW@ep-lucky-sound-ahyqeost.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### **3. MONGODB_URI** (MongoDB Atlas)

```
MONGODB_URI=mongodb+srv://akshithuser:task-tracker@cluster0.yuyejz8.mongodb.net/?appName=Cluster0
```

#### **4. JWT_SECRET**

```
JWT_SECRET=edf90e8d79bfc0cb25488fe41c89c419ea2d0e502bbcc7eb8f831facf2c7cb96
```

#### **5. EMAIL_USER**

```
EMAIL_USER=student.task.tracker.v1@gmail.com
```

#### **6. EMAIL_PASS**

```
EMAIL_PASS=lshpjcndwagmpclf
```

#### **7. PORT**

```
PORT=10000
```

*(Render uses port 10000 by default)*

### **Step 6: Deploy!**

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Build your frontend
   - Start your server
3. **Wait 3-5 minutes** for initial deployment

---

## 🔍 Monitoring Deployment

### **Build Logs**

Watch the deployment progress:

1. Click on your service
2. **"Logs"** tab shows real-time output
3. Look for:

   ```
   ✓ Installing dependencies...
   ✓ Building client...
   ✓ Server running on port 10000
   ```

### **Deployment Status**

- **In Progress** 🟡 - Building/deploying
- **Live** 🟢 - Successfully deployed
- **Failed** 🔴 - Check logs for errors

---

## ✅ Testing Your Deployment

### **1. Get Your URL**

After deployment succeeds:

- Render provides a URL like: `https://task-tracker-xxxx.onrender.com`
- Click **"Open URL"** or copy it

### **2. Test Features**

**Homepage:**

- Visit your URL
- Should load the React app

**Sign Up:**

1. Click "Sign Up"
2. Enter details
3. Click "Send Verification Code"
4. Check email for OTP
5. Verify and create account

**Login:**

- Use created credentials
- Should redirect to dashboard

**Tasks:**

1. Create a new task
2. Mark it complete
3. Check MongoDB Atlas - data should be saved

**Database Verification:**

**Neon (Users):**

```sql
-- In Neon SQL Editor
SELECT * FROM "Users";
```

**MongoDB (Tasks):**

- Go to MongoDB Atlas → Collections
- Check `tasks` collection

---

## 🔧 Configuration Details

### **How It Works**

1. **Build Phase:**
   - Installs root dependencies
   - Builds React app (`client/dist`)
   - Installs API dependencies

2. **Runtime:**
   - Express server starts on port 10000
   - Serves API routes at `/api/*`
   - Serves React app for all other routes
   - Static files from `client/dist`

### **File Structure on Render**

```
/opt/render/project/src/
├── api/
│   ├── index.js (entry point)
│   ├── routes/
│   ├── models/
│   └── ...
├── client/
│   └── dist/ (built React app)
├── package.json
└── render.yaml
```

### **Environment Variables**

Render automatically injects:

- `PORT` - Always 10000 on free tier
- `NODE_ENV` - Set to production
- Your custom variables

---

## 🚨 Troubleshooting

### **Build Fails**

**Issue:** `npm install` errors

- **Fix:** Check `package.json` dependencies
- **Fix:** Verify Node version (18.x or higher)

**Issue:** `client build` fails

- **Fix:** Check `client/package.json`
- **Fix:** Ensure Vite config is correct

### **Server Starts But 404 Errors**

**Issue:** API routes not working

- **Fix:** Check environment variables are set
- **Fix:** Verify database connections (Neon + MongoDB)

**Issue:** Frontend doesn't load

- **Fix:** Verify `client/dist` was built
- **Fix:** Check Express static file serving

### **Database Connection Errors**

**Neon:**

```
Error: password authentication failed
```

- **Fix:** Update `DATABASE_URL` with correct credentials
- **Fix:** Use direct connection string (not pooled)

**MongoDB:**

```
Error: connection timed out
```

- **Fix:** Whitelist Render IPs in MongoDB Atlas
- **Fix:** Use `0.0.0.0/0` for testing (allows all IPs)

### **Email Not Sending**

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

- **Fix:** Verify `EMAIL_USER` and `EMAIL_PASS`
- **Fix:** Ensure Gmail App Password is correct

---

## 🔄 Updates & Redeployment

### **Auto-Deploy from GitHub**

Render auto-deploys on every push to `main`:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render automatically:
# 1. Detects push
# 2. Rebuilds
# 3. Redeploys
```

### **Manual Redeploy**

1. Go to Render Dashboard
2. Click your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

### **Viewing Logs**

- **Build Logs:** See build process
- **Deploy Logs:** See deployment status
- **Runtime Logs:** See server output (console.log, errors)

---

## 💰 Free Tier Limits

**Render Free Tier:**

- ✅ 750 hours/month (sufficient for 1 service)
- ✅ Auto-sleeps after 15 min inactivity
- ✅ 100 GB bandwidth
- ⚠️ Spins down after inactivity (50s cold start)
- ⚠️ 512 MB RAM

**Tips:**

- Use cron-job.org to ping your app every 14 min to keep it awake
- Upgrade to $7/month for always-on and more resources

---

## 🎯 Success Checklist

After deployment, verify:

- [ ] Service shows "Live" status
- [ ] URL opens and shows homepage
- [ ] Can sign up with OTP verification
- [ ] Receive OTP emails
- [ ] Can log in
- [ ] Can create/update/delete tasks
- [ ] Data persists in Neon (users) and MongoDB (tasks)
- [ ] No errors in Render logs

---

## 📞 Quick Links

- **Render Dashboard:** <https://dashboard.render.com>
- **Your Service:** <https://dashboard.render.com/web/[your-service-id>]
- **Render Docs:** <https://render.com/docs>
- **Neon Console:** <https://console.neon.tech>
- **MongoDB Atlas:** <https://cloud.mongodb.com>

---

## 🆚 Render vs Vercel

| Feature | Render | Vercel |
|---------|--------|--------|
| **Deployment Type** | Traditional server | Serverless functions |
| **Function Limit** | None | 12 on free tier |
| **Cold Starts** | 50s | ~1s |
| **Always On** | Paid tier only | Yes |
| **Database** | Can use any | Best with Vercel Postgres |
| **Cost** | Free → $7/mo | Free → $20/mo |
| **Best For** | Full-stack apps | Static + API routes |

Your app is perfect for Render because it needs a persistent server for scheduling and background tasks!

---

## 🎉 Next Steps

1. **Custom Domain (Optional):**
   - Render allows custom domains on free tier
   - Settings → Custom Domain → Add your domain

2. **Discord/Slack Notifications:**
   - Settings → Notifications
   - Get alerts for deployments

3. **Monitor Performance:**
   - Use Render's built-in metrics
   - Check response times and errors

---

**Ready to deploy? Let's push your code and create the Render service!** 🚀

---

**Created:** February 1, 2026  
**Platform:** Render.com  
**Status:** Ready for deployment
