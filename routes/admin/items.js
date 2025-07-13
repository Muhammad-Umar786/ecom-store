const express = require('express');
const Item = require('../../models/Item');
const { uploadImage } = require('../../middleware/upload');
const router = express.Router();


// GET /admin/items — list all
router.get('/', async (req, res, next) => {
    try {
        const items = await Item.find().lean();
        res.render('admin/items', {
            title: 'Manage Items',
            active: 'admin',
            activeAdmin: 'items',
            items
        });
    } catch (err) {
        next(err);
    }
});

// GET /admin/items/new — show “Add Item” form
router.get('/new', (req, res) => {
    res.render('admin/item_form', {
        title: 'Add Item',
        active: 'admin',
        activeAdmin: 'items',
        item: {},
        formAction: '/admin/items',
        submitLabel: 'Create'
    });
});

// POST /admin/items — create new
router.post(
    '/',
    uploadImage,
    async (req, res, next) => {
        try {
            const { name, price } = req.body;
            let image = req.file?.filename;
            if (req.file && req.file.filename) {
                req.file.webPath = '/uploads/' + req.file.filename;
                image = req.file.webPath;
            }
            if (!image) throw new Error('Image is required');
            await Item.create({ name, price, image });
            res.redirect('/admin/items');
        } catch (err) {
            next(err);
        }
    }
);

// GET /admin/items/:id/edit — show edit form
router.get('/:id/edit', async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id).lean();
        if (!item) return res.redirect('/admin/items');
        res.render('admin/item_form', {
            title: 'Edit Item',
            activeAdmin: 'items',
            active: 'admin',

            item,
            formAction: `/admin/items/${item._id}?_method=PUT`,
            submitLabel: 'Update'
        });
    } catch (err) {
        next(err);
    }
});

// PUT /admin/items/:id — update existing
router.put(
    '/:id',
    uploadImage,
    async (req, res, next) => {
        try {
            const { name, price } = req.body;
            const update = { name, price };
            if (req.file && req.file.filename) {
                req.file.webPath = '/uploads/' + req.file.filename;
                update.image = req.file.webPath;
            }
            await Item.findByIdAndUpdate(req.params.id, update);
            res.redirect('/admin/items');
        } catch (err) {
            next(err);
        }
    }
);

// DELETE /admin/items/:id — remove
router.delete('/:id', async (req, res, next) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.redirect('/admin/items');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
