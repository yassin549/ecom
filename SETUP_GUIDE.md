# 🚀 Complete Setup Guide - Dynamic E-Commerce Platform

## Step-by-Step Installation & Configuration

### ✅ Phase 1: Install Dependencies (5 minutes)

```bash
# Navigate to project directory
cd c:\Users\khoua\OneDrive\Desktop\e-com

# Install required packages
npm install resend pusher pusher-js
npm install prisma --save-dev

# Generate Prisma client
npx prisma generate
```

---

### ✅ Phase 2: Set Up PostgreSQL Database (10 minutes)

#### Option A: Local PostgreSQL

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember your password!

2. **Create Database**
   ```bash
   # Open Command Prompt as Administrator
   psql -U postgres
   
   # In PostgreSQL prompt:
   CREATE DATABASE ecommerce;
   \q
   ```

3. **Update Connection String**
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ecommerce"
   ```

#### Option B: Supabase (Free, Cloud-based)

1. Go to https://supabase.com
2. Create account & new project
3. Go to Settings > Database
4. Copy connection string (Transaction pooler)
5. Use as DATABASE_URL

#### Option C: Vercel Postgres

1. Go to https://vercel.com/dashboard
2. Create new Postgres database
3. Copy connection strings
4. Use both DATABASE_URL and DIRECT_URL

---

### ✅ Phase 3: Configure Environment Variables (5 minutes)

Create `.env.local` in project root:

```env
# Database (Choose one option from Phase 2)
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
DIRECT_URL="postgresql://user:password@localhost:5432/ecommerce"

# Email Service (Resend)
# Sign up at https://resend.com (free tier: 100 emails/day)
RESEND_API_KEY="re_your_api_key_here"

# WebSocket (Pusher)
# Sign up at https://pusher.com (free tier: 200k messages/day)
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
PUSHER_APP_ID="your_app_id"
PUSHER_SECRET="your_pusher_secret"

# NextAuth (for future authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"

# Admin
ADMIN_PASSWORD="admin123"
```

#### Get Resend API Key:
1. Go to https://resend.com
2. Sign up (free)
3. Go to API Keys
4. Create new API key
5. Copy and paste into `.env.local`

#### Get Pusher Credentials:
1. Go to https://pusher.com
2. Sign up (free)
3. Create new app (Channels)
4. Go to App Keys
5. Copy all credentials to `.env.local`

---

### ✅ Phase 4: Run Database Migrations (2 minutes)

```bash
# Push schema to database
npx prisma db push

# Open Prisma Studio to verify
npx prisma studio
```

This will:
- Create all tables in your database
- Set up indexes
- Verify connection

---

### ✅ Phase 5: Seed Database (Optional, 2 minutes)

Create sample data for testing:

```bash
# Create seed file (if not exists)
# Then run:
npx prisma db seed
```

Or manually add products via Prisma Studio:
```bash
npx prisma studio
# Opens at http://localhost:5555
# Add categories and products manually
```

---

### ✅ Phase 6: Start Development Server (1 minute)

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🧪 Testing the Implementation

### Test 1: Homepage
1. Go to http://localhost:3000
2. Should see featured products from database
3. Check browser console for errors

### Test 2: Shop Page
1. Go to http://localhost:3000/shop
2. Should see all products
3. Try filtering by category
4. Try search

### Test 3: Product Details
1. Click any product
2. Should see product details
3. Try adding to cart

### Test 4: Cart
1. Add items to cart
2. Open cart drawer
3. Update quantities
4. Remove items

### Test 5: Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Enter password: `admin123`
3. Should see dashboard
4. Check orders, stats, charts

### Test 6: API Routes
Use Postman or Thunder Client:

```bash
# Get products
GET http://localhost:3000/api/products

# Get single product
GET http://localhost:3000/api/products/[id]

# Search products
GET http://localhost:3000/api/products/search?q=test

# Get cart (requires auth header)
GET http://localhost:3000/api/cart
Headers: x-user-id: test-user-id

# Create order
POST http://localhost:3000/api/orders
Headers: x-user-id: test-user-id
Body: {
  "shippingAddress": {
    "street": "123 Rue Test",
    "city": "Tunis",
    "postalCode": "1000",
    "country": "Tunisie"
  },
  "paymentMethod": "pay-on-delivery"
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'resend'"
**Solution:** Run `npm install resend`

### Issue: "Cannot find module 'pusher'"
**Solution:** Run `npm install pusher pusher-js`

### Issue: "Prisma Client not generated"
**Solution:** Run `npx prisma generate`

### Issue: "Database connection failed"
**Solution:** 
1. Check DATABASE_URL in `.env.local`
2. Verify PostgreSQL is running
3. Test connection: `npx prisma db push`

### Issue: "No products showing"
**Solution:**
1. Open Prisma Studio: `npx prisma studio`
2. Add categories first
3. Add products with categoryId
4. Set some products as featured

### Issue: "Admin login not working"
**Solution:**
1. Check middleware.ts is updated
2. Password is `admin123`
3. Clear browser cache

### Issue: "Email not sending"
**Solution:**
1. Verify RESEND_API_KEY in `.env.local`
2. Check Resend dashboard for errors
3. Verify email domain (use test mode)

### Issue: "WebSocket not connecting"
**Solution:**
1. Verify all Pusher credentials
2. Check Pusher dashboard
3. Ensure NEXT_PUBLIC_ prefix for client keys

---

## 📊 Verification Checklist

- [ ] Dependencies installed
- [ ] PostgreSQL database created
- [ ] .env.local configured
- [ ] Prisma migrations run
- [ ] Database has data
- [ ] Dev server starts without errors
- [ ] Homepage loads products
- [ ] Shop page works
- [ ] Product details work
- [ ] Cart functions
- [ ] Admin dashboard accessible
- [ ] API routes respond
- [ ] No console errors

---

## 🎯 Next Steps After Setup

1. **Add More Products**
   - Use Prisma Studio
   - Or create seed script

2. **Test Email Notifications**
   - Create an order
   - Check Resend dashboard

3. **Test Real-Time Updates**
   - Open admin in one tab
   - Open shop in another
   - Update product, see changes

4. **Customize**
   - Update branding
   - Modify email templates
   - Adjust styling

5. **Deploy to Production**
   - See DEPLOYMENT.md (coming next)

---

## 📞 Support

If you encounter issues:
1. Check console errors
2. Check Prisma Studio for data
3. Check API responses in Network tab
4. Verify all environment variables
5. Restart dev server

---

**Estimated Total Setup Time:** 25-30 minutes

**Status:** Ready for development! 🎉
