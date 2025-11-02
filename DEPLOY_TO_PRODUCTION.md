# 🚀 Deploy to Production - Complete Guide

## 📋 Pre-Deployment Checklist

Before deploying, make sure you've completed:
- ✅ Run `npx prisma db push` locally
- ✅ Test all features work locally
- ✅ Categories creation works
- ✅ Products creation works
- ✅ Reviews system works
- ✅ Favorites work
- ✅ No errors in terminal

## 🎯 Deployment Steps

### Option 1: Deploy with Vercel (Recommended)

#### Step 1: Push to GitHub

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Add reviews, favorites, and fix product issues"

# Create GitHub repo and push
# Go to: https://github.com/new
# Create a new repository (e.g., "ecommerce-store")
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/ecommerce-store.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Go to: https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

**Option B: Using Vercel CLI**

```powershell
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: ecommerce-store
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Step 3: Configure Environment Variables

**CRITICAL**: Add these in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Add each variable:

```env
# Database (REQUIRED)
POSTGRES_URL=postgresql://neondb_owner:npg_5Ljyizpw6sOm@ep-restless-night-ad8b0xqq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

DATABASE_URL=postgresql://neondb_owner:npg_5Ljyizpw6sOm@ep-restless-night-ad8b0xqq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

DIRECT_URL=postgresql://neondb_owner:npg_5Ljyizpw6sOm@ep-restless-night-ad8b0xqq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Auth (REQUIRED)
NEXTAUTH_SECRET=8K7mN9pQ2rS5tU6vW8xY0zA1bC3dE4fG5hI7jK9lM1nO3pQ5rS7tU9vW
NEXTAUTH_URL=https://YOUR_VERCEL_URL.vercel.app
ADMIN_PASSWORD=admin123

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://pumbdvvzrpqpheefietj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJkdnZ6cnBxcGhlZWZpZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzQ1MDYsImV4cCI6MjA3NzIxMDUwNn0.DvEnqdn4zMaTIfkdxxx9BvDHrmsWkIb9wgRodltDfcg

# Email (if using)
RESEND_API_KEY=re_Qgp3fqmL_Hd6udVcHybZ8b8C8RistRXGU
```

**Important**: 
- Set environment for: **Production**, **Preview**, and **Development**
- Update `NEXTAUTH_URL` with your actual Vercel URL

#### Step 4: Run Database Migration on Production

After first deployment:

```powershell
# Install Vercel CLI if not already
npm i -g vercel

# Link to your project
vercel link

# Run Prisma migration on production
vercel env pull .env.production
npx prisma db push
```

Or use Vercel's built-in Prisma integration:
1. Go to Vercel Dashboard → Your Project
2. Settings → General → Build & Development Settings
3. Add to "Install Command":
   ```
   npm install && npx prisma generate && npx prisma db push --accept-data-loss
   ```

#### Step 5: Redeploy

After adding environment variables:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click "..." on latest deployment
4. Click "Redeploy"

Or via CLI:
```powershell
vercel --prod
```

---

### Option 2: Deploy with Other Platforms

#### Netlify
```powershell
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

#### Railway
1. Go to: https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Add environment variables
5. Deploy

#### Render
1. Go to: https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repo
5. Add environment variables
6. Deploy

---

## 🔒 Security Checklist

Before going live:

### 1. Update Admin Password
```env
# Change from default
ADMIN_PASSWORD=YOUR_SECURE_PASSWORD_HERE
```

### 2. Generate New Auth Secret
```powershell
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Use output for NEXTAUTH_SECRET
```

### 3. Update NEXTAUTH_URL
```env
# Replace with your actual domain
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 4. Secure Database
- ✅ Use strong database password
- ✅ Enable SSL (already done with `sslmode=require`)
- ✅ Restrict IP access if possible

### 5. Review .gitignore
Make sure these are NOT committed:
```
.env.local
.env
.env.production
node_modules/
.next/
```

---

## 📊 Post-Deployment Verification

### 1. Check Homepage
- Visit: `https://your-app.vercel.app`
- Should load without errors

### 2. Test Admin Panel
- Visit: `https://your-app.vercel.app/admin/categories`
- Login with admin password
- Create a test category

### 3. Test Products
- Create a product
- Check price displays correctly
- Upload images work

### 4. Test Reviews
- Go to product page
- Write a review
- Verify it appears

### 5. Test Favorites
- Click heart on product
- Verify it saves

### 6. Check API Routes
- `/api/admin/categories` - Should return 200
- `/api/admin/products` - Should return 200
- `/api/products/[id]/reviews` - Should return 200

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
**Solution**: 
1. Check environment variables in Vercel
2. Verify `POSTGRES_URL` is set
3. Test connection from local with production env

### Error: "Prisma Client not generated"
**Solution**:
1. Add to build command: `npx prisma generate`
2. Or add postinstall script in `package.json`:
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```

### Error: "Module not found"
**Solution**:
1. Clear Vercel cache
2. Redeploy
3. Check all dependencies in `package.json`

### Error: "Reviews not working"
**Solution**:
1. Run `npx prisma db push` on production database
2. Check Review table exists
3. Verify environment variables

### Images not showing
**Solution**:
1. Check `/public/uploads/` exists
2. For production, use cloud storage (Cloudinary, Vercel Blob)
3. Update image paths

---

## 🎨 Production Optimizations

### 1. Add Custom Domain
1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Update DNS records
5. Update `NEXTAUTH_URL`

### 2. Enable Analytics
```powershell
# Install Vercel Analytics
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 3. Add Image Optimization
For production, use cloud storage:

**Cloudinary** (Recommended):
```powershell
npm install cloudinary

# Add to .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Vercel Blob**:
```powershell
npm install @vercel/blob

# Automatic integration with Vercel
```

### 4. Enable Caching
Already configured with:
```typescript
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

For static pages, adjust as needed.

---

## 📈 Monitoring

### Vercel Dashboard
- View deployments
- Check logs
- Monitor performance
- Track errors

### Add Error Tracking
```powershell
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

---

## 🚀 Quick Deploy Commands

```powershell
# Full deployment flow
git add .
git commit -m "Production ready"
git push origin main

# Vercel auto-deploys from main branch

# Or manual deploy
vercel --prod

# Check deployment
vercel ls

# View logs
vercel logs
```

---

## ✅ Production Checklist

Before announcing your site:

- [ ] All environment variables set in Vercel
- [ ] Database tables created (`npx prisma db push`)
- [ ] Admin password changed from default
- [ ] NEXTAUTH_URL updated to production URL
- [ ] Test category creation
- [ ] Test product creation
- [ ] Test reviews system
- [ ] Test favorites
- [ ] Test on mobile
- [ ] Check all pages load
- [ ] Verify images display
- [ ] Test checkout flow
- [ ] Check performance (Lighthouse)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Custom domain configured (optional)

---

## 🎉 You're Live!

Once deployed, your store will be available at:
- **Vercel URL**: `https://your-app.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

### Share Your Store
- Test all features
- Invite users
- Monitor analytics
- Gather feedback
- Iterate and improve

---

## 📞 Support

If you encounter issues:
1. Check Vercel logs
2. Verify environment variables
3. Test database connection
4. Review error messages
5. Check this guide

**Common URLs**:
- Vercel Dashboard: https://vercel.com/dashboard
- Neon Dashboard: https://console.neon.tech
- GitHub Repo: https://github.com/YOUR_USERNAME/ecommerce-store

---

**Ready to deploy?** Start with Step 1! 🚀
