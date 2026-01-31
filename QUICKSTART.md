# Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### 1. Install Dependencies
```bash
# Backend
cd api
npm install

# Frontend
cd ../client
npm install
```

### 2. Set Up Databases

**Option A: Quick Local Setup**
```bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# Mac: brew install postgresql && brew services start postgresql

# Create database
psql -U postgres -c "CREATE DATABASE tasktracker_users;"
```

**Option B: Cloud Setup (Recommended)**
- **PostgreSQL**: Sign up at [neon.tech](https://neon.tech) (Free, no credit card)
- **MongoDB**: Sign up at [mongodb.com/atlas](https://mongodb.com/cloud/atlas) (Free tier)

### 3. Configure Environment
```bash
cd api

# Copy example env file
cp .env.example .env

# Edit .env with your credentials
# REQUIRED fields:
# - MONGODB_URI (from MongoDB Atlas)
# - PG_PASSWORD (your PostgreSQL password)
# - JWT_SECRET (any random string)
```

### 4. Start Application
```bash
# Terminal 1 - Backend
cd api
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5. Create Your First Account
1. Go to http://localhost:5174
2. Click "Sign Up"
3. Create account (stored in PostgreSQL)
4. Start adding tasks (stored in MongoDB)

## ✨ New Features

### 🎨 Theme Switching
- Go to Account Settings → Appearance
- Choose Light or Dark theme
- Theme persists across sessions

### 👤 User-Specific Tasks
- Each user only sees their own tasks
- Tasks stored with userId in MongoDB
- Secure JWT authentication

## 🔍 Troubleshooting

**Backend won't start?**
```bash
# Check if databases are configured
cd api
cat .env  # Should have MONGODB_URI and PG_PASSWORD

# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"
```

**Can't login?**
- Make sure backend is running (port 5000)
- Check browser console for errors
- Try signing up with a new account
- Clear localStorage and try again

**Tasks not loading?**
- Check if MongoDB URI is correct in .env
- Make sure you're logged in (have a token)
- Check browser Network tab for API errors

## 📚 Detailed Documentation

- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Complete database setup guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🆘 Need Help?

1. Check `DATABASE_SETUP.md` for detailed instructions
2. Verify both databases are running
3. Check `.env` file has all required variables
4. Look at backend terminal for error messages
5. Check browser console for frontend errors

## ⚙️ Environment Variables Quick Reference

```env
# MongoDB Atlas - Get from atlas.mongodb.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# PostgreSQL - Local or from neon.tech
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=tasktracker_users
PG_USER=postgres
PG_PASSWORD=your_password

# JWT - Generate random string
JWT_SECRET=your_random_secret_here

# Server
PORT=5000
```

## 🎯 Next Steps

After setup:
1. ✅ Create an account
2. ✅ Add some tasks
3. ✅ Try the theme switcher
4. ✅ Explore Projects, Learning, Analytics pages
5. ✅ Check that logging out and in shows only your tasks
