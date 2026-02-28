/**
 * API Authentication Routes (JSON-based)
 * 
 * Purpose:
 * - Serve React SPA and mobile clients with JSON token responses
 * - Separate API endpoints from page-render routes
 * - Maintain token-based auth for stateless APIs
 * 
 * Why separate file:
 * - Keeps API logic clean and testable
 * - Does not interfere with existing EJS render routes
 * - Easy to scale with additional API endpoints later
 */

const { Router } = require('express');
const { createTokenForUser, validateToken } = require('../service/authentication');
const User = require('../models/user');
const { checkforAuthenticationCookie } = require('../middleware/authetication');

const router = Router();

/**
 * POST /api/auth/register
 * 
 * Register a new user (student/recruiter)
 * 
 * Request body:
 * {
 *   name: string,
 *   email: string,
 *   password: string (min 6 chars),
 *   role: 'student' | 'recruiter'
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   token: string (JWT),
 *   user: { _id, email, role, name }
 * }
 * 
 * Why JSON response:
 * - Frontend stores token locally
 * - Frontend derives user from token payload (no extra API call needed)
 * - Mobile clients can reuse same endpoint
 */
router.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    if (!['student', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be 'student' or 'recruiter'",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate token
    const token = createTokenForUser(user);

    // Return JSON response (not redirecting)
    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Registration failed',
    });
  }
});

/**
 * POST /api/auth/login
 * 
 * Login an existing user
 * 
 * Request body:
 * {
 *   email: string,
 *   password: string
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   token: string (JWT),
 *   user: { _id, email, role, name }
 * }
 * 
 * Why no Set-Cookie:
 * - Frontend stores token in localStorage
 * - Browser sends token via Authorization header (set by Axios interceptor)
 * - Stateless API, no server-side session storage
 */
router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = createTokenForUser(user);

    // Return success with token (no cookie)
    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
});

/**
 * GET /api/auth/me
 * 
 * Get current user (requires valid token in Authorization header)
 * 
 * Header:
 * Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   success: true,
 *   user: { _id, email, role, name, phone, bio, company, ... }
 * }
 * 
 * Why this endpoint:
 * - On app load, React fetches current user to bootstrap auth state
 * - Validates token is still valid with server
 * - Returns full user profile for the navbar/dashboard
 */
router.get('/api/auth/me', checkforAuthenticationCookie('token'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    // Fetch full user from database
    const user = await User.findById(req.user._id).select('-password -salt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error('Get current user error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch current user',
    });
  }
});

/**
 * POST /api/auth/logout
 * 
 * Logout (client-side action, no server cleanup needed for stateless JWT)
 * 
 * Response:
 * {
 *   success: true,
 *   message: 'Logged out successfully'
 * }
 * 
 * Why this endpoint exists:
 * - For consistency/logging on backend if needed
 * - Frontend removes token from localStorage independently
 * - Server doesn't maintain sessions, so nothing to clean up
 */
router.post('/api/auth/logout', (req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;
