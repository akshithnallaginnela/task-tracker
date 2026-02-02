// OTP Routes for Email Verification and Password Reset
require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

// ...

// @route   POST /api/otp/send
// @desc    Send OTP to email
// @access  Public
router.post('/send', async (req, res) => {
    try {
        const { email, purpose } = req.body; // purpose: 'signup' or 'reset'

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!purpose || !['signup', 'reset'].includes(purpose)) {
            return res.status(400).json({ message: 'Invalid purpose' });
        }

        // Check against Database (PostgreSQL) if available
        let userExists = null;
        if (User) {
            userExists = await User.findOne({ where: { email } });
        } else {
            // Fallback to local memory (only for dev/testing without DB)
            userExists = Array.from(localUsers.values()).find(u => u.email === email);
        }

        // For password reset, check if user exists
        if (purpose === 'reset') {
            if (!userExists) {
                return res.status(404).json({ message: 'No account found with this email' });
            }
        }

        // For signup, check if user already exists
        if (purpose === 'signup') {
            if (userExists) {
                return res.status(400).json({ message: 'Email already registered' });
            }
        }

        const result = await sendOTP(email, purpose);

        if (result.success) {
            return res.status(200).json({
                message: 'OTP sent successfully. Please check your email.',
                email
            });
        } else {
            return res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/otp/verify
// @desc    Verify OTP
// @access  Public
router.post('/verify', async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const result = verifyOTP(email, otp, purpose);

        if (result.success) {
            return res.status(200).json({
                message: 'OTP verified successfully',
                verified: true
            });
        } else {
            return res.status(400).json({
                message: result.message,
                verified: false
            });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/otp/reset-password
// @desc    Reset password after OTP verification
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify OTP
        const otpResult = verifyOTP(email, otp, 'reset');
        if (!otpResult.success) {
            return res.status(400).json({ message: otpResult.message });
        }

        // Find user
        const userEntry = Array.from(localUsers.entries()).find(([id, user]) => user.email === email);
        if (!userEntry) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [userId, user] = userEntry;

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        localUsers.set(userId, user);
        syncLocalUser(userId, user);

        console.log(`✅ Password reset for ${email}`);

        return res.status(200).json({
            message: 'Password reset successfully',
            success: true
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
