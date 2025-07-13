const express = require('express');
const router = express.Router();
const Item = require('../../models/Item');
const Order = require('../../models/Order');
const { reqAuth } = require('../../middleware/auth');


/**
 * Add one item to cart (session)
 */
router.get('/add/:id', reqAuth, async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.session.cart) req.session.cart = [];

        const existing = req.session.cart.find(e => e.itemId === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            // validate item exists
            const item = await Item.findById(id).lean();
            if (!item) return res.status(404).send('Item not found');
            req.session.cart.push({ itemId: id, quantity: 1 });
        }

        res.redirect(req.get('Referer') || '/menu');
    } catch (err) {
        next(err);
    }
});

/**
 * View cart + checkout form
 */
router.get('/', reqAuth, async (req, res, next) => {
    try {
        const cart = req.session.cart || [];
        // load details
        const detailed = await Promise.all(
            cart.map(async entry => {
                const item = await Item.findById(entry.itemId).lean();
                return {
                    id: entry.itemId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: entry.quantity,
                    lineTotal: entry.quantity * item.price,
                };
            })
        );
        const totalPrice = detailed.reduce((sum, i) => sum + i.lineTotal, 0);

        const cartError = req.session.cartError;
        delete req.session.cartError;

        res.render('cart', {
            title: 'Your Cart',
            active: 'cart',
            cart: detailed,
            totalPrice,
            cartError
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Checkout — create Order, clear session cart
 */
router.post('/checkout', reqAuth, async (req, res, next) => {
    try {
        const cart = req.session.cart || [];
        if (!cart.length) {
            return res.redirect('/cart');
        }

        const items = await Promise.all(
            cart.map(async entry => {
                const item = await Item.findById(entry.itemId).lean();
                return {
                    name: item.name,
                    image: item.image,
                    quantity: entry.quantity,
                    price: item.price
                };
            })
        );

        const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

        // pull payment fields
        const { cardNumber, expiry, cvv } = req.body;

        const idx = parseInt(req.body.selectedAddress, 10);
        const shippingAddress = req.user.addresses[idx];
        if (!shippingAddress) {
            // flash error and redirect back
            req.session.cartError = 'Please select a valid shipping address.';
            return res.redirect('/cart');
        }


        await Order.create({
            user: req.user._id,
            paymentInfo: { cardNumber, expiry, cvv },
            items,
            totalPrice,
            shippingAddress
        });

        // clear cart
        req.session.cart = [];

        // redirect to a “thank you” or back to home
        res.redirect('/?order=success');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
