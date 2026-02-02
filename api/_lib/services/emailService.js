const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Debug: Log to verify credentials are loaded
console.log('📧 Email credentials check:');
console.log('   USER:', process.env.EMAIL_USER ? '✅ Loaded' : '❌ Missing');
console.log('   PASS:', process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Missing');

// Email configuration - Simplified for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('');
    console.log('📧 Troubleshooting:');
    console.log('   1. Go to: https://myaccount.google.com/lesssecureapps');
    console.log('   2. Turn ON "Allow less secure apps"');
    console.log('   3. Or check: https://myaccount.google.com/security for blocked sign-in');
    console.log('');
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log(`📧 Using: ${process.env.EMAIL_USER || 'Not configured'}`);
  }
});

// Send task reminder email
const sendTaskReminder = async (userEmail, task) => {
  const dueDate = new Date(task.dueDate);
  const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `⏰ Task Reminder: "${task.title}" is due soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #667eea; margin-bottom: 20px;">📋 Task Reminder</h1>
          
          <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 10px 0;">${task.title}</h2>
            <p style="color: #666; margin: 5px 0;"><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Priority:</strong> ${task.priority || 'Normal'}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Category:</strong> ${task.category || 'Uncategorized'}</p>
            ${task.description ? `<p style="color: #666; margin: 10px 0 0 0;"><strong>Description:</strong> ${task.description}</p>` : ''}
          </div>
          
          <div style="background: ${daysUntilDue <= 1 ? '#fee' : '#fef3cd'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${daysUntilDue <= 1 ? '#f44' : '#f90'};">
            <p style="margin: 0; color: #333;">
              ${daysUntilDue <= 0
        ? '🚨 This task is <strong>overdue</strong>!'
        : daysUntilDue === 1
          ? '⚠️ This task is due <strong>tomorrow</strong>!'
          : `⏰ This task is due in <strong>${daysUntilDue} days</strong>.`
      }
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px;">This is an automated reminder from your Student Task Tracker</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${userEmail} for task: ${task.title}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending reminder email:', error);
    return { success: false, error: error.message };
  }
};

// Send weekly productivity report
const sendWeeklyReport = async (userEmail, userName, stats) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `📊 Your Weekly Productivity Report - ${new Date().toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #667eea; margin-bottom: 10px;">📊 Weekly Productivity Report</h1>
          <p style="color: #666; margin-bottom: 30px;">Hi ${userName}, here's your productivity summary for this week!</p>
          
          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center;">
              <div style="color: white; font-size: 36px; font-weight: bold;">${stats.totalTasks}</div>
              <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 5px;">Total Tasks</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; text-align: center;">
              <div style="color: white; font-size: 36px; font-weight: bold;">${stats.completed}</div>
              <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 5px;">Completed</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 8px; text-align: center;">
              <div style="color: white; font-size: 36px; font-weight: bold;">${stats.pending}</div>
              <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 5px;">Pending</div>
            </div>
            
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; border-radius: 8px; text-align: center;">
              <div style="color: white; font-size: 36px; font-weight: bold;">${stats.overdue}</div>
              <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 5px;">Overdue</div>
            </div>
          </div>
          
          <!-- Completion Rate -->
          <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Completion Rate</h3>
            <div style="background: #e5e7eb; height: 30px; border-radius: 15px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 100%; width: ${stats.completionRate}%; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; transition: width 0.3s;">
                <span style="color: white; font-weight: bold; font-size: 14px;">${stats.completionRate}%</span>
              </div>
            </div>
          </div>
          
          <!-- Insights -->
          <div style="background: linear-gradient(135deg, #fef3cd 0%, #fde68a 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">💡 Insights</h3>
            <p style="color: #78350f; margin: 5px 0;">
              ${stats.completionRate >= 80
        ? '🔥 Excellent work! You\'re crushing your tasks!'
        : stats.completionRate >= 50
          ? '👍 Good progress! Keep up the momentum.'
          : '💪 You can do better! Focus on completing more tasks this week.'
      }
            </p>
            ${stats.overdue > 0 ? `<p style="color: #78350f; margin: 5px 0;">⚠️ You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}. Try to tackle them first!</p>` : ''}
          </div>
          
          <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #999; font-size: 12px; margin: 0;">Keep up the great work! 🎯</p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">- Your Student Task Tracker</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Weekly report sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending weekly report:', error);
    return { success: false, error: error.message };
  }
};

// Send task created notification
const sendTaskNotification = async (userEmail, task, action = 'created') => {
  const actionText = {
    created: 'Created',
    updated: 'Updated',
    completed: 'Completed',
    deleted: 'Deleted'
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `✅ Task ${actionText[action]}: "${task.title}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #667eea; margin-bottom: 20px;">✅ Task ${actionText[action]}</h1>
          
          <div style="background: #f7f7f7; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin: 0 0 10px 0;">${task.title}</h2>
            ${task.description ? `<p style="color: #666; margin: 10px 0;">${task.description}</p>` : ''}
            <p style="color: #666; margin: 5px 0;"><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
            ${task.priority ? `<p style="color: #666; margin: 5px 0;"><strong>Priority:</strong> ${task.priority}</p>` : ''}
            ${task.category ? `<p style="color: #666; margin: 5px 0;"><strong>Category:</strong> ${task.category}</p>` : ''}
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 12px;">Student Task Tracker</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendTaskReminder,
  sendWeeklyReport,
  sendTaskNotification
};
