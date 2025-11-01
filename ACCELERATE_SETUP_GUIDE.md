# Prisma Accelerate Setup - Complete Guide

## What I've Done

✅ Added `@prisma/extension-accelerate` to package.json
✅ Updated Prisma client to use Accelerate extension
✅ Simplified Prisma schema

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

This will install the new `@prisma/extension-accelerate` package.

### Step 2: Get Prisma Accelerate Connection String

#### Option A: Use Prisma Platform (Recommended)

1. Go to https://console.prisma.io/
2. Sign in with GitHub
3. Click "New Project" or select existing project
4. Click "Enable Accelerate"
5. You'll get a connection string like:
   ```
   prisma://accelerate.prisma-data.net/?api_key=eyJhbGc...
   ```
6. Copy this connection string

#### Option B: Use Your Current Database with Connection Pooling

If you don't want to use Prisma Accelerate platform, just ensure your DATABASE_URL uses connection pooling:

```
postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1
```

### Step 3: Update Vercel Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update these variables:

**If using Prisma Accelerate:**
```
DATABASE_URL=prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
DIRECT_URL=postgresql://your-direct-connection-string
```

**If using regular database with pooling:**
```
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://user:pass@host:5432/db
```

5. Click "Save"

### Step 4: Regenerate Prisma Client Locally

```bash
npx prisma generate
```

### Step 5: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000/admin/categories and try creating a category.

### Step 6: Deploy to Vercel

```bash
git add .
git commit -m "Setup Prisma Accelerate"
git push
```

### Step 7: Clear Vercel Build Cache (Important!)

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Scroll to "Build & Development Settings"
5. Click **"Clear Build Cache"**
6. Go back to **Deployments**
7. Click **"Redeploy"** on the latest deployment

## How It Works Now

The code now uses Prisma Accelerate extension which:
- ✅ Works without binary engines
- ✅ Provides connection pooling
- ✅ Adds caching layer
- ✅ Works perfectly on Vercel serverless

## Testing After Deployment

### Test 1: Check API
```bash
curl https://your-domain.vercel.app/api/categories
```
Should return JSON (empty array or categories)

### Test 2: Create Category
1. Login to admin: https://your-domain.vercel.app/admin
2. Go to Categories
3. Click "Nouvelle Catégorie"
4. Fill form and submit
5. Should work without errors!

### Test 3: Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to "Functions" tab
4. Check logs - should see no Prisma errors

## Environment Variables You Need

Make sure these are set in Vercel:

```env
# Database (choose one approach)
DATABASE_URL=prisma://accelerate... OR postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://direct-connection

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Optional
NODE_ENV=production
```

## Troubleshooting

### Issue: "Cannot find module '@prisma/extension-accelerate'"

**Solution:**
```bash
npm install
npx prisma generate
git add .
git commit -m "Install dependencies"
git push
```

### Issue: "Invalid connection string"

**Solution:** Check your DATABASE_URL format:
- Accelerate: `prisma://accelerate.prisma-data.net/?api_key=...`
- Regular: `postgresql://user:pass@host:5432/db?pgbouncer=true`

### Issue: Still getting binary engine error

**Solution:** 
1. Clear Vercel build cache
2. Make sure you pushed the latest code
3. Redeploy

### Issue: Works locally but not on Vercel

**Solution:**
1. Verify DATABASE_URL is set in Vercel (not just .env.local)
2. Clear build cache
3. Redeploy

## What Changed in Your Code

### Before:
```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### After:
```typescript
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

function createPrismaClient() {
  const client = new PrismaClient()
  return client.$extends(withAccelerate())
}

export const prisma = createPrismaClient()
```

## Benefits You Get

1. **No Binary Engine Issues** - Works on any platform
2. **Connection Pooling** - Efficient database connections
3. **Query Caching** - Faster response times
4. **Better Performance** - Optimized for serverless
5. **Global CDN** - Low latency worldwide (with Prisma Accelerate)

## Cost

- **Prisma Accelerate Free Tier:**
  - 1 million queries/month
  - Perfect for development and small apps
  
- **Your Current Database:**
  - No additional cost
  - Just uses the extension for better compatibility

## Next Steps

1. **Install dependencies:** `npm install`
2. **Choose your approach:**
   - Use Prisma Accelerate (get API key from console.prisma.io)
   - OR use your current database with pooling URL
3. **Update DATABASE_URL in Vercel**
4. **Clear build cache**
5. **Deploy:** `git push`
6. **Test:** Create a category in admin

## Quick Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Test locally
npm run dev

# Deploy
git add .
git commit -m "Setup Prisma Accelerate"
git push

# Check deployment logs
vercel logs [deployment-url]
```

## Success Indicators

You'll know it's working when:
- ✅ No "Query Engine not found" errors
- ✅ `/api/categories` returns JSON
- ✅ Can create categories in admin
- ✅ Can create products with categories
- ✅ All database operations work smoothly

## Support

If you still have issues:
1. Check Vercel deployment logs
2. Verify DATABASE_URL format
3. Make sure dependencies are installed
4. Clear build cache and redeploy

The setup is now complete! Just follow the steps above and it should work perfectly on Vercel! 🚀
