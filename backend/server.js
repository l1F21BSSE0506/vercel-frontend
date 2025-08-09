const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

// Import error handling middleware
const errorMiddleware = require('./middleware/error');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.vercel.app',

    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route (no database required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Threadswear.pk API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    mongodb_uri_set: !!process.env.MONGODB_URI,
    vercel: !!process.env.VERCEL
  });
});

// Health check route (no database required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Threadswear.pk API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    mongodb_uri_set: !!process.env.MONGODB_URI,
    vercel: !!process.env.VERCEL
  });
});

// Simple test route (no database required)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    mongodb_uri_set: !!process.env.MONGODB_URI
  });
});

// Database test route (tests connection specifically)
app.get('/api/db-test', async (req, res) => {
  try {
    await connectDB();
    res.json({ 
      success: true,
      message: 'Database connection successful',
      connected: isConnected,
      readyState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Database connection middleware (only for routes that need database)
app.use('/api/auth', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting connection...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.use('/api/products', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting connection...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.use('/api/orders', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting connection...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.use('/api/users', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, attempting connection...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorMiddleware);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// MongoDB connection setup for Vercel serverless
let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    throw new Error('MONGODB_URI not configured');
  }

  try {
    const mongooseOptions = {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      bufferCommands: true, // Enable buffering for better compatibility
      bufferMaxEntries: 0,
      connectTimeoutMS: 15000,
      retryWrites: true,
      w: 'majority'
    };

    // Add connection options to URI
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri.includes('?')) {
      mongoUri += '?retryWrites=true&w=majority&maxPoolSize=1';
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, mongooseOptions);
    isConnected = true;
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
};

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

// Initialize connection
connectDB().catch(console.error);

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
  });
}

module.exports = app; 