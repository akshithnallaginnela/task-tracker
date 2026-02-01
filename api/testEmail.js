// Simple email test script
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');

console.log('📧 Email Test Script');
console.log('===================');
console.log('');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
console.log('');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test email
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'akshithnallaginnela28@gmail.com', // CHANGE THIS to your email
    subject: '✅ Test Email from Task Tracker',
    html: `
    <div style="font-family: Arial; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
      <div style="background: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #667eea;">🎉 Email Test Successful!</h1>
        <p>If you're seeing this email, the email system is working perfectly!</p>
        <p><strong>Sent from:</strong> ${process.env.EMAIL_USER}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `
};

// Send email
console.log('📤 Sending test email...');
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('❌ Error sending email:');
        console.error(error);
    } else {
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('');
        console.log('🎯 Check your inbox at: akshithnallaginnela28@gmail.com');
    }
    process.exit(error ? 1 : 0);
});
