import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  variant: { type: String, default: 'Default' }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: String, required: true, unique: true },
  date: { type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
  items: [orderItemSchema],
  shipping: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    province: { type: String, required: true }
  },
  payment: {
    method: { type: String, default: 'Credit Card' },
    cardNumberLast4: { type: String, default: '4242' }
  },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  itemsCount: { type: Number, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
