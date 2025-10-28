# ✅ CORRECT Environment Configuration

## Copy this into your `.env.local` file:

```env
# ============================================
# DATABASE - Supabase PostgreSQL
# ============================================
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.pumbdvvzrpqpheefietj:yacinekhoualdi@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.pumbdvvzrpqpheefietj:yacinekhoualdi@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://pumbdvvzrpqpheefietj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJkdnZ6cnBxcGhlZWZpZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzQ1MDYsImV4cCI6MjA3NzIxMDUwNn0.DvEnqdn4zMaTIfkdxxx9BvDHrmsWkIb9wgRodltDfcg"

# ============================================
# EMAIL SERVICE
# ============================================
RESEND_API_KEY="re_Qgp3fqmL_Hd6udVcHybZ8b8C8RistRXGU"

# ============================================
# AUTHENTICATION
# ============================================
NEXTAUTH_SECRET="8K7mN9pQ2rS5tU6vW8xY0zA1bC3dE4fG5hI7jK9lM1nO3pQ5rS7tU9vW"
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# ADMIN
# ============================================
ADMIN_PASSWORD="admin123"

# ============================================
# PUSHER (Optional)
# ============================================
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""
PUSHER_APP_ID=""
PUSHER_SECRET=""
```

## Key Changes:
- ✅ Host: `aws-1-eu-west-1.pooler.supabase.com` (correct pooler format)
- ✅ Username: `postgres.pumbdvvzrpqpheefietj` (includes project ref)
- ✅ Port 6543 for DATABASE_URL (connection pooling)
- ✅ Port 5432 for DIRECT_URL (direct connection)
