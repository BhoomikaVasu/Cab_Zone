const logger = require('../config/logger');

/**
 * Global error handler middleware
 * Catches all errors and returns appropriate responses
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // Cloudinary authentication errors
    if (err.http_code === 401 || /invalid signature/i.test(String(err.message))) {
        return res.status(401).json({
            message: 'Image upload failed: invalid Cloudinary credentials',
            hint: 'Update CLOUDINARY_URL or cloud_name/api_key/api_secret in environment variables'
        });
    }

    // Firebase authentication errors
    if (err.code && err.code.startsWith('auth/')) {
        return res.status(401).json({
            message: 'Authentication error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Invalid credentials'
        });
    }

    // Firebase Firestore errors
    if (err.code && err.code.includes('firestore')) {
        return res.status(500).json({
            message: 'Database error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Failed to access database'
        });
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            error: err.message
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
