// middleware/validation.js
const { body, validationResult } = require('express-validator');

// Middleware to convert skills string to array
const convertSkillsToArray = (req, res, next) => {
    if (req.body.skills && typeof req.body.skills === 'string') {
        req.body.skills = req.body.skills.split(',').map(s => s.trim()).filter(s => s);
    }
    next();
};

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // For HTML form submissions, redirect back with error
        if (!req.headers['content-type']?.includes('application/json')) {
            const errorMessages = errors.array().map(e => e.msg).join(', ');
            const referrer = req.headers.referer || '/';
            return res.redirect(referrer + '?error=' + encodeURIComponent(errorMessages));
        }
        // For API calls, return JSON
        return res.status(400).json({ 
            error: 'Validation failed',
            details: errors.array().map(e => ({ field: e.param, message: e.msg }))
        });
    }
    next();
};

// Job validation rules
const validateJob = [
    convertSkillsToArray, // Convert skills string to array before validation
    body('title').trim().notEmpty().withMessage('Job title is required')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
    body('description').trim().notEmpty().withMessage('Description is required')
        .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
    body('salary').optional().trim(),
    body('jobType').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Internship']),
    handleValidationErrors
];

// User signup validation
const validateSignup = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['student', 'recruiter', 'admin']).withMessage('Invalid role'),
    handleValidationErrors
];

// Profile validation
const validateProfile = [
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('city').optional().trim(),
    body('skills').optional().isArray(),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio max 500 characters'),
    handleValidationErrors
];

module.exports = {
    validateJob,
    validateSignup,
    validateProfile,
    handleValidationErrors,
    convertSkillsToArray
};