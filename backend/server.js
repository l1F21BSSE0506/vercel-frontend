const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config.env') });

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');

// Import error handling middleware
const errorMiddleware = require('./middleware/error');

const app = express();

// Simple CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://vercel-frontend-liart.vercel.app',
    'https://vercel-frontend-git-main-omers-projects-0989ee6d.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
}));

// Handle CORS preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route (no database required)
app.get('/health', (req, res) => {
  console.log('Health check requested at:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Railway:', !!process.env.RAILWAY);
  console.log('Port:', process.env.PORT);
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'Threadswear.pk API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    mongodb_uri_set: !!process.env.MONGODB_URI,
    railway: !!process.env.RAILWAY,
    port: process.env.PORT || 5000,
    uptime: process.uptime()
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
    railway: !!process.env.RAILWAY
  });
});

// Simple test route (no database required)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    env: process.env.NODE_ENV,
    railway: !!process.env.RAILWAY,
    mongodb_uri_set: !!process.env.MONGODB_URI
  });
});

// Simple CORS test route
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
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

app.use('/api/chat', async (req, res, next) => {
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
app.use('/api/chat', chatRoutes);

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
        connectTimeoutMS: 15000,
        retryWrites: true,
        w: 'majority'
      };

      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
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

// Initialize connection (non-blocking)
setTimeout(() => {
  connectDB().catch((error) => {
    console.error('Initial MongoDB connection failed, but server will continue:', error.message);
    console.log('Server will start without database connection. Database-dependent routes will fail.');
  });
}, 1000); // Delay connection attempt to allow server to start first

// Start server for Railway (production) and local development
const PORT = process.env.PORT || 5000;
console.log('Environment variables check:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- RAILWAY:', process.env.RAILWAY);
console.log('- Using port:', PORT);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Railway: ${!!process.env.RAILWAY}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = app; 