const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Create a reservation (customer)
router.post('/', auth, async (req, res) => {
  try {
    const { date, time, guests } = req.body;
    const reservation = new Reservation({
      user: req.user.id,
      date,
      time,
      guests
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create reservation' });
  }
});

// Get all reservations for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Admin: view all reservations
router.get('/all', auth, role('admin'), async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all reservations' });
  }
});

module.exports = router;