const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server health endpoint...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test API test endpoint
    const testResponse = await axios.get('http://localhost:5000/api/test');
    console.log('✅ API test passed:', testResponse.data);
    
    console.log('\n🎉 Server is working correctly!');
    
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testServer();
}

module.exports = testServer;
