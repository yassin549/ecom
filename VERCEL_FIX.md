# Vercel Prisma Deployment Fix

## Issues Fixed

### 1. **Prisma Query Engine Error**
- **Problem**: Prisma Client couldn't locate the Query Engine for Vercel's runtime
- **Root Cause**: Conflicting webpack configuration and missing binary targets
- **Solution**: Updated `next.config.ts` and `schema.prisma`

### 2. **Build Errors**
- **Problem**: Routes importing wrong database modules
- **Solution**: Standardized database imports across the codebase

## Changes Made

### 1. `next.config.ts`
- ✅ Removed conflicting webpack externals configuration
- ✅ Kept `serverExternalPackages` for proper Prisma handling

### 2. `prisma/schema.prisma`
- ✅ Set correct binary targets: `["native", "rhel-openssl-3.0.x"]`
- ✅ Added `previewFeatures = []` for stability

### 3. `vercel.json`
- ✅ Added Prisma build environment variables
- ✅ Set `PRISMA_CLI_BINARY_TARGETS` to ensure correct binary generation

### 4. `app/api/categories/route.ts`
- ✅ Converted from Prisma to `simple-db` for consistency

## Deployment Steps

### Step 1: Regenerate Prisma Client Locally
```powershell
# Navigate to your project
cd c:\Users\khoua\OneDrive\Desktop\e-com

# Clear existing Prisma artifacts
Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\@prisma" -Recurse -Force -ErrorAction SilentlyContinue

# Reinstall and regenerate
npm install --legacy-peer-deps
npx prisma generate
```

### Step 2: Verify Environment Variables on Vercel
Make sure these are set in your Vercel project settings:
- `DATABASE_URL` - Your database connection string
- `DIRECT_URL` - Your direct database connection (for migrations)

### Step 3: Deploy to Vercel
```powershell
# Commit all changes
git add .
git commit -m "fix: Resolve Prisma deployment issues on Vercel"
git push origin main

# Or deploy directly
npx vercel --prod
```

### Step 4: Verify Deployment
1. Check Vercel build logs for successful Prisma generation
2. Test creating a category via admin dashboard
3. Test creating a product via admin dashboard

## Understanding the Database Architecture

Your app uses two database layers:

### `lib/db.ts`
- **Purpose**: Hybrid Prisma/SQL layer (legacy)
- **Exports**: `sql` function and `db` object
- **Used by**: Older routes that haven't been migrated

### `lib/db/simple-db.ts`
- **Purpose**: Pure SQL layer using `@vercel/postgres`
- **Exports**: `categories`, `products`, `sqlTemplate`
- **Used by**: Admin routes (categories, products)
- **Advantage**: No Prisma query engine required

## Routes Status

✅ **Using simple-db (Working)**:
- `/api/admin/categories` - GET, POST
- `/api/admin/products` - GET, POST, DELETE
- `/api/categories` - GET (just updated)

⚠️ **Still using Prisma** (Should work after fixes):
- `/api/products` - Complex filtering/pagination
- `/api/cart/*`
- `/api/orders/*`
- Other API routes

## If You Still Experience Issues

### Option 1: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Check "Build Logs" for Prisma generation
4. Check "Runtime Logs" for any Prisma errors

### Option 2: Force Clean Deploy
```powershell
# Delete .next and node_modules
Remove-Item -Path ".next" -Recurse -Force
Remove-Item -Path "node_modules" -Recurse -Force

# Reinstall everything
npm install --legacy-peer-deps
npm run build

# Test locally before deploying
npm run dev
```

### Option 3: Convert More Routes to simple-db
If Prisma continues to cause issues, consider converting remaining routes to use `simple-db` for better Vercel compatibility.

## Testing Checklist

After deployment, test these flows:

- [ ] Admin Dashboard loads without errors
- [ ] Can view categories list in admin
- [ ] Can create new category with image
- [ ] Can view products list in admin
- [ ] Can create new product with image
- [ ] Products display correctly on storefront
- [ ] Categories display correctly on storefront
- [ ] No 500 errors in Vercel logs

## Support Resources

- [Prisma Vercel Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Prisma Setup](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
