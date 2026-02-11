#!/bin/bash

echo "🚀 Starting E-Commerce Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if .env file exists
echo "1️⃣ Checking environment configuration..."
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo "   Creating .env from .env.example..."
    cp .env.example .env
    print_warning "Please update .env with your configuration"
else
    print_success ".env file found"
fi
echo ""

# Check if node_modules exists
echo "2️⃣ Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
else
    print_success "Dependencies already installed"
fi
echo ""

# Clean up old Prisma client and Next.js cache
echo "3️⃣ Cleaning old cache..."
rm -rf node_modules/.prisma/client 2>/dev/null
rm -rf .next 2>/dev/null
print_success "Cache cleaned"
echo ""

# Generate Prisma Client
echo "4️⃣ Generating Prisma Client..."
npx prisma generate --no-engine > /dev/null 2>&1
npx prisma generate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Prisma Client generated"
else
    print_error "Failed to generate Prisma Client"
    exit 1
fi
echo ""

# Push database schema
echo "5️⃣ Syncing database schema..."
npx prisma db push > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Database schema synced"
else
    print_warning "Database sync had issues (may be normal if already synced)"
fi
echo ""

# Check if database needs seeding
echo "6️⃣ Checking database seed status..."
USER_COUNT=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM User;" 2>/dev/null || echo "0")
if [ "$USER_COUNT" = "0" ]; then
    print_warning "Database is empty. Seeding..."
    npm run db:seed
    if [ $? -eq 0 ]; then
        print_success "Database seeded with test data"
    else
        print_error "Failed to seed database"
    fi
else
    print_success "Database already has $USER_COUNT users"
fi
echo ""

# Check Stripe configuration
echo "7️⃣ Checking Stripe configuration..."
if grep -q "STRIPE_SECRET_KEY=\"sk_test_" .env 2>/dev/null; then
    print_success "Stripe test keys configured"
else
    print_warning "Stripe not configured (payments won't work)"
    echo "   See STRIPE_SETUP_GUIDE.md for setup instructions"
fi
echo ""

# Kill any process on port 3000
echo "8️⃣ Clearing port 3000..."
PORT_PID=$(netstat -ano | grep :3000 | grep LISTENING | awk '{print $5}' | head -1)
if [ ! -z "$PORT_PID" ]; then
    taskkill /F /PID $PORT_PID > /dev/null 2>&1
    print_success "Cleared port 3000"
else
    print_success "Port 3000 is available"
fi
echo ""

# Start the development server
echo "9️⃣ Starting development server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "🎉 Application Starting!"
echo ""
echo "   📱 Local:    http://localhost:3000"
echo "   🔐 Sign In:  http://localhost:3000/auth/signin"
echo "   📝 Sign Up:  http://localhost:3000/auth/signup"
echo "   🛍️  Products: http://localhost:3000/products"
echo "   ⚙️  Admin:    http://localhost:3000/admin"
echo ""
echo "   Demo Credentials:"
echo "   Admin:    admin@example.com / admin123"
echo "   Customer: customer@example.com / customer123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev
