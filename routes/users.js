const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;
  const user = await User.create({ fullName, email, phoneNumber, password });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  req.session.token = token;
  res.status(201).json({ token, user });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  req.session.token = token;
  res.json({ token, user });
});

// Get own profile
router.get('/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Update own (except email & role)
router.put('/me', authenticate, async (req, res) => {
  const updates = { ...req.body };
  delete updates.email;
  delete updates.role;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
});

// Address management
router.post('/me/addresses', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.push(req.body);
  await user.save();
  res.json(user.addresses);
});

router.put('/me/addresses/:addrId', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  const addr = user.addresses.id(req.params.addrId);
  Object.assign(addr, req.body);
  await user.save();
  res.json(addr);
});

router.delete('/me/addresses/:addrId', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.id(req.params.addrId).remove();
  await user.save();
  res.json({ success: true });
});

// Admin: list all users
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Admin: delete user
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const validRoles = ['admin', 'user'];

router.put(
  '/:id/role',
  authenticate,
  requireAdmin,
  async (req, res) => {
    const { role } = req.body;
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Role must be one of: ${validRoles.join(', ')}` });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, user });
  }
);

module.exports = router;
