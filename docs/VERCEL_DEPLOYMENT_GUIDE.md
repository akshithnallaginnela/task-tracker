# 🚀 Deploy to Vercel - Complete Guide

## ✅ Pre-Deployment Checklist

Before deploying, make sure:

- ✅ **GitHub Secret Alert** - FIXED! (Updated .env.example)
- ✅ **Neon PostgreSQL** - Connected and working locally
- ✅ **MongoDB Atlas** - Connected and working locally
- ✅ **OTP Emails** - Tested and working locally
- ✅ **.gitignore** - .env file is ignored (not committed)
- ✅ **Environment Variables** - All values documented

---

## 🎯 Step 1: Install Vercel CLI

Open a **new terminal** and run:

```bash
npm install -g vercel
```

**Verify installation:**

```bash
vercel --version
```

Should show something like: `Vercel CLI 33.x.x`

---

## 🔐 Step 2: Login to Vercel

```bash
vercel login
```

Choose your login method:

- Email (you'll get a verification email)
- GitHub (recommended - easier)
- GitLab
- Bitbucket

**Recommendation:** Use GitHub for seamless integration!

---

## 📦 Step 3: Prepare for Deployment

### **3.1: Check Your Files**

Make sure these files exist in your project root:

- ✅ `vercel.json` - Already configured!
- ✅ `package.json` - Has vercel-build script
- ✅ `.gitignore` - Excludes .env
- ✅ `.env.example` - Template (safe to commit)

### **3.2: Verify vercel.json**

Your `vercel.json` should look like this:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    }
  ],
  "outputDirectory": "client/dist"
}
```

✅ **Already configured!**

### **3.3: Test Build Locally** (Optional but recommended)

```bash
# Build the frontend
cd client
npm run build
cd ..
```

If successful, you'll see a `client/dist` folder created.

---

## 🚀 Step 4: Deploy to Vercel

### **4.1: Initialize Deployment**

From your project root:

```bash
cd c:\Users\Akshith\task-tracker
vercel
```

### **4.2: Answer the Prompts**

Vercel will ask you:

**1. Set up and deploy "~/task-tracker"?**

```
Answer: Y (Yes)
```

**2. Which scope do you want to deploy to?**

```
Answer: Select your personal account (probably "Akshith")
```

**3. Link to existing project?**

```
Answer: N (No) - This is a new project
```

**4. What's your project's name?**

```
Answer: task-tracker
(or student-task-tracker, or any name you prefer)
```

**5. In which directory is your code located?**

```
Answer: ./ (just press Enter)
```

**6. Want to modify the settings?**

```
Answer: N (No) - Use defaults
```

Vercel will now:

- ✅ Upload your code
- ✅ Build your project
- ✅ Deploy to a preview URL
- ✅ Give you a URL like: `https://task-tracker-xyz.vercel.app`

---

## ⚙️ Step 5: Add Environment Variables

**CRITICAL:** Your app won't work yet because environment variables are missing!

### **5.1: Go to Vercel Dashboard**

1. Open: <https://vercel.com/dashboard>
2. Click your **"task-tracker"** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** on the left

### **5.2: Add These Variables**

For EACH variable, click **"Add New"** and enter:

| **Name** | **Value** | **Environments** |
|----------|-----------|------------------|
| `DATABASE_URL` | Your Neon connection string | All (Production, Preview, Development) |
| `MONGODB_URI` | Your MongoDB Atlas string | All |
| `JWT_SECRET` | Your JWT secret | All |
| `EMAIL_USER` | <student.task.tracker.v1@gmail.com> | All |
| `EMAIL_PASS` | Your Gmail app password | All |
| `NODE_ENV` | `production` | Production only |

---

### **📋 Copy These Exact Values**

Open your `.env` file and copy the values:

**DATABASE_URL:**

```
postgresql://neondb_owner:npg_9ZOwe0gbxcJW@ep-lucky-sound-ahyqeost-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**MONGODB_URI:**

```
mongodb+srv://akshithuser:task-tracker@cluster0.yuyejz8mongodb.net/?appName=Cluster0
```

**JWT_SECRET:**

```
edf90e8d79bfc0cb25488fe41c89c419ea2d0e502bbcc7eb8f831facf2c7cb96
```

**EMAIL_USER:**

```
student.task.tracker.v1@gmail.com
```

**EMAIL_PASS:**

```
lshpjcndwagmpclf
```

---

### **5.3: How to Add Each Variable**

For each variable:

1. Click **"Add New"**
2. **Name:** Enter variable name (e.g., `DATABASE_URL`)
3. **Value:** Paste the value
4. **Environments:** Check **ALL** boxes:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

**Repeat for all 5 variables!**

---

## 🔄 Step 6: Redeploy with Environment Variables

After adding all environment variables:

```bash
vercel --prod
```

This will:

- ✅ Deploy to production
- ✅ Use your environment variables
- ✅ Create your production URL

---

## ✅ Step 7: Test Your Deployment

### **7.1: Get Your URL**

After deployment, Vercel will show:

```
✅ Production: https://task-tracker.vercel.app
```

### **7.2: Test These Features**

Visit your production URL and test:

1. **Landing Page**
   - ✅ Page loads without errors

2. **Signup with OTP**
   - ✅ Click "Sign Up"
   - ✅ Enter name, email, password
   - ✅ Click "Send Verification Code"
   - ✅ Check email for OTP
   - ✅ Enter OTP and verify
   - ✅ Account created successfully

3. **Login**
   - ✅ Login with created account

4. **Tasks**
   - ✅ Create a new task
   - ✅ View tasks list
   - ✅ Complete/delete tasks

5. **Forgot Password**
   - ✅ Click "Forgot Password"
   - ✅ Receive OTP email
   - ✅ Reset password successfully

---

## 🔍 Step 8: Verify Database

### **Check Neon (Users)**

1. Go to: <https://console.neon.tech>
2. Open your project
3. Click **"SQL Editor"**
4. Run:

   ```sql
   SELECT id, name, email, "createdAt" 
   FROM users 
   ORDER BY "createdAt" DESC;
   ```

5. ✅ You should see users who signed up on production!

### **Check MongoDB (Tasks)**

1. Go to: <https://cloud.mongodb.com>
2. Open your cluster
3. Click **"Collections"**
4. Open **"tasks"** collection
5. ✅ You should see tasks created by users!

---

## 🐛 Troubleshooting

### **Issue: "Internal Server Error"**

**Solution:**

1. Check Vercel logs:

   ```bash
   vercel logs
   ```

2. Or visit: <https://vercel.com/[your-username]/task-tracker/logs>
3. Look for errors related to environment variables or database connections

### **Issue: "OTP Emails Not Sending"**

**Solution:**

1. Verify `EMAIL_USER` and `EMAIL_PASS` are correct in Vercel
2. Check Vercel logs for email errors
3. Verify Gmail app password is still valid

### **Issue: "Database Connection Failed"**

**Solution:**

1. Verify `DATABASE_URL` is correct (no extra spaces)
2. Ensure Neon project is active
3. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)

### **Issue: "404 on API Routes"**

**Solution:**

1. Check `vercel.json` has correct rewrites
2. Ensure API routes start with `/api/`
3. Redeploy: `vercel --prod`

---

## 📊 Monitoring Your Deployment

### **Vercel Dashboard**

Visit: <https://vercel.com/dashboard>

Monitor:

- **Deployments** - See deployment history
- **Functions** - View serverless function logs
- **Analytics** - Track page views and performance
- **Logs** - Debug issues in real-time

### **Neon Dashboard**

Visit: <https://console.neon.tech>

Monitor:

- **Connections** - Active database connections
- **Storage** - Database size usage
- **Compute** - Usage hours
- **Queries** - SQL query performance

---

## 🎯 Optional Enhancements

### **1. Custom Domain**

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS setup instructions
4. ✅ Your app will be at yourdomain.com!

### **2. CORS Configuration**

Update `api/index.js` for specific domain:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-domain.vercel.app'
    : '*',
  credentials: true
}));
```

### **3. Analytics**

Enable Vercel Analytics:

1. Go to project → **Analytics**
2. Click **"Enable"**
3. Track visitors, page views, and performance

---

## 📝 Post-Deployment Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Can sign up with OTP verification
- [ ] Receive OTP emails
- [ ] Can login with created account
- [ ] Can create and manage tasks
- [ ] Password reset works
- [ ] Users saved in Neon database
- [ ] Tasks saved in MongoDB
- [ ] No errors in Vercel logs
- [ ] Environment variables are set correctly

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ App is live at Vercel URL  
✅ All features work exactly like locally  
✅ Emails are sent successfully  
✅ Data is saved to both databases  
✅ No errors in production logs  
✅ Performance is good (< 3s page load)  

---

## 🚀 Deployment Commands Summary

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# First deployment (preview)
vercel

# Add environment variables in dashboard
# Then deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

## 📞 Need Help?

**Resources:**

- Vercel Docs: <https://vercel.com/docs>
- Neon Docs: <https://neon.tech/docs>
- Your project files: Check `NEON_SUCCESS.md` for configuration details

**Common Commands:**

```bash
# Redeploy current branch
vercel --prod

# Deploy specific branch
vercel --prod --branch main

# View real-time logs
vercel logs --follow

# Remove deployment
vercel remove task-tracker
```

---

**Created:** February 1, 2026  
**Status:** ✅ Ready to Deploy!  

**Next Step:** Run `vercel login` to begin deployment! 🚀
