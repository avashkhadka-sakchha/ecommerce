import express from 'express';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

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

    // Build shipping name from firstName + lastName if name is not provided
    const shippingData = {
      name: shipping.name || `${shipping.firstName || ''} ${shipping.lastName || ''}`.trim(),
      street: shipping.street,
      province: shipping.province || shipping.city || ''
    };

    const order = new Order({
      user: req.user._id,
      id: orderId,
      items,
      shipping: shippingData,
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

import Product from '../models/Product.js';

// ...

// @desc    Get order history
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'firstName lastName email');
    } else if (req.user.role === 'manager') {
      // Find products created by this manager
      const myProducts = await Product.find({ createdBy: req.user._id }).select('id');
      const myProductIds = myProducts.map(p => p.id);
      
      // Find orders that contain at least one of these products
      orders = await Order.find({
        'items.id': { $in: myProductIds }
      }).sort({ createdAt: -1 }).populate('user', 'firstName lastName email');
    } else {
      orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch orders' });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:orderId/status
// @access  Private/Manager,Admin
router.put('/:orderId/status', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const order = await Order.findOne({ id: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    // Re-populate user info for the response
    await updatedOrder.populate('user', 'firstName lastName email');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error, failed to update order status' });
  }
});

export default router;
