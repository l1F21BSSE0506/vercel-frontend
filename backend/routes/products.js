const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const Product = require('../models/Product');

// Get all products => /api/products
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, condition, minPrice, maxPrice, search } = req.query;
    
    let query = { isAvailable: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by sub-category
    if (subCategory) {
      query.subCategory = subCategory;
    }
    
    // Filter by condition
    if (condition) {
      query.condition = condition;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).populate('seller', 'name email');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single product => /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new product => /api/products/new (Seller/Admin only)
router.post('/new', isAuthenticatedUser, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    req.body.seller = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update product => /api/products/:id (Seller/Admin only)
router.put('/:id', isAuthenticatedUser, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own products'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete product => /api/products/:id (Seller/Admin only)
router.delete('/:id', isAuthenticatedUser, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own products'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Place bid on product => /api/products/:id/bid
router.post('/:id/bid', isAuthenticatedUser, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid bid amount'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isBiddingEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Bidding is not enabled for this product'
      });
    }

    if (product.biddingEndDate && new Date() > product.biddingEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Bidding has ended for this product'
      });
    }

    if (amount <= product.currentBid) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be higher than current bid'
      });
    }

    // Add bid to product
    product.bids.push({
      bidder: req.user.id,
      amount: amount,
      bidDate: new Date()
    });

    product.currentBid = amount;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Bid placed successfully',
      currentBid: amount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get seller's products => /api/products/seller/me
router.get('/seller/me', isAuthenticatedUser, authorizeRoles('seller', 'admin'), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin Routes

// Get all products (admin only) => /api/products/admin/all
router.get('/admin/all', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update product status (admin only) => /api/products/admin/:id/status
router.put('/admin/:id/status', isAuthenticatedUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 