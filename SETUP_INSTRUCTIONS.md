# Setup Instructions

## Prerequisites
- Node.js 20+ installed
- PostgreSQL database (or use Vercel Postgres)
- Git

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
```

### 3. Database Migration
Apply the database schema (including the new Command model):

```bash
npm run db:push
```

### 4. Seed Database (Optional)
If you have seed data:

```bash
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Admin Access

### Creating an Admin User
You'll need to manually create an admin user in the database or update an existing user's role:

```sql
-- Update existing user to admin
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';

-- Or create new admin user
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-id',
  'admin@example.com',
  'Admin User',
  'password123', -- Remember to hash this in production
  'admin',
  NOW(),
  NOW()
);
```

### Accessing Admin Dashboard
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access admin features at `/admin`

## Key Features to Test

### 1. Admin Dashboard
- **Products**: `/admin/products` - View and manage all products
- **Orders**: `/admin/orders` - View all customer orders
- **Customers**: `/admin/customers` - View customer statistics
- **Settings**: `/admin/settings` - Configure store settings

### 2. User Features
- **Profile**: `/profile` - View orders, manage commands, update info
- **Shop**: `/shop` - Browse products
- **About**: `/about` - Learn about the store
- **Cart**: Click cart icon in header

### 3. Commands System
Users can create and manage commands (actions) from their profile:
- Navigate to Profile → Actions tab
- Commands can be marked as completed or cancelled
- Fully dynamic with database integration

## Database Schema

### New Models Added
- **Command**: User actions/commands tracking
  - Fields: id, userId, name, description, action, status, metadata, createdAt, updatedAt

### Existing Models
- User
- Product
- Category
- Order
- OrderItem
- Cart
- CartItem
- Review
- PromoCode
- Notification
- Session

## API Endpoints

### Admin Endpoints (Require admin role)
- `GET /api/admin/products` - Fetch all products
- `POST /api/admin/products` - Create product
- `DELETE /api/admin/products` - Delete products
- `GET /api/admin/users` - Fetch all users with stats
- `GET /api/admin/orders` - Fetch all orders
- `GET /api/admin/stats` - Get dashboard statistics

### User Endpoints (Require authentication)
- `GET /api/commands` - Fetch user's commands
- `POST /api/commands` - Create new command
- `PATCH /api/commands` - Update command status
- `GET /api/orders` - Fetch user's orders
- `GET /api/products` - Browse products
- `GET /api/cart` - Get user's cart

## Mobile Testing
The navigation has been optimized for mobile devices:
- Responsive button sizes
- Proper spacing
- No overflow issues
- Test on various screen sizes

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if PostgreSQL is running
- Ensure database exists

### Authentication Issues
- Verify AUTH_SECRET is set
- Check user exists in database
- Verify user role for admin access

### API Errors
- Check browser console for errors
- Verify API endpoints exist
- Check authentication headers

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
- Set all `.env.local` variables in Vercel dashboard
- Ensure DATABASE_URL points to production database
- Update NEXTAUTH_URL to production domain

## Development Tips

### Database Studio
View and edit database directly:
```bash
npm run db:studio
```

### Reset Database
```bash
npm run db:reset
```

### Linting
```bash
npm run lint
```

### Type Checking
TypeScript will check types during development and build.

## Support
For issues or questions:
1. Check FIXES_SUMMARY.md for implementation details
2. Review error logs in console
3. Verify database schema matches Prisma schema
4. Check API endpoint responses

## Next Steps
1. Add more products via admin dashboard
2. Test user registration and login
3. Create test orders
4. Explore commands functionality
5. Customize about page content
6. Add more features as needed

Happy coding! 🚀
