# Required Dependencies for Full Dynamic Implementation

## Install Commands

### Core Dependencies (Already Installed)
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @prisma/client
npm install zod
```

### New Dependencies Required

#### Database & ORM
```bash
npm install prisma --save-dev
npx prisma generate
```

#### Email Service
```bash
npm install resend
```

#### WebSocket/Real-Time
```bash
npm install pusher pusher-js
```

#### Background Jobs (Optional - for production)
```bash
npm install bullmq ioredis
```

#### Authentication (Next Phase)
```bash
npm install next-auth@beta
npm install bcryptjs
npm install @types/bcryptjs --save-dev
```

#### Search (Optional - for enhanced search)
```bash
npm install meilisearch
```

#### Monitoring & Error Tracking (Optional)
```bash
npm install @sentry/nextjs
```

## Complete Installation Script

Run this to install all required dependencies:

```bash
# Core dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @prisma/client
npm install zod

# Email
npm install resend

# WebSocket
npm install pusher pusher-js

# Dev dependencies
npm install prisma --save-dev
npm install @types/node --save-dev

# Generate Prisma client
npx prisma generate
```

## Environment Variables Required

Create `.env.local` with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
DIRECT_URL="postgresql://user:password@localhost:5432/ecommerce"

# Email (Resend)
RESEND_API_KEY="re_your_api_key"

# WebSocket (Pusher)
NEXT_PUBLIC_PUSHER_KEY="your_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
PUSHER_APP_ID="your_app_id"
PUSHER_SECRET="your_secret"

# NextAuth (for next phase)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"

# Admin
ADMIN_PASSWORD="admin123"
```

## Package.json Scripts to Add

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## Current Status

✅ Installed:
- @tanstack/react-query
- @tanstack/react-query-devtools
- @prisma/client
- zod
- next
- react
- typescript

⏳ Need to Install:
- resend (for emails)
- pusher & pusher-js (for WebSocket)
- prisma (dev dependency)

## Installation Priority

1. **High Priority (Required for basic functionality)**
   - prisma (dev)
   - @prisma/client

2. **Medium Priority (Required for full features)**
   - resend
   - pusher & pusher-js

3. **Low Priority (Optional enhancements)**
   - bullmq & ioredis
   - meilisearch
   - @sentry/nextjs

## Notes

- Some packages like `resend` and `pusher` will show TypeScript errors until installed
- The application will work without WebSocket, but won't have real-time updates
- Email functionality requires Resend API key
- Background jobs can use the simple in-memory queue initially
