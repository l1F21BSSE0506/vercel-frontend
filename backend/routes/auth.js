const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const User = require('../models/User');

// Register user => /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'buyer' } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'buyer',
      isVerified: true
    });

    // Create token
    const token = user.getJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

// Login user => /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password is entered by user
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email & password'
      });
    }

    // Finding user in database (case-insensitive email search)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email or Password'
      });
    }

    // Check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email or Password'
      });
    }

    // Create token
    const token = user.getJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

// Logout user => /api/auth/logout
router.get('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get currently logged in user details => /api/auth/me
router.get('/me', isAuthenticatedUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile => /api/auth/me/update
router.put('/me/update', isAuthenticatedUser, async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin Routes

// Get all users (admin only) => /api/auth/admin/users
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user details (admin only) => /api/auth/admin/user/:id
router.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user role (admin only) => /api/auth/admin/user/:id
router.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete user (admin only) => /api/auth/admin/user/:id
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create admin user (for initial setup) => /api/auth/create-admin
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    // Create admin user
    const adminUser = await User.create({
      name: name || 'Admin User',
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
      isVerified: true
    });

    // Create token
    const token = adminUser.getJwtToken();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create admin user'
      });
  }
});

module.exports = router; 