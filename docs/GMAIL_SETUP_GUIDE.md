# 📧 Gmail Setup for Task Tracker Email Notifications

## ✅ Complete Setup Guide

Follow these steps to enable email notifications using a dedicated Gmail account for your Task Tracker application.

---

## 📋 Step 1: Create Application Gmail Account

### Create New Gmail

1. Go to: **<https://accounts.google.com/signup>**
2. Fill in the details:

   ```
   First name: Student
   Last name: Task Tracker
   Username: studenttasktracker (or your preferred name)
   Password: [Create a strong password]
   ```

3. Complete the phone verification
4. Skip optional settings
5. Agree to terms and create account

**Suggested Email Names:**

- `studenttasktracker@gmail.com`
- `tasktrackerapp@gmail.com`
- `mytasktracker@gmail.com`

---

## 🔐 Step 2: Enable 2-Factor Authentication

2FA is **required** to generate App Passwords:

1. Go to: **<https://myaccount.google.com/security>**
2. Scroll to **"2-Step Verification"**
3. Click **"Get Started"**
4. Enter your password
5. Add your phone number
6. Enter the verification code sent to your phone
7. Click **"Turn On"**

✅ 2FA is now enabled!

---

## 🔑 Step 3: Generate App Password

Now generate a 16-character app password:

1. Go to: **<https://myaccount.google.com/apppasswords>**
   - (If link doesn't work, go to Security → App passwords)

2. You may need to sign in again

3. Select app and device:
   - **Select app**: "Mail"
   - **Select device**: "Other (Custom name)"
   - Type: "Task Tracker Application"

4. Click **"Generate"**

5. Google will show a **16-character password** like:

   ```
   abcd efgh ijkl mnop
   ```

6. **IMPORTANT**: Copy this password immediately!
   - You won't be able to see it again
   - Remove all spaces when copying

---

## 📝 Step 4: Update .env File

1. Open `api/.env` file in your project

2. Find these lines (around line 64):

   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   ```

3. Replace with your actual credentials:

   ```env
   EMAIL_USER=studenttasktracker@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

   ⚠️ **Remove spaces from the password!**

4. Save the file

---

## 🔄 Step 5: Restart the Server

1. **Stop the current server**:
   - Go to the terminal running `npm start`
   - Press `Ctrl + C`

2. **Start the server again**:

   ```bash
   cd c:\Users\Akshith\task-tracker
   npm start
   ```

3. **Check for success messages**:

   ```
   ✅ Email server is ready to send messages
   ⏰ Initializing task scheduler...
   ✅ Scheduler initialized
      📅 Daily reminders: 9:00 AM
      📅 Weekly reports: Monday 8:00 AM
      📅 6-hour checks: Every 6 hours
   ```

---

## ✨ What Happens Now?

### When Users Register

✅ They receive a **welcome email** from `studenttasktracker@gmail.com`

### When Users Create Tasks

✅ They receive a **task creation notification** email

### When Users Complete Tasks

✅ They receive a **task completion** email

### Daily (9 AM)

✅ Users get **reminders** for tasks due tomorrow

### Weekly (Monday 8 AM)

✅ Users with "Weekly Report" enabled get **productivity summary**

---

## 🧪 Test the Email System

### Test 1: Registration Email

1. **Create a new user account**:
   - Use your REAL email address
   - Complete registration

2. **Check your inbox**:
   - Look for email from your app account
   - Subject: "✅ Task Created: Welcome to Student Task Tracker!"

### Test 2: Task Creation Email

1. **Create a new task** in the app
2. **Check your inbox** for task notification

### Test 3: Check Console

Look in the terminal for:

```
✅ Welcome email sent to user@example.com
✅ Task creation email sent to user@example.com
```

---

## ❌ Troubleshooting

### "Email server ready" not showing

- **Check** EMAIL_USER and EMAIL_PASSWORD in `.env`
- **Verify** no spaces in the password
- **Confirm** you're using the **app password**, not your regular password

### "Authentication failed"

- **Regenerate** the app password
- **Make sure** 2FA is enabled
- **Double-check** the email address

### Emails not received

1. **Check spam folder** in your inbox
2. **Verify** you used your REAL email when registering
3. **Look at server logs** for error messages
4. **Make sure** EMAIL_USER in .env is correct

### Gmail blocking emails

- **Mark as "Not Spam"** if in spam folder
- **Check** Gmail's "Less secure app access" (should be disabled, use app password instead)

---

## 🎯 Email Sending Limits

### Gmail Free Account

- **500 emails per day**
- **2,000 emails per day** with Google Workspace

### Tips to Stay Under Limit

- Only send important notifications
- Let users toggle notifications on/off
- Batch weekly reports instead of daily

---

## 🔒 Security Best Practices

✅ **DO**:

- Use a dedicated email account for the app
- Use app passwords (not your main password)
- Keep `.env` file in `.gitignore`
- Never commit credentials to Git

❌ **DON'T**:

- Share your app password
- Use your personal Gmail
- Commit `.env` to version control
- Hard-code credentials in code

---

## 📊 Current System Status

| Feature | Status |
|---------|--------|
| Email Service | ✅ Ready |
| Welcome Emails | ✅ Implemented |
| Task Notifications | ✅ Implemented |
| Task Reminders | ✅ Scheduled (9 AM) |
| Weekly Reports | ✅ Scheduled (Mon 8 AM) |
| User Email Storage | ✅ Working |
| Settings Toggles | ✅ Working |

---

## 🎉 You're All Set

Once you complete these steps:

1. ✅ Create Gmail account
2. ✅ Enable 2FA
3. ✅ Generate app password
4. ✅ Update `.env` file
5. ✅ Restart server

Your Task Tracker will send beautiful, professional emails to all users! 📧✨

---

**Last Updated**: February 2026  
**Support**: Check server logs for email sending status
