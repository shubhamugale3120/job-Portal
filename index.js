const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/user');
const userRouter = require('./routes/user');
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

app.use('/user',userRouter);

app.listen(PORT,()=>{
    console.log('Server is running on port', PORT);
})