# E-Commerce Website

A full-featured e-commerce platform built with Next.js 15, TypeScript, Prisma, and Stripe.

## Features

### Customer Features
- 🛍️ Browse products with search and filtering
- 🛒 Shopping cart with localStorage persistence
- ⚡ Buy Now button for instant checkout
- 💳 Secure checkout with Stripe
- 👤 User authentication (NextAuth.js)
- 📝 User registration with full profile (name, phone, address, city, country, ZIP)
- 📦 Order history and downloads
- 📱 Responsive design

### Admin Features
- 📊 Dashboard with sales analytics
- ➕ Product management (CRUD)
- 📋 Order management
- 🔒 Protected admin routes
- 👥 User management

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ecommerce-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-admin-password"
```

4. Set up the database:
```bash
npx prisma migrate dev
npm run db:seed
```

5. Start the development server:

**Quick Start (Recommended):**
```bash
# Windows
startup.bat

# Linux/Mac/Git Bash
bash startup.sh
```

**Or manually:**
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

After seeding the database, you can log in with:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Customer Account:**
- Email: customer@example.com
- Password: customer123

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── account/           # Customer account pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   └── products/          # Product pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin-specific components
│   └── products/         # Product-related components
├── contexts/             # React contexts (Cart, etc.)
├── lib/                  # Utility functions
└── prisma/               # Database schema and migrations
```

## Database Schema

- **Product:** Digital products with pricing, files, and images
- **User:** Customer and admin accounts with full profile (email, password, name, phone, address, city, country, ZIP code)
- **Order:** Purchase records linking users and products
- **DownloadVerification:** Secure download tokens

## API Routes

- `GET/POST /api/products` - Product listing and creation
- `GET/PUT/DELETE /api/products/[id]` - Single product operations
- `POST /api/auth/register` - User registration
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Stripe Integration

### Testing Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and CVC

### Webhook Setup

For local development, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to your `.env` file.

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## License

MIT
