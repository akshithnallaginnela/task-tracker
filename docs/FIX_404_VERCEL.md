# 🔧 Fix Vercel 404 - Dashboard Settings

## ✅ Code is Already on Main Branch

Your updated `vercel.json` is now on the `main` branch in GitHub. Vercel should automatically redeploy, but if you're still seeing 404 errors, we need to check and update the Vercel project settings.

---

## 🎯 Fix in Vercel Dashboard

### **Step 1: Go to Project Settings**

1. Open <https://vercel.com/dashboard>
2. Click your **task-tracker** project
3. Click **"Settings"** tab

### **Step 2: Configure Build Settings**

Click **"General"** in the left sidebar, then scroll to **"Build & Development Settings"**:

#### **Framework Preset:**

```
Other
```

(NOT Vite - this is important!)

#### **Build Command:**

Override and set to:

```
npm run vercel-build
```

#### **Output Directory:**

Override and set to:

```
client/dist
```

#### **Install Command:**

Keep default:

```
npm install
```

#### **Root Directory:**

Keep as:

```
./
```

### **Step 3: Save Changes**

Click **"Save"** at the bottom of the Build & Development Settings section.

---

## 🔄 Step 4: Trigger Redeploy

After saving settings:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **three dots (...)** menu
4. Click **"Redeploy"**
5. **IMPORTANT:** Uncheck "Use existing Build Cache"
6. Click **"Redeploy"** to confirm

---

## ⚙️ Step 5: Add Environment Variables (CRITICAL!)

While the deployment is running, add environment variables:

1. Click **"Settings"** tab
2. Click **"Environment Variables"** (left sidebar)
3. Add these 5 variables:

### **Add Each Variable:**

Click "Add New" for each:

#### **1. DATABASE_URL**

- **Name:** `DATABASE_URL`
- **Value:**

  ```
  postgresql://neondb_owner:npg_9ZOwe0gbxcJW@ep-lucky-sound-ahyqeost-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
  ```

- **Environments:** ☑ Production ☑ Preview ☑ Development

#### **2. MONGODB_URI**

- **Name:** `MONGODB_URI`
- **Value:**

  ```
  mongodb+srv://akshithuser:task-tracker@cluster0.yuyejz8.mongodb.net/?appName=Cluster0
  ```

- **Environments:** ☑ Production ☑ Preview ☑ Development

#### **3. JWT_SECRET**

- **Name:** `JWT_SECRET`
- **Value:**

  ```
  edf90e8d79bfc0cb25488fe41c89c419ea2d0e502bbcc7eb8f831facf2c7cb96
  ```

- **Environments:** ☑ Production ☑ Preview ☑ Development

#### **4. EMAIL_USER**

- **Name:** `EMAIL_USER`
- **Value:**

  ```
  student.task.tracker.v1@gmail.com
  ```

- **Environments:** ☑ Production ☑ Preview ☑ Development

#### **5. EMAIL_PASS**

- **Name:** `EMAIL_PASS`
- **Value:**

  ```
  lshpjcndwagmpclf
  ```

- **Environments:** ☑ Production ☑ Preview ☑ Development

---

## 🔄 Step 6: Final Redeploy

After adding all environment variables:

1. Go back to **"Deployments"** tab
2. Click **three dots (...)** on latest deployment
3. Click **"Redeploy"**
4. Uncheck "Use existing Build Cache"
5. Click **"Redeploy"**

This will deploy with:

- ✅ Correct build settings
- ✅ Updated vercel.json from GitHub
- ✅ All environment variables

---

## ✅ Step 7: Verify Deployment

### **Check Build Logs:**

1. Click on the running deployment
2. Click **"Building"** to see build logs
3. Look for:

   ```
   ✓ Client build successful
   ✓ API functions ready
   ```

### **Check Deployment Status:**

Wait for deployment to show:

```
✅ Ready
```

### **Test Your App:**

1. Click **"Visit"** or go to your deployment URL
2. You should see your app homepage!
3. Try signing up with OTP
4. Check if emails are sent

---

## 🐛 Troubleshooting

### **Still seeing 404?**

**Check Framework Preset:**

- Settings → General → Build & Development Settings
- Must be "Other" NOT "Vite"

**Check Build Command:**

- Must be: `npm run vercel-build`
- NOT: `cd client && npm run build`

**Check Output Directory:**

- Must be: `client/dist`
- NOT: `dist` or `.next` or anything else

### **Build fails?**

**Check build logs** for errors:

- Missing dependencies?
- Environment variables missing?
- Build command incorrect?

### **API returns errors?**

**Check Function Logs:**

- Settings → Functions → View logs
- Look for database connection errors
- Verify environment variables are set

### **No errors but app doesn't work?**

**Check browser console:**

- Press F12
- Go to Console tab
- Look for network errors or API call failures

---

## 📋 Complete Settings Checklist

Before redeploying, verify:

**General Settings:**

- [ ] Framework Preset: Other
- [ ] Build Command: `npm run vercel-build`
- [ ] Output Directory: `client/dist`
- [ ] Install Command: `npm install`  
- [ ] Root Directory: `./`

**Environment Variables:**

- [ ] DATABASE_URL (Neon PostgreSQL)
- [ ] MONGODB_URI (MongoDB Atlas)
- [ ] JWT_SECRET (Authentication)
- [ ] EMAIL_USER (Gmail address)
- [ ] EMAIL_PASS (Gmail app password)
- [ ] All set for: Production, Preview, Development

**Deployment:**

- [ ] Code is on main branch (✅ Already done!)
- [ ] vercel.json is updated (✅ Already done!)
- [ ] Redeploy with fresh build cache

---

## 🎯 Expected Result

After following these steps:

✅ Homepage loads successfully  
✅ Can sign up with OTP  
✅ Email verification works  
✅ Can login  
✅ Can create and manage tasks  
✅ All API routes work  
✅ No 404 errors in logs  

---

## 📞 Quick Links

- **Vercel Dashboard:** <https://vercel.com/dashboard>
- **Your Project Settings:** <https://vercel.com/[your-username]/task-tracker/settings>
- **Neon Console:** <https://console.neon.tech>
- **MongoDB Atlas:** <https://cloud.mongodb.com>

---

**Next Steps:**

1. Open Vercel Dashboard
2. Configure build settings (Framework: Other, Build Command, Output Directory)
3. Add 5 environment variables
4. Redeploy with fresh build
5. Test your app!

---

**Created:** February 1, 2026  
**Status:** Ready to configure in Vercel Dashboard 🚀
