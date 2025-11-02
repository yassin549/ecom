# 🔧 Database Setup - Fix Connection Error

## ❌ Current Error
```
VercelPostgresError - 'missing_connection_string': 
You did not supply a 'connectionString' and no 'POSTGRES_URL' env var was found.
```

## ✅ Solution: Create `.env.local` File

### Step 1: Create Environment File

Create a file named `.env.local` in your project root:

**Location**: `c:\Users\khoua\OneDrive\Desktop\e-com\.env.local`

### Step 2: Add Database Connection String

Copy this template and fill in your database details:

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# Or if using Neon/Supabase pooler:
# DATABASE_URL="postgresql://username:password@pooler-host:port/database?sslmode=require"
# DIRECT_URL="postgresql://username:password@direct-host:port/database?sslmode=require"
```

### Step 3: Get Your Database URL

**Where is your database hosted?**

#### Option A: Neon (Recommended for Vercel)
1. Go to: https://console.neon.tech
2. Create a free account (if you don't have one)
3. Create a new project
4. Copy the connection string
5. Paste in `.env.local`

**Example Neon URLs**:
```env
DATABASE_URL="postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

#### Option B: Supabase
1. Go to: https://app.supabase.com
2. Go to Settings → Database
3. Copy "Connection string" (transaction pooler)
4. Copy "Direct connection" string
5. Replace `[YOUR-PASSWORD]` with your actual password

**Example Supabase URLs**:
```env
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
```

#### Option C: Local PostgreSQL
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"
```

#### Option D: Vercel Postgres
1. Go to Vercel Dashboard
2. Your Project → Storage → Create Database → Postgres
3. Copy environment variables
4. Add to `.env.local`

### Step 4: Create the `.env.local` File

**Using PowerShell**:
```powershell
# Navigate to project
cd c:\Users\khoua\OneDrive\Desktop\e-com

# Create .env.local file
New-Item -Path ".env.local" -ItemType File -Force

# Open in notepad
notepad .env.local
```

**Then paste your DATABASE_URL and DIRECT_URL**

### Step 5: Restart Dev Server

```powershell
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🚀 Quick Setup (If You Don't Have Database)

### Using Neon (Fastest - 2 Minutes)

1. **Go to**: https://console.neon.tech
2. **Sign up** with GitHub (free)
3. **Create Project**: 
   - Name: `ecommerce-store`
   - Region: Choose closest to you
   - Click "Create Project"
4. **Copy Connection String**:
   - You'll see: "Connection Details"
   - Copy the "Connection string"
   - It looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb`
5. **Create `.env.local`**:
   ```powershell
   cd c:\Users\khoua\OneDrive\Desktop\e-com
   notepad .env.local
   ```
6. **Paste** (replace with YOUR string):
   ```env
   DATABASE_URL="postgresql://your-neon-string-here"
   DIRECT_URL="postgresql://your-neon-string-here"
   ```
7. **Save** and close notepad
8. **Push Database Schema**:
   ```powershell
   npx prisma db push
   ```
9. **Restart Server**:
   ```powershell
   npm run dev
   ```

## 🎯 Verification

After creating `.env.local`, verify it works:

```powershell
# Test database connection
npx prisma db push

# Should see:
# ✓ Database schema pushed successfully
```

## 📝 Complete `.env.local` Template

```env
# PostgreSQL Database (REQUIRED)
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Next.js (Optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Auth (Optional - for future)
NEXTAUTH_SECRET="generate-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 🔒 Security Notes

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ Never share your DATABASE_URL publicly
- ✅ Use different databases for dev/production
- ✅ Rotate passwords regularly

## 🆘 Still Having Issues?

### Check if `.env.local` exists:
```powershell
Test-Path .env.local
# Should return: True
```

### View file contents (to verify):
```powershell
Get-Content .env.local
# Should show your DATABASE_URL
```

### Common Mistakes:

❌ **Wrong filename**: `.env` instead of `.env.local`
✅ **Correct**: `.env.local`

❌ **Quotes missing**: `DATABASE_URL=postgresql://...`
✅ **Correct**: `DATABASE_URL="postgresql://..."`

❌ **Wrong format**: Spaces around `=`
✅ **Correct**: `DATABASE_URL="..."` (no spaces)

❌ **Not restarting**: Server still running with old env
✅ **Correct**: Ctrl+C then `npm run dev`

## 📊 After Setup

Once `.env.local` is created and server restarted:

1. **Go to**: http://localhost:3000/admin/categories
2. **Should see**: Empty categories list (no errors)
3. **Create category**: Should work!
4. **Upload image**: Should work!

## 🎉 Expected Output

```
 ✓ Starting...
 ✓ Ready in 3.2s
 ○ Compiling /admin/categories ...
[GET /api/admin/categories] Fetching all categories...
[GET /api/admin/categories] Success - 0 categories (234ms)  ← This means it works!
 GET /api/admin/categories 200 in 1.2s
```

---

**Next Step**: Create `.env.local` with your DATABASE_URL, then restart the server!
