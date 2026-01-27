const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/user');
const userRouter = require('./routes/user');
const jobRouter = require('./routes/job');
const applicationRouter = require('./routes/application');
const path = require('path');
const cookieParser = require('cookie-parser');
const {checkforAuthenticationCookie} = require('./middleware/authetication')
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkforAuthenticationCookie('token'));
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

app.use('/user',userRouter);
app.use('/jobs', jobRouter);
app.use('/applications', applicationRouter);

app.listen(PORT,()=>{
    console.log('Server is running on port', PORT);
})



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