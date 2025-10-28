# 🚀 Deployment Guide - Production Ready

## Pre-Deployment Checklist

- [ ] All dependencies installed
- [ ] PostgreSQL database configured
- [ ] Environment variables set
- [ ] Prisma migrations run
- [ ] Database seeded with data
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance optimized

---

## Option 1: Vercel (Recommended)

### Step 1: Prepare for Deployment

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project

### Step 3: Add Environment Variables

In Vercel dashboard, add all variables from `.env.local`:

```env
# Database
DATABASE_URL=your_production_database_url
DIRECT_URL=your_production_database_url

# Email
RESEND_API_KEY=your_resend_key

# WebSocket
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_secret

# Auth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_production_secret

# Admin
ADMIN_PASSWORD=your_secure_password
```

### Step 4: Configure Build Settings

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Step 5: Add Vercel Postgres (Optional)

1. In Vercel dashboard, go to Storage
2. Create new Postgres database
3. Copy connection strings
4. Update environment variables

### Step 6: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your live site!

---

## Option 2: Railway

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Add PostgreSQL Database

1. Click "New"
2. Select "Database" → "PostgreSQL"
3. Copy connection string

### Step 3: Deploy Application

1. Click "New" → "GitHub Repo"
2. Select your repository
3. Railway auto-detects Next.js

### Step 4: Add Environment Variables

In Railway dashboard, add all variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
DIRECT_URL=${{Postgres.DATABASE_URL}}
RESEND_API_KEY=your_key
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_APP_ID=your_id
PUSHER_SECRET=your_secret
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXTAUTH_SECRET=your_secret
ADMIN_PASSWORD=your_password
```

### Step 5: Run Migrations

In Railway dashboard:
1. Go to your service
2. Click "Settings" → "Deploy"
3. Add build command: `npx prisma migrate deploy && npm run build`

### Step 6: Deploy

Railway automatically deploys on push to main branch.

---

## Option 3: Self-Hosted (VPS)

### Requirements

- Ubuntu 22.04 LTS
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE ecommerce;
CREATE USER ecomuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecomuser;
\q
```

### Step 3: Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/e-com.git
cd e-com

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add all environment variables

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed

# Build application
npm run build
```

### Step 4: PM2 Setup

```bash
# Start with PM2
pm2 start npm --name "ecommerce" -- start

# Save PM2 config
pm2 save

# Setup auto-restart
pm2 startup
```

### Step 5: Nginx Configuration

```nginx
# /etc/nginx/sites-available/ecommerce
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Homepage loads
- [ ] Products display
- [ ] Search works
- [ ] Cart functions
- [ ] Checkout works
- [ ] Admin dashboard accessible
- [ ] Email notifications send
- [ ] WebSocket connects

### 2. Performance Monitoring

**Add Vercel Analytics:**
```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```tsx
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

### 3. Error Monitoring

**Add Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4. Database Backups

**Vercel Postgres:**
- Automatic daily backups
- Point-in-time recovery

**Railway:**
- Automatic backups
- Download via dashboard

**Self-Hosted:**
```bash
# Daily backup script
#!/bin/bash
pg_dump -U ecomuser ecommerce > backup_$(date +%Y%m%d).sql

# Add to crontab
0 2 * * * /path/to/backup.sh
```

### 5. CDN Setup

**Cloudflare (Free):**
1. Add site to Cloudflare
2. Update nameservers
3. Enable caching
4. Enable minification
5. Enable Brotli compression

### 6. Security

- [ ] Enable HTTPS
- [ ] Set security headers
- [ ] Enable CORS properly
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] SQL injection protected
- [ ] XSS protection enabled

**Security Headers (Nginx):**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Troubleshooting

### Build Fails

**Error:** "Cannot find module"
**Solution:** Run `npm install` and commit `package-lock.json`

**Error:** "Prisma Client not generated"
**Solution:** Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Issues

**Error:** "Can't reach database server"
**Solution:** 
1. Check DATABASE_URL format
2. Verify database is accessible
3. Check firewall rules
4. Whitelist deployment IP

### Environment Variables Not Working

**Solution:**
1. Verify all variables are set
2. Restart deployment
3. Check for typos
4. Ensure NEXT_PUBLIC_ prefix for client vars

### Performance Issues

**Solutions:**
1. Enable caching headers
2. Optimize images
3. Use CDN
4. Enable compression
5. Minimize bundle size

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check performance metrics
- Review user feedback

**Weekly:**
- Database backups verification
- Security updates
- Performance optimization

**Monthly:**
- Dependency updates
- Security audit
- Database cleanup
- Cost optimization

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart (PM2)
pm2 restart ecommerce

# Or redeploy (Vercel/Railway)
git push origin main
```

---

## Cost Estimates

### Vercel + Vercel Postgres
- **Hobby:** Free (personal projects)
- **Pro:** $20/month (commercial)
- **Database:** $0.25/GB storage

### Railway
- **Starter:** $5/month
- **Developer:** $20/month
- **Database:** Included

### Self-Hosted (DigitalOcean)
- **Droplet:** $6-12/month
- **Database:** $15/month
- **Total:** ~$25/month

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

**Status:** Ready for production deployment! 🚀
