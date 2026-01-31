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
            return res.render('signin',{
                error: 'Invalid credentials',
            });
        }
        // Use comparePassword method to verify hashed password
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.render('signin',{
                error: 'Invalid credentials',
            });
        }
        const token = createTokenForUser(user);
        res.cookie('token', token);
        
        // Redirect based on role
        if (user.role === 'student') {
            return res.redirect('/student/dashboard?success=Logged in successfully');
        } else if (user.role === 'recruiter') {
            return res.redirect('/recruiter/dashboard?success=Logged in successfully');
        } else if (user.role === 'admin') {
            return res.redirect('/admin/dashboard?success=Logged in successfully');
        }
        return res.redirect('/');
    } catch(err) {
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