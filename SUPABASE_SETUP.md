# ✅ Supabase PostgreSQL Setup

## Your Connection Strings

Based on your Supabase project, here are your connection strings:

### 📝 Update your `.env.local` file with these values:

```env
# Database URLs (Supabase PostgreSQL)
# Connection Pooling (for Prisma migrations and queries)
DATABASE_URL="postgresql://postgres:yacinekhoualdi@db.pumbdvvzrpqpheefietj.supabase.co:6543/postgres?pgbouncer=true"

# Direct Connection (for Prisma migrations)
DIRECT_URL="postgresql://postgres:yacinekhoualdi@db.pumbdvvzrpqpheefietj.supabase.co:5432/postgres"

# Email Service (Resend)
RESEND_API_KEY="re_Qgp3fqmL_Hd6udVcHybZ8b8C8RistRXGU"

# NextAuth Configuration
NEXTAUTH_SECRET="8K7mN9pQ2rS5tU6vW8xY0zA1bC3dE4fG5hI7jK9lM1nO3pQ5rS7tU9vW"
NEXTAUTH_URL="http://localhost:3000"

# Admin Password
ADMIN_PASSWORD="admin123"

# Pusher (Optional - for real-time features)
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""
PUSHER_APP_ID=""
PUSHER_SECRET=""
```

## 🚀 Next Steps

### 1. Update .env.local
Copy the values above into your `.env.local` file.

**Important Notes:**
- `DATABASE_URL` uses port **6543** with `?pgbouncer=true` (connection pooling)
- `DIRECT_URL` uses port **5432** (direct connection for migrations)

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Push Database Schema
```bash
npx prisma db push
```
This will create all tables in your Supabase database.

### 4. Seed the Database
```bash
npm run db:seed
```
This will populate your database with:
- 5 categories
- 20 products
- 3 test users
- Sample data

### 5. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 6. Verify Database
Go to your Supabase dashboard:
- https://supabase.com/dashboard/project/pumbdvvzrpqpheefietj
- Click "Table Editor"
- You should see all your tables populated with data

## 🎯 Test Admin Access

- URL: http://localhost:3000/admin/login
- Password: `admin123`

## ✅ You're Ready to Deploy!

Once everything works locally, you can deploy to Vercel:
```bash
npm i -g vercel
vercel
```

Don't forget to add all environment variables in the Vercel dashboard!
