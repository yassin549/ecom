# 🔧 Database Setup - Fix Connection Errors

## ❌ Current Error

You're seeing:
```
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
```

This happens because the **Review** and **Favorite** tables don't exist yet!

## ✅ Quick Fix (30 Seconds)

### Step 1: Stop the Server
Press **Ctrl+C** in your terminal to stop the dev server.

### Step 2: Push Database Schema

```powershell
npx prisma db push
```

**What this does**:
- Creates `Review` table for product reviews
- Creates `Favorite` table for wishlist
- Updates existing tables if needed

**Expected output**:
```
✓ Generated Prisma Client
✓ The database is now in sync with the Prisma schema
```

### Step 3: Restart Server

```powershell
npm run dev
```

## 🎯 After Setup

Once you run `npx prisma db push`, the errors will disappear and you'll have:

✅ **Working Reviews**:
- View reviews on product pages
- Write your own reviews
- Star ratings
- Auto-updating product ratings

✅ **Working Favorites**:
- Add products to favorites
- Remove from favorites
- Heart button shows state
- Persisted across sessions

✅ **No More Errors**:
- No PostgreSQL connection errors
- Product pages load smoothly
- All features work

## 🧪 Test After Setup

### Test 1: View Product Page
1. Go to any product: `http://localhost:3000/product/test`
2. **Expected**: Page loads without errors ✅
3. Reviews section shows "Aucun avis pour le moment" ✅

### Test 2: Write a Review
1. Click "Écrire un avis"
2. Fill form and submit
3. **Expected**: Review appears immediately ✅

### Test 3: Add to Favorites
1. Click heart button
2. **Expected**: Heart fills red, toast notification ✅

## 📊 Database Tables Created

After `npx prisma db push`:

```
✅ Review
   - id, productId, userId, rating, comment
   - approved, createdAt, updatedAt

✅ Favorite
   - id, userId, productId, createdAt

✅ User (if not exists)
   - id, email, name, password, role
   - createdAt, updatedAt
```

## ⚠️ Important Notes

### Why This Error Happened
- New features (reviews, favorites) need new database tables
- Tables are defined in `prisma/schema.prisma`
- `npx prisma db push` creates them in your database

### Safe to Run
- ✅ Won't delete existing data
- ✅ Only adds new tables
- ✅ Updates schema safely
- ✅ Takes ~5 seconds

### One-Time Setup
- You only need to run this once
- Future changes will be handled automatically
- No data loss

## 🚨 Troubleshooting

### Error: "Environment variable not found"
**Solution**: Make sure `.env.local` has `POSTGRES_URL`:
```env
POSTGRES_URL="postgresql://your-connection-string"
```

### Error: "Can't reach database"
**Solution**: Check your database is running and connection string is correct.

### Error: "Schema is already in sync"
**Good news**: Tables already exist! Just restart server:
```powershell
npm run dev
```

## 📝 Quick Commands

```powershell
# Stop server
Ctrl+C

# Create tables
npx prisma db push

# Restart server
npm run dev

# View database (optional)
npx prisma studio
```

## 🎉 Success Indicators

After setup, you should see:
```
✓ Ready in 7.5s
GET /product/test 200
GET /api/products/prod_xxx/reviews 200  ← No errors!
```

No more:
```
❌ prisma:error Error in PostgreSQL connection
```

---

**Run this now**: 
```powershell
npx prisma db push
```

Then restart your server! 🚀
