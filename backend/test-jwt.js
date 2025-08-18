// Test JWT functionality
require('dotenv').config({ path: './config.env' });

const { generateToken, verifyToken } = require('./utils/jwt');

console.log('🔍 Testing JWT functionality...');
console.log('Environment variables:');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('  JWT_EXPIRE:', process.env.JWT_EXPIRE);

try {
  // Test token generation
  const payload = { id: 'test123', role: 'buyer' };
  console.log('\n📝 Generating token with payload:', payload);
  
  const token = generateToken(payload);
  console.log('✅ Token generated successfully:', token.substring(0, 50) + '...');
  
  // Test token verification
  console.log('\n🔍 Verifying token...');
  const decoded = verifyToken(token);
  console.log('✅ Token verified successfully:', decoded);
  
  console.log('\n🎉 JWT functionality is working correctly!');
  
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
  console.error('Full error:', error);
}
