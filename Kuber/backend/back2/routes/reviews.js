const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Add a review (customer)
router.post('/', auth, async (req, res) => {
  try {
    const { menuItem, rating, comment } = req.body;
    const review = new Review({
      user: req.user.id,
      menuItem,
      rating,
      comment,
      createdAt: new Date(),
      approved: false
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add review' });
  }
});

// Get all approved reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Delete a review (admin only)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Approve a review (admin only)
router.put('/:id/approve', auth, role('admin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to approve review' });
  }
});