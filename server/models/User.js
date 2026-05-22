const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

/**
 * User Schema
 * Represents a user account in the devBoard application
 */
const userSchema = new mongoose.Schema({
  /**
   * User's full name
   * @type {String}
   */
  name: {
    type: String,
    required: true,
    trim: true,
  },

  /**
   * User's email address (unique and stored in lowercase)
   * @type {String}
   */
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  /**
   * Hashed password for authentication
   * @type {String}
   */
  passwordHash: {
    type: String,
    required: true,
  },

  /**
   * Timestamp when the user account was created
   * @type {Date}
   */
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Instance method to compare entered password with stored hash
 * @param {String} enteredPassword - The plaintext password entered by user
 * @returns {Promise<Boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
