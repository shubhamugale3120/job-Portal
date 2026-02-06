const JWT = require('jsonwebtoken');

/**
 * JWT Secret Key
 * 
 * Why environment variable:
 * - Production: Use strong random secret from .env
 * - Development: Fallback to default (CHANGE THIS IN PRODUCTION!)
 * 
 * Security best practice:
 * - Never commit real secrets to Git
 * - Use minimum 32 character random string
 * - Rotate secrets periodically
 */
const JWT_SECRET = process.env.JWT_SECRET || "$123shu";

/**
 * Create JWT token for authenticated user
 * 
 * Why JWT:
 * - Stateless authentication (no session storage needed)
 * - Enables horizontal scaling (any server can validate)
 * - Contains user info (no DB lookup on each request)
 * 
 * Token expiry strategy:
 * - 7 days: Balance between security and UX
 * - Too short (1hr): Users log in too often
 * - Too long (30 days): Security risk if token stolen
 * 
 * Payload contents:
 * - _id: User identification
 * - email: For display purposes
 * - role: For authorization (student/recruiter/admin)
 * 
 * @param {Object} user - User object from database
 * @returns {string} - Signed JWT token
 */
function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        // Future: Add 'iat' (issued at) for token refresh logic
    }
    
    // Sign token with 7-day expiry
    // Why 7 days: Weekly active users stay logged in, inactive users re-authenticate
    const token = JWT.sign(payload, JWT_SECRET, {
        expiresIn: '7d',  // 7 days in production
        // Alternative values:
        // '1h' - high security apps
        // '24h' - daily active users
        // '30d' - low security requirements
    });
    
    return token;
}

/**
 * Validate and decode JWT token
 * 
 * What happens:
 * 1. Verifies token signature (prevents tampering)
 * 2. Checks expiry time (auto-rejects expired tokens)
 * 3. Returns decoded payload if valid
 * 
 * Error handling:
 * - Invalid signature: JWT.verify throws error
 * - Expired token: JWT.verify throws TokenExpiredError
 * - Malformed token: JWT.verify throws JsonWebTokenError
 * 
 * Why this is critical:
 * - Prevents unauthorized access
 * - Ensures tokens can't be forged
 * - Auto-expires old tokens
 * 
 * @param {string} token - JWT token from cookie/header
 * @returns {Object} - Decoded payload {_id, email, role}
 * @throws {JsonWebTokenError} - If token invalid or expired
 */
function validateToken(token){
    try {
        // verify() checks signature AND expiry automatically
        const payload = JWT.verify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        // Re-throw with context for better error handling
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expired - please login again');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token - please login again');
        }
        throw error;
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
}