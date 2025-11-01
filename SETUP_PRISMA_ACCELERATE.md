# Setup Prisma Accelerate - Step by Step

## Why Prisma Accelerate?

The binary engine issue on Vercel is a persistent problem. **Prisma Accelerate** completely eliminates this by:
- ✅ No binary engines needed
- ✅ Built-in connection pooling
- ✅ Global caching layer
- ✅ Works perfectly with serverless
- ✅ Better performance

## Step-by-Step Setup

### Step 1: Sign Up for Prisma Accelerate

1. Go to https://console.prisma.io/
2. Sign in with GitHub
3. Create a new project or select existing
4. Click "Enable Accelerate"

### Step 2: Get Your Accelerate Connection String

After enabling Accelerate, you'll get a connection string like:
```
prisma://accelerate.prisma-data.net/?api_key=eyJhbGc...
```

**Important:** Keep this API key secret!

### Step 3: Update Vercel Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update `DATABASE_URL`:
   ```
   DATABASE_URL=prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
   ```
5. Keep `DIRECT_URL` as your direct PostgreSQL connection:
   ```
   DIRECT_URL=postgresql://user:pass@host:5432/database
   ```

### Step 4: Update Local Environment

Update your `.env.local`:
```env
# For local development, use direct connection
DATABASE_URL=postgresql://user:pass@localhost:5432/database
DIRECT_URL=postgresql://user:pass@localhost:5432/database

# For production (Vercel), use Accelerate
# DATABASE_URL=prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY
```

### Step 5: Regenerate Prisma Client

```bash
npx prisma generate
```

### Step 6: Commit and Deploy

```bash
git add .
git commit -m "Setup Prisma Accelerate for Vercel"
git push
```

## Alternative: Use @vercel/postgres

If you're using Vercel Postgres, you can use their adapter:

### Step 1: Install Dependencies

```bash
npm install @prisma/adapter-neon @neondatabase/serverless
```

### Step 2: Update Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Update Prisma Client Initialization

Create `lib/db/prisma-edge.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL!

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

export { prisma }
```

### Step 4: Use in API Routes

```typescript
import { prisma } from '@/lib/db/prisma-edge'

export async function GET() {
  const categories = await prisma.category.findMany()
  return Response.json(categories)
}
```

## Simplest Solution: Use Vercel Postgres

If you're not using a database yet:

### Step 1: Create Vercel Postgres Database

1. Go to Vercel Dashboard
2. Select your project
3. Go to Storage tab
4. Click "Create Database"
5. Select "Postgres"
6. Follow the setup wizard

### Step 2: Connect to Your Project

Vercel will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### Step 3: Update .env.local

```env
DATABASE_URL=your_postgres_prisma_url
DIRECT_URL=your_postgres_url_non_pooling
```

### Step 4: Push Schema

```bash
npx prisma db push
```

### Step 5: Deploy

```bash
git push
```

## Testing After Setup

### Test 1: Local Development

```bash
npm run dev
# Visit http://localhost:3000/admin/categories
# Try creating a category
```

### Test 2: Production

```bash
# After deployment
curl https://your-domain.vercel.app/api/categories
```

Should return JSON array (empty or with categories)

### Test 3: Create Category

1. Login to admin
2. Go to /admin/categories
3. Click "Nouvelle Catégorie"
4. Fill form and submit
5. Should work without errors!

## Troubleshooting

### Issue: "Invalid connection string"

**Solution:** Make sure DATABASE_URL is correctly set in Vercel

### Issue: "Connection timeout"

**Solution:** Check your database is accessible from Vercel's IP ranges

### Issue: "Table does not exist"

**Solution:** Run migrations:
```bash
npx prisma db push
```

## Current Configuration

I've already updated your schema to the simplest form:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## What You Need to Do NOW

### Option 1: Use Prisma Accelerate (Recommended)

1. Go to https://console.prisma.io/
2. Enable Accelerate
3. Get your connection string
4. Update DATABASE_URL in Vercel
5. Deploy

### Option 2: Use Vercel Postgres (Easiest)

1. Create Vercel Postgres database in dashboard
2. Vercel auto-configures environment variables
3. Run `npx prisma db push`
4. Deploy

### Option 3: Check Your Current Database URL

Your current DATABASE_URL might already work! Try:

1. Make sure DATABASE_URL in Vercel is a **connection pooling URL**
2. Should end with `?pgbouncer=true` or similar
3. Example:
   ```
   postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1
   ```

## Quick Fix Commands

```bash
# 1. Regenerate Prisma Client
npx prisma generate

# 2. Push schema to database
npx prisma db push

# 3. Commit changes
git add .
git commit -m "Fix Prisma configuration"
git push

# 4. Check Vercel logs after deployment
vercel logs [deployment-url]
```

## Environment Variables Checklist

Make sure these are set in Vercel:

```
✅ DATABASE_URL - Connection pooling URL or Accelerate URL
✅ DIRECT_URL - Direct database connection (for migrations)
✅ NEXTAUTH_SECRET - Your auth secret
✅ NEXTAUTH_URL - Your production URL
```

## Success Indicators

After deployment, you should see:
- ✅ No Prisma errors in Vercel logs
- ✅ `/api/categories` returns JSON
- ✅ Can create categories in admin
- ✅ Categories show in product form
- ✅ All database operations work

## Need Help?

If still not working:
1. Share your Vercel deployment logs
2. Share your DATABASE_URL format (without password)
3. Confirm your database provider (Vercel Postgres, Neon, Supabase, etc.)

I can provide specific instructions based on your setup!
