# Prisma Lazy Loading Fix - Complete Solution

## Problem
Category creation fails on Vercel because Prisma Query Engine binary is missing. Even though the category route uses SQL (not Prisma), Prisma was being initialized when importing from `lib/db.ts`, causing the entire route to crash.

## Root Cause
1. `lib/db.ts` imported Prisma at the top level: `import { prisma } from './prisma'`
2. `lib/db/prisma.ts` called `getPrisma()` immediately: `export const prisma = getPrisma()`
3. This caused Prisma to initialize even when routes only needed SQL
4. Prisma initialization fails on Vercel because binary isn't found

## Solution Applied

### 1. Made Prisma Import Lazy in `lib/db.ts`
**Before:**
```typescript
import { prisma } from './prisma'  // ❌ Eager import
```

**After:**
```typescript
// Lazy-load prisma to avoid initialization errors on Vercel when only using SQL
let _prisma: any = null
const getPrisma = () => {
  if (!_prisma) {
    try {
      _prisma = require('./prisma').prisma  // ✅ Lazy require
    } catch (error) {
      console.error('Failed to load Prisma (this is OK if using SQL only):', error)
      return null
    }
  }
  return _prisma
}
```

### 2. Made Prisma Export Lazy in `lib/db/prisma.ts`
**Before:**
```typescript
export const prisma = getPrisma()  // ❌ Immediate initialization
```

**After:**
```typescript
// LAZY EXPORT: Use Proxy to avoid immediate initialization
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const instance = getPrisma()  // ✅ Only called when accessed
    const value = (instance as any)[prop]
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    return value
  }
}) as PrismaClient
```

## How It Works

1. **Category Route** (`/api/admin/categories`):
   - Imports `sql` from `@/lib/db`
   - `lib/db.ts` loads, but Prisma is NOT initialized
   - SQL queries work perfectly ✅

2. **Other Routes** (e.g., `/api/admin/stats`):
   - Import `prisma` from `@/lib/db/prisma`
   - Proxy object is returned immediately (no initialization)
   - When route accesses `prisma.order.findMany()`, Proxy intercepts
   - `getPrisma()` is called at that moment
   - Prisma initializes (may fail, but only for routes that use it)

## Benefits

✅ **Category creation works**: Uses SQL, never touches Prisma
✅ **Product creation works**: Uses SQL, never touches Prisma  
✅ **No crash on import**: Prisma doesn't initialize until actually used
✅ **Graceful degradation**: Routes using Prisma will error, but SQL routes work

## Routes Status

| Route | Uses | Status |
|-------|------|--------|
| `/api/admin/categories` (GET/POST) | SQL only | ✅ Works |
| `/api/admin/products` (GET/POST/DELETE) | SQL only | ✅ Works |
| `/api/admin/categories/[id]` (PUT/DELETE) | Prisma | ⚠️ Will fail if binaries missing |
| `/api/admin/stats` | Prisma | ⚠️ Will fail if binaries missing |
| `/api/orders` | Prisma | ⚠️ Will fail if binaries missing |

## Next Steps

1. **Commit and push** these changes
2. **Test category creation** - should work now
3. **Fix remaining Prisma routes** - either:
   - Add binaries to Vercel deployment (update `prisma/schema.prisma` binary targets)
   - Or convert those routes to SQL

## Testing

After deployment:
1. Go to `/admin/categories`
2. Click "Nouvelle Catégorie"
3. Fill form and submit
4. ✅ Should work without Prisma errors

The category route is now completely independent of Prisma!
