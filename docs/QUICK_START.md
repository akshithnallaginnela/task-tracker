# 🚀 Quick Start Guide - OTP Email Verification

## Start Testing in 2 Steps

### Step 1: Start Backend Server

Open a terminal and run:

```bash
cd c:\Users\Akshith\task-tracker
npm start
```

Wait for:

```
✅ Connected to MongoDB Atlas
Server running on port 5000
```

### Step 2: Start Frontend Development Server

Open a NEW terminal and run:

```bash
cd c:\Users\Akshith\task-tracker\client
npm run dev
```

Wait for:

```
  ➜  Local:   http://localhost:5173/
```

### Step 3: Test the OTP Flow

1. Open your browser to **<http://localhost:5173>**
2. Click **"Sign up"**
3. Fill in your details (use a REAL email address)
4. Click **"Send Verification Code"**
5. Check your email inbox for the OTP
6. Enter the 6-digit code
7. Click **"Verify & Create Account"**

**🎉 You're in!**

---

## Troubleshooting

### "OTP not received"

- Check spam/junk folder
- Wait 1-2 minutes (Gmail can be slow)
- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`

### "Backend won't start"

- Make sure MongoDB connection string is correct
- Check `.env` file exists with all variables
- Run `npm install` if packages are missing

### "Frontend won't start"

- Run `npm install` in the client folder
- Clear browser cache
- Try a different port if 5173 is busy

---

## Email Configuration

Make sure your `.env` file has:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

For Gmail app password:

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate an App Password
4. Use that password (not your regular Gmail password)

---

## 🎯 What to Test

- ✅ Signup with OTP verification
- ✅ Resend OTP functionality
- ✅ OTP expiration (wait 5 minutes)
- ✅ Invalid OTP handling
- ✅ Forgot password flow
- ✅ Password reset with OTP
- ✅ Email already registered error

---

**Ready? Let's test it! 🚀**
