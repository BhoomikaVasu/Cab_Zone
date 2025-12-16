// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
// You no longer need: const dotenv = require('dotenv');

// --- 🛠️ CORRECTED DOTENV CONFIGURATION ---
// This line both imports the module and immediately runs the config method,
// pointing it to your 'key.env' file.
require('dotenv').config({ path: path.join(__dirname, 'key.env') });
// ------------------------------------------
const logger = require('./config/logger');
logger.info('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID); // Debugging line

const db = require('./config/db');
const admin = require('firebase-admin');
const licenseRoutes = require('./routes/LicenseRoutes');
const vehicleRoutes = require('./routes/VehicleRoutes');
const aadharRoutes = require('./routes/AadharRoutes');
const adminApiRoutes = require('./routes/AdminRoutes');
const driverRoutes = require('./routes/DriverRoutes');
const driverDocRoutes = require('./routes/DriverDocRoutes');
const authRoutes = require('./routes/AuthRoutes');

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
// Force Port 5000 to match Frontend Proxy and avoid conflict with Vite (3000)
const PORT = 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// ... rest of your server code remains the same ...
// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for authentication guards
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', limiter); // Apply rate limiting to all API routes
app.use('/api/licenses', licenseRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/drivers', driverDocRoutes);
app.use('/api/aadhar', aadharRoutes);
app.use('/api/admin', adminApiRoutes);
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Provide Firebase client config to browser
app.get('/config/firebase.json', (req, res) => {
  const projectId = process.env.FIREBASE_PROJECT_ID || '';
  const apiKey = process.env.FIREBASE_WEB_API_KEY || '';
  const authDomain = projectId ? `${projectId}.firebaseapp.com` : '';
  res.json({ apiKey, authDomain, projectId });
});

// Root path redirects to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Error handler middleware (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server starting on port ${PORT}...`);
  fs.writeFileSync('backend_port.txt', String(PORT));
  logger.info(`Server running on port ${PORT}. Open http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  logger.error('Server error:', error);
});

// Global error handling for uncaught exceptions/rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error('Uncaught Exception:', error);
  // process.exit(1); // Optional: keep functionality for now
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logger.error('Unhandled Rejection:', reason);
});
