const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config({ path: '../config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample products data
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
    seller: null, // Will be set to admin user
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
    seller: null,
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
    seller: null,
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
    seller: null,
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
    seller: null,
    isAvailable: true,
    biddingEnabled: false
  }
];

// Product management functions
const productManager = {
  // Add a single product
  async addProduct(productData) {
    try {
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        console.log('Creating admin user...');
        const adminUser = new User({
          name: 'Admin User',
          email: 'admin@threadswear.com',
          password: 'admin123',
          role: 'admin'
        });
        await adminUser.save();
      }

      const product = new Product({
        ...productData,
        seller: adminUser._id
      });
      
      const savedProduct = await product.save();
      console.log(`✅ Product added: ${savedProduct.name}`);
      return savedProduct;
    } catch (error) {
      console.error('❌ Error adding product:', error.message);
    }
  },

  // Add multiple products
  async addMultipleProducts(products) {
    console.log('Adding multiple products...');
    for (const product of products) {
      await this.addProduct(product);
    }
    console.log('✅ All products added successfully!');
  },

  // List all products
  async listProducts() {
    try {
      const products = await Product.find().populate('seller', 'name email');
      console.log('\n📋 Current Products:');
      console.log('='.repeat(80));
      
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: $${product.price} | Condition: ${product.condition}`);
        console.log(`   Category: ${product.category} | Size: ${product.size}`);
        console.log(`   Bidding: ${product.biddingEnabled ? 'Enabled' : 'Disabled'}`);
        if (product.biddingEnabled) {
          console.log(`   Current Bid: $${product.currentBid || product.price}`);
        }
        console.log(`   Available: ${product.isAvailable ? 'Yes' : 'No'}`);
        console.log(`   Seller: ${product.seller?.name || 'Unknown'}`);
        console.log('-'.repeat(80));
      });
      
      return products;
    } catch (error) {
      console.error('❌ Error listing products:', error.message);
    }
  },

  // Update a product
  async updateProduct(productId, updateData) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );
      if (product) {
        console.log(`✅ Product updated: ${product.name}`);
        return product;
      } else {
        console.log('❌ Product not found');
      }
    } catch (error) {
      console.error('❌ Error updating product:', error.message);
    }
  },

  // Delete a product
  async deleteProduct(productId) {
    try {
      const product = await Product.findByIdAndDelete(productId);
      if (product) {
        console.log(`✅ Product deleted: ${product.name}`);
        return product;
      } else {
        console.log('❌ Product not found');
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error.message);
    }
  },

  // Search products
  async searchProducts(query) {
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }
        ]
      }).populate('seller', 'name email');
      
      console.log(`\n🔍 Search results for "${query}":`);
      console.log('='.repeat(80));
      
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price}`);
      });
      
      return products;
    } catch (error) {
      console.error('❌ Error searching products:', error.message);
    }
  },

  // Get product statistics
  async getStats() {
    try {
      const totalProducts = await Product.countDocuments();
      const availableProducts = await Product.countDocuments({ isAvailable: true });
      const biddingProducts = await Product.countDocuments({ biddingEnabled: true });
      const categories = await Product.distinct('category');
      
      console.log('\n📊 Product Statistics:');
      console.log('='.repeat(40));
      console.log(`Total Products: ${totalProducts}`);
      console.log(`Available Products: ${availableProducts}`);
      console.log(`Bidding Products: ${biddingProducts}`);
      console.log(`Categories: ${categories.join(', ')}`);
      
      return { totalProducts, availableProducts, biddingProducts, categories };
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
    }
  }
};

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'add':
      if (args[1] === 'sample') {
        await productManager.addMultipleProducts(sampleProducts);
      } else {
        console.log('Usage: node manageProducts.js add sample');
      }
      break;
      
    case 'list':
      await productManager.listProducts();
      break;
      
    case 'search':
      if (args[1]) {
        await productManager.searchProducts(args[1]);
      } else {
        console.log('Usage: node manageProducts.js search <query>');
      }
      break;
      
    case 'stats':
      await productManager.getStats();
      break;
      
    case 'update':
      if (args[1] && args[2]) {
        const updateData = JSON.parse(args[2]);
        await productManager.updateProduct(args[1], updateData);
      } else {
        console.log('Usage: node manageProducts.js update <productId> \'{"price": 29.99}\'');
      }
      break;
      
    case 'delete':
      if (args[1]) {
        await productManager.deleteProduct(args[1]);
      } else {
        console.log('Usage: node manageProducts.js delete <productId>');
      }
      break;
      
    default:
      console.log(`
🎯 Product Management Tool

Usage:
  node manageProducts.js <command> [options]

Commands:
  add sample          - Add sample products to database
  list               - List all products
  search <query>     - Search products by name, description, category, or brand
  stats              - Show product statistics
  update <id> <data> - Update a product (data in JSON format)
  delete <id>        - Delete a product

Examples:
  node manageProducts.js add sample
  node manageProducts.js list
  node manageProducts.js search "denim"
  node manageProducts.js stats
  node manageProducts.js update 507f1f77bcf86cd799439011 '{"price": 29.99}'
  node manageProducts.js delete 507f1f77bcf86cd799439011
      `);
  }
  
  process.exit(0);
}

main().catch(console.error); 