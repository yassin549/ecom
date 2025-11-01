# Prisma Vercel Deployment Fix

## Issue
Prisma Query Engine binary for `rhel-openssl-3.0.x` is not found on Vercel, causing category creation and other operations to fail.

## Root Cause
Vercel's serverless environment uses a different Linux distribution than what Prisma's default binary target expects. The binary needs to be included in the deployment package.

## Fixes Applied

### 1. Updated Prisma Schema Binary Targets
**File**: `prisma/schema.prisma`

Added `linux-musl-openssl-3.0.x` binary target which is compatible with Vercel's Alpine Linux-based runtime.

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x", "linux-musl-openssl-3.0.x"]
}
```

### 2. Improved Prisma Client Initialization
**File**: `lib/db/prisma.ts`

- Added lazy initialization to prevent crashes during serverless function cold starts
- Added error handling for Prisma initialization failures
- Better support for Vercel's serverless environment

### 3. Alternative Solution: Use SQL for Admin Routes

Since category creation already uses SQL (via `sql` from `@/lib/db`), it should work even if Prisma fails. However, other routes that use Prisma will fail.

## Next Steps

### Option 1: Regenerate Prisma Client (Recommended)

After updating the schema, regenerate Prisma Client locally and commit the generated files:

```bash
# Generate Prisma Client with new binary targets
npx prisma generate

# Commit the generated files
git add node_modules/.prisma
git commit -m "Update Prisma binary targets for Vercel"
git push
```

### Option 2: Ensure Postinstall Runs on Vercel

Verify that `postinstall` script in `package.json` runs during Vercel build:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

Both scripts are already in place.

### Option 3: Use Environment-Specific Database Access

For routes that must work reliably, use SQL instead of Prisma:

- ✅ Admin categories routes: Already using SQL
- ✅ Admin products routes: Already using SQL
- ⚠️ Other routes: Still using Prisma (may fail if binaries missing)

## Verification

After deployment, check:

1. **Category Creation**: Should work (uses SQL)
2. **Product Creation**: Should work (uses SQL)
3. **Order Routes**: May fail if Prisma binaries missing
4. **Stats Routes**: May fail if Prisma binaries missing

## If Issues Persist

If Prisma continues to fail on Vercel:

1. **Switch problematic routes to SQL**: Update routes that fail to use `sql` from `@/lib/db` instead of Prisma
2. **Use Prisma Data Proxy**: Consider using Prisma Accelerate for serverless deployments
3. **Check Vercel Build Logs**: Ensure `prisma generate` runs successfully during build

## Build Command Verification

The build command already includes Prisma generation:
```bash
"build": "prisma generate && next build"
```

And postinstall also runs:
```bash
"postinstall": "prisma generate"
```

This ensures Prisma Client is generated both during install and build phases.
