/**
 * Server Entry Point
 * ============================================================================
 * Initializes the Express application, sets up middleware (CORS, body parsing),
 * mounts API routes, connects to the database, and exposes health and error handlers.
 * ============================================================================
 */

const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables from .env
dotenv.config();

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 * Permits incoming requests from the configured frontend origin with credentials.
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

/**
 * Body Parsing Middleware
 * Parses incoming JSON payloads and URL-encoded query strings.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes Mounting
 */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

/**
 * Health Check Endpoint
 * GET /api/health
 * Used by cloud deployment platforms (Render, AWS, Docker, Kubernetes) for uptime
 * monitoring and container liveness probes, as well as quick manual verification.
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

/**
 * Global Error Handling Middleware
 * 
 * Express identifies this as an error handler because it defines exactly four parameters:
 * (err, req, res, next).
 * 
 * Catches any unhandled synchronous and forwarded asynchronous errors from routes,
 * logs the stack trace to the console, and returns a clean, standardized JSON response.
 * This prevents uncaught exceptions from terminating the Node.js process.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

/**
 * Establishes database connection and starts listening for HTTP requests.
 */
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

/**
 * Export the Express app instance for automated integration testing
 * (e.g., with Supertest/Jest) and serverless environments.
 */
module.exports = { app };
