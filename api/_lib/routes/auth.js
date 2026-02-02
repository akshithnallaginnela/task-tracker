// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { syncLocalUser, localUsers } = require('../services/userService');
const { sendTaskNotification } = require('../services/emailService');

// Check if PostgreSQL is available
const isPostgresAvailable = !!User;

// Note: localUsers is now imported from userService for cross-module access

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', async (req, res) => {
  console.log('🔵 === SIGNUP REQUEST RECEIVED ===');
  console.log('Body:', req.body);

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // LOCAL MODE: Use in-memory storage
    if (!isPostgresAvailable) {
      console.log('🟡 LOCAL MODE: Checking for existing user...');

      // Check if user already exists
      const existingUser = Array.from(localUsers.values()).find(u => u.email === email);
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user ID
      const userId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Store user
      console.log('🟢 Creating new user:', email);
      const newUser = {
        id: userId,
        name,
        email,
        password: hashedPassword
      };
      localUsers.set(userId, newUser);
      syncLocalUser(userId, newUser); // Sync to userService
      console.log('✅ User stored in memory');
      console.log('Total users in memory:', localUsers.size);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, name: newUser.name },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Send welcome email
      console.log(`📧 Attempting to send welcome email to: ${email}`);
      try {
        const welcomeTask = {
          title: 'Welcome to Student Task Tracker!',
          description: `Hi ${name}, welcome aboard! Start organizing your tasks effectively.`,
          dueDate: new Date(),
          category: 'Welcome',
          priority: 'high'
        };
        await sendTaskNotification(email, welcomeTask, 'created');
        console.log(`✅ Welcome email sent to ${email}`);
      } catch (emailError) {
        console.error('❌ Failed to send welcome email:', emailError.message);
        console.error('Full error:', emailError);
        // Don't fail registration if email fails
      }

      return res.status(201).json({
        message: 'User created successfully (LOCAL MODE)',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      });
    }

    // PRODUCTION MODE: Use PostgreSQL
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // LOCAL MODE: Use in-memory storage
    if (!isPostgresAvailable) {
      // Find user
      const user = Array.from(localUsers.values()).find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.json({
        message: 'Login successful (LOCAL MODE)',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }

    // PRODUCTION MODE: Use PostgreSQL
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    // LOCAL MODE: Use in-memory storage
    if (!isPostgresAvailable) {
      const user = localUsers.get(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }

    // PRODUCTION MODE: Use PostgreSQL
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'name', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
