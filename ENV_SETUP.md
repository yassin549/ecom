# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"

# Email (Resend)
RESEND_API_KEY="re_your_resend_api_key"

# WebSocket (Pusher)
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-pusher-secret"

# Admin Password
ADMIN_PASSWORD="admin123"
```

## Setup Instructions

### 1. PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
# Create database
createdb ecommerce

# Update DATABASE_URL with your credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce"
```

**Option B: Vercel Postgres**
```bash
# Create database on Vercel
# Copy connection string
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."
```

**Option C: Supabase**
```bash
# Create project on Supabase
# Copy connection string from Settings > Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### 2. Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Verify
npx prisma studio
```

### 3. Email Setup (Resend)

1. Sign up at https://resend.com
2. Get API key
3. Add to `.env.local`

```env
RESEND_API_KEY="re_..."
```

### 4. WebSocket Setup (Pusher)

1. Sign up at https://pusher.com
2. Create app
3. Get credentials
4. Add to `.env.local`

```env
NEXT_PUBLIC_PUSHER_KEY="..."
NEXT_PUBLIC_PUSHER_CLUSTER="..."
PUSHER_APP_ID="..."
PUSHER_SECRET="..."
```

### 5. NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Add to `.env.local`:

```env
NEXTAUTH_SECRET="generated-secret-here"
```

## Testing

```bash
# Test database connection
npm run db:test

# Start dev server
npm run dev

# Visit http://localhost:3000
```

## Production

For production deployment, add all environment variables to your hosting platform (Vercel, Railway, etc.)

**Important:** Never commit `.env.local` to git!
