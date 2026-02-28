function notFoundHandler(req, res, next) {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    error.code = 'NOT_FOUND';
    next(error);
}

module.exports = notFoundHandler;
