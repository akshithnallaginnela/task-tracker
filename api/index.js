// Load environment variables FIRST!
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');
const authMiddleware = require('./middleware/auth');
const { initializeScheduler } = require('./services/schedulerService');
const { sendTaskNotification } = require('./services/emailService');

const app = express();

// CORS - Allow all origins (temporary for debugging)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log ALL incoming requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
}

// Connect to MongoDB (for tasks)
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Sync PostgreSQL database (for users) - only if configured
if (sequelize) {
    sequelize.sync({ alter: true })
        .catch((err) => console.error('❌ PostgreSQL sync error:', err.message));
}

app.get('/', (req, res) => {
    res.send('Task Tracker API is running');
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// OTP routes (public)
app.use('/api/otp', otpRoutes);
console.log('✅ Routes registered: /api/auth, /api/otp, /api/tasks');

// Get all tasks for a specific user
app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a task
app.post('/api/tasks', authMiddleware, async (req, res) => {
    const { title, description, dueDate, category, priority } = req.body;
    try {
        const newTask = new Task({
            title,
            description,
            dueDate,
            userId: req.user.userId,
            category: category || 'Other',
            priority: priority || 'medium'
        });
        await newTask.save();

        // Send email notification if enabled
        try {
            // Get user email from JWT or userService
            const userEmail = req.user.email || await require('./services/userService').getUserEmail(req.user.userId);

            if (userEmail) {
                await sendTaskNotification(userEmail, newTask, 'created');
                console.log(`✅ Task creation email sent to ${userEmail}`);
            }
        } catch (emailError) {
            console.error('❌ Email notification error:', emailError.message);
            // Don't fail the request if email fails
        }

        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a task
app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        Object.assign(task, req.body);
        await task.save();

        // Send email notification if task was completed
        try {
            if (req.user.email && req.body.isCompleted && !task.isCompleted) {
                await sendTaskNotification(req.user.email, task, 'completed');
            } else if (req.user.email) {
                await sendTaskNotification(req.user.email, task, 'updated');
            }
        } catch (emailError) {
            console.error('Email notification error:', emailError);
        }

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve static files from React build (for Render deployment)
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // SPA fallback - handle client-side routing with middleware
    app.use((req, res, next) => {
        // If no route matched and it's not an API route, serve index.html
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        } else {
            next();
        }
    });
}

const PORT = process.env.PORT || 5000;

// Only listen if not running as a serverless function
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        // Initialize email scheduler for reminders and weekly reports
        initializeScheduler();
    });
}

// Export for serverless (Vercel)
module.exports = app;
