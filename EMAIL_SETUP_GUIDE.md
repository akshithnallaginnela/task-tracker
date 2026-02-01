# Email Notification System Setup Guide

## 📧 Overview

The Task Tracker now includes a complete email notification system with:
- ✉️ **Email Notifications** for task creation, updates, and completion
- ⏰ **Task Reminders** for upcoming deadlines  
- 📊 **Weekly Productivity Reports** sent automatically every Monday

---

## 🔧 Setup Instructions

### 1. Email Service Configuration

#### For Gmail Users:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and the device you're using
   - Google will generate a 16-character password
   - Copy this password

3. **Update .env file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

#### For Other Email Providers:

Update `api/services/emailService.js` line 5-6:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',  // e.g., smtp.outlook.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

Common SMTP Settings:
- **Outlook/Hotmail**: `smtp.office365.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom Domain**: Check with your hosting provider

---

## 📅 Automated Schedules

The system runs the following automated tasks:

### Daily Task Reminders
- **Time**: 9:00 AM daily
- **Frequency**: Also checks every 6 hours
- **Function**: Sends reminders for tasks due within 24-48 hours
- **User Control**: Can be disabled in Settings → Notifications → "Task Reminders"

### Weekly Reports  
- **Time**: Monday at 8:00 AM
- **Content**: 
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
  - Completion rate
  - Personalized insights
- **User Control**: Can be enabled in Settings → Notifications → "Weekly Report"

---

## ✉️ Email Templates

### 1. Task Reminder Email
Sent when a task is due in 24-48 hours:
- Task title and description
- Due date
- Priority level
- Category
- Visual warning based on urgency

### 2. Weekly Productivity Report
Sent every Monday with:
- Beautiful stats dashboard
- Completion rate progress bar
- AI-powered insights
- Motivational messages

### 3. Task Notification Email
Sent when tasks are:
- Created
- Updated
- Completed
- Deleted

---

## 🎯 User Preferences

Users can control notifications from **Settings → Notifications**:

1. **Email Notifications** (Toggle)
   - Master switch for all email notifications
   - Disabled by default to respect user privacy

2. **Task Reminders** (Toggle)
   - Controls daily/6-hourly reminder emails
   - Only sends for tasks due within 24-48 hours

3. **Weekly Report** (Toggle)
   - Controls Monday morning productivity reports
   - Disabled by default (opt-in)

---

## 🧪 Testing Emails

### Manual Testing:

1. **Start the server**:
   ```bash
   cd api
   npm start
   ```

2. **Create a test task** with a due date tomorrow:
   - The system will send a reminder at 9:00 AM
   - Or trigger immediately using the test endpoint (see below)

### Test Endpoints (Optional):

Add to `api/index.js` temporarily:

```javascript
const { triggerTaskReminders, triggerWeeklyReports } = require('./services/schedulerService');

// Test reminders
app.get('/api/test/reminders', authMiddleware, async (req, res) => {
  await triggerTaskReminders();
  res.json({ message: 'Test reminders triggered' });
});

// Test weekly report  
app.get('/api/test/weekly-report', authMiddleware, async (req, res) => {
  await triggerWeeklyReports();
  res.json({ message: 'Test weekly report triggered' });
});
```

---

## 🔒 Security Best Practices

1. **Never commit .env file** to Git
2. **Use app-specific passwords** (not your main password)
3. **Rotate passwords** regularly
4. **Monitor email quota** to avoid hitting send limits

### Gmail Sending Limits:
- Free Gmail: 500 emails/day
- Google Workspace: 2,000 emails/day

---

## 🐛 Troubleshooting

### Emails Not Sending:

1. **Check environment variables**:
   ```bash
   echo $EMAIL_USER
   echo $EMAIL_PASSWORD
   ```

2. **Verify email configuration**:
   - Check console for "Email server is ready" message
   - Look for authentication errors

3. **Check spam folder**:
   - Emails might be filtered as spam initially
   - Mark as "Not Spam" to whitelist

4. **Test Gmail connection**:
   - Log in to Gmail with the credentials
   - Ensure 2FA is enabled
   - Regenerate app password if needed

### Scheduler Not Running:

1. **Check console logs**:
   - Look for "Initializing task scheduler..."
   - Verify cron jobs are registered

2. **Verify server is running**:
   - Scheduler only runs when server is active
   - Use a process manager (PM2) for production

---

## 📊 Monitoring

### Email Activity Logs:

The system logs all email activity:
- ✅ Success: "Reminder email sent to user@email.com"
- ❌ Error: "Error sending reminder email"

### Cron Job Status:

When server starts, you'll see:
```
✅ Scheduler initialized:
   - Daily reminders at 9:00 AM
   - Weekly reports every Monday at 8:00 AM  
   - 6-hour reminder checks
```

---

## 🚀 Production Deployment

### For 24/7 Operation:

1. **Use a Process Manager** (PM2):
   ```bash
   npm install -g pm2
   pm2 start api/index.js --name task-tracker
   pm2 save
   pm2 startup
   ```

2. **Use a Cloud Service**:
   - Heroku (with scheduler add-on)
   - AWS EC2 (always-on instance)
   - DigitalOcean Droplet
   - Railway.app

3. **Set up monitoring**:
   - PM2 monitoring dashboard
   - Email delivery tracking
   - Error logging (Sentry, LogRocket)

---

## 📝 Customization

### Change Email Schedule:

Edit `api/services/schedulerService.js`:

```javascript
// Change daily reminder time to 7:00 AM
cron.schedule('0 7 * * *', () => {
  checkTaskReminders();
});

// Change weekly report to Friday at 5:00 PM
cron.schedule('0 17 * * 5', () => {
  sendWeeklyReports();
});
```

### Customize Email Templates:

Edit `api/services/emailService.js`:
- Modify HTML templates
- Change colors, fonts, layouts
- Add your logo or branding

---

## ✅ Verification Checklist

Before going live:

- [ ] Email credentials configured in .env
- [ ] Server starts without errors
- [ ] "Email server is ready" message appears
- [ ] Scheduler initializes successfully
- [ ] Test email received successfully
- [ ] User preferences saved correctly
- [ ] Notification toggles work in Settings

---

## 🆘 Support

If you encounter issues:

1. Check the console logs for errors
2. Verify all environment variables are set
3. Test with a simple task creation
4. Ensure your email provider allows SMTP access

---

**Developed for Student Task Tracker**  
Last Updated: February 2026
