const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile => /api/users/profile
router.get('/profile', isAuthenticatedUser, async (req, res) => {
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

// Update user profile => /api/users/profile/update
router.put('/profile/update', isAuthenticatedUser, async (req, res) => {
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

// Get all users (admin only) => /api/users/admin/all
router.get('/admin/all', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
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

// Get user details (admin only) => /api/users/admin/:id
router.get('/admin/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
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

// Update user (admin only) => /api/users/admin/:id
router.put('/admin/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      isVerified: req.body.isVerified
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

// Delete user (admin only) => /api/users/admin/:id
router.delete('/admin/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
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

// Get users by role (admin only) => /api/users/admin/role/:role
router.get('/admin/role/:role', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role });

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

// Get dashboard stats (admin only) => /api/users/admin/stats
router.get('/admin/stats', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const buyers = await User.countDocuments({ role: 'buyer' });
    const sellers = await User.countDocuments({ role: 'seller' });
    const admins = await User.countDocuments({ role: 'admin' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        buyers,
        sellers,
        admins,
        verifiedUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 