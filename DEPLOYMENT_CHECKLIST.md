# Quick Deployment Checklist

## Before Deploying

### ✅ Code is Ready
- [x] API configured for serverless
- [x] Database connections support SSL
- [x] API routes use relative paths in production
- [x] Environment variables configured
- [x] Vercel configuration added

### 📦 What You Need

1. **Neon PostgreSQL URL** - Get from https://neon.tech
   ```
   postgresql://user:pass@host.neon.tech/db?sslmode=require
   ```

2. **MongoDB Atlas URL** - Get from https://mongodb.com/atlas
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/tasktracker?retryWrites=true&w=majority
   ```

3. **JWT Secret** - Generate with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

---

## Deployment Steps

### 1️⃣ Set Up Databases (10 minutes)

**Neon PostgreSQL**:
1. Sign up at https://neon.tech (free, no credit card)
2. Create project → Copy connection string
3. Save as `DATABASE_URL`

**MongoDB Atlas**:
1. Sign up at https://mongodb.com/atlas (free)
2. Create cluster (M0 free tier)
3. Create database user
4. Allow access from anywhere (0.0.0.0/0)
5. Get connection string → Replace `<password>`
6. Save as `MONGODB_URI`

### 2️⃣ Push to GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git push -u origin main
```

### 3️⃣ Deploy to Vercel (5 minutes)

1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - **Framework**: Vite
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`

4. Add Environment Variables:
   - `DATABASE_URL` = Your Neon connection string
   - `MONGODB_URI` = Your MongoDB connection string  
   - `JWT_SECRET` = Generated secret
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`

5. Click "Deploy"

### 4️⃣ Test (2 minutes)

1. Open deployed URL
2. Sign up with test account
3. Create a task
4. Verify theme switching works

---

## Environment Variables Template

Copy this and fill in your values:

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tasktracker?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=<GENERATE_WITH_COMMAND_ABOVE>
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=production
```

---

## Troubleshooting

**Build fails on Vercel?**
- Check that api/package.json exists
- Verify all dependencies are listed
- Check Vercel build logs

**Can't connect to database?**
- Verify connection strings have no typos
- Check MongoDB allows 0.0.0.0/0 in Network Access
- Ensure Neon project is active

**500 Error on API calls?**
- Check Vercel function logs
- Verify environment variables are set
- Make sure DATABASE_URL and MONGODB_URI are correct

---

## Success! 🎉

Your app should now be live at:
`https://your-project-name.vercel.app`

Test with a new account and enjoy your deployed app!

---

## Next Steps

- [ ] Set up custom domain (optional)
- [ ] Monitor usage in Neon/MongoDB dashboards
- [ ] Share your app!

For detailed instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
