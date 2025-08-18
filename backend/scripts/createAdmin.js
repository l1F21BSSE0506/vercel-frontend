const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './config.env' });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asf', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: 'admin@asf.com',
      password: 'Admin123!@#', // This will be hashed automatically
      role: 'admin',
      isVerified: true
    };

    const admin = await User.create(adminData);
    console.log('Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', adminData.password);
    console.log('Role:', admin.role);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();
