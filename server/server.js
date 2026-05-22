const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { sendSuccess } = require('./utils/responseHelpers');

dotenv.config();

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect MongoDB:', error);
    process.exit(1);
  });

module.exports = { app};