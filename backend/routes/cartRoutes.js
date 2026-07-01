import express from 'express';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    
    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart.items);
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch cart' });
  }
});

// @desc    Update user cart items (Sync full cart list)
// @route   PUT /api/cart
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { items } = req.body; // Expects array of cart items
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    cart.items = items || [];
    const updatedCart = await cart.save();
    
    res.json(updatedCart.items);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error, failed to update cart' });
  }
});

export default router;
