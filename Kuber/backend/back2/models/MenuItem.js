const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['Starters', 'Main Course', 'Desserts', 'Drinks', 'Street Food'],
  },
  ingredients: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  dietary: {
    type: [String],
    default: ['Vegetarian'],
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
