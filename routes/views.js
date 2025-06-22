// routes/views.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper to attach JWT from session
const apiClient = (req) => {
    return axios.create({
        baseURL: process.env.API_URL,
        headers: { Authorization: `Bearer ${req.session.token}` }
    });
};

// Home page: fetch 8 random items
router.get('/', async (req, res, next) => {
    try {
        const { data: featured } = await apiClient(req).get('/items/random8');
        const title = "home"
        res.render('pages/home', {
            featured,
            title
        });
    } catch (err) {
        next(err);
    }
});

// Contact Us proxy (use POST to /contacts/)
router.put('/contact', async (req, res, next) => {
    try {
        const { data } = await apiClient(req).post('/contacts', req.body);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Stub routes for menu, about, signUp
router.get('/menu', (req, res) => res.render('pages/menu'));
router.get('/about', (req, res) => res.render('pages/about'));
router.get('/signUp', (req, res) => res.render('pages/signUp'));
router.get('/login', (req, res) => res.render('pages/login'));
router.get('/profile', (req, res) => res.render('pages/profile'));
router.get('/cart', (req, res) => res.render('pages/cart'));

module.exports = router;
