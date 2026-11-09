/**
 * Database Connection Configuration
 * ============================================================================
 * Establishes a persistent connection to MongoDB using Mongoose.
 * Logs host details on successful connection or terminates process on failure.
 * ============================================================================
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance using the MONGO_URI environment variable.
 * Logs the connected host (e.g., localhost/127.0.0.1 or MongoDB Atlas cluster address).
 * Exits the process with code 1 if connection fails.
 * 
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
