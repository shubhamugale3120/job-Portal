/**
 * Rate Limiting Middleware
 * 
 * Purpose: Prevent abuse and DoS attacks by limiting request rates
 * 
 * Why rate limiting is critical:
 * - Prevents brute force login attacks (trying 1000s of passwords)
 * - Prevents API abuse (scraping all job data)
 * - Protects server from overload
 * - Ensures fair resource usage among users
 * 
 * How it works:
 * - Tracks requests per IP address in memory
 * - Blocks requests exceeding limit
 * - Automatically resets after time window
 * 
 * Installation:
 * npm install express-rate-limit
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * 
 * Limits: 100 requests per minute per IP
 * 
 * Why 100/minute:
 * - Normal user makes ~10-20 requests/minute
 * - 100 allows burst traffic (page loads)
 * - Blocks obvious abuse (bots, scrapers)
 * 
 * Applied to: All API routes
 */
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute time window
    max: 100, // Max 100 requests per window
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 1 minute.',
        retryAfter: '60 seconds'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Store in memory by default (use Redis for production with multiple servers)
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests. Please slow down and try again later.',
            retryAfter: 60
        });
    }
});

/**
 * Strict rate limiter for authentication endpoints
 * 
 * Limits: 5 login attempts per 15 minutes per IP
 * 
 * Why stricter:
 * - Prevents brute force password attacks
 * - Login attempts are expensive (bcrypt hashing)
 * - Failed logins indicate potential attack
 * 
 * Applied to: /signin, /signup, /user/signin
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 5, // Max 5 attempts per window
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.',
        security: 'Your IP has been temporarily blocked due to suspicious activity.'
    },
    handler: (req, res) => {
        // Log potential security threat
        console.warn(`⚠️ Rate limit exceeded from IP: ${req.ip} on ${req.path}`);
        
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Account security protection activated.',
            retryAfter: '15 minutes',
            help: 'If you forgot your password, use the password reset option.'
        });
    }
});

/**
 * Moderate rate limiter for job posting
 * 
 * Limits: 10 job posts per hour per user
 * 
 * Why:
 * - Prevents spam job postings
 * - Recruiters shouldn't post 100s of jobs instantly
 * - Normal usage: 1-5 jobs per session
 * 
 * Applied to: POST /jobs/post
 */
const jobPostLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Max 10 job posts per hour
    message: {
        success: false,
        message: 'You have reached the hourly limit for job postings. Please try again later.',
        limit: '10 jobs per hour'
    },
    skipFailedRequests: true, // Don't count failed posts
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Job posting limit reached. You can post up to 10 jobs per hour.',
            retryAfter: '1 hour'
        });
    }
});

/**
 * Application submission rate limiter
 * 
 * Limits: 20 applications per hour per user
 * 
 * Why:
 * - Prevents spam applications
 * - Encourages quality over quantity
 * - Normal usage: 5-10 applications per session
 * 
 * Applied to: POST /applications/apply
 */
const applicationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Max 20 applications per hour
    message: {
        success: false,
        message: 'You have reached the hourly limit for job applications.',
        tip: 'Take time to customize each application for better results.'
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Application limit reached. You can apply to up to 20 jobs per hour.',
            tip: 'Quality applications have higher success rates than quantity.',
            retryAfter: '1 hour'
        });
    }
});

/**
 * File upload rate limiter
 * 
 * Limits: 10 file uploads per 10 minutes
 * 
 * Why:
 * - File uploads are resource-intensive
 * - Prevents storage abuse
 * - Normal usage: 1-3 uploads (resume, profile pic)
 * 
 * Applied to: POST /profile/upload, POST /applications/upload
 */
const uploadLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Max 10 uploads per 10 minutes
    message: {
        success: false,
        message: 'Upload limit reached. Please try again in 10 minutes.'
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many file uploads. Please wait 10 minutes before uploading again.'
        });
    }
});

// Export all limiters for use in routes
module.exports = {
    apiLimiter,        // General API protection
    authLimiter,       // Login/signup protection
    jobPostLimiter,    // Job posting protection
    applicationLimiter,// Application spam protection
    uploadLimiter      // File upload protection
};
