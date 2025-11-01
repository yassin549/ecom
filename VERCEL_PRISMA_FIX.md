# Vercel Prisma Deployment Fix

## Problem
Prisma Query Engine not found on Vercel deployment, causing categories and other database operations to fail.

Error:
```
Prisma Client could not locate the Query Engine for runtime "rhel-openssl-3.0.x"
```

## Solution Applied

### 1. Updated Prisma Schema (`prisma/schema.prisma`)
Added explicit output path and binary targets:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]
  output = "../node_modules/.prisma/client"
}
```

### 2. Updated Build Scripts (`package.json`)
Ensured Prisma generates and pushes schema before building:
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push --skip-generate && next build",
    "vercel-build": "prisma generate && prisma db push --skip-generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### 3. Updated Vercel Configuration (`vercel.json`)
Made Prisma client inclusion more explicit:
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10,
      "includeFiles": "node_modules/.prisma/client/**"
    },
    "app/**/*.tsx": {
      "maxDuration": 10,
      "includeFiles": "node_modules/.prisma/client/**"
    }
  }
}
```

## Deployment Steps

### Step 1: Commit Changes
```bash
git add .
git commit -m "Fix Prisma engine deployment on Vercel"
git push
```

### Step 2: Redeploy on Vercel
The deployment will automatically trigger. Vercel will:
1. Run `npm install --legacy-peer-deps`
2. Run `postinstall` → `prisma generate`
3. Run `build` → `prisma generate && prisma db push && next build`
4. Include Prisma engine files in serverless functions

### Step 3: Verify Deployment
1. Wait for deployment to complete
2. Check deployment logs for any errors
3. Test category creation at `/admin/categories`
4. Test product creation at `/admin/products`

## Environment Variables Required

Make sure these are set in Vercel:
- `DATABASE_URL` - Your PostgreSQL connection string
- `DIRECT_URL` - Direct database URL (for migrations)
- `NEXTAUTH_SECRET` - Your NextAuth secret
- `NEXTAUTH_URL` - Your production URL

## Testing After Deployment

### Test 1: Categories API
```bash
curl https://your-domain.vercel.app/api/categories
```
Should return JSON array of categories (or empty array if none exist)

### Test 2: Create Category (Admin)
1. Login to admin dashboard
2. Go to Categories page
3. Click "Nouvelle Catégorie"
4. Fill form and submit
5. Should see success message and category in list

### Test 3: Product Creation
1. Go to Products page
2. Click "Nouveau Produit"
3. Category dropdown should show your categories
4. Create product successfully

## Common Issues & Solutions

### Issue 1: Still getting engine error
**Solution**: Clear Vercel build cache
1. Go to Vercel Dashboard
2. Project Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Clear Build Cache"
5. Redeploy

### Issue 2: Database connection error
**Solution**: Check environment variables
1. Verify `DATABASE_URL` is correct
2. Verify `DIRECT_URL` is set
3. Make sure database is accessible from Vercel's IP ranges

### Issue 3: Prisma schema not updated
**Solution**: Force regenerate
```bash
# Locally
npx prisma generate --force
npx prisma db push

# Then commit and push
git add .
git commit -m "Force Prisma regeneration"
git push
```

### Issue 4: Build timeout
**Solution**: Increase function timeout in vercel.json
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Verification Checklist

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] Admin login works
- [ ] Categories page loads (`/admin/categories`)
- [ ] Can create new category
- [ ] Categories appear in product form dropdown
- [ ] Can create new product with category
- [ ] Public categories page shows categories (`/categories`)
- [ ] No Prisma errors in Vercel logs

## Additional Notes

### Binary Targets
We include multiple binary targets to support different environments:
- `native` - Local development
- `rhel-openssl-3.0.x` - Vercel (AWS Lambda)
- `debian-openssl-3.0.x` - Some Docker environments

### Build Process
The build process now:
1. Generates Prisma Client with all binary targets
2. Pushes schema to database (creates tables if needed)
3. Builds Next.js application
4. Includes Prisma engine files in deployment

### Performance
- Prisma Client is generated once during build
- Engine files are included in serverless functions
- No runtime generation needed
- Fast cold starts

## If All Else Fails

### Nuclear Option: Fresh Deployment
1. Delete the project from Vercel
2. Reconnect GitHub repository
3. Set all environment variables
4. Deploy fresh

### Contact Support
If issues persist:
1. Check Vercel status page
2. Review Vercel deployment logs
3. Check Prisma GitHub issues
4. Contact Vercel support with deployment logs

## Success Indicators

You'll know it's working when:
✅ No Prisma engine errors in logs
✅ Categories API returns data
✅ Can create categories in admin
✅ Categories show in product form
✅ Database operations work smoothly
✅ No "Query Engine not found" errors

## Next Steps After Fix

1. Test all database operations
2. Create initial categories
3. Create test products
4. Verify public pages work
5. Monitor Vercel logs for any issues
6. Set up error tracking (Sentry) for production monitoring
