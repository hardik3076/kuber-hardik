const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Place a new order (customer)
router.post('/', auth, async (req, res) => {
  try {
    const order = new Order({
      user: req.user.id,
      items: req.body.items, // array of menu item IDs and quantities
      status: 'pending',
      createdAt: new Date()
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to place order' });
  }
});

// Get all orders for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, role('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;