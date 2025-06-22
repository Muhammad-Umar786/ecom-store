const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all items
router.get('/', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// Get 4 random
router.get('/random4', async (req, res) => {
    const items = await Item.aggregate([{ $sample: { size: 4 } }]);
    res.json(items);
});

// Get 8 random
router.get('/random8', async (req, res) => {
    const items = await Item.aggregate([{ $sample: { size: 8 } }]);
    res.json(items);
});

// Search by name
router.get('/search', async (req, res) => {
    const q = req.query.q || '';
    const items = await Item.find({ name: new RegExp(q, 'i') });
    res.json({ query: q, items });
});

// Admin: create
router.post('/', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
    const { name, price } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : '';
    const item = await Item.create({ image, name, price });
    res.status(201).json(item);
});

// Admin: update
router.put('/:id', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
    const { name, price } = req.body;
    const update = { name, price };
    if (req.file) update.image = '/uploads/' + req.file.filename;
    const item = await Item.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
    );
    res.json(item);
});

// Admin: delete
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;
