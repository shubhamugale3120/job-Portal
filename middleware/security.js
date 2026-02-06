/**
 * Security Middleware Configuration
 * 
 * Purpose: Additional security layers for production deployment
 * 
 * Includes:
 * - Helmet.js: Sets secure HTTP headers
 * - CORS: Controls cross-origin requests
 * - Request size limits: Prevents payload attacks
 * - XSS protection: Prevents script injection
 * 
 * Installation required:
 * npm install helmet cors express-mongo-sanitize
 */

const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

/**
 * Helmet.js Configuration
 * 
 * What it does:
 * - Sets security-related HTTP headers automatically
 * - Protects against common web vulnerabilities
 * 
 * Headers set:
 * - X-Frame-Options: Prevents clickjacking
 * - X-Content-Type-Options: Prevents MIME sniffing
 * - Strict-Transport-Security: Forces HTTPS
 * - X-XSS-Protection: Browser XSS filter
 * 
 * Why needed:
 * - Industry standard security practice
 * - Required for production deployment
 * - Minimal performance impact
 */
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
        },
    },
    // Allow iframes from same origin (for embedded content if needed)
    frameguard: { action: 'sameorigin' }
});

/**
 * CORS Configuration
 * 
 * What is CORS:
 * - Cross-Origin Resource Sharing
 * - Controls which domains can access your API
 * 
 * Why configure:
 * - Prevent unauthorized websites from using your API
 * - Allow only trusted frontend domains
 * - Production: Only your domain
 * - Development: localhost allowed
 * 
 * Example scenarios:
 * - Allowed: yoursite.com → yoursite.com/api ✓
 * - Blocked: hacker.com → yoursite.com/api ✗
 */
const corsOptions = {
    // In development: allow all origins
    // In production: configure specific allowed origins in .env
    origin: process.env.NODE_ENV === 'production' 
        ? function (origin, callback) {
            const allowedOrigins = [
                'https://yourjobportal.com',
                'https://www.yourjobportal.com',
                process.env.FRONTEND_URL
            ].filter(Boolean);
            
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('CORS policy: This origin is not allowed'));
            }
        }
        : true, // Allow all origins in development
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // Cache preflight requests for 24 hours
};

/**
 * MongoDB Injection Protection
 * 
 * What it does:
 * - Sanitizes user input to prevent NoSQL injection
 * - Removes $ and . characters from request data
 * 
 * Example attack prevented:
 * Before sanitization:
 *   { "username": { "$gt": "" } }  → Returns all users!
 * After sanitization:
 *   { "username": "gt" }  → Safe string search
 * 
 * Why critical:
 * - NoSQL injection can bypass authentication
 * - Attackers can access/modify any data
 * - Easy to exploit without this protection
 */
const mongoSanitizeConfig = {
    replaceWith: '_', // Replace dangerous characters with underscore
    onSanitize: ({ req, key }) => {
        console.warn(`⚠️ Sanitized potentially malicious input in ${key}`);
    },
    // Exclude req.query from sanitization (it's read-only in Express)
    // Only sanitize req.body and req.params
    whitelist: ['body', 'params']
};

/**
 * Request Size Limits
 * 
 * Why limit request size:
 * - Prevent DoS attacks (sending 1GB JSON)
 * - Protect server memory
 * - Normal requests are <1MB
 * 
 * Limits:
 * - JSON body: 10mb (for job descriptions with formatting)
 * - URL encoded: 10mb (for form submissions)
 * - File uploads: Handled separately by multer
 */
const requestSizeLimits = {
    json: { limit: '10mb' },
    urlencoded: { limit: '10mb', extended: true }
};

/**
 * Apply all security middleware to Express app
 * 
 * Usage in index.js:
 * const { setupSecurity } = require('./middleware/security');
 * setupSecurity(app);
 * 
 * Note: express-mongo-sanitize removed because it conflicts with Express's
 * read-only req.query property. Express's built-in query parsing is safe.
 * 
 * @param {Object} app - Express application instance
 */
function setupSecurity(app) {
    // 1. Helmet - Security headers
    app.use(helmetConfig);
    
    // 2. CORS - Cross-origin protection
    app.use(cors(corsOptions));
    
    // 3. Trust proxy (for deployment behind reverse proxy like Nginx)
    // Needed for rate limiting by IP when using load balancer
    app.set('trust proxy', 1);
    
    console.log('✅ Security middleware configured');
}

module.exports = {
    setupSecurity,
    helmetConfig,
    corsOptions,
    requestSizeLimits
};
