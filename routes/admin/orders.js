const express = require('express');
const Order = require('../../models/Order');
const router = express.Router();


/**
 * GET /admin/orders
 * List all orders, newest first
 */
router.get('/', async (req, res, next) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'fullName email')  // get user name & email
            .lean();

        res.render('admin/orders', {
            title: 'Manage Orders',
            active: 'admin',
            activeAdmin: 'orders',
            orders
        });
    } catch (err) {
        next(err);
    }
});

/**
 * PUT /admin/orders/:id/status?_method=PUT
 * Change an order's status
 */
router.put('/:id/status', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['pending', 'on way', 'delivered', 'canceled'].includes(status)) {
            return res.redirect('/admin/orders');
        }
        await Order.findByIdAndUpdate(id, { status });
        res.redirect('/admin/orders');
    } catch (err) {
        next(err);
    }
});

/**
 * DELETE /admin/orders/:id?_method=DELETE
 * Remove an order entirely
 */
router.delete('/:id', async (req, res, next) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.redirect('/admin/orders');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
