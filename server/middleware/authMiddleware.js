const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHelpers');

/**
 * Middleware to protect routes and verify JWT token
 * Attaches user to req.user if token is valid
 */
const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Not authorized, no token', 401);
    }

    // Extract token from 'Bearer <token>'
    const token = authHeader.slice(7);

    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return sendError(res, 'Not authorized, token failed', 401);
    }

    // Fetch user from database, excluding password hash
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return sendError(res, 'Not authorized, token failed', 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized, token failed', 401);
  }
};

module.exports = protect;
