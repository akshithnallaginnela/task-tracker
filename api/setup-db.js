#!/usr/bin/env node

/**
 * Database Setup Helper Script
 * Run this to generate JWT secret and validate environment variables
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 Task Tracker - Database Setup Helper\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('✅ Generated JWT Secret:');
console.log('━'.repeat(80));
console.log(jwtSecret);
console.log('━'.repeat(80));
console.log('\n📋 Copy this to your .env file as JWT_SECRET\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file found\n');
  
  // Read and validate
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'DATABASE_URL'
  ];
  
  const missingVars = [];
  requiredVars.forEach(varName => {
    const regex = new RegExp(`^${varName}=.+$`, 'm');
    if (!regex.test(envContent) || envContent.match(regex)[0].endsWith('=')) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing or empty environment variables:');
    missingVars.forEach(v => console.log(`   - ${v}`));
    console.log('\n📝 Please fill these in your .env file\n');
  } else {
    console.log('✅ All required environment variables are set!\n');
  }
} else {
  console.log('⚠️  .env file not found');
  console.log('📝 Please create .env file from .env.example\n');
}

console.log('📚 Quick Setup Guide:');
console.log('━'.repeat(80));
console.log('1. Neon PostgreSQL (Free):');
console.log('   → https://neon.tech');
console.log('   → Create project → Copy connection string → Set as DATABASE_URL\n');
console.log('2. MongoDB Atlas (Free):');
console.log('   → https://mongodb.com/atlas');
console.log('   → Create cluster → Get connection string → Set as MONGODB_URI\n');
console.log('3. Vercel Deployment:');
console.log('   → https://vercel.com');
console.log('   → Import GitHub repo → Add environment variables → Deploy\n');
console.log('━'.repeat(80));
console.log('\n📖 Full guide: See VERCEL_DEPLOYMENT.md\n');
