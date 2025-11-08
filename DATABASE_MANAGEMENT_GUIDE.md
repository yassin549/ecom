# 🗄️ Database Management - Production Issues & Solutions

**Priority:** CRITICAL  
**Impact:** Data Consistency, Performance, Maintenance

---

## 🚨 Current Problem

Your e-commerce site has **5 DIFFERENT database abstraction layers** running simultaneously:

```
Production Request Flow:
┌─────────────────────────────────────────────┐
│  User visits /shop                          │
└────────────┬────────────────────────────────┘
             │
             ├──> Uses: vercel-db.ts (Direct SQL)
             │
┌────────────┴────────────────────────────────┐
│  User views product details                 │
└────────────┬────────────────────────────────┘
             │
             ├──> Uses: Prisma Client
             │
┌────────────┴────────────────────────────────┐
│  Admin creates product                      │
└────────────┬────────────────────────────────┘
             │
             ├──> Uses: simple-db.ts (SQL)
             │
┌────────────┴────────────────────────────────┐
│  Admin creates category                     │
└────────────┬────────────────────────────────┘
             │
             └──> Uses: database.ts (SQL)
```

**Result:** Different parts of your app talk to the database differently!

---

## 📊 Database Layer Inventory

### Layer 1: Prisma (Primary ORM)
**File:** `lib/prisma.ts`

```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

**Used By:**
- ✅ `/api/products` - Product listing
- ✅ `/api/cart` - Shopping cart
- ✅ `/api/orders` - Order management
- ✅ `/api/admin/stats` - Dashboard stats
- ✅ `auth.config.ts` - Authentication

**Pros:**
- ✅ Type safety (TypeScript types generated)
- ✅ Connection pooling
- ✅ Migration management
- ✅ Relation loading
- ✅ Query builder

**Cons:**
- ⚠️ Slight performance overhead
- ⚠️ Not used consistently

---

### Layer 2: Vercel DB Direct
**File:** `lib/vercel-db.ts`

```typescript
export async function getSql() {
  const { sql } = await import('@vercel/postgres')
  return sql
}
```

**Used By:**
- `/page.tsx` - Homepage featured products
- `/shop/page.tsx` - Product catalog
- `/app/shop/page.tsx` - Category filtering

**Why It Exists:**
- Created to avoid Prisma build errors on Vercel
- Lazy-loaded to prevent initialization issues

**Issues:**
- ❌ No type safety
- ❌ Manual query writing
- ❌ No connection pooling
- ❌ Duplicates Prisma functionality

---

### Layer 3: Simple DB
**File:** `lib/db/simple-db.ts`

```typescript
export const products = {
  async getAll() {
    return sqlTemplate`SELECT * FROM "Product"...`
  },
  async create(data) {
    return sqlTemplate`INSERT INTO "Product"...`
  }
}
```

**Used By:**
- `/api/admin/products` - Admin product CRUD
- Admin product management

**Features:**
- Helper functions for common operations
- Uses @vercel/postgres internally

**Issues:**
- ❌ Duplicates Prisma models
- ❌ Another abstraction layer to maintain
- ❌ Type safety lost

---

### Layer 4: Database.ts
**File:** `lib/database.ts`

```typescript
export const categoryDB = {
  async getAll(): Promise<Category[]> {
    const result = await sql<Category>`SELECT * FROM "Category"`
    return result.rows
  }
}
```

**Used By:**
- Admin category operations
- Category management API

**Issues:**
- ❌ Fourth way to access database
- ❌ Overlaps with simple-db.ts
- ❌ Confusion about which to use

---

### Layer 5: Legacy DB Layer
**File:** `lib/db.ts`

```typescript
export const db = {
  async getProducts(limit?: number) {
    if (isVercel) {
      const sql = await getSql()
      const { rows } = await sql`SELECT * FROM "Product"...`
      return rows
    }
    const prisma = getPrisma()
    return await prisma.product.findMany({ take: limit })
  }
}
```

**Used By:**
- Legacy code paths
- Should be deprecated

**Issues:**
- ❌ Runtime environment detection
- ❌ Different behavior dev vs prod
- ❌ Hard to test
- ❌ Maintenance burden

---

## 🎯 Problems This Causes in Production

### Problem 1: Data Inconsistency

**Scenario:**
```typescript
// Admin creates product via simple-db.ts
await products.create({
  name: "New Product",
  price: 99.99
})

// Public API fetches via Prisma
const allProducts = await prisma.product.findMany()
// ❌ May not include the new product immediately
// ❌ Caching strategies different
// ❌ Transaction isolation levels different
```

### Problem 2: Connection Pool Exhaustion

**What Happens:**
```
Request 1: Uses Prisma (Connection Pool A)
Request 2: Uses vercel-db (New Connection)
Request 3: Uses simple-db (New Connection)
Request 4: Uses database.ts (New Connection)

Result: 
- Prisma maintains 1 pool (configured)
- Direct SQL creates new connections each time
- Eventually hit PostgreSQL connection limit
- Requests start failing
```

**Error You'll See:**
```
Error: remaining connection slots are reserved
Error: too many clients already
```

### Problem 3: Cache Invalidation Nightmare

```typescript
// Admin updates product price via simple-db
await products.update(id, { price: 79.99 })

// React Query cache (using Prisma endpoint) still shows old price
// User sees: 99.99
// Database has: 79.99
// No automatic cache invalidation across layers
```

### Problem 4: Type Safety Loss

```typescript
// Prisma - Full type safety ✅
const product: Product = await prisma.product.findUnique(...)
product.name // TypeScript knows this exists

// Direct SQL - No type safety ❌
const product: any = await sql`SELECT * FROM "Product"...`
product.nmae // Typo not caught, runtime error
```

### Problem 5: Migration Conflicts

```
Prisma Schema: Product.price is Float
Direct SQL: Some queries expect DECIMAL
Simple-DB: Manually handles number parsing

One migration breaks multiple layers
No single migration tool
```

---

## 🔧 Solutions

### Option A: Prisma Only (RECOMMENDED)

**Action Plan:**

1. **Update all routes to use Prisma**
   ```typescript
   // Before: app/page.tsx
   const sql = await getSql()
   const { rows } = await sql`SELECT * FROM "Product" WHERE featured = true`

   // After: app/page.tsx
   const products = await prisma.product.findMany({
     where: { featured: true },
     take: 8
   })
   ```

2. **Remove other layers**
   - Delete `lib/vercel-db.ts`
   - Delete `lib/db/simple-db.ts`
   - Delete `lib/database.ts`
   - Delete `lib/db.ts`

3. **Benefits**
   - ✅ One source of truth
   - ✅ Type safety everywhere
   - ✅ Connection pooling
   - ✅ Easy migrations
   - ✅ Relations handled automatically

4. **Trade-offs**
   - ⚠️ Slightly more code for complex queries
   - ⚠️ Need to ensure Prisma builds on Vercel

### Option B: Prisma + Raw Queries for Complex Cases

**When to Use:**

1. **Use Prisma for 95% of queries**
   ```typescript
   // Simple CRUD
   await prisma.product.create({ data: { ... } })
   await prisma.product.findMany({ where: { ... } })
   await prisma.product.update({ where: { ... }, data: { ... } })
   ```

2. **Use Prisma Raw for Complex Analytics**
   ```typescript
   // Complex aggregation
   const stats = await prisma.$queryRaw`
     SELECT 
       DATE_TRUNC('month', "createdAt") as month,
       SUM(total) as revenue
     FROM "Order"
     GROUP BY month
   `
   ```

3. **Benefits**
   - ✅ Best of both worlds
   - ✅ Type safety for simple queries
   - ✅ Performance for complex queries
   - ✅ Single connection pool

---

## 📋 Migration Checklist

### Phase 1: Audit (1-2 hours)

- [x] List all database layer files
- [x] Map which routes use which layer
- [x] Identify dependencies
- [ ] Create backup of current code
- [ ] Document all custom queries

### Phase 2: Convert Public Routes (2-3 hours)

Files to update:
- [ ] `app/page.tsx`
- [ ] `app/shop/page.tsx`
- [ ] `app/product/[slug]/page.tsx`
- [ ] `app/categories/[slug]/page.tsx`

**Example Conversion:**

```typescript
// BEFORE: app/page.tsx
const sql = await getSql()
const { rows } = await sql`
  SELECT p.*, c.name as category_name
  FROM "Product" p
  LEFT JOIN "Category" c ON p."categoryId" = c.id
  WHERE p.featured = true
  LIMIT 8
`

// AFTER: app/page.tsx
const products = await prisma.product.findMany({
  where: { featured: true },
  take: 8,
  include: {
    category: {
      select: { name: true }
    }
  }
})
```

### Phase 3: Convert Admin Routes (3-4 hours)

Files to update:
- [ ] `app/api/admin/products/route.ts`
- [ ] `app/api/admin/categories/route.ts`
- [ ] `app/api/admin/categories/[id]/route.ts`
- [ ] `app/api/admin/products/[id]/route.ts`

**Example Conversion:**

```typescript
// BEFORE: app/api/admin/products/route.ts
import { products } from '@/lib/db/simple-db'

export async function GET() {
  const allProducts = await products.getWithCategory()
  return NextResponse.json(allProducts)
}

// AFTER: app/api/admin/products/route.ts
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  const allProducts = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(allProducts)
}
```

### Phase 4: Clean Up (1 hour)

- [ ] Delete `lib/vercel-db.ts`
- [ ] Delete `lib/db/simple-db.ts`
- [ ] Delete `lib/database.ts`
- [ ] Delete `lib/db.ts`
- [ ] Update all imports
- [ ] Remove unused dependencies

### Phase 5: Testing (2-3 hours)

- [ ] Test all product CRUD operations
- [ ] Test category management
- [ ] Test order creation
- [ ] Test admin dashboard stats
- [ ] Test cart functionality
- [ ] Load test with concurrent requests
- [ ] Monitor connection pool usage

---

## 🚀 Implementation Guide

### Step 1: Install & Configure Prisma Properly

**Ensure Prisma builds on Vercel:**

```typescript
// next.config.ts
export default {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // ... rest of config
}
```

**Build script:**
```json
// package.json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### Step 2: Create Prisma Helper Functions

```typescript
// lib/db/prisma-helpers.ts
import { prisma } from '@/lib/prisma'

export const productDB = {
  async getAllWithCategory() {
    return prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getFeatured(limit = 8) {
    return prisma.product.findMany({
      where: { featured: true },
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { rating: 'desc' }
    })
  },

  async search(query: string) {
    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })
  }
}

export const categoryDB = {
  async getAllWithProductCount() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    })
  },

  async getBySlugWithProducts(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          take: 20,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }
}
```

### Step 3: Update Route Files

**app/page.tsx:**
```typescript
import { productDB } from '@/lib/db/prisma-helpers'

export default async function Home() {
  const featuredProducts = await productDB.getFeatured(8)
  
  return (
    <>
      <HeroModern />
      <FeaturedProducts products={featuredProducts} />
    </>
  )
}
```

**app/shop/page.tsx:**
```typescript
import { prisma } from '@/lib/db/prisma'
import { categoryDB } from '@/lib/db/prisma-helpers'

export default async function ShopPage({ searchParams }) {
  const params = await searchParams
  
  // Get categories with counts
  const categories = await categoryDB.getAllWithProductCount()
  
  // Build where clause
  const where: any = {}
  if (params.category) {
    const category = await prisma.category.findUnique({
      where: { slug: params.category }
    })
    if (category) where.categoryId = category.id
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } }
    ]
  }
  
  // Get products
  const products = await prisma.product.findMany({
    where,
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true
    }
  })
  
  return <ProductGrid products={products} categories={categories} />
}
```

**app/api/admin/products/route.ts:**
```typescript
import { prisma } from '@/lib/db/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Proper auth check
  const isAdmin = request.headers.get('x-user-role') === 'admin'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const isAdmin = request.headers.get('x-user-role') === 'admin'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { name, description, price, stock, categoryId, image, images, featured } = body

  // Validation
  if (!name || !description || !price || !categoryId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // Generate slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // Check if slug exists
  const existing = await prisma.product.findUnique({
    where: { slug }
  })

  const finalSlug = existing 
    ? `${slug}-${Date.now()}` 
    : slug

  // Create product
  const product = await prisma.product.create({
    data: {
      name,
      slug: finalSlug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      categoryId,
      image: image || '/placeholder.svg',
      images: JSON.stringify(images || []),
      featured: featured || false
    },
    include: {
      category: true
    }
  })

  return NextResponse.json(product, { status: 201 })
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// tests/db/product.test.ts
import { prisma } from '@/lib/db/prisma'

describe('Product Database Operations', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
  })

  it('should create product', async () => {
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category'
      }
    })

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test',
        price: 99.99,
        stock: 10,
        categoryId: category.id,
        image: '/test.jpg'
      }
    })

    expect(product.id).toBeDefined()
    expect(product.name).toBe('Test Product')
  })
})
```

### Integration Tests

```typescript
// tests/api/products.test.ts
import { GET } from '@/app/api/products/route'

describe('Products API', () => {
  it('should return products', async () => {
    const request = new Request('http://localhost/api/products')
    const response = await GET(request as any)
    const data = await response.json()

    expect(Array.isArray(data.products)).toBe(true)
  })
})
```

---

## 📊 Monitoring

### Connection Pool Monitoring

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// Monitor connections
prisma.$on('query' as any, (e: any) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})

export { prisma }
```

### Performance Metrics

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()

  const response = NextResponse.next()

  // Log query time
  const duration = Date.now() - start
  console.log(`${request.method} ${request.url} - ${duration}ms`)

  return response
}
```

---

## ⚡ Performance Optimization

### Add Database Indexes

```prisma
// prisma/schema.prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  categoryId  String
  featured    Boolean  @default(false)
  rating      Float    @default(0)
  
  @@index([slug])
  @@index([categoryId])
  @@index([featured])
  @@index([rating])
  @@index([categoryId, featured]) // Composite index
}
```

### Connection Pooling

```typescript
// lib/db/prisma.ts
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Vercel Postgres automatically handles pooling
// But you can configure:
// DATABASE_URL=postgresql://...?connection_limit=10&pool_timeout=20
```

---

## 🎯 Summary

**Current State:**
- 5 different database layers
- Inconsistent data access
- Connection pool issues
- Type safety problems
- Hard to maintain

**Recommended State:**
- 1 database layer (Prisma)
- Consistent type-safe queries
- Proper connection pooling
- Easy to maintain
- Production ready

**Effort Required:**
- Audit: 2 hours ✅ (Done)
- Migration: 6-8 hours
- Testing: 3-4 hours
- **Total: 11-14 hours**

**Risk Level:** Medium
- Backup database before starting
- Migrate one route at a time
- Test thoroughly
- Have rollback plan

---

## 📞 Next Steps

1. **Review this document** ✅
2. **Backup database** before changes
3. **Create test environment** for migration
4. **Start with one route** (e.g., `/page.tsx`)
5. **Test thoroughly** before moving to next
6. **Document any issues** encountered
7. **Update production** once all routes work

**Ready to start migration? Begin with Phase 1!**
