const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

/**
 * User Schema
 * Represents a user account in the devBoard application
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);