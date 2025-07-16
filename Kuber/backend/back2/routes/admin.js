const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// User management: view all users
router.get('/users', auth, role('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// User management: delete user
router.delete('/users/:id', auth, role('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Menu management: add menu item
router.post('/menu', auth, role('admin'), async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add menu item' });
  }
});

// Menu management: edit menu item
router.put('/menu/:id', auth, role('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(menuItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update menu item' });
  }
});

// Menu management: delete menu item
router.delete('/menu/:id', auth, role('admin'), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Order overview: view all orders
router.get('/orders', auth, role('admin'), async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Contact overview: view all contact messages
router.get('/contacts', auth, role('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

module.exports