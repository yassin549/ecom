# Deployment Fix Script for Vercel/Prisma Issues
# Run this script to prepare your project for deployment

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  E-Commerce Deployment Fix Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean Prisma artifacts
Write-Host "[1/5] Cleaning Prisma artifacts..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Path "node_modules\.prisma" -Recurse -Force
    Write-Host "  ✓ Removed .prisma folder" -ForegroundColor Green
}
if (Test-Path "node_modules\@prisma\client") {
    Remove-Item -Path "node_modules\@prisma\client" -Recurse -Force
    Write-Host "  ✓ Removed @prisma/client folder" -ForegroundColor Green
}
Write-Host ""

# Step 2: Regenerate Prisma Client
Write-Host "[2/5] Regenerating Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "  ✓ Prisma Client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to generate Prisma Client" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Check environment variables
Write-Host "[3/5] Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "  ✓ DATABASE_URL found in .env" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ DATABASE_URL not found in .env" -ForegroundColor Red
        Write-Host "    Make sure to set it in Vercel Dashboard" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ No .env file found" -ForegroundColor Yellow
    Write-Host "    Make sure environment variables are set in Vercel Dashboard" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Git status check
Write-Host "[4/5] Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "  ✓ Modified files found:" -ForegroundColor Green
    $gitStatus | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
    Write-Host ""
    $commit = Read-Host "  Do you want to commit and push changes? (y/n)"
    if ($commit -eq "y" -or $commit -eq "Y") {
        git add .
        git commit -m "fix: Resolve Prisma deployment issues on Vercel"
        Write-Host "  ✓ Changes committed" -ForegroundColor Green
        
        $push = Read-Host "  Push to origin/main? (y/n)"
        if ($push -eq "y" -or $push -eq "Y") {
            git push origin main
            Write-Host "  ✓ Changes pushed to GitHub" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  ⚠ No modified files to commit" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Summary
Write-Host "[5/5] Summary" -ForegroundColor Yellow
Write-Host "  ✓ Prisma Client regenerated" -ForegroundColor Green
Write-Host "  ✓ Configuration files updated:" -ForegroundColor Green
Write-Host "    - next.config.ts (removed webpack conflicts)" -ForegroundColor Gray
Write-Host "    - schema.prisma (correct binary targets)" -ForegroundColor Gray
Write-Host "    - vercel.json (added Prisma env vars)" -ForegroundColor Gray
Write-Host "    - api/categories/route.ts (using simple-db)" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "1. If you pushed changes, check Vercel Dashboard" -ForegroundColor White
Write-Host "   for automatic deployment" -ForegroundColor White
Write-Host ""
Write-Host "2. Verify environment variables in Vercel:" -ForegroundColor White
Write-Host "   - DATABASE_URL" -ForegroundColor Gray
Write-Host "   - DIRECT_URL" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the deployment:" -ForegroundColor White
Write-Host "   - Create a new category" -ForegroundColor Gray
Write-Host "   - Create a new product" -ForegroundColor Gray
Write-Host "   - Check Vercel Runtime Logs for errors" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed information, see VERCEL_FIX.md" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
