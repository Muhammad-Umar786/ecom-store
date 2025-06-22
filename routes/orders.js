const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Place an order
router.post('/', authenticate, async (req, res) => {
  const { paymentInfo, items } = req.body;
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = await Order.create({
    user: req.user.id,
    paymentInfo,
    items,
    totalPrice
  });
  res.status(201).json(order);
});

// User: get own orders
router.get('/me', authenticate, async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

// Admin: all orders
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const orders = await Order.find().populate('user');
  res.json(orders);
});

// User: cancel own order
router.put('/:id/cancel', authenticate, async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { status: 'canceled' },
    { new: true }
  );
  res.json(order);
});

// Admin: update status
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(order);
});

// Admin: delete order
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
