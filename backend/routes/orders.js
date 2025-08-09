const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const Order = require('../models/Order');

// Create new order => /api/orders/new
router.post('/new', isAuthenticatedUser, async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      deliveryDate,
      customization
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user.id,
      seller: orderItems[0].seller, // Assuming all items are from same seller
      deliveryDate,
      customization
    });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single order => /api/orders/:id
router.get('/:id', isAuthenticatedUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('seller', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the buyer, seller, or admin
    if (order.user._id.toString() !== req.user.id && 
        order.seller._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get logged in user orders => /api/orders/me
router.get('/me', isAuthenticatedUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('seller', 'name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update order status => /api/orders/:id/status (Seller/Admin only)
router.put('/:id/status', isAuthenticatedUser, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the seller or admin
    if (order.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update orders for your products'
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get seller's orders => /api/orders/seller/me
router.get('/seller/me', isAuthenticatedUser, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin Routes

// Get all orders (admin only) => /api/orders/admin/all
router.get('/admin/all', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('seller', 'name email');

    let totalAmount = 0;
    orders.forEach(order => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      totalAmount,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update order (admin only) => /api/orders/admin/:id
router.put('/admin/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete order (admin only) => /api/orders/admin/:id
router.delete('/admin/:id', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.remove();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 