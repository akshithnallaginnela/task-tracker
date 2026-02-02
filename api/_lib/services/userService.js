const jwt = require('jsonwebtoken');
require('dotenv').config();

// In-memory user store (same as auth.js)
// This should ideally be a shared module, but for now we'll sync it
const localUsers = new Map();

// Helper function to get user email by userId
const getUserEmail = async (userId) => {
    try {
        // First, check if we have PostgreSQL User model
        try {
            const User = require('../models/User');
            if (User) {
                const user = await User.findByPk(userId);
                return user ? user.email : null;
            }
        } catch (err) {
            // PostgreSQL not available, use local storage
        }

        // LOCAL MODE: Check in-memory storage
        const user = localUsers.get(userId);
        return user ? user.email : null;
    } catch (error) {
        console.error('Error getting user email:', error);
        return null;
    }
};

// Helper to get user data from JWT token
const getUserFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        return decoded;
    } catch (error) {
        return null;
    }
};

// Export helper to sync local users from auth routes
const syncLocalUser = (userId, userData) => {
    localUsers.set(userId, userData);
};

module.exports = {
    getUserEmail,
    getUserFromToken,
    syncLocalUser,
    localUsers
};
