const express = require('express');
const Contact = require('../../models/Contact');
const router = express.Router();

// GET /admin/contacts — list all contacts, newest first
router.get('/', async (req, res, next) => {
    try {
        const contacts = await Contact
            .find()
            .sort({ createdAt: -1 })
            .lean();

        res.render('admin/contacts', {
            title: 'Manage Contacts',
            active: 'admin',
            activeAdmin: 'contacts',
            contacts
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
