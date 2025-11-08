@echo off
echo ========================================
echo  FIX VERCEL DEPLOYMENT - PRISMA ISSUES
echo ========================================
echo.

echo [1/5] Cleaning Prisma client...
rmdir /s /q node_modules\.prisma 2>nul
rmdir /s /q node_modules\@prisma\client 2>nul
echo Done.
echo.

echo [2/5] Regenerating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo Done.
echo.

echo [3/5] Verifying binary exists...
if exist "node_modules\.prisma\client\libquery_engine-debian-openssl-3.0.x.so.node" (
    echo SUCCESS: Binary found!
) else (
    echo ERROR: Binary NOT found! Check schema.prisma
    pause
    exit /b 1
)
echo.

echo [4/5] Cleaning build artifacts...
rmdir /s /q .next 2>nul
echo Done.
echo.

echo [5/5] Testing build...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed! Fix errors before deploying.
    pause
    exit /b 1
)
echo.

echo ========================================
echo  SUCCESS! Ready to deploy!
echo ========================================
echo.
echo Next steps:
echo 1. git add .
echo 2. git commit -m "fix: Prisma deployment configuration"
echo 3. git push origin main
echo.
echo Vercel will auto-deploy with the fixes.
echo.
pause
