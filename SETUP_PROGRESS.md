# 🚀 Setup Progress Tracker

## ✅ Phase 1: Dependencies - COMPLETE
- ✅ Installed: resend, pusher, pusher-js
- ✅ Prisma client generated
- ✅ Schema updated to PostgreSQL

---

## 🔄 Phase 2: Database Setup - IN PROGRESS

### Choose ONE option:

### **Option A: Supabase (EASIEST - Recommended)** ⭐

1. **Sign up:**
   - Go to: https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub/Google

2. **Create project:**
   - Click "New Project"
   - Name: `ecommerce` (or any name)
   - Database Password: Choose a strong password (SAVE THIS!)
   - Region: Choose closest to you
   - Click "Create new project" (takes 2 minutes)

3. **Get connection string:**
   - Wait for project to finish setting up
   - Go to: Settings > Database
   - Scroll to "Connection string"
   - Select "Transaction" mode
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

4. **Update .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```

---

### **Option B: Local PostgreSQL**

1. **Download & Install:**
   - Go to: https://www.postgresql.org/download/windows/
   - Download installer
   - Run installer with default settings
   - **REMEMBER YOUR PASSWORD!**

2. **Create Database:**
   ```bash
   # Open Command Prompt as Administrator
   psql -U postgres
   # Enter your password
   
   # In PostgreSQL prompt:
   CREATE DATABASE ecommerce;
   \q
   ```

3. **Update .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ecommerce"
   DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ecommerce"
   ```

---

### **Option C: Vercel Postgres**

1. **Go to Vercel:**
   - https://vercel.com/dashboard
   - Sign in with GitHub

2. **Create Database:**
   - Go to Storage tab
   - Click "Create Database"
   - Select "Postgres"
   - Name: `ecommerce`
   - Click "Create"

3. **Get Connection Strings:**
   - Click on your database
   - Go to ".env.local" tab
   - Copy `POSTGRES_URL` as `DATABASE_URL`
   - Copy `POSTGRES_URL_NON_POOLING` as `DIRECT_URL`

---

## 📝 Phase 3: Environment Variables

Create `.env.local` file in project root with:

```env
# Database (from Phase 2)
DATABASE_URL="your_database_url_here"
DIRECT_URL="your_direct_url_here"

# Email Service (Resend) - Get from https://resend.com
RESEND_API_KEY="re_your_api_key"

# WebSocket (Pusher) - Get from https://pusher.com
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
PUSHER_APP_ID="your_app_id"
PUSHER_SECRET="your_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Admin
ADMIN_PASSWORD="admin123"
```

### Get Resend API Key:
1. Go to: https://resend.com
2. Sign up (free - 100 emails/day)
3. Click "API Keys"
4. Click "Create API Key"
5. Copy and paste into `.env.local`

### Get Pusher Credentials:
1. Go to: https://pusher.com
2. Sign up (free - 200k messages/day)
3. Click "Create app"
4. Name: `ecommerce`
5. Cluster: Choose closest
6. Click "Create app"
7. Go to "App Keys" tab
8. Copy all 4 values to `.env.local`

---

## 🎯 Phase 4: Run Migrations

After setting up database and environment variables:

```bash
# Push schema to database
npx prisma db push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio to verify
npx prisma studio
```

---

## 🚀 Phase 5: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## ✅ Verification Checklist

- [ ] Database created (Supabase/Local/Vercel)
- [ ] .env.local file created with all variables
- [ ] Resend API key added
- [ ] Pusher credentials added
- [ ] Migrations run successfully
- [ ] Database seeded with products
- [ ] Dev server starts without errors
- [ ] Homepage shows products
- [ ] No console errors

---

## 🆘 Quick Troubleshooting

**Error: "Cannot connect to database"**
- Check DATABASE_URL is correct
- Verify database is running (if local)
- Test with: `npx prisma db push`

**Error: "Environment variable not found"**
- Ensure `.env.local` exists in project root
- Restart dev server after adding variables

**Error: "No products showing"**
- Run: `npm run db:seed`
- Or add manually via Prisma Studio

---

## 📞 Need Help?

1. Check console errors in browser (F12)
2. Check terminal errors
3. Verify all environment variables are set
4. Restart dev server

---

**Current Status:** Phase 2 - Choose database option and configure!
