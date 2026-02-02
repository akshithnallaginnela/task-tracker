// OTP Routes for Email Verification and Password Reset
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import User model
const { sendOTP, verifyOTP } = require('../services/otpService');
const { syncLocalUser, localUsers } = require('../services/userService');
const { sendTaskNotification } = require('../services/emailService');

// @route   POST /api/otp/send
// @desc    Send OTP to email
// @access  Public
router.post('/send', async (req, res) => {
    try {
        let { email, purpose } = req.body; // purpose: 'signup' or 'reset'
        if (email) email = email.toLowerCase(); // Normalize email

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        // ... (keep existing logic) ...
        const result = await sendOTP(email, purpose);

        // ... (keep existing logic) ...

        // @route   POST /api/otp/verify
        // @desc    Verify OTP
        // @access  Public
        router.post('/verify', async (req, res) => {
            try {
                let { email, otp, purpose } = req.body;
                if (email) email = email.toLowerCase(); // Normalize email

                if (!email || !otp) {
                    return res.status(400).json({ message: 'Email and OTP are required' });
                }

                const result = await verifyOTP(email, otp, purpose); // Added await

                // ... (keep existing logic) ...

                // @route   POST /api/otp/reset-password
                // @desc    Reset password after OTP verification
                // @access  Public
                router.post('/reset-password', async (req, res) => {
                    try {
                        let { email, otp, newPassword } = req.body;
                        if (email) email = email.toLowerCase(); // Normalize email

                        if (!email || !otp || !newPassword) {
                            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
                        }

                        if (newPassword.length < 6) {
                            return res.status(400).json({ message: 'Password must be at least 6 characters' });
                        }

                        // Verify OTP
                        const otpResult = await verifyOTP(email, otp, 'reset'); // Added await
                        if (!otpResult.success) {
                            return res.status(400).json({ message: otpResult.message });
                        }


                        // Hash new password
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(newPassword, salt);

                        // Update Password in Database
                        if (User) {
                            const user = await User.findOne({ where: { email } });
                            if (!user) {
                                return res.status(404).json({ message: 'User not found' });
                            }

                            user.password = hashedPassword;
                            await user.save();
                            console.log(`✅ Password reset for ${email} (DB)`);
                        } else {
                            // Local fallback
                            const userEntry = Array.from(localUsers.entries()).find(([id, user]) => user.email === email);
                            if (!userEntry) {
                                return res.status(404).json({ message: 'User not found' });
                            }

                            const [userId, user] = userEntry;
                            user.password = hashedPassword;
                            localUsers.set(userId, user);
                            syncLocalUser(userId, user);
                            console.log(`✅ Password reset for ${email} (Local)`);
                        }

                        return res.status(200).json({
                            message: 'Password reset successfully',
                            success: true
                        });
                    } catch (error) {
                        console.error('Error resetting password:', error);
                        res.status(500).json({ message: 'Server error' });
                    }
                });

                module.exports = router;
