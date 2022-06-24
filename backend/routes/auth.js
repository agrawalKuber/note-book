const express = require("express");
const User = require("../models/User");
const session = require("express-session");
const router = express.Router();
var jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const JWT_SECRET = process.env.JWT_SECRET;

const sessionConfig = {
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

router.use(session(sessionConfig));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post(
  "/createUser",
  [
    body(
      "username",
      "Username Should Have a Minimum Of 4 Characters"
    ).isLength({ min: 4 }),
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Password Should Have a Minimum Of 4 Characters"
    ).isLength({ min: 4 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      success = false;
      const user = new User({
        username: req.body.username,
        email: req.body.email,
      });
      const newUser = await User.register(user, req.body.password);
      console.log(newUser);
      const data = {
        user: {
          username: newUser.username,
          id: newUser._id,
        },
      };
      console.log(data);

      const token = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, token });
    } catch (err) {
      res.json({ error: "User Already Exists", message: err.message });
    }
  }
);

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(req.body);
  success = false;
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  const data = {
    user: {
      username: user.username,
      id: user._id,
    },
  };
  console.log(data);
  const token = jwt.sign(data, JWT_SECRET, { expiresIn: "168h" });
  success = true;
  console.log(user);
  res.json({ success, token });
});

router.get("/login", (req, res) => {});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
  });

  res.json({ success: true });
});
module.exports = router;
