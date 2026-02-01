// Clear all data script
require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

async function clearAllData() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Delete all tasks
        const result = await Task.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} tasks`);

        console.log('✅ All data cleared!');
        console.log('');
        console.log('📝 Next steps:');
        console.log('   1. Clear browser localStorage (F12 → Application → Local Storage → Clear)');
        console.log('   2. Refresh the page');
        console.log('   3. Sign up with a new account to test emails!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearAllData();
