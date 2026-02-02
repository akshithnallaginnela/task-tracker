// Clear EVERYTHING script
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

async function clearEverything() {
    try {
        console.log('🧹 CLEARING ALL DATA...');
        console.log('=====================');
        console.log('');

        // ========== Clear MongoDB Tasks ==========
        console.log('📦 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Task = require('./models/Task');
        const taskResult = await Task.deleteMany({});
        console.log(`🗑️  Deleted ${taskResult.deletedCount} tasks from MongoDB`);

        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        console.log('');

        // ========== Try to Clear PostgreSQL Users ==========
        if (process.env.DATABASE_URL) {
            try {
                console.log('🗄️  Attempting to connect to PostgreSQL...');
                const sequelize = new Sequelize(process.env.DATABASE_URL, {
                    dialect: 'postgres',
                    logging: false
                });

                await sequelize.authenticate();
                console.log('✅ Connected to PostgreSQL');

                // Try to delete users
                await sequelize.query('DELETE FROM "Users"');
                console.log('🗑️  Deleted all users from PostgreSQL');

                await sequelize.close();
                console.log('✅ PostgreSQL connection closed');
            } catch (pgError) {
                console.log('⚠️  PostgreSQL not available or no users table (this is OK if using LOCAL MODE)');
            }
        } else {
            console.log('⚠️  PostgreSQL not configured (using LOCAL MODE)');
            console.log('   Users are stored in server memory and will clear on restart');
        }

        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('✅ ALL DATA CLEARED!');
        console.log('═══════════════════════════════════════');
        console.log('');
        console.log('📝 NEXT STEPS:');
        console.log('   1. ✅ MongoDB tasks - CLEARED');
        console.log('   2. ✅ Server memory - Will clear on restart');
        console.log('   3. ⏳ Browser localStorage - YOU need to clear:');
        console.log('      - Open http://localhost:5173');
        console.log('      - Press F12');
        console.log('      - Go to "Application" tab');
        console.log('      - Click "Local Storage" → http://localhost:5173');
        console.log('      - Click "Clear All"');
        console.log('      - Refresh page (F5)');
        console.log('');
        console.log('🚀 After clearing browser storage, restart the server:');
        console.log('   npm start');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearEverything();
