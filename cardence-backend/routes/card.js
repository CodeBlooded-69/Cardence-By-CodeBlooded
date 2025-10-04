const express = require('express');
const Card = require('../models/Card');
const auth = require('../middleware/auth');
const router = express.Router();

// Add a card
router.post('/', auth, async (req, res) => {
  const { cardType, cardNo, expiry, holder, limit, logo } = req.body;
  try {
    const card = new Card({
      user: req.user._id,
      cardType, cardNo, expiry, holder, limit, logo
    });
    await card.save();
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Error adding card' });
  }
});

// Get all cards for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cards' });
  }
});

module.exports = router;
