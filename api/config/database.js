const { Sequelize } = require('sequelize');
require('dotenv').config();

// Check if PostgreSQL is configured
const isPostgresConfigured = !!(
  process.env.DATABASE_URL || 
  (process.env.PG_PASSWORD && process.env.PG_DATABASE)
);

let sequelize = null;

// Only create PostgreSQL connection if configured
if (isPostgresConfigured) {
  // PostgreSQL connection for user authentication
  // Supports both connection string (Vercel/Neon) and individual parameters (local)
  sequelize = process.env.DATABASE_URL 
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false // For Neon/Vercel Postgres
          }
        },
        pool: {
          max: 3, // Reduced for serverless
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      })
    : new Sequelize(
        process.env.PG_DATABASE || 'tasktracker_users',
        process.env.PG_USER || 'postgres',
        process.env.PG_PASSWORD,
        {
          host: process.env.PG_HOST || 'localhost',
          port: process.env.PG_PORT || 5432,
          dialect: 'postgres',
          logging: false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      );
}

// Test connection only if PostgreSQL is configured
const testConnection = async () => {
  if (!sequelize) {
    console.log('⚠️  PostgreSQL not configured - Running in LOCAL MODE');
    console.log('   Auth features will use localStorage (development only)');
    console.log('   For production, set DATABASE_URL or PostgreSQL credentials in .env');
    return;
  }

  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL database synced');
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    console.log('⚠️  Running in LOCAL MODE without database persistence');
    console.log('   Set DATABASE_URL in .env for production deployment');
  }
};

testConnection();

module.exports = sequelize;
