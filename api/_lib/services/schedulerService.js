const cron = require('node-cron');
const Task = require('../models/Task');
const { sendTaskReminder, sendWeeklyReport } = require('./emailService');

// Helper to get user email from task (we'll need to store it with tasks or get from JWT)
// For now, we'll use a simplified approach - users manage their own notifications via Settings

// Check for upcoming tasks and send reminders
const checkTaskReminders = async () => {
    try {
        console.log('🔔 Checking for task reminders...');

        // Get all incomplete tasks
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        const upcomingTasks = await Task.find({
            isCompleted: false,
            dueDate: {
                $gte: tomorrow,
                $lt: dayAfterTomorrow
            }
        });

        console.log(`Found ${upcomingTasks.length} tasks due tomorrow`);

        // Note: Email sending requires user emails to be stored with tasks
        // For now, logging what would be sent
        for (const task of upcomingTasks) {
            console.log(`⏰ Task reminder needed: "${task.title}" (User ID: ${task.userId})`);
            // TODO: Send reminder when user email is available
            // await sendTaskReminder(userEmail, task);
        }

        console.log('✅ Task reminder check complete');
    } catch (error) {
        console.error('❌ Error in task reminder check:', error);
    }
};

// Generate and send weekly reports
const sendWeeklyReports = async () => {
    try {
        console.log('📊 Generating weekly reports...');

        // Get unique user IDs from tasks
        const userIds = await Task.distinct('userId');
        console.log(`Found ${userIds.length} users with tasks`);

        for (const userId of userIds) {
            // Get all tasks for the user
            const allTasks = await Task.find({ userId });

            // Calculate stats
            const stats = {
                totalTasks: allTasks.length,
                completed: allTasks.filter(t => t.isCompleted).length,
                pending: allTasks.filter(t => !t.isCompleted && new Date(t.dueDate) >= new Date()).length,
                overdue: allTasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date()).length,
                completionRate: allTasks.length > 0
                    ? Math.round((allTasks.filter(t => t.isCompleted).length / allTasks.length) * 100)
                    : 0
            };

            console.log(`📊 User ${userId} stats:`, stats);
            // TODO: Send weekly report when user email is available
            // await sendWeeklyReport(userEmail, userName, stats);
        }

        console.log('✅ Weekly report preparation complete');
    } catch (error) {
        console.error('❌ Error preparing weekly reports:', error);
    }
};

// Initialize cron jobs
const initializeScheduler = () => {
    console.log('⏰ Initializing task scheduler...');

    // Check for task reminders every day at 9:00 AM
    cron.schedule('0 9 * * *', () => {
        console.log('⏰ Running daily task reminder check at 9:00 AM');
        checkTaskReminders();
    });

    // Send weekly reports every Monday at 8:00 AM
    cron.schedule('0 8 * * 1', () => {
        console.log('📊 Running weekly report generation on Monday at 8:00 AM');
        sendWeeklyReports();
    });

    // Optional: Check for reminders every 6 hours for tasks due soon
    cron.schedule('0 */6 * * *', () => {
        console.log('⏰ Running 6-hour task reminder check');
        checkTaskReminders();
    });

    console.log('✅ Scheduler initialized');
    console.log('   📅 Daily reminders: 9:00 AM');
    console.log('   📅 Weekly reports: Monday 8:00 AM');
    console.log('   📅 6-hour checks: Every 6 hours');
};

// Manual trigger functions for testing
const triggerTaskReminders = async () => {
    console.log('🔔 Manually triggering task reminders...');
    await checkTaskReminders();
};

const triggerWeeklyReports = async () => {
    console.log('📊 Manually triggering weekly reports...');
    await sendWeeklyReports();
};

module.exports = {
    initializeScheduler,
    triggerTaskReminders,
    triggerWeeklyReports,
    checkTaskReminders,
    sendWeeklyReports
};
