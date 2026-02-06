const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/user');
const userRouter = require('./routes/user');
const jobRouter = require('./routes/job');
const applicationRouter = require('./routes/application');
const profileRouter = require('./routes/profile');
// AI Recommendation Routes - provides personalized job suggestions to students
// Why: Increases user engagement and application rates by showing relevant jobs
const recommendationRouter = require('./routes/recommendations');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const { setupSecurity } = require('./middleware/security');
const {checkforAuthenticationCookie} = require('./middleware/authetication');

// Rate Limiting Middleware - prevents abuse and DoS attacks
// Why: Protects server from spam, brute force attacks, and excessive API calls
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

const app = express();
setupSecurity(app);
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== SECURITY & RATE LIMITING MIDDLEWARE =====
// Why this order matters: Security first, then parsing, then authentication

// 1. Trust proxy (for rate limiting behind load balancers/nginx)
// Why: Ensures correct IP addresses when behind proxy
app.set('trust proxy', 1);

// 2. Apply general API rate limiter to ALL routes
// Why: Prevents DoS attacks and API abuse (100 requests/minute per IP)
// Applied before other middleware to block attackers early
app.use(apiLimiter);

// 3. Body parsers (after rate limiting, before routes)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 4. Cookie parser and authentication
app.use(cookieParser());
app.use(checkforAuthenticationCookie('token'));

// Use MONGODB_URI from environment variables (for Docker/production), fallback to local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobPortalDB';

mongoose.connect(MONGODB_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("MongoDB connection error:", err);
    // process.exit(1);
})

// Middleware to pass query parameters as locals for flash messages
// This must be AFTER body/cookie parsing but BEFORE routes
app.use((req, res, next) => {
    // Only read query parameters, don't modify req.query
    if (req.query && req.query.success) {
        res.locals.success = req.query.success;
    }
    if (req.query && req.query.error) {
        res.locals.error = req.query.error;
    }
    next();
});

app.get('/',(req,res)=>{
    res.render('home', {
        user: req.user
    });
});

app.get('/signin',(req,res)=>{
    res.render('signin');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});

// ===== AUTHENTICATION ROUTES WITH STRICT RATE LIMITING =====
// Why stricter limits: Prevent brute force password attacks
// Limit: 5 attempts per 15 minutes per IP

// Apply auth limiter to signin POST route
app.post('/user/signin', authLimiter, (req, res, next) => {
    // Authent limiter allows only 5 attempts per 15 minutes
    // Why: Prevents password guessing attacks
    next();
});

// Apply auth limiter to signup POST route  
app.post('/user/signup', authLimiter, (req, res, next) => {
    // Why also limit signup: Prevents spam account creation
    next();
});

// ✅ Debug endpoints removed for production security

// ====== VIEW ROUTES FOR FRONTEND PAGES ======

// Public route - Browse all jobs
app.get('/jobs/browse', (req, res) => {
    res.render('jobs', { user: req.user });
});

// Student Dashboard - requires student role
const {requireRole} = require('./middleware/authorization');
app.get('/student/dashboard', requireRole('student'), (req, res) => {
    res.render('student/dashboard', { user: req.user });
});

// Student My Applications - requires student role
app.get('/student/my-applications', requireRole('student'), (req, res) => {
    res.render('student/my-applications', { user: req.user });
});

// Recruiter Dashboard - requires recruiter role
app.get('/recruiter/dashboard', requireRole('recruiter'), (req, res) => {
    res.render('recruiter/dashboard', { user: req.user });
});

// Recruiter Post Job - requires recruiter role
app.get('/recruiter/post-job', requireRole('recruiter'), (req, res) => {
    res.render('recruiter/post-job', { user: req.user });
});

// Recruiter Edit Job - requires recruiter role
app.get('/recruiter/edit-job/:id', requireRole('recruiter'), (req, res) => {
    res.render('recruiter/edit-job', { user: req.user });
});

// Recruiter View Applicants - requires recruiter role
app.get('/recruiter/view-applicants/:jobId', requireRole('recruiter'), (req, res) => {
    res.render('recruiter/view-applicants', { user: req.user });
});

// Recruiter View All Jobs - requires recruiter role
app.get('/recruiter/my-jobs', requireRole('recruiter'), (req, res) => {
    res.render('recruiter/my-jobs', { user: req.user });
});

// Recruiter View All Applications - requires recruiter role
app.get('/recruiter/applications', requireRole('recruiter'), (req, res) => {
    res.render('recruiter/applications', { user: req.user });
});

// Recruiter View Single Application - requires recruiter role
app.get('/recruiter/view-application/:id', requireRole('recruiter'), (req, res) => {
    res.render('recruiter/view-application', { user: req.user, applicationId: req.params.id });
});

// Profile View Routes - requires authentication and fetches fresh data from DB
app.get('/profile/view', async (req, res) => {
    if (!req.user) {
        return res.redirect('/signin?error=' + encodeURIComponent('Please login to view profile'));
    }
    
    try {
        // Fetch fresh user data from database to show latest updates
        const User = require('./models/user');
        const freshUser = await User.findById(req.user._id).select('-password -salt');
        
        if (!freshUser) {
            return res.redirect('/signin?error=' + encodeURIComponent('User not found'));
        }
        
        if (freshUser.role === 'student') {
            res.render('student/profile', { user: freshUser });
        } else if (freshUser.role === 'recruiter') {
            res.render('recruiter/profile', { user: freshUser });
        } else {
            res.render('profile', { user: freshUser });
        }
    } catch (error) {
        console.error('Error loading profile view:', error);
        res.redirect('/?error=' + encodeURIComponent('Failed to load profile'));
    }
});

// Profile Edit Routes - requires authentication
app.get('/profile/edit', (req, res) => {
    if (!req.user) {
        return res.redirect('/signin?error=' + encodeURIComponent('Please login to edit profile'));
    }
    
    if (req.user.role === 'student') {
        res.render('student/edit-profile', { user: req.user });
    } else if (req.user.role === 'recruiter') {
        res.render('recruiter/edit-profile', { user: req.user });
    } else {
        res.render('edit-profile', { user: req.user });
    }
});

// ====== API ROUTES ======
const {updateProfile} = require('./controllers/userController');
app.post('/profile/update', (req, res, next) => {
    if (!req.user) {
        return res.redirect('/signin?error=' + encodeURIComponent('Please login to update profile'));
    }
    next();
}, updateProfile);

app.use('/user',userRouter);
app.use('/jobs', jobRouter);
app.use('/applications', applicationRouter);
app.use('/profile', profileRouter);

// Register AI recommendation routes
// Why: Provides /api/recommendations/* endpoints for job suggestions
// This must be registered after authentication middleware so req.user is available
app.use(recommendationRouter);

// ===== HEALTH CHECK ENDPOINT =====
// Why: Deployment platforms use this to monitor app status
// Heroku, AWS, DigitalOcean, etc check /health to ensure app is alive
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development'
    };
    res.status(200).json(healthcheck);
});

app.use(errorHandler);

app.listen(PORT,()=>{
    const env = process.env.NODE_ENV || 'development';
    console.log(`
╔════════════════════════════════════════════╗
║     🚀 SERVER STARTED SUCCESSFULLY         ║
║  Environment: ${env.toUpperCase().padEnd(27)} ║
║  Port: ${PORT.toString().padEnd(36)} ║
║  PID: ${process.pid.toString().padEnd(37)} ║
╚════════════════════════════════════════════╝
    `);
    if (env === 'development') {
        console.log('📌 Development Mode: Hot reload enabled with nodemon\n');
    } else {
        console.log('✅ Production Mode: Running with optimizations\n');
    }
});



//what yet to do
//1. Job posting route for recruiters
//2. Job listing route for students
//3. Job application route for students
//4. Dashboard route for recruiters to see applications
//5. Profile management routes for both students and recruiters
//6. Implement proper error handling and validations

/*
Priority 1 (Critical):
1. Fix Application model - proper refs & file handling
2. Add authorization middleware - check user roles
3. Add controllers - separation of business logic

Priority 2 (Important):
4. Create job routes - CRUD operations
5. Create application routes - apply/withdraw
6. Add multer config - resume uploads

Priority 3 (Enhancements):
7. Create profile model - more user details
8. Create admin routes - manage users/jobs

9. Add pagination - job listings
10. Add search/filter - job listings
11. Implement email notifications - application status
12. Add unit/integration tests - critical paths

*/