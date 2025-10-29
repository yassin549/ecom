#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Running custom postinstall script...');

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Check if binaries exist
  const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
  
  if (fs.existsSync(prismaClientPath)) {
    const files = fs.readdirSync(prismaClientPath);
    console.log('✅ Prisma binaries found:');
    files.filter(f => f.includes('query_engine')).forEach(f => {
      console.log(`   - ${f}`);
    });
  } else {
    console.warn('⚠️  Prisma client path not found');
  }

  console.log('✅ Postinstall complete!');
} catch (error) {
  console.error('❌ Postinstall failed:', error.message);
  process.exit(1);
}
