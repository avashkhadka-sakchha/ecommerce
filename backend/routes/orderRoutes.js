import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, shipping, payment, subtotal, tax, total, itemsCount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Generate unique order number #MH-XXXXX
    const orderId = `#MH-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = new Order({
      user: req.user._id,
      id: orderId,
      items,
      shipping,
      payment,
      subtotal,
      tax,
      total,
      itemsCount
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error, failed to place order' });
  }
});

// @desc    Get order history
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // If role is manager or admin, fetch all orders. Otherwise fetch only user orders.
    let orders;
    if (req.user.role === 'manager' || req.user.role === 'admin') {
      orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'firstName lastName email');
    } else {
      orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch orders' });
  }
});

export default router;
