// OTP Service for Email Verification and Password Reset
const nodemailer = require('nodemailer');
const path = require('path');
const OTP = require('../models/OTP'); // Import MongoDB OTP Model
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create transporter with explicit Gmail SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOTP = async (email, purpose = 'signup') => {
  try {
    const otp = generateOTP();

    // Save to Database (Upsert: Update if exists, Insert if not)
    await OTP.findOneAndUpdate(
      { email, purpose },
      { otp, createdAt: new Date() }, // Update OTP and reset expiration timer
      { upsert: true, new: true }
    );
    console.log(`✅ OTP stored in DB for ${email}`);

    // Email content based on purpose
    const templates = {
      signup: {
        subject: '🔐 Verify Your Email - Student Task Tracker',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
            <div style="background: white; padding: 40px; border-radius: 8px;">
              <h1 style="color: #667eea; margin-bottom: 20px; text-align: center;">📧 Verify Your Email</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Welcome to Student Task Tracker!</p>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Please use the following OTP to verify your email address:</p>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <div style="color: white; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #fef3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;">
                  ⏰ This OTP will expire in <strong>5 minutes</strong>
                </p>
              </div>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px;">
                If you didn't request this OTP, please ignore this email.
              </p>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 12px; margin: 0;">Student Task Tracker</p>
              </div>
            </div>
          </div>
        `
      },
      reset: {
        subject: '🔑 Reset Your Password - Student Task Tracker',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
            <div style="background: white; padding: 40px; border-radius: 8px;">
              <h1 style="color: #667eea; margin-bottom: 20px; text-align: center;">🔑 Reset Your Password</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">You requested to reset your password.</p>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">Please use the following OTP to continue:</p>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <div style="color: white; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #fef3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;">
                  ⏰ This OTP will expire in <strong>5 minutes</strong>
                </p>
              </div>
              
              <div style="background: #fee; padding: 15px; border-radius: 8px; border-left: 4px solid #f44; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b;">
                  ⚠️ If you didn't request this password reset, please contact support immediately.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 12px; margin: 0;">Student Task Tracker</p>
              </div>
            </div>
          </div>
        `
      }
    };

    const template = templates[purpose];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email} for ${purpose}`);

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

// Verify OTP
const verifyOTP = async (email, otp, purpose = 'signup') => {
  try {
    const storedOTP = await OTP.findOne({ email, purpose });

    if (!storedOTP) {
      return { success: false, message: 'No OTP found for this email (or expired)' };
    }

    if (storedOTP.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // OTP is valid, remove it
    await OTP.deleteOne({ _id: storedOTP._id });
    console.log(`✅ OTP verified and deleted for ${email}`);

    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    return { success: false, message: 'Database error verifying OTP' };
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  generateOTP
};
