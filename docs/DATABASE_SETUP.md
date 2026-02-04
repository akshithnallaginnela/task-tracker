# Task Tracker - Database Setup Guide

## Overview
This application uses **two databases**:
- **PostgreSQL**: For user authentication (email, password, user profile)
- **MongoDB Atlas**: For tasks storage (user-specific tasks)

## Setting Up PostgreSQL

### Option 1: Install PostgreSQL Locally

1. **Download PostgreSQL**:
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL**:
   ```bash
   # Windows (if installed as service, it starts automatically)
   # Mac
   brew services start postgresql
   # Linux
   sudo service postgresql start
   ```

3. **Create Database**:
   ```bash
   # Access PostgreSQL shell
   psql -U postgres
   
   # Create database
   CREATE DATABASE tasktracker_users;
   
   # Exit
   \q
   ```

4. **Update .env file** in `/api`:
   ```env
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=tasktracker_users
   PG_USER=postgres
   PG_PASSWORD=your_password_here
   ```

### Option 2: Use Cloud PostgreSQL (Recommended for Production)

**Neon.tech (Free Tier)**:
1. Go to https://neon.tech/
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Update `.env`:
   ```env
   PG_HOST=your-project.neon.tech
   PG_PORT=5432
   PG_DATABASE=neondb
   PG_USER=your_username
   PG_PASSWORD=your_password
   ```

**Supabase (Free Tier)**:
1. Go to https://supabase.com/
2. Create new project
3. Go to Settings > Database
4. Copy connection details
5. Update `.env` accordingly

## Setting Up MongoDB Atlas

1. **Create MongoDB Atlas Account**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create a Cluster**:
   - Choose free tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Grant "Read and write to any database" permissions

4. **Configure Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String**:
   - Go to "Database" > "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env file** in `/api`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tasktracker?retryWrites=true&w=majority
   ```

## JWT Secret

Generate a secure random string for JWT authentication:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use any random string generator
```

Update `.env`:
```env
JWT_SECRET=your_generated_secret_key_here
JWT_EXPIRES_IN=7d
```

## Complete .env Example

```env
# MongoDB Atlas (for tasks)
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/tasktracker?retryWrites=true&w=majority

# PostgreSQL (for user authentication)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=tasktracker_users
PG_USER=postgres
PG_PASSWORD=mysecurepassword

# JWT Configuration
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=7d

# Server
PORT=5000
```

## Running the Application

1. **Install backend dependencies**:
   ```bash
   cd api
   npm install
   ```

2. **Start backend server**:
   ```bash
   npm start
   ```

3. **Install frontend dependencies**:
   ```bash
   cd client
   npm install
   ```

4. **Start frontend**:
   ```bash
   npm run dev
   ```

## Verification

### Test PostgreSQL Connection:
The server will log on startup:
```
✅ PostgreSQL connection established successfully.
✅ PostgreSQL database synced
```

### Test MongoDB Connection:
The server will log:
```
✅ Connected to MongoDB Atlas
```

### Test Authentication:
1. Sign up with a new account
2. Check PostgreSQL for user entry:
   ```sql
   SELECT * FROM users;
   ```

### Test Tasks:
1. Create a task
2. Check MongoDB Atlas:
   - Go to "Collections"
   - View "tasks" collection
   - Verify userId field is populated

## Troubleshooting

**PostgreSQL Connection Failed**:
- Check if PostgreSQL service is running
- Verify credentials in `.env`
- Check firewall settings

**MongoDB Connection Failed**:
- Verify connection string is correct
- Check network access settings in Atlas
- Ensure password doesn't contain special characters (URL encode if needed)

**JWT Errors**:
- Ensure JWT_SECRET is set in `.env`
- Clear localStorage and try login again
- Check server logs for details

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` file to Git
- Use strong passwords for database users
- Generate a secure random JWT_SECRET
- In production, restrict MongoDB network access to your server IP only
- Use environment variables in production (Vercel, Heroku, etc.)
