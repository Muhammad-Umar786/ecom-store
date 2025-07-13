const express = require('express');
const router = express.Router();
const Item = require('../../models/Item');

router.get('/', async (req, res, next) => {
    try {
        const q = req.query.q?.trim() || '';
        let items;

        if (q) {
            // case‑insensitive, loose match anywhere in name
            items = await Item.find({
                name: { $regex: q, $options: 'i' }
            }).lean();
        } else {
            items = await Item.find().lean();
        }

        res.render('menu', {
            title: 'Menu',
            active: 'menu',
            items,
            q
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
