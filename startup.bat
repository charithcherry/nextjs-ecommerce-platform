@echo off
echo ====================================
echo Starting E-Commerce Application...
echo ====================================
echo.

REM Check if .env file exists
echo [1/9] Checking environment configuration...
if not exist .env (
    echo [!] .env file not found! Creating from .env.example...
    copy .env.example .env
    echo [!] Please update .env with your configuration
) else (
    echo [OK] .env file found
)
echo.

REM Check if node_modules exists
echo [2/9] Checking dependencies...
if not exist node_modules (
    echo [!] node_modules not found. Installing dependencies...
    call npm install
) else (
    echo [OK] Dependencies already installed
)
echo.

REM Clean up old Prisma client and Next.js cache
echo [3/9] Cleaning old cache...
if exist node_modules\.prisma\client rmdir /s /q node_modules\.prisma\client
if exist .next rmdir /s /q .next
echo [OK] Cache cleaned
echo.

REM Generate Prisma Client
echo [4/9] Generating Prisma Client...
call npx prisma generate --no-engine >nul 2>&1
call npx prisma generate >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Prisma Client generated
) else (
    echo [ERROR] Failed to generate Prisma Client
    pause
    exit /b 1
)
echo.

REM Push database schema
echo [5/9] Syncing database schema...
call npx prisma db push >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Database schema synced
) else (
    echo [!] Database sync had issues ^(may be normal if already synced^)
)
echo.

REM Check if database needs seeding
echo [6/9] Checking database seed status...
if not exist prisma\dev.db (
    echo [!] Database is empty. Seeding...
    call npm run db:seed
    if %errorlevel% equ 0 (
        echo [OK] Database seeded with test data
    ) else (
        echo [ERROR] Failed to seed database
    )
) else (
    echo [OK] Database file exists
)
echo.

REM Check Stripe configuration
echo [7/9] Checking Stripe configuration...
findstr /C:"STRIPE_SECRET_KEY=\"sk_test_" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Stripe test keys configured
) else (
    echo [!] Stripe not configured ^(payments won't work^)
    echo     See STRIPE_SETUP_GUIDE.md for setup instructions
)
echo.

REM Kill any process on port 3000
echo [8/9] Clearing port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] Port 3000 cleared
echo.

REM Start the development server
echo [9/9] Starting development server...
echo.
echo ====================================
echo.
echo    Application Starting!
echo.
echo    Local:    http://localhost:3000
echo    Sign In:  http://localhost:3000/auth/signin
echo    Sign Up:  http://localhost:3000/auth/signup
echo    Products: http://localhost:3000/products
echo    Admin:    http://localhost:3000/admin
echo.
echo    Demo Credentials:
echo    Admin:    admin@example.com / admin123
echo    Customer: customer@example.com / customer123
echo.
echo ====================================
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
call npm run dev
