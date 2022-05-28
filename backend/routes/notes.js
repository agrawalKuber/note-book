
const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const session=require("express-session");
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('../middlewar/isLoggedin');
const router = express.Router();
const Note=require("../models/Note");
const { body, validationResult } = require('express-validator');


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

router.use(session(sessionConfig))
router.use(passport.initialize()); 
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTE 1: Get All the Notes using: GET "/api/auth/fetchallnotes". Login required
router.get('/fetchallnotes', isLoggedIn, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/auth/addnote". Login required
router.post('/addnote', isLoggedIn, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('content', 'Content must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {

            const { title, content } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, content, user: req.user._id
            })
            const savedNote = await note.save();
            res.json(savedNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

    // ROUTE 3: Update an existing Note using: POST "/api/notes/updatenote". Login required
router.put('/updatenote/:id', isLoggedIn, async (req, res) => {
    const {title, content} = req.body;
    // Create a newNote object
    try {
    const newNote  = {};
    if(title){newNote.title = title};
    if(content){newNote.content = content};

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}

    })

    // ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', isLoggedIn, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router