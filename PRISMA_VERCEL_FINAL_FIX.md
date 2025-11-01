# Prisma Vercel Deployment - FINAL FIX

## The Real Problem
Vercel's serverless functions can't find the Prisma query engine binary. This is a known issue with Prisma + Vercel + Next.js 15+.

## Solution Applied

### Changes Made:

1. **Simplified Prisma Schema** (`prisma/schema.prisma`)
   - Removed explicit output path
   - Added driverAdapters preview feature
   - Kept only necessary binary target

2. **Simplified Build Scripts** (`package.json`)
   - Removed complex build commands
   - Let postinstall handle Prisma generation

3. **Updated Next.js Config** (`next.config.ts`)
   - Removed standalone output
   - Added webpack externals for Prisma
   - Kept serverExternalPackages

4. **Updated Vercel Config** (`vercel.json`)
   - Simplified functions configuration
   - Included both Prisma client paths

## Deployment Instructions

### Step 1: Commit All Changes
```bash
git add .
git commit -m "Fix Prisma deployment on Vercel"
git push
```

### Step 2: Clear Vercel Cache (IMPORTANT!)
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → General
4. Scroll to "Build & Development Settings"
5. Click "Clear Build Cache"

### Step 3: Trigger New Deployment
Option A: Push a new commit
Option B: Go to Deployments → Click "..." → Redeploy

### Step 4: Monitor Build Logs
Watch for:
- ✅ "prisma generate" runs successfully
- ✅ Binary files are generated
- ✅ No "Query Engine not found" errors

## Alternative Solution: Use Prisma Accelerate

If the above doesn't work, use Prisma Accelerate (recommended for production):

### 1. Sign up for Prisma Accelerate
```bash
npx prisma@latest accelerate
```

### 2. Update DATABASE_URL in Vercel
Replace your DATABASE_URL with the Accelerate connection string

### 3. Update Prisma Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 4. Remove Binary Targets
No need for binary targets with Accelerate!

## Testing After Deployment

### Test 1: Check API Health
```bash
curl https://your-domain.vercel.app/api/categories
```

### Test 2: Check Vercel Function Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to "Functions" tab
4. Click on any API function
5. Check logs for Prisma errors

### Test 3: Test Category Creation
1. Login to admin
2. Go to /admin/categories
3. Create a category
4. Check browser console and network tab

## Common Issues & Solutions

### Issue: Still getting engine error after deployment

**Solution 1: Force Clean Build**
```bash
# Delete node_modules and lock file locally
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Force clean install"
git push
```

**Solution 2: Use Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

**Solution 3: Check Environment Variables**
Make sure these are set in Vercel:
- DATABASE_URL (must be connection pooling URL)
- DIRECT_URL (direct connection for migrations)

### Issue: Build succeeds but runtime error

**Check:**
1. Is DATABASE_URL correct?
2. Is database accessible from Vercel?
3. Are tables created? (Run `npx prisma db push` locally first)

### Issue: Works locally but not on Vercel

**This means:**
- Binary target mismatch
- Try Prisma Accelerate instead

## Environment Variables Checklist

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

## Prisma Accelerate Setup (Recommended)

If traditional deployment keeps failing, use Accelerate:

### 1. Enable Accelerate
```bash
npx prisma@latest accelerate
```

### 2. Get Connection String
Follow the prompts to get your Accelerate connection string

### 3. Update Vercel Environment Variable
Replace DATABASE_URL with the Accelerate URL:
```
DATABASE_URL=prisma://accelerate.prisma-data.net/?api_key=your-key
```

### 4. Update Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. Deploy
```bash
git add .
git commit -m "Switch to Prisma Accelerate"
git push
```

## Benefits of Prisma Accelerate

✅ No binary engine issues
✅ Built-in connection pooling
✅ Global caching
✅ Better performance
✅ Easier deployment
✅ Works perfectly with serverless

## Verification Steps

After deployment, verify:

1. **Homepage loads** - No errors
2. **Admin dashboard** - Can access
3. **Categories API** - Returns data
   ```bash
   curl https://your-domain.vercel.app/api/categories
   ```
4. **Create category** - Works without errors
5. **Create product** - Categories show in dropdown
6. **No Prisma errors** - Check Vercel function logs

## If Nothing Works

### Last Resort: Contact Support

1. **Vercel Support**
   - Include deployment logs
   - Include function logs
   - Mention Prisma version

2. **Prisma Discord**
   - #help-and-questions channel
   - Provide schema and error logs

3. **GitHub Issues**
   - Check Prisma GitHub issues
   - Search for "Vercel deployment"

## Success Indicators

You'll know it's fixed when:
- ✅ No "Query Engine not found" errors
- ✅ Categories API returns JSON
- ✅ Can create categories
- ✅ Can create products
- ✅ All database operations work
- ✅ No errors in Vercel logs

## Next Steps

Once working:
1. Test all database operations
2. Create initial data
3. Monitor Vercel logs
4. Set up error tracking (Sentry)
5. Consider Prisma Accelerate for production

## Important Notes

- Vercel uses AWS Lambda (RHEL runtime)
- Prisma needs correct binary for Lambda
- Accelerate bypasses binary issues entirely
- Connection pooling is crucial for serverless
- Use `?pgbouncer=true` in DATABASE_URL

## Quick Commands Reference

```bash
# Clear local cache
rm -rf node_modules .next
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Deploy to Vercel
vercel --prod

# Check Vercel logs
vercel logs [deployment-url]
```

## Final Recommendation

**Use Prisma Accelerate for production deployments on Vercel.**

It eliminates all binary engine issues and provides better performance with built-in caching and connection pooling.
