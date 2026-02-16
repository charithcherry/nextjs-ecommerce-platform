# E-Commerce Website

A full-featured e-commerce platform built with Next.js 15, TypeScript, Prisma, and Stripe.

## Features

### Customer Features
- 🛍️ **Product Browsing:** Browse products with search, sorting, and category filtering
- 🎨 **Product Images:** High-quality product images with automatic fallback handling
- 🏷️ **Categories:** Filter products by categories (E-Books, Templates, Software, Graphics, Courses, Music, Video, Photos)
- 🛒 **Shopping Cart:** Persistent cart with user-specific storage
- ⚡ **Buy Now:** Quick checkout with instant cart-to-checkout flow
- 💳 **Secure Payments:** Stripe-powered checkout with PCI compliance
- 👤 **Authentication:** NextAuth.js with email/password login
- 📝 **User Registration:** Full profile support (name, phone, address, city, country, ZIP)
- 📦 **Order History:** View all past purchases with order details
- 📥 **Secure Downloads:** Time-limited download tokens (24-hour expiry) for digital products
- 📱 **Responsive Design:** Mobile-first design with Tailwind CSS

### Admin Features
- 📊 **Dashboard:** Real-time analytics (revenue, orders, products, users)
- ➕ **Product Management:** Full CRUD operations with image upload
- 📁 **File Upload:** Direct image and file uploads with validation
- 🏷️ **Category Management:** Create, edit, and manage product categories
- 🔗 **Category Assignment:** Assign multiple categories to products
- 🗑️ **Soft Delete:** Preserve order history when deleting products
- 📋 **Order Management:** View all orders with customer and product details
- 🔒 **Protected Routes:** Middleware-based admin authentication
- 🎨 **Product Images:** Visual product display in admin panel

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
npx prisma db push
npx tsx prisma/seed.ts
npx tsx prisma/seed-categories.ts
npx tsx prisma/seed-products.ts
```

This will:
- Create the database schema
- Seed admin and customer accounts
- Add 8 product categories
- Add 28 diverse products across all categories

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
│   ├── admin/             # Admin dashboard
│   │   ├── categories/   # Category management
│   │   ├── products/     # Product management
│   │   └── orders/       # Order management
│   ├── api/               # API routes
│   │   ├── categories/   # Category CRUD
│   │   ├── products/     # Product CRUD
│   │   ├── downloads/    # Secure download system
│   │   ├── upload/       # File upload handler
│   │   └── webhooks/     # Stripe webhooks
│   ├── auth/              # Authentication pages
│   ├── account/           # Customer account & orders
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   └── products/          # Product catalog & details
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # ProductForm, CategoryForm
│   └── products/         # ProductImage, AddToCart, BuyNow
├── contexts/             # React contexts (Cart with memoization)
├── lib/                  # Auth, DB, Stripe, utilities
└── prisma/               # Schema, seeds, migrations
public/
└── uploads/              # User-uploaded files
```

## Database Schema

- **Product:** Digital products with pricing, files, images, categories, and soft-delete support
- **Category:** Product categories with unique slugs for filtering
- **User:** Customer and admin accounts with full profile (email, password, name, phone, address, city, country, ZIP code)
- **Order:** Purchase records linking users and products
- **DownloadVerification:** Time-limited secure download tokens (24-hour expiry)

## API Routes

### Products
- `GET /api/products` - List products with category filtering
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product with categories (admin only)
- `DELETE /api/products/[id]` - Soft-delete product (admin only)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/[id]` - Update category (admin only)
- `DELETE /api/categories/[id]` - Delete category (admin only)

### File Management
- `POST /api/upload` - Upload images and files (admin only)
- `GET /api/downloads/[id]` - Download digital product with token verification

### Authentication & Checkout
- `POST /api/auth/register` - User registration
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe webhook handler (creates orders & download tokens)

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

## Key Features Explained

### 🎨 Product Images
- **Upload System:** Admin can upload images directly through the product form
- **Validation:** Supports JPEG, PNG, WebP up to 10MB
- **Display:** Next.js Image component with automatic optimization
- **Fallback:** Graceful handling of missing or broken images

### 📥 Secure Downloads
- **Token-Based:** Each purchase generates time-limited download tokens
- **24-Hour Expiry:** Tokens automatically expire after 24 hours
- **One-Time Use:** Tokens are deleted after download
- **Order Preservation:** Tokens regenerate for each purchase

### 🏷️ Category System
- **8 Categories:** E-Books, Templates, Software, Graphics, Courses, Music, Video, Photos
- **Filtering:** Browse products by category
- **Multi-Assignment:** Products can belong to multiple categories
- **Admin Management:** Full CRUD operations for categories

### 🗑️ Soft Delete
- **History Preservation:** Deleted products retain order history
- **Admin View:** Deleted products visible in admin panel with badge
- **No Accidental Loss:** Can't delete products with existing orders

### 🛒 Enhanced Cart
- **Memoization:** Optimized performance with useCallback
- **User-Specific:** Separate carts for each user
- **Persistence:** Cart survives page refreshes
- **Guest Support:** Anonymous users can shop too

## Sample Products

The database comes seeded with **28 diverse products** including:

- **E-Books:** Web Development, Python, Marketing, UI/UX Design
- **Templates:** Landing Pages, Dashboards, Email Templates, Resumes
- **Software:** Task Manager, Photo Editor, SEO Analyzer
- **Graphics:** Icons, Social Media Graphics, Logos, Stock Photos
- **Courses:** Full Stack Bootcamp, Machine Learning, Photoshop, Business
- **Music:** Royalty-Free Tracks, Sound Effects, Lo-Fi Beats
- **Video:** YouTube Intros, Stock Footage, Motion Graphics
- **Photos:** Minimalist, Food, Nature Collections

All with realistic pricing, descriptions, and Unsplash images.

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma db push` - Push schema changes to database
- `npx tsx prisma/seed.ts` - Seed user accounts
- `npx tsx prisma/seed-categories.ts` - Seed categories
- `npx tsx prisma/seed-products.ts` - Seed products
- `npx prisma studio` - Open Prisma Studio GUI

## License

MIT
