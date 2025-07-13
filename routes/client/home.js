const express = require('express');
const router  = express.Router();
const Item    = require('../../models/Item');
const Contact = require('../../models/Contact');  // ← new

// GET / — home page
router.get('/', async (req, res, next) => {
  try {
    const total = await Item.countDocuments();
    const trending = total > 4
      ? await Item.aggregate([ { $sample: { size: 4 } } ])
      : await Item.find().lean();
    const explore = total > 8
      ? await Item.aggregate([ { $sample: { size: 8 } } ])
      : await Item.find().lean();

    // if you passed ?sent=1 we can show a message (optional)
    const sent = req.query.sent === '1';

    res.render('home', {
      title:   'Home',
      active:  'home',
      trending,
      explore,
      sent     // ← pass this so EJS can show a “thank you” alert
    });
  } catch (err) {
    next(err);
  }
});

// POST /contact — handle form on home page
router.post('/contact', async (req, res, next) => {
  try {
    const { firstName, lastName, message } = req.body;
    await Contact.create({ firstName, lastName, message });
    // redirect back to home, with a query flag so we can show feedback
    res.redirect('/?sent=1');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
