const express = require('express');
const User = require('../models/User');
const session=require("express-session");
const flash = require('connect-flash');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {isLoggedIn} =require("../middlewar/isLoggedin")

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

router.use(flash());
router.use(session(sessionConfig))
router.use(passport.initialize()); 
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post('/createUser',[
    body('username', 'Username Should Have a Minimum Of 4 Characters').isLength({ min: 4 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password Should Have a Minimum Of 4 Characters').isLength({ min: 5 }),
] , async (req, res)=>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user=new User({
        username: req.body.username,
        email: req.body.email,
      })
      const newUser = await User.register(user,req.body.password);
    
      res.send(newUser);

    }
    catch(err){
      res.json({error: 'User Already Exists', message: err.message})
    }
 
} )


router.post('/login', passport.authenticate('local',{ failureFlash: true, failureRedirect: '/api/auth/login' }), (req, res) => {
 req.flash('success', 'welcome back!');
  res.send("logged in");
});


router.get('/new',isLoggedIn, (req, res) => {
  res.send("well done");
});
router.get('/login', (req, res) => {
  res.send("login page");
});


router.get('/logout', (req, res) => {
  req.logout((err)=>{
    if(err)
      return next(err);
  });
 req.flash('success', "Goodbye!");
  res.send("loggedOut");
})
module.exports = router