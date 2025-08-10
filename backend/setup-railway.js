#!/usr/bin/env node

/**
 * Railway Deployment Setup Script
 * This script helps you prepare your backend for Railway deployment
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚂 Railway Deployment Setup for Threadswear Backend\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('🔐 Generated JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Check if package.json exists
const packagePath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json not found. Make sure you\'re in the backend directory.');
  process.exit(1);
}

// Check required dependencies
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const requiredDeps = ['express', 'mongoose', 'cors', 'dotenv', 'bcryptjs', 'jsonwebtoken'];
const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length > 0) {
  console.log('⚠️  Missing required dependencies:');
  missingDeps.forEach(dep => console.log(`   - ${dep}`));
  console.log('\nRun: npm install\n');
} else {
  console.log('✅ All required dependencies are installed\n');
}

// Environment variables template
const envTemplate = `# Railway Environment Variables
# Copy these to your Railway project environment variables

# Database
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority

# JWT Secret (use the one generated above)
JWT_SECRET=${jwtSecret}

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-app.vercel.app

# Railway specific
RAILWAY=true

# Optional: File upload configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
`;

console.log('📝 Environment Variables Template:');
console.log('Copy this to your Railway project variables:\n');
console.log(envTemplate);

console.log('\n📋 Next Steps:');
console.log('1. Go to railway.app and sign up with GitHub');
console.log('2. Create a new project from your GitHub repo');
console.log('3. Add the environment variables above to your Railway project');
console.log('4. Deploy and test your endpoints');
console.log('5. Update your frontend to use the new Railway backend URL');

console.log('\n🔗 Useful Links:');
console.log('- Railway Dashboard: https://railway.app/dashboard');
console.log('- Railway Docs: https://docs.railway.app');
console.log('- Deployment Guide: Check RAILWAY_DEPLOYMENT.md');

console.log('\n✨ Happy deploying!');
