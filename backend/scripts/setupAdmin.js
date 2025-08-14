const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/asf';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', existingAdmin.email);
      console.log('   If you need to reset the admin password, delete the user first');
      return;
    }

    // Get admin credentials from environment or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@asf.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
    const adminName = process.env.ADMIN_NAME || 'ASF Admin';

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log('⚠️  Using default admin credentials. For production, set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
      console.log('   Default Email:', adminEmail);
      console.log('   Default Password:', adminPassword);
    }

    // Create admin user
    const adminData = {
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true
    };

    const admin = await User.create(adminData);
    console.log('✅ Admin user created successfully!');
    console.log('   Name:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log('   ⚠️  Please change these credentials after first login!');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
setupAdmin();
