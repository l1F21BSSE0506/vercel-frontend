const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Threadswear.pk...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm version: ${npmVersion.trim()}`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm first.');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('cd backend && npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Check if config.env exists in backend
const configPath = path.join(__dirname, 'backend', 'config.env');
if (!fs.existsSync(configPath)) {
  console.log('\n⚙️  Creating backend configuration...');
  
  const configContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/threadswear
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
`;

  try {
    fs.writeFileSync(configPath, configContent);
    console.log('✅ Backend configuration created');
    console.log('⚠️  Please update the JWT_SECRET in backend/config.env for production');
  } catch (error) {
    console.error('❌ Failed to create backend configuration');
    process.exit(1);
  }
} else {
  console.log('✅ Backend configuration already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start MongoDB: mongod');
console.log('2. Seed the database: cd backend && npm run seed');
console.log('3. Start the full application: npm run dev:full');
console.log('4. Open http://localhost:5173 in your browser');
console.log('\n🔑 Default admin credentials:');
console.log('   Email: admin@threadswear.pk');
console.log('   Password: admin123');
console.log('\n📚 For more information, see README.md'); 