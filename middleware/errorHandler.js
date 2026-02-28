// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    const requestId = req?.id || 'unknown-request-id';
    const statusCode = err.status || 500;
    console.error(`[${requestId}] Error:`, err.message);

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'LIMIT_FILE_SIZE',
                message: 'File too large (max 5MB)'
            },
            requestId
        });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'LIMIT_FILE_COUNT',
                message: 'Too many files'
            },
            requestId
        });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: messages
            },
            requestId
        });
    }

    // Duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            error: {
                code: 'DUPLICATE_KEY',
                message: `${field} already exists`
            },
            requestId
        });
    }

    if (statusCode === 404) {
        return res.status(404).json({
            success: false,
            error: {
                code: err.code || 'NOT_FOUND',
                message: err.message || 'Route not found'
            },
            requestId
        });
    }

    // Default error
    const isDevelopment = process.env.NODE_ENV === 'development';
    const defaultMessage = isDevelopment
        ? (err.message || 'Internal server error')
        : 'Internal server error';
    const defaultCode = err.code || 'INTERNAL_ERROR';

    res.status(statusCode).json({
        success: false,
        error: {
            code: defaultCode,
            message: defaultMessage
        },
        requestId
    });
};

module.exports = errorHandler;