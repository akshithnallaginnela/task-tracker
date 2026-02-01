# 🔧 Neon Connection String Fix

## Issue: Password Authentication Failed

The error `password authentication failed for user 'neondb_owner'` usually means we need to use the **direct** connection string instead of the pooled one.

## 📋 Get the Correct Connection String

### **Go to Neon Dashboard:**

1. Visit <https://console.neon.tech>
2. Click on your **"task-tracker"** project
3. Look for **"Connection Details"** or click **"Connect"**
4. You'll see **two** types of connection strings:

### **Option 1: Direct Connection** (Use This!)

```
postgresql://neondb_owner:npg_9ZOwe0gbxcJW@ep-lucky-sound-ahyqeost.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Notice: **NO `-pooler`** in the hostname

### **Option 2: Pooled Connection** (What you currently have)

```
postgresql://neondb_owner:npg_9ZOwe0gbxcJW@ep-lucky-sound-ahyqeost-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Notice: **HAS `-pooler`** in the hostname

## ✅ Solution

### **In Neon Dashboard:**

1. Look for a dropdown or tabs labeled:
   - **"Direct"**  ← Select this!
   - "Pooled"

2. OR look for an option called:
   - **"Connection string"**
   - **"Direct connection to database"**

3. Copy the connection string from the **Direct** option

### **The difference:**

**Current (Pooled):**

```
@ep-lucky-sound-ahyqeost-pooler.us-east-1.aws.neon.tech
                         ^^^^^^^ HAS THIS
```

**Should be (Direct):**

```
@ep-lucky-sound-ahyqeost.us-east-1.aws.neon.tech
                         NO -pooler
```

## 🎯 What to Do

1. Go to Neon dashboard
2. Find the **"Direct"** connection string
3. Copy it
4. Paste it here

I'll then update your `.env` file with the correct connection string!

---

**Why Direct vs Pooled?**

- **Direct**: Connects directly to the database (what Sequelize needs)
- **Pooled**: Uses Neon's connection pooler (better for serverless, but needs different config)

For local development and initial setup, **Direct** is simpler and more reliable.

---

**Created:** February 1, 2026
