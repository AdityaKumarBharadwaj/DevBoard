const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/responseHelpers');


// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return sendError(res, 'Please provide all fields', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return sendError(res, 'Email already registered', 400);
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);    // Salt Rounds / Cost Factor
    // Bcrypt performs repeated CPU-intensive cryptographic computations involving the password and a random salt. The cost factor controls how many rounds of this expensive computation are performed.

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    // Generate auth token
    const token = generateToken(user._id);

    // Send success response
    return sendSuccess(
      res,
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Login existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);   // defined in User schema

    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Generate auth token
    const token = generateToken(user._id);

    // Send success response
    return sendSuccess(res, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


// Get current logged-in user
// GET /api/auth/me
const getMe = async (req, res) => {
  return sendSuccess(res, req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};