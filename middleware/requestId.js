const { randomUUID } = require('crypto');

function requestIdMiddleware(req, res, next) {
    const incomingRequestId = req.headers['x-request-id'];
    const requestId = (typeof incomingRequestId === 'string' && incomingRequestId.trim())
        ? incomingRequestId.trim()
        : randomUUID();

    req.id = requestId;
    res.setHeader('x-request-id', requestId);
    next();
}

module.exports = requestIdMiddleware;
