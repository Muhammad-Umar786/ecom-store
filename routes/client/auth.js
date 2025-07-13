const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { createSessionToken } = require('../../middleware/auth');
const router = express.Router();

// GET Sign-Up
router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up', active: 'signup', errors: null, form: {} });
});

// POST Sign-Up
router.post('/signup', async (req, res, next) => {
    const { fullName, email, phoneNumber, password, confirmPassword } = req.body;
    const errors = [];

    if (password !== confirmPassword) errors.push("Passwords don't match");
    if (await User.findOne({ email })) errors.push("Email is already registered");

    if (errors.length) {
        return res.render('signup', { title: 'Sign Up', active: 'signup', errors, form: req.body });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, phoneNumber, password: hashed });
    createSessionToken(req, user);
    res.redirect('/');
});

// GET Login
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', active: '', error: null, form: {} });
});

// POST Login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.render('login', { title: 'Login', active: '', error: "Invalid credentials", form: req.body });
    }

    createSessionToken(req, user);
    res.redirect('/');
});

// POST Logout
router.post('/logout', (req, res) => {
    delete req.session.token;
    res.redirect('/');
});

module.exports = router;
