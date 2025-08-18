const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Password should be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    default: 'buyer',
    enum: ['buyer', 'seller', 'admin']
  },
  avatar: {
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  phoneNumber: {
    type: String,
    maxLength: [15, 'Phone number cannot exceed 15 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token
userSchema.methods.getJwtToken = function() {
  return generateToken({ id: this._id, role: this.role });
};

module.exports = mongoose.model('User', userSchema); 