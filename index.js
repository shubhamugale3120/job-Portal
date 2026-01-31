const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/user');
const userRouter = require('./routes/user');
const jobRouter = require('./routes/job');
const applicationRouter = require('./routes/application');
const profileRouter = require('./routes/profile');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const {checkforAuthenticationCookie} = require('./middleware/authetication')
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkforAuthenticationCookie('token'));

// Middleware to pass query parameters as locals for flash messages
app.use((req, res, next) => {
    if (req.query.success) {
        res.locals.success = req.query.success;
    }
    if (req.query.error) {
        res.locals.error = req.query.error;
    }
    next();
});

mongoose.connect('mongodb://127.0.0.1:27017/jobPortalDB').then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("MongoDB connection error:", err);
    // process.exit(1);
})

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

// Debug endpoint: check current user
app.get('/debug/user', (req, res) => {
    res.json({ user: req.user || 'Not authenticated' });
});

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


app.use(errorHandler);

app.listen(PORT,()=>{
    console.log('Server is running on port', PORT);
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