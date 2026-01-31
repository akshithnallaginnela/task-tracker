const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }
        
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTask);
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

const PORT = process.env.PORT || 5000;

// Only listen if not running as a serverless function
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for serverless (Vercel)
module.exports = app;
