# Fix Vercel Deployment - Prisma Issues
# Run this script before redeploying to Vercel

Write-Host "🔧 Fixing Vercel Deployment Issues..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean existing Prisma client
Write-Host "1️⃣ Cleaning existing Prisma client..." -ForegroundColor Yellow
Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\@prisma\client" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Cleaned" -ForegroundColor Green
Write-Host ""

# Step 2: Regenerate Prisma client with correct binary
Write-Host "2️⃣ Generating Prisma client for Vercel..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Generated" -ForegroundColor Green
Write-Host ""

# Step 3: Verify binary exists
Write-Host "3️⃣ Verifying Prisma engine binary..." -ForegroundColor Yellow
$binaryPath = "node_modules\.prisma\client\libquery_engine-debian-openssl-3.0.x.so.node"
if (Test-Path $binaryPath) {
    Write-Host "✅ Binary found: $binaryPath" -ForegroundColor Green
} else {
    Write-Host "❌ Binary NOT found! This will fail on Vercel!" -ForegroundColor Red
    Write-Host "Expected path: $binaryPath" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 4: Clean build artifacts
Write-Host "4️⃣ Cleaning build artifacts..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Cleaned" -ForegroundColor Green
Write-Host ""

# Step 5: Test local build
Write-Host "5️⃣ Testing local build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Fix errors before deploying!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 6: Git commit
Write-Host "6️⃣ Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "fix: Update Prisma configuration for Vercel deployment"
Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Ready to deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub: git push origin main" -ForegroundColor White
Write-Host "2. Vercel will auto-deploy" -ForegroundColor White
Write-Host "3. Check deployment logs at: https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Or deploy manually:" -ForegroundColor Cyan
Write-Host "npm run deploy:prod" -ForegroundColor White
