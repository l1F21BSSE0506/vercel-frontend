#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build for frontend...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Please run this from the project root.');
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the frontend
  console.log('🔨 Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Frontend build completed successfully!');
  console.log('📁 Output directory: dist/');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
