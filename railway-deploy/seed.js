const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB for seeding');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample products data
const sampleProducts = [
  {
    name: 'Imported Cotton T-Shirt (Pre-owned)',
    description: 'High-quality cotton t-shirt in excellent condition. Perfect for casual wear.',
    price: 15.99,
    originalPrice: 29.99,
    condition: 'excellent',
    category: 'men',
    subCategory: 'shirts',
    brand: 'Nike',
    size: 'M',
    color: 'White',
    images: [
      {
        public_id: 'sample1',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ],
    stock: 5,
    isBiddingEnabled: true,
    currentBid: 18.50,
    isNegotiable: true,
    isAvailable: true,
    tags: ['cotton', 'casual', 'pre-owned'],
    ratings: 4.5,
    numOfReviews: 12
  },
  {
    name: 'Vintage Denim Jacket (Second-hand)',
    description: 'Classic vintage denim jacket with authentic wear. Unique piece for fashion enthusiasts.',
    price: 45.99,
    originalPrice: 89.99,
    condition: 'good',
    category: 'men',
    subCategory: 'jackets',
    brand: 'Levi\'s',
    size: 'L',
    color: 'Blue',
    images: [
      {
        public_id: 'sample2',
        url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ],
    stock: 2,
    isBiddingEnabled: true,
    currentBid: 52.00,
    isNegotiable: true,
    isAvailable: true,
    tags: ['vintage', 'denim', 'jacket'],
    ratings: 4.8,
    numOfReviews: 8
  },
  {
    name: 'Imported Designer Dress (Pre-loved)',
    description: 'Elegant designer dress perfect for special occasions. Maintains its original beauty.',
    price: 65.99,
    originalPrice: 199.99,
    condition: 'excellent',
    category: 'women',
    subCategory: 'dresses',
    brand: 'Zara',
    size: 'S',
    color: 'Black',
    images: [
      {
        public_id: 'sample3',
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ],
    stock: 1,
    isBiddingEnabled: false,
    currentBid: 0,
    isNegotiable: true,
    isAvailable: true,
    tags: ['designer', 'elegant', 'dress'],
    ratings: 4.7,
    numOfReviews: 15
  },
  {
    name: 'Imported Casual Blouse (Second-hand)',
    description: 'Comfortable and stylish blouse suitable for office and casual wear.',
    price: 25.99,
    originalPrice: 49.99,
    condition: 'good',
    category: 'women',
    subCategory: 'shirts',
    brand: 'H&M',
    size: 'M',
    color: 'Pink',
    images: [
      {
        public_id: 'sample4',
        url: 'https://images.unsplash.com/photo-1564257631407-3deb25e9c8e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ],
    stock: 3,
    isBiddingEnabled: true,
    currentBid: 28.75,
    isNegotiable: true,
    isAvailable: true,
    tags: ['casual', 'blouse', 'office'],
    ratings: 4.3,
    numOfReviews: 9
  },
  {
    name: 'Imported Kids Hoodie (Pre-owned)',
    description: 'Warm and comfortable hoodie perfect for kids. Great condition with minimal wear.',
    price: 20.99,
    originalPrice: 39.99,
    condition: 'excellent',
    category: 'kids',
    subCategory: 'sweaters',
    brand: 'Gap Kids',
    size: 'M',
    color: 'Gray',
    images: [
      {
        public_id: 'sample5',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ],
    stock: 4,
    isBiddingEnabled: false,
    currentBid: 0,
    isNegotiable: true,
    isAvailable: true,
    tags: ['kids', 'hoodie', 'warm'],
    ratings: 4.6,
    numOfReviews: 6
  },
  {
    name: 'Imported Formal Shirt (Second-hand)',
    description: 'Professional formal shirt suitable for business meetings and formal events.',
    price: 35.99,
    originalPrice: 69.99,
    condition: 'excellent',
    category: 'men',
    subCategory: 'shirts',
    brand: 'Tommy Hilfiger',
    size: 'L',
    color: 'White',
    images: [
      {
        public_id: 'sample6',
        url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
      }
    ],
    stock: 2,
    isBiddingEnabled: true,
    currentBid: 38.25,
    isNegotiable: true,
    isAvailable: true,
    tags: ['formal', 'business', 'professional'],
    ratings: 4.4,
    numOfReviews: 11
  }
];

// Create admin user and sample products
const seedDatabase = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@threadswear.pk' });
    
    let adminUser;
    if (!existingAdmin) {
      // Create admin user
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@threadswear.pk',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });

      console.log('Admin user created successfully:', {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      });
    } else {
      adminUser = existingAdmin;
      console.log('Admin user already exists');
    }

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      // Create sample products
      const productsWithSeller = sampleProducts.map(product => ({
        ...product,
        seller: adminUser._id
      }));

      const createdProducts = await Product.insertMany(productsWithSeller);
      console.log(`${createdProducts.length} sample products created successfully`);
    } else {
      console.log('Sample products already exist');
    }

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 