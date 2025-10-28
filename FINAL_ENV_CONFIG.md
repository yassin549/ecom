# 🎯 Final Environment Configuration

## Copy this ENTIRE content into your `.env.local` file:

```env
# ============================================
# DATABASE - Supabase PostgreSQL
# ============================================
# Connection Pooling (for Prisma queries)
DATABASE_URL="postgresql://postgres:yacinekhoualdi@db.pumbdvvzrpqpheefietj.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection (for Prisma migrations)
DIRECT_URL="postgresql://postgres:yacinekhoualdi@db.pumbdvvzrpqpheefietj.supabase.co:5432/postgres"

# ============================================
# SUPABASE (Optional - for direct Supabase features)
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://pumbdvvzrpqpheefietj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJkdnZ6cnBxcGhlZWZpZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzQ1MDYsImV4cCI6MjA3NzIxMDUwNn0.DvEnqdn4zMaTIfkdxxx9BvDHrmsWkIb9wgRodltDfcg"

# ============================================
# EMAIL SERVICE - Resend
# ============================================
RESEND_API_KEY="re_Qgp3fqmL_Hd6udVcHybZ8b8C8RistRXGU"

# ============================================
# AUTHENTICATION - NextAuth
# ============================================
NEXTAUTH_SECRET="8K7mN9pQ2rS5tU6vW8xY0zA1bC3dE4fG5hI7jK9lM1nO3pQ5rS7tU9vW"
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# ADMIN ACCESS
# ============================================
ADMIN_PASSWORD="admin123"

# ============================================
# PUSHER (Optional - Real-time features)
# ============================================
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""
PUSHER_APP_ID=""
PUSHER_SECRET=""
```

## 📝 Instructions:

1. **Open** `c:\Users\khoua\OneDrive\Desktop\e-com\.env.local`
2. **Delete** all existing content
3. **Copy** the entire config above (from `# DATABASE` to the end)
4. **Save** the file

## ⚠️ Important Notes:

- **DATABASE_URL** uses port `6543` with `pgbouncer=true` (connection pooling)
- **DIRECT_URL** uses port `5432` (direct connection for migrations)
- Both use the same password: `yacinekhoualdi`
- Both use the same host: `db.pumbdvvzrpqpheefietj.supabase.co`

## 🚀 After updating .env.local, run:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push schema to Supabase
npx prisma db push

# 3. Seed the database
npm run db:seed

# 4. Start dev server
npm run dev
```

## ✅ Verify Setup:

Visit your Supabase dashboard to see the tables:
https://supabase.com/dashboard/project/pumbdvvzrpqpheefietj/editor

You should see tables: User, Category, Product, Cart, CartItem, Order, OrderItem, etc.
