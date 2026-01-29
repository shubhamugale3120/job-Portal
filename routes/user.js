const {Router} = require('express');
const {createTokenForUser} = require('../service/authentication');
const User = require('../models/user');
 
const router = Router();

// Define user-related routes here
router.get('/signin',(req,res)=>{
    return res.render('signin');
});

router.get('/signup',(req,res)=>{
    return res.render("signup");
})


router.post('/signup',async(req,res)=>{
    // Logic for handling user signup
    const {name,email,password,role} = req.body;
    try {
         
        await User.create({
            name,email,password,role
        });
        return res.redirect("/user/signin");
    } catch(err) {
        return res.render("signup", {
            error: err.message
        });
    }
});

router.post('/signin', async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            // For API testing, return JSON instead of rendering
            if (req.headers['content-type'] === 'application/json') {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            return res.render('signin',{
                error: 'Invalid credentials',
            });
        }
        // Use comparePassword method to verify hashed password
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            if (req.headers['content-type'] === 'application/json') {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            return res.render('signin',{
                error: 'Invalid credentials',
            });
        }
        const token = createTokenForUser(user);
        res.cookie('token', token);
        
        // If API request (Postman), return JSON. If browser, redirect
        if (req.headers['content-type'] === 'application/json') {
            return res.json({ 
                success: true, 
                message: 'Logged in successfully',
                user: { email: user.email, role: user.role }
            });
        }
        return res.redirect('/');
    } catch(err) {
        if (req.headers['content-type'] === 'application/json') {
            return res.status(500).json({ error: 'An error occurred' });
        }
        return res.render('signin',{
            error: 'An error occurred',
        });
    }
});

router.get('/logout', (req,res)=>{
    res.clearCookie('token');
    return res.redirect('/');
});

module.exports = router;