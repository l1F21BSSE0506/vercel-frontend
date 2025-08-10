const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Admin middleware - check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Get admin dashboard data
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ isAvailable: true });
    const biddingProducts = await Product.countDocuments({ biddingEnabled: true });
    const totalUsers = await User.countDocuments();
    const categories = await Product.distinct('category');
    
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('seller', 'name email');

    res.json({
      stats: {
        totalProducts,
        availableProducts,
        biddingProducts,
        totalUsers,
        categories
      },
      recentProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products with pagination
router.get('/products', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new product
router.post('/products', adminAuth, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user._id
    };
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('seller', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add sample products
router.post('/seed-products', adminAuth, async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Classic White T-Shirt",
        description: "Premium cotton classic white t-shirt, perfect for everyday wear",
        price: 25.99,
        condition: "New",
        category: "T-Shirts",
        size: "M",
        brand: "ThreadWear",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        seller: req.user._id,
        isAvailable: true,
        biddingEnabled: false
      },
      {
        name: "Denim Jacket",
        description: "Vintage-style denim jacket with modern fit",
        price: 89.99,
        condition: "Like New",
        category: "Jackets",
        size: "L",
        brand: "DenimCo",
        images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500"],
        seller: req.user._id,
        isAvailable: true,
        biddingEnabled: true,
        currentBid: 75.00,
        minBidIncrement: 5.00
      },
      {
        name: "Slim Fit Jeans",
        description: "Comfortable slim fit jeans in dark wash",
        price: 65.00,
        condition: "New",
        category: "Jeans",
        size: "32x32",
        brand: "FitStyle",
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"],
        seller: req.user._id,
        isAvailable: true,
        biddingEnabled: false
      },
      {
        name: "Casual Hoodie",
        description: "Warm and comfortable hoodie for casual wear",
        price: 45.99,
        condition: "Good",
        category: "Hoodies",
        size: "XL",
        brand: "ComfortWear",
        images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"],
        seller: req.user._id,
        isAvailable: true,
        biddingEnabled: true,
        currentBid: 35.00,
        minBidIncrement: 3.00
      },
      {
        name: "Formal Dress Shirt",
        description: "Professional dress shirt for business meetings",
        price: 55.00,
        condition: "New",
        category: "Shirts",
        size: "L",
        brand: "Professional",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"],
        seller: req.user._id,
        isAvailable: true,
        biddingEnabled: false
      }
    ];
    
    const savedProducts = await Product.insertMany(sampleProducts);
    res.json({ message: `${savedProducts.length} sample products added successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 