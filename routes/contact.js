const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Create a contact message
router.post('/', async (req, res) => {
  const { firstName, lastName, message } = req.body;
  const newMsg = await Contact.create({ firstName, lastName, message });
  res.status(201).json(newMsg);
});

// List messages (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const messages = await Contact.find().sort('-createdAt');
  res.json(messages);
});

module.exports = router;
