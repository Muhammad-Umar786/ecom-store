// routes/admin/users.js
const express = require('express');
const User    = require('../../models/User');
const Order   = require('../../models/Order');    // ← import Order
const router  = express.Router();


// GET /admin/users — list all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().lean();
    res.render('admin/users', {
      title:           'Manage Users',
      activeAdmin:     'users',
      active: 'admin',
      users,
      currentAdminId:  req.user._id.toString()
    });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/users/:id/role — toggle role
router.put('/:id/role', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) return res.redirect('/admin/users');

    const user = await User.findById(id);
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/users/:id — delete user **and** their orders
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Prevent self‑deletion
    if (id === req.user._id.toString()) {
      return res.redirect('/admin/users');
    }

    // 1) delete all orders by this user
    await Order.deleteMany({ user: id });

    // 2) delete the user
    await User.findByIdAndDelete(id);

    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
