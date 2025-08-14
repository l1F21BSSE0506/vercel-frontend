const mongoose = require('mongoose');
const axios = require('axios');

async function testNetwork() {
  console.log('🔍 Testing network connectivity...\n');
  
  // Test 1: Basic internet connectivity
  try {
    console.log('1. Testing basic internet connectivity...');
    const response = await axios.get('https://httpbin.org/ip', { timeout: 10000 });
    console.log('✅ Internet connectivity: OK');
    console.log('   Your IP:', response.data.origin);
  } catch (error) {
    console.log('❌ Internet connectivity: FAILED');
    console.log('   Error:', error.message);
  }
  
  // Test 2: MongoDB connection (if URI is available)
  if (process.env.MONGODB_URI) {
    console.log('\n2. Testing MongoDB connection...');
    try {
      const mongooseOptions = {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000
      };
      
      await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
      console.log('✅ MongoDB connection: OK');
      console.log('   Database:', mongoose.connection.db.databaseName);
      await mongoose.disconnect();
    } catch (error) {
      console.log('❌ MongoDB connection: FAILED');
      console.log('   Error:', error.message);
      
      if (error.message.includes('ENOTFOUND')) {
        console.log('   💡 This suggests a DNS resolution issue');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log('   💡 This suggests a network access issue');
      } else if (error.message.includes('ETIMEDOUT')) {
        console.log('   💡 This suggests a network timeout issue');
      }
    }
  } else {
    console.log('\n2. Testing MongoDB connection: SKIPPED (no MONGODB_URI)');
  }
  
  // Test 3: Railway environment
  console.log('\n3. Railway environment check...');
  console.log('   RAILWAY:', !!process.env.RAILWAY);
  console.log('   PORT:', process.env.PORT);
  console.log('   NODE_ENV:', process.env.NODE_ENV);
  
  console.log('\n🎯 Network test completed!');
}

// Only run if this file is executed directly
if (require.main === module) {
  testNetwork().catch(console.error);
}

module.exports = testNetwork;
