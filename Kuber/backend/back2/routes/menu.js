const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Create menu item (admin only)
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create menu item' });
  }
});

// Update menu item (admin only)
router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json(menuItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item (admin only)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports