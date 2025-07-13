const express = require('express');
const Order = require('../../models/Order');
const { reqAuth } = require('../../middleware/auth');
const router = express.Router();

router.use(reqAuth);

// GET Profile + Orders
router.get('/profile', async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt').lean();
    res.render('profile', { title: 'My Profile', active: '', orders });
});

// POST Cancel Order
router.put('/profile/cancel/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id, user: req.user._id });

        if (order && order.status === 'pending') {
            order.status = 'canceled';
            await order.save();
        }

        // redirect back to profile (with fresh data)
        res.redirect('/profile');
    } catch (err) {
        next(err);
    }
});


// Add new address
router.post('/profile/address', async (req, res, next) => {
    const { title, address } = req.body;
    req.user.addresses.push({ title, address });
    await req.user.save();
    res.redirect('/profile');
});

// Delete an address
router.post('/profile/address/delete/:idx', async (req, res, next) => {
    const idx = parseInt(req.params.idx, 10);
    if (!isNaN(idx) && req.user.addresses[idx]) {
        req.user.addresses.splice(idx, 1);
        await req.user.save();
    }
    res.redirect('/profile');
});



module.exports = router;
