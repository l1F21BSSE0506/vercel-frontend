const jwt = require('jsonwebtoken');

// JWT configuration with fallbacks
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || 604800; // 7 days in seconds

/**
 * Generate JWT token for user
 * @param {Object} payload - Token payload (id, role, etc.)
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE
    });
  } catch (error) {
    console.error('JWT Token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT Token verification error:', error);
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRE
};
